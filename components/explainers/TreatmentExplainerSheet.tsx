"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, CalendarCheck, Pause, Play, RotateCcw, Sparkles, X } from "lucide-react";
import { formatPrice, getTreatment } from "@/lib/data/treatments";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";
import { useReducedMotion } from "@/components/ui/useMediaQuery";
import { ImplantScene, RootCanalScene } from "./ExplainerScenes";

import type { ExplainerKind } from "./TreatmentExplainer";

type Explainer = {
  title: string;
  treatment: string;
  steps: { title: string; text: string }[];
};

const EXPLAINERS: Record<ExplainerKind, Explainer> = {
  implant: {
    title: "How a dental implant works",
    treatment: "dental-implants",
    steps: [
      { title: "A missing tooth", text: "Gaps let neighbouring teeth drift and the jawbone slowly shrink." },
      {
        title: "Titanium post placed",
        text: "A small titanium post goes into the jawbone under local anaesthesia, guided by a 3D scan.",
      },
      {
        title: "Bone fuses, abutment fitted",
        text: "Over 2–3 months the bone bonds to the post. Then a small connector is attached.",
      },
      {
        title: "Custom crown fitted",
        text: "A ceramic crown, shade-matched to your teeth, completes a natural, permanent smile.",
      },
    ],
  },
  rootCanal: {
    title: "How a root canal works",
    treatment: "root-canal",
    steps: [
      {
        title: "Infection reaches the pulp",
        text: "Deep decay or a crack lets bacteria into the pulp, causing throbbing pain or swelling.",
      },
      {
        title: "Canals gently cleaned",
        text: "Under local anaesthesia, the infected pulp is removed and the canals cleaned with fine rotary files.",
      },
      {
        title: "Sealed from the inside",
        text: "The clean canals are filled and sealed so bacteria can't get back in.",
      },
      {
        title: "A crown restores strength",
        text: "A crown protects the treated tooth, so you can bite and chew normally again.",
      },
    ],
  },
};

const STEP_MS = 3400;

