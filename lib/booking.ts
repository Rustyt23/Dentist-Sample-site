// Frontend-only, deterministic dummy availability for the demo booking flow.
// A real build would replace these functions with calls to the clinic's scheduling system.

import { doctors, type Doctor } from "@/lib/data/doctors";

export type Period = "Morning" | "Afternoon" | "Evening";

export type SlotAvailability = {
  minutes: number;
  label: string;
  period: Period;
  available: boolean;
  /** Dentists free at this time (respecting the doctor filter) */
  doctors: Doctor[];
};

export type DayAvailability = "closed" | "unavailable" | "limited" | "good";

export const BOOKING_WINDOW_DAYS = 45;
/** Minimum notice for same-day slots, in minutes */
const SAME_DAY_NOTICE = 60;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function toDateKey(d: Date) {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

export function fromDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function formatDate(d: Date, style: "short" | "long" = "short") {
  return style === "long"
    ? `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`
    : `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatMinutes(minutes: number) {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function range(start: number, end: number, step = 30) {
  const out: number[] = [];
  for (let t = start; t <= end; t += step) out.push(t);
  return out;
}

/** Clinic slot grid for a weekday (minutes since midnight). Sunday is by phone only. */
function clinicSlots(weekday: number): { minutes: number; period: Period }[] {
  if (weekday === 0) return [];
  const morning = range(9 * 60 + 30, 12 * 60 + 30).map((m) => ({ minutes: m, period: "Morning" as const }));
  const afternoon = range(14 * 60, 16 * 60 + 30).map((m) => ({ minutes: m, period: "Afternoon" as const }));
  const evening =
    weekday === 6
      ? range(17 * 60, 17 * 60 + 30).map((m) => ({ minutes: m, period: "Evening" as const }))
      : range(17 * 60, 20 * 60).map((m) => ({ minutes: m, period: "Evening" as const }));
  return [...morning, ...afternoon, ...evening];
}

/** FNV-1a hash → stable pseudo-random number per (doctor, day, time). */
function hash(input: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function isBooked(doctorSlug: string, dateKey: string, minutes: number) {
  // Evenings and Saturdays are busier, like a real clinic.
  const date = fromDateKey(dateKey);
  const busy = (minutes >= 17 * 60 ? 18 : 0) + (date.getDay() === 6 ? 12 : 0);
  return hash(`${doctorSlug}|${dateKey}|${minutes}`) % 100 < 34 + busy;
}

export function doctorWorksOn(doctor: Doctor, date: Date) {
  return doctor.workDays.includes(date.getDay());
}

/**
 * Slots for a date. `doctorSlug` of "any" means any dentist; `now` disables
 * same-day slots that are too soon.
 */
export function getSlots(date: Date, doctorSlug: string, now: Date): SlotAvailability[] {
  const key = toDateKey(date);
  const pool = doctorSlug === "any" ? doctors : doctors.filter((d) => d.slug === doctorSlug);
  const isToday = key === toDateKey(now);
  const cutoff = now.getHours() * 60 + now.getMinutes() + SAME_DAY_NOTICE;

  return clinicSlots(date.getDay()).map(({ minutes, period }) => {
    const free = pool.filter((d) => doctorWorksOn(d, date) && !isBooked(d.slug, key, minutes));
    const tooSoon = isToday && minutes < cutoff;
    return {
      minutes,
      period,
      label: formatMinutes(minutes),
      available: !tooSoon && free.length > 0,
      doctors: tooSoon ? [] : free,
    };
  });
}

export function getDayAvailability(date: Date, doctorSlug: string, now: Date): DayAvailability {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (date < today || date > addDays(today, BOOKING_WINDOW_DAYS)) return "unavailable";
  if (date.getDay() === 0) return "closed";
  const open = getSlots(date, doctorSlug, now).filter((s) => s.available).length;
  if (open === 0) return "unavailable";
  return open <= 4 ? "limited" : "good";
}

export function nextAvailableDate(doctorSlug: string, now: Date) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = 0; i <= BOOKING_WINDOW_DAYS; i++) {
    const d = addDays(today, i);
    const level = getDayAvailability(d, doctorSlug, now);
    if (level === "good" || level === "limited") return d;
  }
  return null;
}

/** Pick the dentist for an "any dentist" booking, preferring specialists for the treatment. */
export function assignDoctor(slot: SlotAvailability, treatmentSlug: string) {
  return slot.doctors.find((d) => d.treatments.includes(treatmentSlug)) ?? slot.doctors[0];
}

export function createBookingId(date: Date) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  const stamp = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  return `SC-${stamp}-${suffix}`;
}

/** Normalise an Indian mobile number to 10 digits, or return null if invalid. */
export function normalisePhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function formatPhone(digits: string) {
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}
