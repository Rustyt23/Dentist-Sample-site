"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, CalendarCheck, ChevronDown, Hand, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Accent, Eyebrow } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/components/ui/useMediaQuery";
import { useAnimationVisibility } from "@/components/ui/useAnimationVisibility";
import { clamp01, useScrubbedSteps } from "@/components/ui/useScrubbedSteps";
import { ExplainerTrigger, type ExplainerKind } from "@/components/explainers/TreatmentExplainer";
import { HOTSPOTS, ToothStage, type Layer } from "./inside-tooth/ToothStage";

/* ───────────────────────── Content ───────────────────────── */

type ToothPrices = Record<Layer, string>;

/** What happens if decay reaches each layer — the cost of waiting. */
const DECAY: Record<Layer, { fix: string; short: string; href: string; dot: string; tint: string }> = {
  enamel: {
    fix: "Check-up & fluoride",
    short: "Fluoride",
    href: "/treatments#dental-checkup",
    dot: "bg-brand-500",
    tint: "bg-brand-50 ring-brand-100",
  },
  dentin: {
    fix: "Tooth-coloured filling",
    short: "Filling",
    href: "/treatments#dental-checkup",
    dot: "bg-amber-400",
    tint: "bg-amber-50 ring-amber-100",
  },
  pulp: {
    fix: "Root canal + crown",
    short: "Root canal",
    href: "/treatments#root-canal",
    dot: "bg-orange-500",
    tint: "bg-orange-50 ring-orange-100",
  },
  root: {
    fix: "Dental implant",
    short: "Implant",
    href: "/treatments#dental-implants",
    dot: "bg-red-500",
    tint: "bg-red-50 ring-red-100",
  },
};

type LayerStep = {
  layer: Layer;
  number: string;
  name: string;
  tagline: string;
  body: string;
  decay: string;
  fact: string;
  links: { label: string; href: string }[];
  explainer?: ExplainerKind;
};

const LAYERS: LayerStep[] = [
  {
    layer: "enamel",
    number: "01",
    name: "Enamel",
    tagline: "Protective outer layer",
    body: "The hardest substance in your body. It shields teeth from biting forces, acids and stains — but it can't grow back.",
    decay: "A small spot appears. Caught now, it's painless to fix.",
    fact: "Harder than bone",
    links: [
      { label: "Teeth Cleaning", href: "/treatments#teeth-cleaning" },
      { label: "Teeth Whitening", href: "/treatments#teeth-whitening" },
    ],
  },
  {
    layer: "dentin",
    number: "02",
    name: "Dentin",
    tagline: "Layer beneath the enamel",
    body: "Softer and naturally yellowish, dentin is packed with microscopic tubules that carry sensations inward.",
    decay: "The cavity spreads faster here — sensitivity to hot and cold begins.",
    fact: "Tens of thousands of tubules per mm²",
    links: [
      { label: "Fillings & Check-ups", href: "/treatments#dental-checkup" },
      { label: "Crowns", href: "/treatments#crowns-bridges" },
    ],
  },
  {
    layer: "pulp",
    number: "03",
    name: "Pulp & Nerve",
    tagline: "Sensitive inner part of the tooth",
    body: "Living tissue with nerves and blood vessels that keep the tooth alive and feeling.",
    decay: "Infection reaches the nerve — throbbing pain, but the tooth can still be saved.",
    fact: "The tooth's living core",
    links: [{ label: "Root Canal", href: "/treatments#root-canal" }],
    explainer: "rootCanal",
  },
  {
    layer: "root",
    number: "04",
    name: "Root & Bone",
    tagline: "Supports and anchors the tooth",
    body: "Roots hold each tooth firmly in the jawbone, cushioned by gum and ligament.",
    decay: "Left untreated, the tooth may be lost — an implant replaces the root.",
    fact: "About two-thirds of a tooth sits below the gum",
    links: [{ label: "Dental Implants", href: "/treatments#dental-implants" }],
  },
];

const LAST = LAYERS.length + 1;
const STEP_LABELS = ["Your tooth", ...LAYERS.map((l) => l.name), "Protect it"];

/* ───────────────────────── Scroll-scrubbed visual states ───────────────────────── */

