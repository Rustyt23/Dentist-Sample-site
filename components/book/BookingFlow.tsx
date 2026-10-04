"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Lock, MessageCircle, Phone, PhoneCall } from "lucide-react";
import {
  assignDoctor,
  createBookingId,
  formatDate,
  formatMinutes,
  fromDateKey,
  getDayAvailability,
  getSlots,
  normalisePhone,
} from "@/lib/booking";
import { clinic } from "@/lib/data/clinic";
import { getDoctor } from "@/lib/data/doctors";
import { getTreatment } from "@/lib/data/treatments";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";
import { BookingSummary } from "./BookingSummary";
import { BookingSuccess, type ConfirmedBooking } from "./BookingSuccess";
import { StepProgress } from "./StepProgress";
import { DateTimeStep, DetailsStep, DoctorStep, TreatmentStep } from "./steps";
import { useNow } from "./useNow";

const STEPS = ["Treatment", "Dentist", "Date & time", "Your details"];

const STEP_COPY = [
  {
    title: "What would you like to book?",
    text: "Choose a treatment. Not sure? A dental check-up is the perfect place to start.",
  },
  { title: "Choose your dentist", text: "Pick a specialist, or let us match you with the first available dentist." },
  { title: "Pick a date & time", text: "Live availability for the next six weeks. Sundays are for emergencies only." },
  { title: "Your details", text: "Almost done — we only use these to confirm your appointment." },
];

type Errors = Partial<Record<"treatment" | "date" | "time" | "name" | "phone", string>>;

function validateName(name: string) {
  const v = name.trim();
  if (!v) return "Please enter the patient's name.";
  if (v.length < 2 || !/[a-zA-Zऀ-ॿ]/.test(v)) return "Please enter a valid name.";
  return undefined;
}

function validatePhone(phone: string) {
  if (!phone.trim()) return "Please enter a mobile number.";
  return normalisePhone(phone) ? undefined : "Enter a valid 10-digit Indian mobile number.";
}

