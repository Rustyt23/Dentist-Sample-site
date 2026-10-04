"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CalendarClock, CalendarDays, Check, PhoneCall, Sparkles } from "lucide-react";
import {
  formatDate,
  fromDateKey,
  getSlots,
  nextAvailableDate,
  type Period,
  type SlotAvailability,
} from "@/lib/booking";
import { clinic } from "@/lib/data/clinic";
import { doctors, WEEKDAY_INITIALS } from "@/lib/data/doctors";
import { formatPrice, getTreatment, treatments } from "@/lib/data/treatments";
import { cn, unsplash } from "@/lib/utils";
import { TreatmentIcon } from "@/components/icons";
import { Calendar } from "./Calendar";

const optionBase =
  "relative w-full rounded-2xl bg-white text-left ring-1 transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

function optionState(selected: boolean) {
  return selected
    ? "bg-brand-50/70 ring-2 ring-brand-500 shadow-soft"
    : "ring-navy-200 hover:-translate-y-0.5 hover:ring-brand-300 hover:shadow-soft";
}

function SelectedTick({ show }: { show: boolean }) {
  return (
    <span
      className={cn(
        "absolute top-3 right-3 grid size-6 place-items-center rounded-full bg-brand-600 text-white transition duration-200",
        show ? "scale-100 opacity-100" : "scale-50 opacity-0",
      )}
      aria-hidden
    >
      <Check className="size-3.5" strokeWidth={3} />
    </span>
  );
}

/* ───────────────────────── Step 1: Treatment ───────────────────────── */

