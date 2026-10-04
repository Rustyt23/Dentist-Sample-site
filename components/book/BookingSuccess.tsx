"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Check,
  Clock3,
  Copy,
  Info,
  MessageCircle,
  Navigation,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { formatDate, formatMinutes, formatPhone, fromDateKey } from "@/lib/booking";
import { clinic } from "@/lib/data/clinic";
import { getTreatment, visitLength } from "@/lib/data/treatments";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";

export type ConfirmedBooking = {
  id: string;
  treatment: string;
  doctorName: string;
  /** True when the clinic picked the dentist ("any available") */
  assigned: boolean;
  date: string;
  time: number;
  name: string;
  phone: string;
  note: string;
};

export function whatsappLink(b: ConfirmedBooking) {
  const t = getTreatment(b.treatment);
  const lines = [
    "Hi SmileCare Dental Clinic! I've just requested an appointment and would like to confirm it.",
    "",
    `Booking ID: ${b.id}`,
    `Treatment: ${t?.name ?? b.treatment}`,
    `Dentist: ${b.doctorName}${b.assigned ? " (first available)" : ""}`,
    `Date: ${formatDate(fromDateKey(b.date), "long")}`,
    `Time: ${formatMinutes(b.time)}`,
    `Patient: ${b.name}`,
    `Phone: ${formatPhone(b.phone)}`,
    ...(b.note ? [`Note: ${b.note}`] : []),
  ];
  const number = clinic.whatsappHref.split("wa.me/")[1]?.split("?")[0] ?? "";
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

const steps = [
  { title: "We confirm your slot", text: "By call or WhatsApp within 15 minutes during clinic hours." },
  { title: "Reminder the day before", text: "A friendly WhatsApp reminder with directions." },
  { title: "Arrive 10 minutes early", text: "Bring any previous X-rays, reports or prescriptions." },
];

export function BookingSuccess({ booking, onReset }: { booking: ConfirmedBooking; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const t = getTreatment(booking.treatment);
  const firstName = booking.name.trim().split(/\s+/)[0];

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(booking.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const details = [
    { icon: Stethoscope, label: "Treatment", value: t?.name ?? booking.treatment },
    {
      icon: UserRound,
      label: "Dentist",
      value: booking.doctorName,
      hint: booking.assigned ? "Matched for you" : undefined,
    },
    { icon: CalendarDays, label: "Date", value: formatDate(fromDateKey(booking.date), "long") },
    { icon: Clock3, label: "Time", value: formatMinutes(booking.time), hint: t ? visitLength(t) : undefined },
  ];

  return (
    <div className="mx-auto max-w-3xl" role="status" aria-live="polite">
      <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-navy-100">
        <div className="relative overflow-hidden bg-linear-to-br from-navy-900 via-navy-800 to-brand-800 px-6 pt-12 pb-10 text-center sm:px-10">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-brand-400/25 blur-3xl" />
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="animate-sparkle absolute size-1.5 rounded-full bg-brand-200"
                style={{
                  left: `${8 + ((i * 37) % 84)}%`,
                  top: `${12 + ((i * 53) % 70)}%`,
                  animationDelay: `${300 + i * 90}ms`,
                }}
              />
            ))}
          </div>

          <div className="relative mx-auto grid size-20 place-items-center">
            <span className="animate-success-ring absolute inset-0 rounded-full bg-brand-400/40" aria-hidden />
            <span className="animate-success-pop relative grid size-20 place-items-center rounded-full bg-white shadow-lift">
              <svg viewBox="0 0 52 52" className="size-10 text-brand-600" aria-hidden>
                <path
                  d="M14 27.5 22.5 36 39 17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-success-check"
                  style={{ strokeDasharray: 40, strokeDashoffset: 40 }}
                />
              </svg>
            </span>
          </div>

          <h2
            className="animate-fade-up relative mt-7 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            style={{ animationDelay: "350ms" }}
          >
            Appointment Request Received
          </h2>
          <p
            className="animate-fade-up relative mx-auto mt-3 max-w-md text-navy-200"
            style={{ animationDelay: "450ms" }}
          >
            Thank you, {firstName}. Our team will confirm your appointment by call or WhatsApp on{" "}
            <span className="font-semibold text-white">{formatPhone(booking.phone)}</span>.
          </p>

          <div
            className="animate-fade-up relative mx-auto mt-7 inline-flex items-center gap-3 rounded-full bg-white/10 py-2 pr-2 pl-5 ring-1 ring-white/20 backdrop-blur"
            style={{ animationDelay: "550ms" }}
          >
            <span className="text-sm text-navy-200">Booking ID</span>
            <span className="font-mono text-base font-semibold tracking-wider text-white">{booking.id}</span>
            <button
              type="button"
              onClick={copyId}
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-900 transition hover:bg-brand-50"
            >
              {copied ? (
                <Check className="size-3.5 text-brand-600" aria-hidden />
              ) : (
                <Copy className="size-3.5" aria-hidden />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="animate-fade-up p-6 sm:p-10" style={{ animationDelay: "650ms" }}>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value, hint }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl bg-mist-50 p-4 ring-1 ring-mist-100">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-soft">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-navy-400">{label}</dt>
                  <dd className="font-semibold text-navy-900">
                    {value}
                    {hint ? <span className="ml-1.5 text-xs font-medium text-navy-400">· {hint}</span> : null}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href={whatsappLink(booking)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "whatsapp", size: "lg", className: "w-full" })}
            >
              <MessageCircle className="size-5" aria-hidden />
              Continue on WhatsApp
            </a>
            <a
              href={clinic.phoneHref}
              className={buttonClasses({ variant: "secondary", size: "lg", className: "w-full" })}
            >
              <Phone className="size-5 text-brand-600" aria-hidden />
              Call Clinic
            </a>
          </div>
          <p className="mt-3 text-center text-xs text-navy-400">
            WhatsApp opens with your appointment details already filled in.
          </p>

          <div className="mt-10 border-t border-navy-100 pt-8">
            <p className="text-sm font-semibold text-navy-900">What happens next</p>
            <ol className="mt-5 grid gap-5 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-3 sm:flex-col">
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold",
                      i === 0 ? "bg-brand-600 text-white" : "bg-mist-100 text-navy-600",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy-900">{s.title}</span>
                    <span className="mt-0.5 block text-sm text-navy-500">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-navy-100 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <a
                href={clinic.directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "ghost", size: "sm" })}
              >
                <Navigation className="size-4 text-brand-600" aria-hidden />
                Get directions
              </a>
              <button type="button" onClick={onReset} className={buttonClasses({ variant: "ghost", size: "sm" })}>
                <CalendarPlus className="size-4 text-brand-600" aria-hidden />
                Book another appointment
              </button>
            </div>
            <Link href="/" className={buttonClasses({ variant: "ghost", size: "sm" })}>
              <ArrowLeft className="size-4" aria-hidden />
              Back to home
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-navy-400">
        <Info className="size-3.5 shrink-0" aria-hidden />
        Demo booking experience — final version will use real-time appointment availability.
      </p>
    </div>
  );
}