export function BookingFlow() {
  const params = useSearchParams();
  const now = useNow();

  const [treatment, setTreatment] = useState<string | null>(() => getTreatment(params.get("treatment"))?.slug ?? null);
  const [doctor, setDoctor] = useState<string>(() => getDoctor(params.get("doctor"))?.slug ?? "any");
  const [step, setStep] = useState(() => {
    if (!getTreatment(params.get("treatment"))) return 0;
    return getDoctor(params.get("doctor")) ? 2 : 1;
  });
  const [reached, setReached] = useState(step);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean }>({});
  const [status, setStatus] = useState<"editing" | "submitting" | "success">("editing");
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // Move focus to the new step heading (skipped on first render) for keyboard and screen-reader users.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const scrollToTop = () => {
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goTo = (next: number) => {
    // Jumping forward (via the stepper) must not skip a step that is no longer valid.
    for (let i = step; i < next; i++) {
      const e = validateStep(i);
      if (Object.keys(e).length) {
        setStep(i);
        setErrors(e);
        scrollToTop();
        return;
      }
    }
    setStep(next);
    setReached((r) => Math.max(r, next));
    setErrors({});
    scrollToTop();
  };

  const selectDoctor = (slug: string) => {
    setDoctor(slug);
    // Keep the chosen slot only if the new dentist is still free then.
    if (date && now) {
      const day = fromDateKey(date);
      const level = getDayAvailability(day, slug, now);
      if (level === "closed" || level === "unavailable") {
        setDate(null);
        setTime(null);
      } else if (time !== null && !getSlots(day, slug, now).find((s) => s.minutes === time)?.available) {
        setTime(null);
      }
    }
  };

  const selectDate = (key: string) => {
    setDate(key);
    setErrors((e) => ({ ...e, date: undefined }));
    if (time !== null && now && !getSlots(fromDateKey(key), doctor, now).find((s) => s.minutes === time)?.available) {
      setTime(null);
    }
  };

  const validateStep = (index: number): Errors => {
    if (index === 0) return treatment ? {} : { treatment: "Please choose a treatment to continue." };
    if (index === 2) {
      if (!date) return { date: "Please pick a date for your visit." };
      if (time === null) return { time: "Please choose an available time." };
      return {};
    }
    if (index === 3) {
      const e: Errors = {};
      const n = validateName(name);
      const p = validatePhone(phone);
      if (n) e.name = n;
      if (p) e.phone = p;
      return e;
    }
    return {};
  };

  const submit = () => {
    if (!treatment || !date || time === null || !now) return;
    const slot = getSlots(fromDateKey(date), doctor, now).find((s) => s.minutes === time);
    const chosen = getDoctor(doctor) ?? (slot ? assignDoctor(slot, treatment) : undefined);
    setStatus("submitting");
    // Simulated network round-trip for a realistic feel.
    window.setTimeout(() => {
      setConfirmed({
        id: createBookingId(fromDateKey(date)),
        treatment,
        doctorName: chosen?.name ?? "First available dentist",
        assigned: doctor === "any",
        date,
        time,
        name: name.trim(),
        phone: normalisePhone(phone) ?? phone,
        note: note.trim(),
      });
      setStatus("success");
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1300);
  };

  const onContinue = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors(e);
      setTouched({ name: true, phone: true });
      if (step === 3) {
        document.getElementById(e.name ? "patient-name" : "patient-phone")?.focus();
      }
      return;
    }
    if (step < STEPS.length - 1) goTo(step + 1);
    else submit();
  };

  const reset = () => {
    setTreatment(null);
    setDoctor("any");
    setDate(null);
    setTime(null);
    setName("");
    setPhone("");
    setNote("");
    setErrors({});
    setTouched({});
    setConfirmed(null);
    setStatus("editing");
    setStep(0);
    setReached(0);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onFieldChange = (field: "name" | "phone" | "note", value: string) => {
    if (field === "name") {
      setName(value);
      if (touched.name) setErrors((e) => ({ ...e, name: validateName(value) }));
    } else if (field === "phone") {
      setPhone(value);
      if (touched.phone) setErrors((e) => ({ ...e, phone: validatePhone(value) }));
    } else {
      setNote(value);
    }
  };

  const onFieldBlur = (field: "name" | "phone") => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: field === "name" ? validateName(name) : validatePhone(phone) }));
  };

  if (status === "success" && confirmed) {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <BookingSuccess booking={confirmed} onReset={reset} />
      </div>
    );
  }

  const t = getTreatment(treatment);
  const mobileSummary = [
    t?.name,
    date ? formatDate(fromDateKey(date)) : null,
    time !== null ? formatMinutes(time) : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const isLast = step === STEPS.length - 1;
  const submitting = status === "submitting";

  return (
    <div ref={topRef} className="grid scroll-mt-28 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="min-w-0 lg:col-span-8">
        <div className="rounded-[1.75rem] bg-white shadow-soft ring-1 ring-navy-100">
          <StepProgress steps={STEPS} current={step} reached={reached} onSelect={goTo} />

          <div key={step} className="animate-step-in p-6 sm:p-8">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl font-semibold tracking-tight outline-none sm:text-[1.75rem]"
            >
              {STEP_COPY[step].title}
            </h2>
            <p className="mt-2 text-[0.95rem] text-navy-500">
              {step === 2 && doctor !== "any"
                ? `Showing ${getDoctor(doctor)?.name}'s availability. Sundays are for emergencies only.`
                : STEP_COPY[step].text}
            </p>

            <div className="mt-7">
              {step === 0 ? (
                <TreatmentStep
                  value={treatment}
                  onChange={(slug) => {
                    setTreatment(slug);
                    setErrors({});
                  }}
                />
              ) : null}
              {step === 1 ? (
                <DoctorStep value={doctor} treatment={treatment} now={now} onChange={selectDoctor} />
              ) : null}
              {step === 2 ? (
                <DateTimeStep
                  now={now}
                  doctor={doctor}
                  date={date}
                  time={time}
                  onDate={selectDate}
                  onTime={(m) => {
                    setTime(m);
                    setErrors((e) => ({ ...e, time: undefined }));
                  }}
                  errors={errors}
                />
              ) : null}
              {step === 3 ? (
                <>
                  <DetailsStep
                    name={name}
                    phone={phone}
                    note={note}
                    errors={errors}
                    onChange={onFieldChange}
                    onBlur={onFieldBlur}
                  />
                  <BookingSummary
                    title="Review your appointment"
                    treatment={treatment}
                    doctor={doctor}
                    date={date}
                    time={time}
                    onEdit={goTo}
                    className="mt-8 bg-mist-50/60 shadow-none lg:hidden"
                  />
                  <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-navy-400">
                    <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    By requesting, you agree to be contacted by call or WhatsApp about this appointment. Your details
                    are never shared.
                  </p>
                </>
              ) : null}
            </div>

            {errors.treatment ? (
              <p className="mt-5 text-sm font-medium text-red-600" role="alert">
                {errors.treatment}
              </p>
            ) : null}
          </div>

          {/* Actions — sticky to the viewport bottom while the card is on screen */}
          <div className="sticky bottom-0 z-10 rounded-b-[1.75rem] border-t border-navy-100 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-8 sm:py-5">
            {mobileSummary && !isLast ? (
              <p className="mb-2.5 truncate text-center text-xs font-medium text-navy-500 sm:hidden">{mobileSummary}</p>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  disabled={submitting}
                  className={cn(buttonClasses({ variant: "ghost", size: "md" }), "px-4 disabled:opacity-40")}
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Back
                </button>
              ) : (
                <span className="hidden text-sm text-navy-400 sm:block">Takes about a minute</span>
              )}
              <button
                type="button"
                onClick={onContinue}
                disabled={submitting}
                className={cn(
                  buttonClasses({ variant: "primary", size: "md" }),
                  "min-w-40 flex-1 sm:flex-none disabled:cursor-wait disabled:opacity-80",
                )}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Sending request…
                  </>
                ) : isLast ? (
                  <>Request Appointment</>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="size-4" aria-hidden />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-28 space-y-5">
          <BookingSummary
            treatment={treatment}
            doctor={doctor}
            date={date}
            time={time}
            onEdit={(s) => (s <= reached ? goTo(s) : undefined)}
          />
          <div className="rounded-[1.75rem] bg-linear-to-br from-navy-900 to-navy-800 p-6 text-white">
            <p className="font-semibold">Prefer to talk?</p>
            <p className="mt-1 text-sm text-navy-200">Our front desk can book you in right away.</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <a href={clinic.phoneHref} className={buttonClasses({ variant: "light", size: "sm" })}>
                <Phone className="size-4 text-brand-600" aria-hidden />
                Call
              </a>
              <a
                href={clinic.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "whatsapp", size: "sm" })}
              >
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp
              </a>
            </div>
            <a
              href={clinic.emergencyPhoneHref}
              className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-navy-200 transition hover:text-white"
            >
              <PhoneCall className="size-4 text-red-300" aria-hidden />
              Dental emergency? <span className="font-semibold text-white">Call now</span>
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