export function TreatmentStep({ value, onChange }: { value: string | null; onChange: (slug: string) => void }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="group" aria-label="Treatments">
        {treatments.map((t) => {
          const selected = value === t.slug;
          return (
            <button
              key={t.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(t.slug)}
              className={cn(optionBase, optionState(selected), "flex flex-col gap-3 p-4")}
            >
              <SelectedTick show={selected} />
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-xl transition-colors",
                  selected ? "bg-brand-600 text-white" : "bg-mist-100 text-brand-600",
                )}
              >
                <TreatmentIcon icon={t.icon} size={20} />
              </span>
              <span>
                <span className="block pr-4 text-[0.92rem] leading-snug font-semibold text-navy-900">{t.name}</span>
                <span className="mt-1 block text-xs text-navy-400">
                  {t.duration} · {formatPrice(t.price)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-red-50/70 p-4 ring-1 ring-red-100 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-navy-700">
          <span className="font-semibold text-red-700">In severe pain or swelling?</span> Skip the queue — call our
          emergency line for a same-day slot.
        </p>
        <a
          href={clinic.emergencyPhoneHref}
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800"
        >
          <PhoneCall className="size-4" aria-hidden />
          {clinic.emergencyPhone}
        </a>
      </div>
    </div>
  );
}

/* ───────────────────────── Step 2: Dentist ───────────────────────── */

export function DoctorStep({
  value,
  treatment,
  now,
  onChange,
}: {
  value: string;
  treatment: string | null;
  now: Date | null;
  onChange: (slug: string) => void;
}) {
  const t = getTreatment(treatment);
  const sorted = [...doctors].sort(
    (a, b) => Number(b.treatments.includes(treatment ?? "")) - Number(a.treatments.includes(treatment ?? "")),
  );

  const nextLabel = (slug: string) => {
    if (!now) return "Checking availability…";
    const d = nextAvailableDate(slug, now);
    return d ? `Next available: ${formatDate(d)}` : "Fully booked — please call";
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Dentists">
      <button
        type="button"
        aria-pressed={value === "any"}
        onClick={() => onChange("any")}
        className={cn(optionBase, optionState(value === "any"), "flex items-start gap-4 p-5 sm:col-span-2")}
      >
        <SelectedTick show={value === "any"} />
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-brand-400 to-brand-700 text-white">
          <Sparkles className="size-6" aria-hidden />
        </span>
        <span className="min-w-0 pr-6">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-navy-900">Any available dentist</span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[0.7rem] font-semibold text-brand-800">
              Fastest
            </span>
          </span>
          <span className="mt-1 block text-sm text-navy-500">
            We&apos;ll match you with the best-suited specialist{t ? ` for ${t.name.toLowerCase()}` : ""}.
          </span>
          <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-700">
            <CalendarClock className="size-3.5" aria-hidden />
            {nextLabel("any")}
          </span>
        </span>
      </button>

      {sorted.map((d) => {
        const selected = value === d.slug;
        const recommended = !!treatment && d.treatments.includes(treatment);
        return (
          <button
            key={d.slug}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(d.slug)}
            className={cn(optionBase, optionState(selected), "flex flex-col p-5")}
          >
            <SelectedTick show={selected} />
            <span className="flex items-center gap-4">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-mist-100">
                <Image src={unsplash(d.image, 200)} alt="" fill sizes="56px" className="object-cover object-top" />
              </span>
              <span className="min-w-0 pr-6">
                <span className="block font-semibold text-navy-900">{d.name}</span>
                <span className="block text-sm leading-snug text-navy-500">{d.role}</span>
              </span>
            </span>
            {recommended && t ? (
              <span className="mt-4 w-fit rounded-full bg-brand-100 px-2.5 py-1 text-[0.7rem] font-semibold text-brand-800">
                Recommended for {t.name}
              </span>
            ) : null}
            <span className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-navy-100 pt-3">
              <span className="flex gap-1" aria-label={`Works ${d.workDays.length} days a week`}>
                {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                  <span
                    key={day}
                    className={cn(
                      "grid size-5 place-items-center rounded-md text-[0.6rem] font-semibold",
                      d.workDays.includes(day) ? "bg-navy-900 text-white" : "bg-mist-100 text-navy-300",
                    )}
                  >
                    {WEEKDAY_INITIALS[day]}
                  </span>
                ))}
              </span>
              <span className="text-right text-xs font-medium text-brand-700">{nextLabel(d.slug)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Step 3: Date & time ───────────────────────── */

const periods: Period[] = ["Morning", "Afternoon", "Evening"];

export function DateTimeStep({
  now,
  doctor,
  date,
  time,
  onDate,
  onTime,
  errors,
}: {
  now: Date | null;
  doctor: string;
  date: string | null;
  time: number | null;
  onDate: (key: string) => void;
  onTime: (minutes: number) => void;
  errors: { date?: string; time?: string };
}) {
  const slotsRef = useRef<HTMLDivElement>(null);
  const prevDate = useRef(date);

  // On small screens, bring the time slots into view after a date is picked.
  useEffect(() => {
    if (date && date !== prevDate.current && window.matchMedia("(max-width: 767px)").matches) {
      slotsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevDate.current = date;
  }, [date]);

  if (!now) {
    return <div className="h-96 animate-pulse rounded-2xl bg-mist-50" aria-label="Loading availability" />;
  }

  const slots: SlotAvailability[] = date ? getSlots(fromDateKey(date), doctor, now) : [];
  const openCount = slots.filter((s) => s.available).length;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
      <div>
        <Calendar now={now} doctor={doctor} selected={date} onSelect={onDate} />
        {errors.date ? (
          <p className="mt-3 text-sm font-medium text-red-600" role="alert">
            {errors.date}
          </p>
        ) : null}
      </div>

      <div ref={slotsRef} className="scroll-mt-28 md:border-l md:border-navy-100 md:pl-10">
        {!date ? (
          <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-2xl bg-mist-50 p-6 text-center ring-1 ring-mist-100">
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft">
              <CalendarDays className="size-5" aria-hidden />
            </span>
            <p className="mt-4 font-semibold text-navy-900">Select a date</p>
            <p className="mt-1 text-sm text-navy-500">Available times will appear here.</p>
          </div>
        ) : (
          <div className="animate-step-in">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-semibold text-navy-900">{formatDate(fromDateKey(date), "long")}</p>
              <p className="shrink-0 text-xs font-medium text-navy-400">{openCount} available</p>
            </div>
            {openCount === 0 ? (
              <p className="mt-4 rounded-2xl bg-mist-50 p-4 text-sm text-navy-500">
                No times left on this day. Please choose another date.
              </p>
            ) : null}
            <div className="mt-4 space-y-5" role="group" aria-label="Available times">
              {periods.map((p) => {
                const group = slots.filter((s) => s.period === p);
                if (group.length === 0) return null;
                return (
                  <div key={p}>
                    <p className="mb-2 text-xs font-semibold tracking-wide text-navy-400 uppercase">{p}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {group.map((s) => {
                        const selected = time === s.minutes;
                        return (
                          <button
                            key={s.minutes}
                            type="button"
                            disabled={!s.available}
                            aria-pressed={selected}
                            aria-label={`${s.label}${s.available ? "" : ", unavailable"}`}
                            onClick={() => onTime(s.minutes)}
                            className={cn(
                              "h-11 rounded-xl text-sm font-semibold transition duration-200",
                              selected
                                ? "bg-navy-900 text-white shadow-soft"
                                : s.available
                                  ? "bg-white text-navy-800 ring-1 ring-navy-200 hover:ring-brand-400 hover:text-brand-700"
                                  : "cursor-not-allowed bg-mist-50 text-navy-300 line-through decoration-navy-200",
                            )}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {errors.time ? (
          <p className="mt-3 text-sm font-medium text-red-600" role="alert">
            {errors.time}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ───────────────────────── Step 4: Details ───────────────────────── */

export const NOTE_LIMIT = 300;

const fieldClass =
  "w-full rounded-xl bg-white px-4 text-[0.95rem] text-navy-900 ring-1 ring-navy-200 transition outline-none placeholder:text-navy-300 focus:ring-2 focus:ring-brand-500 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-400";

export function DetailsStep({
  name,
  phone,
  note,
  errors,
  onChange,
  onBlur,
}: {
  name: string;
  phone: string;
  note: string;
  errors: { name?: string; phone?: string };
  onChange: (field: "name" | "phone" | "note", value: string) => void;
  onBlur: (field: "name" | "phone") => void;
}) {
  return (
    <div className="grid gap-5">
      <div>
        <label htmlFor="patient-name" className="mb-2 block text-sm font-medium text-navy-700">
          Patient&apos;s full name <span className="text-red-500">*</span>
        </label>
        <input
          id="patient-name"
          name="name"
          autoComplete="name"
          placeholder="e.g. Priya Sharma"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          onBlur={() => onBlur("name")}
          aria-invalid={!!errors.name || undefined}
          aria-describedby={errors.name ? "patient-name-error" : undefined}
          className={cn(fieldClass, "h-12")}
        />
        {errors.name ? (
          <p id="patient-name-error" className="mt-2 text-sm font-medium text-red-600">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="patient-phone" className="mb-2 block text-sm font-medium text-navy-700">
          Mobile number <span className="text-red-500">*</span>
        </label>
        <div className="flex">
          <span className="grid h-12 place-items-center rounded-l-xl bg-mist-50 px-3.5 text-[0.95rem] font-medium text-navy-500 ring-1 ring-navy-200">
            +91
          </span>
          <input
            id="patient-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="98765 43210"
            maxLength={14}
            value={phone}
            onChange={(e) => onChange("phone", e.target.value.replace(/[^\d\s+-]/g, ""))}
            onBlur={() => onBlur("phone")}
            aria-invalid={!!errors.phone || undefined}
            aria-describedby={errors.phone ? "patient-phone-error" : "patient-phone-hint"}
            className={cn(fieldClass, "h-12 rounded-l-none")}
          />
        </div>
        {errors.phone ? (
          <p id="patient-phone-error" className="mt-2 text-sm font-medium text-red-600">
            {errors.phone}
          </p>
        ) : (
          <p id="patient-phone-hint" className="mt-2 text-xs text-navy-400">
            We&apos;ll confirm on this number by call or WhatsApp.
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="patient-note" className="block text-sm font-medium text-navy-700">
            Anything we should know? <span className="font-normal text-navy-400">(optional)</span>
          </label>
          <span className="text-xs text-navy-400" aria-live="polite">
            {note.length}/{NOTE_LIMIT}
          </span>
        </div>
        <textarea
          id="patient-note"
          name="note"
          rows={3}
          maxLength={NOTE_LIMIT}
          placeholder="e.g. sensitivity on the lower left, nervous about injections…"
          value={note}
          onChange={(e) => onChange("note", e.target.value)}
          className={cn(fieldClass, "resize-none py-3")}
        />
      </div>
    </div>
  );
}
