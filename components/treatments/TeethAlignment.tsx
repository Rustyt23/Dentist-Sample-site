"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarCheck, Hand, Info, MoveHorizontal, Play } from "lucide-react";
import { formatPrice, getTreatment } from "@/lib/data/treatments";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Accent, Eyebrow } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/components/ui/useMediaQuery";
import { Dentition, DentitionDefs, applianceAt } from "./alignment/Dentition";
import { LOWER_TEETH, PAINT_ORDER, UPPER_TEETH, crookedness, toothTransform, wireFor } from "./alignment/teeth";

const braces = getTreatment("braces-aligners");

const STEPS = [
  {
    label: "Initial Alignment",
    at: 0,
    when: "Month 0",
    text: "A 3D scan maps every tooth. We plan each movement — and show you the result — before treatment begins.",
  },
  {
    label: "Guided Movement",
    at: 0.4,
    when: "Months 1–4",
    text: "Light, steady pressure from braces or aligners starts gently rotating and shifting each tooth.",
  },
  {
    label: "Progress",
    at: 0.72,
    when: "Months 5–9",
    text: "Teeth move into line and crowding resolves. Quick check-ins every 6–8 weeks keep everything on track.",
  },
  {
    label: "Final Smile",
    at: 1,
    when: "Month 12",
    text: "Teeth sit straight and balanced. A slim retainer keeps your new smile in place.",
  },
];

const MONTHS = 12;
const stepFor = (p: number) => (p < 0.2 ? 0 : p < 0.56 ? 1 : p < 0.9 ? 2 : 3);
const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const ease = (n: number) => (n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2);
const afterLabel = (p: number) => (p > 0.995 ? "After" : `Month ${Math.round(p * MONTHS)}`);

