"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./BeforeAfterSlider.module.css";

type BeforeAfterSliderProps = {
  src: string;
  alt: string;
  beforeFilter: string;
  className?: string;
};

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/** Drag (or use arrow keys) to reveal the "before" and "after" states of a smile. */
export function BeforeAfterSlider({ src, alt, beforeFilter, className }: BeforeAfterSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const touchedRef = useRef(false);
  const position = useRef(50);
  const finishArmed = useRef(true);
  const [shine, setShine] = useState(0);

  const moveDivider = (next: number) => {
    const value = clamp(next);
    position.current = value;
    setPos(value);
    setTouched(true);
    touchedRef.current = true;
    if (value > 5) finishArmed.current = true;
    if (value <= 1 && finishArmed.current) {
      finishArmed.current = false;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setShine((count) => count + 1);
    }
  };

  // Gently sweep the divider once when the slider first scrolls into view, hinting that it's draggable.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        [
          [400, 32],
          [1100, 68],
          [1800, 50],
        ].forEach(([delay, value]) =>
          timers.push(window.setTimeout(() => {
            if (touchedRef.current) return;
            position.current = value;
            setPos(value);
          }, delay)),
        );
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const update = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    moveDivider(((clientX - rect.left) / rect.width) * 100);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") moveDivider(position.current - step);
    else if (e.key === "ArrowRight") moveDivider(position.current + step);
    else if (e.key === "Home") moveDivider(0);
    else if (e.key === "End") moveDivider(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Before and after comparison. Use arrow keys to move the divider."
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-valuetext={`${Math.round(pos)}% before`}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        finishArmed.current = true;
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      className={cn(
        "group relative cursor-ew-resize touch-pan-y overflow-hidden rounded-[1.75rem] bg-navy-800 select-none focus-visible:outline-brand-300",
        className,
      )}
    >
      {/* After (full) */}
      <Image
        src={src}
        alt={`After: ${alt}`}
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="pointer-events-none object-cover"
        draggable={false}
      />

      {/* Before (clipped) */}
      <div
        className={cn("absolute inset-0", !touched && "transition-[clip-path] duration-700 ease-in-out")}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={src}
          alt={`Before: ${alt}`}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="pointer-events-none object-cover"
          style={{ filter: beforeFilter }}
          draggable={false}
        />
      </div>

      {shine > 0 && <span key={shine} className={styles.shine} data-finish-shine={shine} aria-hidden />}

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-navy-950/60 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur">
        Before
      </span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wide text-navy-900 uppercase backdrop-blur">
        After
      </span>

      {/* Divider + handle */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0",
          !touched && "transition-[left] duration-700 ease-in-out",
        )}
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white/90 shadow-[0_0_12px_rgb(0_0_0/0.25)]" />
        <div className="absolute top-1/2 left-0 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-900 shadow-lift ring-4 ring-white/30 transition-transform group-active:scale-95">
          <MoveHorizontal className="size-5" aria-hidden />
        </div>
      </div>

      <span
        className={cn(
          "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-navy-950/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur transition-opacity duration-500",
          touched ? "opacity-0" : "opacity-100",
        )}
      >
        Drag to compare
      </span>
    </div>
  );
}
