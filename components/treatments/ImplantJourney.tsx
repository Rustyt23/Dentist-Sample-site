"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, CalendarCheck, Check, ChevronDown, Clock3, ShieldCheck, Wallet } from "lucide-react";
import { formatPrice, getTreatment } from "@/lib/data/treatments";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Accent, Eyebrow } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/components/ui/useMediaQuery";
import { clamp01, useScrubbedSteps } from "@/components/ui/useScrubbedSteps";
import { ImplantStage } from "./implant/ImplantStage";

const implant = getTreatment("dental-implants");

const STEPS = [
  {
    short: "Placement",
    title: "Implant Placement",
    when: "Day 1 · about an hour",
    body: "A slim titanium post is placed in the jawbone, exactly where the root used to be — planned on a 3D scan and done under local anaesthesia.",
    points: ["Painless with local anaesthesia", "Guided by 3D planning"],
  },
  {
    short: "Healing",
    title: "Healing",
    when: "2–3 months",
    body: "Your jawbone grows around the implant and bonds to it, creating a new root that's as strong as the original.",
    points: ["Bone fuses to the titanium", "Temporary tooth available"],
  },
  {
    short: "Abutment",
    title: "Abutment",
    when: "One short visit",
    body: "A small connector is fitted to the implant, just above the gum. It will hold your new tooth firmly in place.",
    points: ["Quick, minimal discomfort", "Gum settles in 1–2 weeks"],
  },
  {
    short: "Crown",
    title: "Crown",
    when: "1–2 weeks later",
    body: "Your custom ceramic crown — shaped and shade-matched to your own teeth — is fixed securely onto the abutment.",
    points: ["Zirconia or E.max ceramic", "Matched to your natural shade"],
  },
  {
    short: "Complete",
    title: "Complete Smile",
    when: "Built to last for decades",
    body: "A permanent tooth that looks, feels and works like your own. Smile, bite and chew with complete confidence.",
    points: ["Lifetime implant warranty", "Neighbouring teeth stay untouched"],
  },
];

const CTA_STEP = STEPS.length + 1;

/* ───────────────────────── Scroll-scrubbed assembly ───────────────────────── */

type Visual = {
  ghost: number;
  screwY: number;
  screwO: number;
  heal: number;
  abutY: number;
  abutO: number;
  crownY: number;
  crownO: number;
  natural: number;
  halo: number;
};

const away = { abutY: -120, abutO: 0, crownY: -110, crownO: 0 };
const VISUALS: Visual[] = [
  // 0 — the gap
  { ghost: 1, screwY: -170, screwO: 0, heal: 0, ...away, natural: 0, halo: 0.7 },
  // 1 — implant placement
  { ghost: 0.25, screwY: 0, screwO: 1, heal: 0, ...away, natural: 0, halo: 0.9 },
  // 2 — healing
  { ghost: 0, screwY: 0, screwO: 1, heal: 1, ...away, natural: 0, halo: 1 },
  // 3 — abutment
  { ghost: 0, screwY: 0, screwO: 1, heal: 0.3, abutY: 0, abutO: 1, crownY: -110, crownO: 0, natural: 0, halo: 1 },
  // 4 — crown
  { ghost: 0, screwY: 0, screwO: 1, heal: 0, abutY: 0, abutO: 1, crownY: 0, crownO: 1, natural: 0, halo: 1 },
  // 5 — complete smile
  { ghost: 0, screwY: 0, screwO: 1, heal: 0, abutY: 0, abutO: 1, crownY: 0, crownO: 1, natural: 1, halo: 1 },
  // 6 — call to action
  { ghost: 0, screwY: 0, screwO: 1, heal: 0, abutY: 0, abutO: 1, crownY: 0, crownO: 1, natural: 1, halo: 1 },
];

/** Assembled cross-section, all parts labelled, for reduced motion. */
const STATIC_VISUAL: Visual = { ...VISUALS[4], heal: 0.35 };

function visualAt(t: number): Visual {
  const i = Math.floor(t);
  const k = t - i;
  const a = VISUALS[i];
  const b = VISUALS[Math.min(i + 1, VISUALS.length - 1)];
  const out = {} as Visual;
  (Object.keys(a) as (keyof Visual)[]).forEach((key) => {
    out[key] = a[key] + (b[key] - a[key]) * k;
  });
  return out;
}

function toVars(v: Visual, t: number): Record<string, string> {
  const pct = (units: number) => `${((units / 450) * 100).toFixed(2)}%`;
  return {
    "--ghost": v.ghost.toFixed(3),
    "--screw-y": pct(v.screwY),
    "--screw-o": v.screwO.toFixed(3),
    // Threads scroll past as the post descends, so it reads as being screwed in.
    "--thread-shift": ((-v.screwY * 0.9) % 14).toFixed(2),
    "--heal": v.heal.toFixed(3),
    "--abut-y": pct(v.abutY),
    "--abut-o": v.abutO.toFixed(3),
    "--crown-y": pct(v.crownY),
    "--crown-o": v.crownO.toFixed(3),
    "--contact": (v.crownO * (1 - Math.abs(v.crownY) / 110)).toFixed(3),
    "--natural": v.natural.toFixed(3),
    "--halo": v.halo.toFixed(3),
    "--progress": clamp01((t - 1) / (STEPS.length - 1)).toFixed(3),
  };
}