export function TeethAlignment() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(3);
  const [mode, setMode] = useState<"aligners" | "braces">("aligners");
  const [interacted, setInteracted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const afterTagRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const upperWireRef = useRef<SVGPathElement>(null);
  const lowerWireRef = useRef<SVGPathElement>(null);
  const teethRefs = useRef<Record<string, SVGGElement | null>>({});
  const progress = useRef(1);
  const split = useRef(50);
  const seq = useRef(0);
  const raf = useRef(0);
  const dragging = useRef(false);
  const played = useRef(false);

  const register = useCallback((id: string, el: SVGGElement | null) => {
    teethRefs.current[id] = el;
  }, []);

  /** Pose the "after" side for treatment progress p (0–1). */
  const pose = useCallback((p: number) => {
    progress.current = p;
    for (const t of PAINT_ORDER) {
      const el = teethRefs.current[t.id];
      if (!el) continue;
      const k = crookedness(t, p);
      el.setAttribute("transform", toothTransform(t, k));
      const shade = el.querySelector<SVGPathElement>("[data-shade]");
      if (shade) shade.style.opacity = (t.shade * 0.5 * k).toFixed(3);
    }
    upperWireRef.current?.setAttribute("d", wireFor(UPPER_TEETH, p));
    lowerWireRef.current?.setAttribute("d", wireFor(LOWER_TEETH, p));
    svgRef.current?.style.setProperty("--appliance", applianceAt(p).toFixed(3));
    if (afterTagRef.current) afterTagRef.current.textContent = afterLabel(p);
    setStage(stepFor(p));
  }, []);

  /** Move the before/after divider (percentage from the left). */
  const setSplit = useCallback((pct: number) => {
    split.current = pct;
    if (beforeRef.current) beforeRef.current.style.clipPath = `inset(0 ${(100 - pct).toFixed(2)}% 0 0)`;
    if (dividerRef.current) dividerRef.current.style.left = `${pct.toFixed(2)}%`;
    stageRef.current?.setAttribute("aria-valuenow", String(Math.round(pct)));
  }, []);

  /** Tween a value; resolves false if another interaction took over. */
  const tween = useCallback(
    (from: number, to: number, ms: number, onUpdate: (v: number) => void, id: number) =>
      new Promise<boolean>((resolve) => {
        const start = performance.now();
        const tick = (now: number) => {
          if (seq.current !== id) return resolve(false);
          const e = ease(clamp((now - start) / ms));
          onUpdate(from + (to - from) * e);
          if (e < 1) raf.current = requestAnimationFrame(tick);
          else resolve(true);
        };
        raf.current = requestAnimationFrame(tick);
      }),
    [],
  );

  const interrupt = () => {
    seq.current += 1;
    cancelAnimationFrame(raf.current);
    played.current = true;
  };

  /** Full-view treatment playback, then settle into the before/after comparison. */
  const watch = useCallback(async () => {
    const id = ++seq.current;
    cancelAnimationFrame(raf.current);
    if (reduced) {
      pose(1);
      setSplit(50);
      return;
    }
    if (!(await tween(split.current, 0, 450, setSplit, id))) return;
    pose(0);
    if (!(await tween(0, 1, 4600, pose, id))) return;
    await new Promise((r) => window.setTimeout(r, 350));
    if (seq.current !== id) return;
    await tween(0, 50, 750, setSplit, id);
  }, [pose, reduced, setSplit, tween]);

  const goToStage = (i: number) => {
    interrupt();
    setInteracted(true);
    const id = seq.current;
    if (split.current < 20 || split.current > 80) setSplit(50);
    if (reduced) pose(STEPS[i].at);
    else void tween(progress.current, STEPS[i].at, 600 + 900 * Math.abs(STEPS[i].at - progress.current), pose, id);
  };

  // Play once, the first time the section scrolls into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.current) {
          played.current = true;
          observer.disconnect();
          window.setTimeout(() => void watch(), 300);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      seq.current += 1;
      cancelAnimationFrame(raf.current);
    };
  }, [reduced, watch]);

  const fromPointer = (clientX: number) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (r) setSplit(clamp(((clientX - r.left) / r.width) * 100, 0, 100));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5;
    const next =
      e.key === "ArrowLeft"
        ? split.current - step
        : e.key === "ArrowRight"
          ? split.current + step
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? 100
              : null;
    if (next === null) return;
    e.preventDefault();
    interrupt();
    setInteracted(true);
    setSplit(clamp(next, 0, 100));
  };

  const current = STEPS[stage];

  return (
    <section ref={sectionRef} id="teeth-alignment" aria-labelledby="teeth-alignment-title" className="px-2 sm:px-4">
      <DentitionDefs />
      <div className="rounded-[2.5rem] bg-mist-50 py-16 ring-1 ring-mist-100 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-8">
            {/* Heading */}
            <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
              <Eyebrow>Braces & clear aligners</Eyebrow>
              <h2
                id="teeth-alignment-title"
                className="mt-4 text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl"
              >
                From crowded to confident — <Accent>see the difference.</Accent>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-500 sm:text-lg">
                Braces and clear aligners apply light, steady pressure that gradually guides each tooth into a better
                position. Drag to compare before and after, or watch the smile straighten.
              </p>
            </div>

            {/* Before / After comparison */}
            <div className="min-w-0 lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
              <div
                ref={stageRef}
                role="slider"
                tabIndex={0}
                aria-label="Before and after comparison. Use the arrow keys to move the divider."
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={50}
                onKeyDown={onKeyDown}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  dragging.current = true;
                  interrupt();
                  setInteracted(true);
                  fromPointer(e.clientX);
                }}
                onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
                onPointerUp={() => (dragging.current = false)}
                onPointerCancel={() => (dragging.current = false)}
                className="relative aspect-[460/280] cursor-ew-resize touch-pan-y overflow-hidden rounded-[2rem] bg-linear-to-b from-white to-mist-100 shadow-lift ring-1 ring-navy-100 select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
              >
                {/* After (animated) */}
                <Dentition
                  p={1}
                  mode={mode}
                  label="After treatment: straight, evenly aligned upper and lower teeth"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  refs={{ svg: svgRef, upperWire: upperWireRef, lowerWire: lowerWireRef, register }}
                />

                {/* Before (clipped to the left of the divider) */}
                <div
                  ref={beforeRef}
                  className="pointer-events-none absolute inset-0"
                  style={{ clipPath: "inset(0 50% 0 0)" }}
                >
                  <Dentition
                    p={0}
                    mode={mode}
                    label="Before treatment: crowded, rotated and overlapping teeth"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>

                <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-navy-950/70 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur sm:top-4 sm:left-4">
                  Before
                </span>
                <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold tracking-wide text-navy-900 uppercase shadow-soft sm:top-4 sm:right-4">
                  <span ref={afterTagRef}>After</span>
                </span>

                {/* Divider */}
                <div ref={dividerRef} className="pointer-events-none absolute inset-y-0" style={{ left: "50%" }}>
                  <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_14px_rgb(0_0_0/0.35)]" />
                  <div className="absolute top-1/2 left-0 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-900 shadow-lift ring-4 ring-white/40">
                    <MoveHorizontal className="size-5" aria-hidden />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setInteracted(true);
                    void watch();
                  }}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-900 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-white transition hover:bg-navy-800"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-white text-navy-900">
                    <Play className="size-3.5 fill-current" aria-hidden />
                  </span>
                  Watch it straighten
                </button>
                <div
                  className="flex rounded-full bg-white p-1 text-xs font-semibold shadow-soft ring-1 ring-navy-100"
                  role="group"
                  aria-label="Show treatment with"
                >
                  {(["aligners", "braces"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={mode === m}
                      onClick={() => setMode(m)}
                      className={cn(
                        "rounded-full px-3 py-1.5 transition",
                        mode === m ? "bg-brand-600 text-white" : "text-navy-500 hover:text-navy-900",
                      )}
                    >
                      {m === "aligners" ? "Clear aligners" : "Braces"}
                    </button>
                  ))}
                </div>
              </div>
              <p
                className={cn(
                  "mt-3 flex items-center gap-1.5 text-xs text-navy-400 transition-opacity",
                  interacted && "opacity-0",
                )}
              >
                <Hand className="size-3.5" aria-hidden />
                Drag across the image to compare
              </p>

              {/* Stage thumbnails */}
              <ol className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4" aria-label="Treatment stages">
                {STEPS.map((s, i) => {
                  const on = stage === i;
                  return (
                    <li key={s.label}>
                      <button
                        type="button"
                        onClick={() => goToStage(i)}
                        aria-pressed={on}
                        className={cn(
                          "w-full rounded-2xl bg-white p-1.5 text-left ring-1 transition duration-300",
                          on ? "shadow-soft ring-2 ring-brand-400" : "ring-navy-100 hover:ring-brand-200",
                        )}
                      >
                        <span className="relative block overflow-hidden rounded-xl bg-mist-50">
                          <Dentition
                            p={s.at}
                            mode={mode}
                            label={`${s.label} stage`}
                            className="block aspect-[460/280] h-auto w-full"
                          />
                        </span>
                        <span className="flex items-baseline justify-between gap-2 px-1.5 pt-2 pb-1">
                          <span
                            className={cn(
                              "text-[0.78rem] leading-tight font-semibold",
                              on ? "text-brand-700" : "text-navy-800",
                            )}
                          >
                            {s.label}
                          </span>
                          <span className="shrink-0 text-[0.65rem] text-navy-400">{s.when}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Stage detail + CTA */}
            <div className="lg:col-span-5 lg:col-start-8 lg:row-start-2">
              <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100 sm:p-6" aria-live="polite">
                <p className="flex items-center justify-between gap-3 text-xs font-semibold tracking-wide text-brand-600 uppercase">
                  <span>
                    Step {stage + 1} of {STEPS.length}
                  </span>
                  <span className="text-navy-400 normal-case">{current.when}</span>
                </p>
                <h3 key={`h-${stage}`} className="animate-step-in mt-2 text-xl font-semibold tracking-tight">
                  {current.label}
                </h3>
                <p key={`p-${stage}`} className="animate-step-in mt-2 text-[0.95rem] leading-relaxed text-navy-500">
                  {current.text}
                </p>
                {braces ? (
                  <p className="mt-4 border-t border-navy-100 pt-4 text-sm text-navy-500">
                    Typical treatment {braces.duration} · Braces {formatPrice(braces.price).toLowerCase()}
                    {braces.priceNote ? ` · ${braces.priceNote}` : ""}
                  </p>
                ) : null}
              </div>

              <div className="mt-5 rounded-3xl bg-linear-to-br from-navy-900 via-navy-800 to-brand-800 p-6 text-white sm:p-7">
                <h3 className="text-xl leading-tight font-semibold tracking-tight text-white sm:text-2xl">
                  See what a straighter smile <Accent tone="light">could look like</Accent>
                </h3>
                <p className="mt-2 text-sm text-navy-200">
                  Your consultation includes a 3D digital preview of your own new smile.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/book?treatment=braces-aligners"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-center text-sm font-semibold text-navy-900 shadow-soft transition hover:-translate-y-0.5 hover:bg-mist-50"
                  >
                    <CalendarCheck className="size-4 shrink-0 text-brand-600" aria-hidden />
                    Book Orthodontic Consultation
                  </Link>
                  <Link
                    href="/treatments#braces-aligners"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10 hover:ring-white/50"
                  >
                    Explore Braces & Aligners
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                </div>
              </div>

              <p className="mt-4 flex items-start gap-2 px-1 text-xs leading-relaxed text-navy-400">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Illustration for guidance. Your own treatment plan and timeline are confirmed after a 3D scan.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