export default function TreatmentExplainerSheet({ kind, onClose, dialogId }: { kind: ExplainerKind; onClose: () => void; dialogId: string }) {
  const data = EXPLAINERS[kind];
  const treatment = getTreatment(data.treatment);
  const reduced = useReducedMotion();
  const last = data.steps.length - 1;

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [closing, setClosing] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);
  const closeTimeout = useRef<number | null>(null);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const autoplay = playing && !reduced && step < last;

  useEffect(() => () => {
    if (closeTimeout.current !== null) window.clearTimeout(closeTimeout.current);
  }, []);

  const close = () => {
    if (closeTimeout.current !== null) return;
    setClosing(true);
    closeTimeout.current = window.setTimeout(() => onCloseRef.current(), reduced ? 0 : 220);
  };
  const go = (next: number) => setStep(Math.max(0, Math.min(last, next)));

  // Advance automatically, like stories.
  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => setStep((s) => Math.min(last, s + 1)), STEP_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, step, last]);

  // The trigger keeps scroll lock and focus containment active during loading.
  // The loaded sheet provides step shortcuts and focuses its own close control.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setStep((s) => Math.min(last, s + 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [last]);

  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 40) {
      go(step + (dx < 0 ? 1 : -1));
      return;
    }
    // Tap: left third goes back, the rest goes forward.
    const rect = e.currentTarget.getBoundingClientRect();
    go(step + (e.clientX - rect.left < rect.width / 3 ? -1 : 1));
  };

  const Scene = kind === "implant" ? ImplantScene : RootCanalScene;
  const current = data.steps[step];

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[80] flex items-end justify-center bg-navy-950/55 backdrop-blur-sm transition-opacity duration-200 sm:items-center sm:p-6",
        closing ? "opacity-0" : "opacity-100",
      )}
      onClick={close}
    >
      <div
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`explainer-${kind}-title`}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative max-h-[94svh] w-full overflow-y-auto rounded-t-[2rem] bg-white pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-lift sm:max-w-lg sm:rounded-[2rem] sm:pb-6",
          !reduced && "animate-sheet-up sm:animate-fade-up",
          closing && "translate-y-6 transition-transform duration-200",
        )}
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-navy-100 sm:hidden" aria-hidden />

        <div className="flex items-start justify-between gap-4 px-5 pt-4 sm:px-7 sm:pt-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">How it works</p>
            <h2 id={`explainer-${kind}-title`} className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              {data.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-mist-100 text-navy-700 transition hover:bg-mist-200"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Story-style progress */}
        <div className="mt-4 flex gap-1.5 px-5 sm:px-7" aria-hidden>
          {data.steps.map((s, i) => (
            <span key={s.title} className="h-1 flex-1 overflow-hidden rounded-full bg-navy-100">
              <span
                key={`${i}-${step}-${autoplay}`}
                className={cn(
                  "block h-full origin-left rounded-full bg-brand-500",
                  i < step && "scale-x-100",
                  i > step && "scale-x-0",
                  i === step && (autoplay ? "animate-story" : "scale-x-100"),
                )}
                style={i === step && autoplay ? { animationDuration: `${STEP_MS}ms` } : undefined}
              />
            </span>
          ))}
        </div>

        {/* Scene — tap the sides or swipe */}
        <div className="px-5 pt-4 sm:px-7">
          <div
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipeStart.current = null)}
            className="relative aspect-[400/330] cursor-pointer touch-pan-y overflow-hidden rounded-3xl bg-linear-to-b from-mist-50 to-mist-100 select-none sm:aspect-[400/360]"
          >
            <div className="absolute inset-x-0 -top-[6%] bottom-0">
              <Scene step={step} animate={!reduced} />
            </div>
            {step === last && !reduced
              ? [
                  [30, 16],
                  [66, 12],
                  [74, 34],
                  [24, 40],
                ].map(([x, y], i) => (
                  <Sparkles
                    key={`${x}-${y}`}
                    className="animate-sparkle absolute size-4 text-brand-400"
                    style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${500 + i * 140}ms` }}
                    aria-hidden
                  />
                ))
              : null}
            <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-navy-700 shadow-soft">
              Step {step + 1} of {data.steps.length}
            </span>
          </div>
        </div>

        <div className="min-h-[6.5rem] px-5 pt-5 sm:px-7" aria-live="polite">
          <h3 key={`t-${step}`} className={cn("text-lg font-semibold tracking-tight", !reduced && "animate-step-in")}>
            {current.title}
          </h3>
          <p
            key={`p-${step}`}
            className={cn("mt-1.5 text-[0.95rem] leading-relaxed text-navy-500", !reduced && "animate-step-in")}
          >
            {current.text}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between gap-3 px-5 sm:px-7">
          <button
            type="button"
            onClick={() => go(step - 1)}
            disabled={step === 0}
            aria-label="Previous step"
            className="grid size-11 place-items-center rounded-full text-navy-700 ring-1 ring-navy-200 transition hover:bg-mist-50 disabled:opacity-30"
          >
            <ArrowLeft className="size-5" />
          </button>

          {step < last ? (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              disabled={reduced}
              className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-navy-700 transition hover:bg-mist-50 disabled:hidden"
            >
              {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
              {playing ? "Pause" : "Play"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStep(0);
                setPlaying(true);
              }}
              className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-navy-700 transition hover:bg-mist-50"
            >
              <RotateCcw className="size-4" aria-hidden />
              Replay
            </button>
          )}

          <button
            type="button"
            onClick={() => go(step + 1)}
            disabled={step === last}
            aria-label="Next step"
            className="grid size-11 place-items-center rounded-full bg-navy-900 text-white transition hover:bg-navy-800 disabled:opacity-30"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>

        <div className="mx-5 mt-5 flex flex-col gap-3 rounded-2xl bg-mist-50 p-4 sm:mx-7 sm:flex-row sm:items-center sm:justify-between">
          {treatment ? (
            <p className="text-sm text-navy-600">
              <span className="font-semibold text-navy-900">{formatPrice(treatment.price)}</span> · {treatment.visits}
            </p>
          ) : null}
          <Link
            href={`/book?treatment=${data.treatment}`}
            onClick={onClose}
            className={buttonClasses({ size: "sm", className: "w-full sm:w-auto" })}
          >
            <CalendarCheck className="size-4" aria-hidden />
            Book a consultation
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}