type Visual = {
  ext: number;
  extX: number;
  enamelY: number;
  toothY: number;
  fadeE: number;
  fadeD: number;
  fadeP: number;
  bone: number;
  nerves: number;
  halo: number;
  /** 0 = healthy … 3 = decay has reached the pulp */
  decay: number;
  cap: number;
};

const opened = { ext: 0, extX: -18, halo: 1 };

const VISUALS: Visual[] = [
  // 0 — complete tooth
  {
    ext: 1,
    extX: 0,
    enamelY: 0,
    toothY: 0,
    fadeE: 0,
    fadeD: 0,
    fadeP: 0,
    bone: 0.6,
    nerves: 0,
    halo: 0.8,
    decay: 0,
    cap: 0,
  },
  // 1 — enamel lifts away, an early spot appears
  {
    ...opened,
    enamelY: -48,
    toothY: 0,
    fadeE: 0,
    fadeD: 0.55,
    fadeP: 0.55,
    bone: 0.45,
    nerves: 0,
    decay: 1,
    cap: 0.45,
  },
  // 2 — dentin, the cavity spreads
  { ...opened, enamelY: -48, toothY: 0, fadeE: 0.75, fadeD: 0, fadeP: 0.5, bone: 0.45, nerves: 0, decay: 2, cap: 0.45 },
  // 3 — pulp & nerve, infection reaches the nerve
  { ...opened, enamelY: -48, toothY: 0, fadeE: 0.75, fadeD: 0.6, fadeP: 0, bone: 0.5, nerves: 1, decay: 3, cap: 0.45 },
  // 4 — root & bone, the tooth rises from its socket
  { ...opened, enamelY: 0, toothY: -34, fadeE: 0.15, fadeD: 0.1, fadeP: 0.35, bone: 1, nerves: 0, decay: 3, cap: 0 },
  // 5 — treated, healthy and whole again
  {
    ext: 1,
    extX: 0,
    enamelY: 0,
    toothY: 0,
    fadeE: 0,
    fadeD: 0,
    fadeP: 0,
    bone: 0.75,
    nerves: 0,
    halo: 1,
    decay: 0,
    cap: 0,
  },
];

/** Static, fully-labelled cross-section for reduced motion. */
const STATIC_VISUAL: Visual = {
  ext: 0,
  extX: 0,
  enamelY: 0,
  toothY: 0,
  fadeE: 0,
  fadeD: 0,
  fadeP: 0,
  bone: 1,
  nerves: 1,
  halo: 0.8,
  decay: 0,
  cap: 0,
};

function toVars(v: Visual): Record<string, string> {
  return {
    "--ext-o": v.ext.toFixed(3),
    "--ext-x": `${((v.extX / 440) * 100).toFixed(2)}%`,
    "--enamel-y": `${((v.enamelY / 520) * 100).toFixed(2)}%`,
    "--tooth-y": `${((v.toothY / 520) * 100).toFixed(2)}%`,
    "--fade-e": (v.fadeE * 0.7).toFixed(3),
    "--fade-d": (v.fadeD * 0.62).toFixed(3),
    "--fade-p": (v.fadeP * 0.62).toFixed(3),
    "--bone-o": v.bone.toFixed(3),
    "--nerves-o": v.nerves.toFixed(3),
    "--halo-o": v.halo.toFixed(3),
    "--cap-o": v.cap.toFixed(3),
    "--decay-spot": clamp01(v.decay).toFixed(3),
    "--decay-enamel": clamp01(v.decay - 1).toFixed(3),
    "--decay-dentin": clamp01(v.decay - 1).toFixed(3),
    "--decay-deep": clamp01(v.decay - 2).toFixed(3),
    "--inflame": (clamp01(v.decay - 2) * 0.45).toFixed(3),
  };
}