const INITIAL_STYLE = toVars(VISUALS[0], 0) as React.CSSProperties;
const STATIC_STYLE = toVars(STATIC_VISUAL, 4) as React.CSSProperties;

/* ───────────────────────── Navigation ───────────────────────── */

function StepPanel({ active, onSelect }: { active: number; onSelect: (step: number) => void }) {
  const current = STEPS[active - 1];
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 lg:w-full lg:flex-none lg:gap-4">
      {/* Phones: compact vertical list */}
      <div className="flex flex-col gap-1.5 lg:hidden" role="group" aria-label="Implant stages">
        {STEPS.map((s, i) => {
          const on = active === i + 1;
          const done = active > i + 1;
          return (
            <button
              key={s.short}
              type="button"
              onClick={() => onSelect(i + 1)}
              aria-pressed={on}
              className={cn(
                "flex min-h-9 items-start gap-2 rounded-xl px-2.5 py-2 text-left transition duration-300",
                on ? "bg-white shadow-soft ring-2 ring-brand-400" : "bg-mist-50 ring-1 ring-navy-100",
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold transition",
                  on || done ? "bg-brand-600 text-white" : "bg-white text-navy-600 ring-1 ring-navy-200",
                )}
              >
                {done ? <Check className="size-3" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.8rem] leading-tight font-semibold text-navy-900">{s.short}</span>
                {on ? (
                  <span className="animate-step-in mt-0.5 block text-[0.7rem] leading-tight text-navy-500">
                    {s.when}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop: timeline with a progress line that fills as you scroll */}
      <div className="hidden lg:block">
        <div className="relative px-[10%]">
          <div className="absolute top-4 right-[10%] left-[10%] h-0.5 rounded-full bg-navy-100" aria-hidden />
          <div
            className="absolute top-4 left-[10%] h-0.5 origin-left rounded-full bg-brand-500"
            style={{ width: "80%", transform: "scaleX(var(--progress, 0))" }}
            aria-hidden
          />
          <ol className="relative flex justify-between" aria-label="Implant stages">
            {STEPS.map((s, i) => {
              const on = active === i + 1;
              const done = active > i + 1;
              return (
                <li key={s.short} className="flex w-0 flex-col items-center">
                  <button
                    type="button"
                    onClick={() => onSelect(i + 1)}
                    aria-current={on ? "step" : undefined}
                    className="group flex flex-col items-center gap-2"
                  >
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-full text-xs font-bold transition duration-300",
                        on && "bg-navy-900 text-white shadow-soft ring-4 ring-navy-100",
                        done && "bg-brand-600 text-white",
                        !on && !done && "bg-white text-navy-500 ring-1 ring-navy-200 group-hover:ring-brand-300",
                      )}
                    >
                      {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold whitespace-nowrap transition-colors",
                        on ? "text-navy-900" : "text-navy-400 group-hover:text-navy-700",
                      )}
                    >
                      {s.short}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mt-4 flex min-h-6 items-center justify-center gap-2 text-sm text-navy-500">
          {current ? (
            <span key={current.short} className="animate-step-in flex items-center gap-2">
              <Clock3 className="size-4 text-brand-600" aria-hidden />
              <span className="font-semibold text-navy-900">{current.title}</span> · {current.when}
            </span>
          ) : (
            <span>Scroll, or tap a stage, to see each step.</span>
          )}
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── Section ───────────────────────── */

export function ImplantJourney() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { active, goTo } = useScrubbedSteps({
    sectionRef,
    stageRef,
    stepRefs,
    reduced,
    frame: (t, progress) => {
      if (reduced) return null;
      const tilt = window.innerWidth >= 1024 ? Math.sin(progress * Math.PI * 2) : 0;
      return { ...toVars(visualAt(t), t), "--tilt": tilt.toFixed(3) };
    },
  });

  const labelled = (step: number) => (reduced ? [1, 3, 4].includes(step) : step === Math.min(active, 5));

  return (
    <section
      ref={sectionRef}
      id="implant-journey"
      aria-labelledby="implant-journey-title"
      className="relative overflow-x-clip pt-6 pb-12 sm:pb-20"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-mist-100 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 h-[24rem] w-[24rem] rounded-full bg-brand-50 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Pinned stage */}
          <div className="sticky top-16 z-10 -mx-4 bg-white/95 px-4 pt-3 pb-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-24 lg:col-span-6 lg:mx-0 lg:flex lg:h-[calc(100svh-7rem)] lg:flex-col lg:justify-center lg:self-start lg:bg-transparent lg:px-0 lg:pb-0 lg:backdrop-blur-none">
            <div className="flex items-center gap-3 lg:flex-col lg:gap-6">
              <div
                ref={stageRef}
                className="relative aspect-[320/450] h-[32svh] min-h-52 shrink-0 overflow-hidden rounded-[1.75rem] bg-linear-to-b from-mist-50 to-white ring-1 ring-mist-100 sm:h-[36svh] md:h-[40svh] lg:aspect-[400/450] lg:h-[min(calc(100svh-16rem),560px,calc((50vw-4rem)*1.12))]"
                style={{ ...(reduced ? STATIC_STYLE : INITIAL_STYLE), perspective: "1200px" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: reduced ? undefined : "rotateY(calc(var(--tilt, 0) * 5deg))",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Wider than the frame on phones so the gap stays the hero; full scene on desktop */}
                  <div className="absolute inset-y-0 left-1/2 w-[125%] -translate-x-1/2 lg:w-full">
                    <ImplantStage active={reduced ? -1 : active} labelled={labelled} animate={!reduced} />
                  </div>
                </div>
              </div>

              <StepPanel active={active} onSelect={goTo} />
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 -bottom-5 h-5 bg-linear-to-b from-white/95 to-transparent lg:hidden"
              aria-hidden
            />
          </div>

          {/* Scrolling explanations */}
          <div className="relative lg:col-span-6">
            <div
              ref={(el) => {
                stepRefs.current[0] = el;
              }}
              className="flex min-h-[34svh] flex-col justify-center py-6 lg:min-h-[52svh]"
            >
              <Eyebrow>Dental implants, step by step</Eyebrow>
              <h2
                id="implant-journey-title"
                className="mt-4 text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl lg:text-5xl"
              >
                How an implant <Accent>restores your smile</Accent>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-500 sm:text-lg">
                A missing tooth can be replaced from the root up. Scroll to watch each stage — from your first visit to
                your finished smile.
              </p>
              <p className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-700" aria-hidden>
                <ChevronDown className="size-4 animate-bounce" />
                Scroll to see each stage
              </p>
            </div>

            {STEPS.map((s, i) => {
              const index = i + 1;
              const on = reduced || active === index;
              return (
                <div
                  key={s.short}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className="flex min-h-[46svh] items-center py-4 lg:min-h-[52svh]"
                >
                  <article
                    className={cn(
                      "w-full rounded-3xl bg-white p-5 ring-1 transition duration-500 sm:p-7",
                      on ? "shadow-lift ring-brand-200" : "shadow-soft ring-navy-100 lg:opacity-40",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold tracking-[0.16em] text-brand-600 uppercase">
                        Step {index} of {STEPS.length}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-full bg-mist-100 px-3 py-1 text-xs font-semibold text-navy-600">
                        <Clock3 className="size-3.5 text-brand-600" aria-hidden />
                        {s.when}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                      {index}. {s.title}
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-navy-500">{s.body}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {s.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-800 ring-1 ring-brand-100"
                        >
                          <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              );
            })}

            {/* Call to action */}
            <div
              ref={(el) => {
                stepRefs.current[CTA_STEP] = el;
              }}
              className="flex min-h-[50svh] items-center py-4 lg:min-h-[52svh]"
            >
              <div className="w-full rounded-3xl bg-linear-to-br from-navy-900 via-navy-800 to-brand-800 p-6 text-white sm:p-8">
                <h3 className="text-2xl leading-tight font-semibold tracking-tight text-white sm:text-3xl">
                  Restore your smile with a <Accent tone="light">long-term solution</Accent>
                </h3>
                <ul className="mt-5 grid gap-2.5 text-sm text-navy-100 sm:grid-cols-3">
                  {implant ? (
                    <li className="flex items-center gap-2">
                      <Wallet className="size-4 shrink-0 text-brand-300" aria-hidden />
                      {formatPrice(implant.price)}
                      {implant.priceNote ? `, ${implant.priceNote.toLowerCase().replace("per implant, ", "")}` : ""}
                    </li>
                  ) : null}
                  {implant ? (
                    <li className="flex items-center gap-2">
                      <CalendarCheck className="size-4 shrink-0 text-brand-300" aria-hidden />
                      {implant.visits}
                    </li>
                  ) : null}
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="size-4 shrink-0 text-brand-300" aria-hidden />
                    Lifetime implant warranty
                  </li>
                </ul>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/book?treatment=dental-implants" className={buttonClasses({ variant: "light" })}>
                    <CalendarCheck className="size-4 text-brand-600" aria-hidden />
                    Book Implant Consultation
                  </Link>
                  <Link href="/treatments#dental-implants" className={buttonClasses({ variant: "outline-light" })}>
                    Learn More
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