function visualAt(position: number): Visual {
  // Clamp so an unexpected scroll value can never index past the defined states.
  const t = Number.isFinite(position) ? Math.min(Math.max(position, 0), VISUALS.length - 1) : 0;
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

const INITIAL_STYLE = { perspective: "1200px", ...toVars(VISUALS[0]) } as React.CSSProperties;
const STATIC_STYLE = { perspective: "1200px", ...toVars(STATIC_VISUAL) } as React.CSSProperties;

/* ───────────────────────── Layer navigation ───────────────────────── */

function LayerPanel({ active, onSelect, prices }: { active: number; onSelect: (step: number) => void; prices: ToothPrices }) {
  const activeLayer = LAYERS[active - 1];
  const decay = activeLayer ? DECAY[activeLayer.layer] : null;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 lg:w-full lg:flex-none lg:gap-3">
      <div className="flex flex-col gap-1.5 lg:grid lg:grid-cols-4 lg:gap-2" role="group" aria-label="Tooth layers">
        {HOTSPOTS.map((spot) => {
          const on = spot.step === active;
          const d = DECAY[spot.layer];
          return (
            <button
              key={spot.layer}
              type="button"
              onClick={() => onSelect(spot.step)}
              aria-pressed={on}
              className={cn(
                "flex min-h-9 items-start gap-2 rounded-xl px-2.5 py-2 text-left transition duration-300 lg:items-center lg:justify-center lg:px-3",
                on
                  ? "bg-white shadow-soft ring-2 ring-brand-400"
                  : "bg-mist-50 ring-1 ring-navy-100 hover:ring-brand-200",
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold transition",
                  on ? "bg-brand-600 text-white" : "bg-white text-navy-600 ring-1 ring-navy-200",
                )}
              >
                {spot.step}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.8rem] leading-tight font-semibold text-navy-900 lg:text-sm">
                  {spot.label}
                </span>
                {on ? (
                  <span className="animate-step-in mt-1 block text-[0.7rem] leading-tight text-navy-500 lg:hidden">
                    <span className="flex items-center gap-1.5">
                      <span className={cn("size-1.5 shrink-0 rounded-full", d.dot)} aria-hidden />
                      {d.short}
                    </span>
                    <span className="mt-0.5 block font-semibold text-navy-900">from {prices[spot.layer]}</span>
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <p className="flex items-center gap-1.5 px-1 text-[0.7rem] text-navy-400 lg:hidden">
        <Hand className="size-3.5 shrink-0" aria-hidden />
        Tap a layer
      </p>

      {/* Desktop cost readout */}
      <div className="hidden min-h-12 items-center justify-between gap-4 rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-navy-100 lg:flex">
        {decay && activeLayer ? (
          <>
            <p key={activeLayer.layer} className="animate-step-in text-sm text-navy-600">
              <span className="font-semibold text-navy-900">
                If decay reaches the {activeLayer.name.toLowerCase()}:
              </span>{" "}
              {decay.fix} · from {prices[activeLayer.layer]}
            </p>
            <span className="flex shrink-0 gap-1" aria-hidden>
              {LAYERS.map((l, i) => (
                <span
                  key={l.layer}
                  className={cn(
                    "h-2 w-5 rounded-full transition-colors duration-500",
                    i < active ? decay.dot : "bg-navy-100",
                  )}
                />
              ))}
            </span>
          </>
        ) : (
          <p className="flex items-center gap-2 text-sm text-navy-500">
            <Hand className="size-4 text-brand-600" aria-hidden />
            Scroll, or tap a numbered point on the tooth, to look inside.
          </p>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Component ───────────────────────── */

export function InsideYourTooth({ prices }: { prices: ToothPrices }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useAnimationVisibility(sectionRef);

  // Scroll position → continuous layer state, written straight to CSS variables (no re-render per frame).
  const { active, goTo } = useScrubbedSteps({
    sectionRef,
    stageRef,
    stepRefs,
    reduced,
    frame: (t, progress) => {
      if (reduced) return null;
      const tilt = window.innerWidth >= 1024 ? Math.sin(progress * Math.PI * 2) : 0;
      return { ...toVars(visualAt(t)), "--tilt": tilt.toFixed(3) };
    },
  });

  // Desktop pointer parallax.
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    e.currentTarget.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
  };

  const glowLayer = reduced ? null : (LAYERS[active - 1]?.layer ?? null);

  return (
    <section
      ref={sectionRef}
      id="inside-your-tooth"
      aria-labelledby="inside-your-tooth-title"
      data-animation-paused="true"
      className="relative overflow-x-clip"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-1/4 -left-40 h-[30rem] w-[30rem] rounded-full bg-mist-100 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-[26rem] w-[26rem] rounded-full bg-brand-50 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Pinned stage */}
          <div className="sticky top-16 z-10 -mx-4 bg-white/98 px-4 pt-3 pb-3 sm:-mx-6 sm:px-6 lg:top-24 lg:col-span-6 lg:mx-0 lg:flex lg:h-[calc(100svh-7rem)] lg:flex-col lg:justify-center lg:self-start lg:bg-transparent lg:px-0 lg:pb-0">
            <div className="flex items-center gap-3 lg:flex-col lg:gap-6">
              <div
                ref={stageRef}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                className="relative aspect-[440/520] h-[32svh] min-h-52 shrink-0 sm:h-[36svh] md:h-[40svh] lg:h-[min(calc(100svh-17rem),580px,calc((50vw-4rem)*1.18))]"
                style={reduced ? STATIC_STYLE : INITIAL_STYLE}
              >
                {/* Platform rings */}
                <div className="pointer-events-none absolute top-[44%] left-1/2 aspect-square w-[104%] -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 rounded-full border border-dashed border-brand-200/70 lg:animate-spin-slow" />
                  <div className="absolute inset-[12%] rounded-full border border-mist-200" />
                </div>

                {/* Click-through: in a preserve-3d scene, whichever half of the tooth tilts behind this
                    plane would otherwise swallow clicks meant for the hotspots (they opt back in) */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    transform: reduced
                      ? undefined
                      : "rotateY(calc(var(--tilt, 0) * 8deg)) rotateZ(calc(var(--tilt, 0) * -1.5deg))",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* The sway pauses under the pointer so the hotspots hold still to be clicked */}
                  <div
                    className={cn(
                      "absolute inset-0",
                      !reduced && "lg:animate-tooth-sway lg:hover:[animation-play-state:paused]",
                    )}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: "translate(calc(var(--px, 0) * 6px), calc(var(--py, 0) * 4px))",
                        transition: "transform 0.3s ease-out",
                      }}
                    >
                      <ToothStage
                        active={reduced ? -1 : active}
                        glow={glowLayer}
                        animate={!reduced}
                        allLabels={reduced}
                        onSelect={goTo}
                      />
                    </div>
                  </div>
                </div>

                {/* Digital scan sweep as the layers open */}
                {active === 1 && !reduced ? (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]" aria-hidden>
                    <div className="animate-scan absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-brand-300/35 to-transparent" />
                  </div>
                ) : null}

                {/* Sparkles once the tooth is healthy again */}
                {active === LAST && !reduced
                  ? [
                      [24, 18],
                      [72, 14],
                      [80, 34],
                      [18, 40],
                      [50, 8],
                    ].map(([x, y], i) => (
                      <Sparkles
                        key={`${x}-${y}`}
                        className="animate-sparkle pointer-events-none absolute size-4 text-brand-400"
                        style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 140}ms` }}
                        aria-hidden
                      />
                    ))
                  : null}
              </div>

              <LayerPanel active={active} onSelect={goTo} prices={prices} />
            </div>

            <p className="sr-only" aria-live="polite">
              {STEP_LABELS[active]}
            </p>

            {/* Soft edge where content scrolls beneath the pinned stage on small screens */}
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
              className="flex min-h-[36svh] flex-col justify-center py-6 lg:min-h-[56svh]"
            >
              <Eyebrow>Dental anatomy, made simple</Eyebrow>
              <h2
                id="inside-your-tooth-title"
                className="mt-4 text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl lg:text-5xl"
              >
                Inside Your <Accent>Tooth</Accent>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-500 sm:text-lg">
                Every tooth is built in layers. Watch how a tiny cavity grows — and why fixing it early is quicker,
                painless and far more affordable.
              </p>
              <p className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-700" aria-hidden>
                <ChevronDown className="size-4 animate-bounce" />
                Scroll or tap a layer to explore
              </p>
            </div>

            {LAYERS.map((l, i) => {
              const index = i + 1;
              const on = reduced || active === index;
              const d = DECAY[l.layer];
              return (
                <div
                  key={l.layer}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className="flex min-h-[50svh] items-center py-4 lg:min-h-[56svh]"
                >
                  <article
                    className={cn(
                      "w-full rounded-3xl bg-white p-5 ring-1 transition duration-500 sm:p-7",
                      on ? "shadow-lift ring-brand-200" : "shadow-soft ring-navy-100 lg:opacity-40",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-serif text-3xl leading-none text-brand-500 italic sm:text-4xl">
                        {l.number}
                      </span>
                      <h3 className="text-xl leading-tight font-semibold tracking-tight sm:text-2xl">
                        {l.name} <span className="text-navy-300">—</span>{" "}
                        <span className="text-brand-700">{l.tagline}</span>
                      </h3>
                    </div>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-navy-500">{l.body}</p>

                    <Link
                      href={d.href}
                      className={cn("group mt-4 flex items-center gap-3 rounded-2xl p-3.5 ring-1 transition", d.tint)}
                    >
                      <span className={cn("size-2.5 shrink-0 rounded-full", d.dot)} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.7rem] font-semibold tracking-wide text-navy-500 uppercase">
                          If decay reaches here
                        </span>
                        <span className="mt-0.5 block text-sm leading-snug text-navy-700">{l.decay}</span>
                        <span className="mt-1 block text-sm font-semibold text-navy-900">
                          {d.fix} · from {prices[l.layer]}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-navy-400 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>

                    <div className={cn("mt-4 flex-wrap items-center gap-2", l.explainer ? "flex" : "hidden lg:flex")}>
                      {l.explainer ? <ExplainerTrigger kind={l.explainer} /> : null}
                      <span className="hidden rounded-full bg-mist-100 px-3 py-1 text-xs font-semibold text-navy-600 lg:inline">
                        {l.fact}
                      </span>
                      {l.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="hidden items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 ring-1 ring-brand-100 transition hover:bg-brand-100 lg:inline-flex"
                        >
                          {link.label}
                          <ArrowRight className="size-3.5" aria-hidden />
                        </Link>
                      ))}
                    </div>
                  </article>
                </div>
              );
            })}

            {/* Closing CTA with the cost of waiting */}
            <div
              ref={(el) => {
                stepRefs.current[LAST] = el;
              }}
              className="flex min-h-[54svh] items-center py-4 lg:min-h-[56svh]"
            >
              <div
                className={cn(
                  "w-full rounded-3xl bg-linear-to-br from-navy-900 via-navy-800 to-brand-800 p-6 text-white transition duration-500 sm:p-8",
                  !reduced && active !== LAST && "lg:opacity-60",
                )}
              >
                <h3 className="text-2xl leading-tight font-semibold tracking-tight text-white sm:text-3xl">
                  Understand your smile. <Accent tone="light">Protect it early.</Accent>
                </h3>
                <p className="mt-3 text-sm text-navy-200 sm:text-base">
                  The same cavity costs very different amounts depending on when it&apos;s treated.
                </p>

                <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {LAYERS.map((l, i) => {
                    const d = DECAY[l.layer];
                    return (
                      <li key={l.layer} className="rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/10">
                        <span className={cn("block h-1 rounded-full", d.dot)} style={{ width: `${(i + 1) * 25}%` }} />
                        <span className="mt-2 block text-[0.7rem] font-semibold tracking-wide text-navy-300 uppercase">
                          {i === 0 ? "Treat early" : i === 3 ? "Treat late" : `Stage ${i + 1}`}
                        </span>
                        <span className="mt-0.5 block text-sm leading-snug text-white">{d.fix}</span>
                        <span className="mt-1 block text-base font-semibold text-white">{prices[l.layer]}</span>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/treatments" className={buttonClasses({ variant: "light" })}>
                    Explore Treatments
                    <ArrowRight className="size-4 text-brand-600" aria-hidden />
                  </Link>
                  <Link href="/book" className={buttonClasses({ variant: "outline-light" })}>
                    <CalendarCheck className="size-4" aria-hidden />
                    Book Appointment
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
