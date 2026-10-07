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
  const touchedRef = useRef(false);
  const position = useRef(50);
  const bounds = useRef<{ left: number; width: number } | null>(null);
  const frame = useRef(0);
  const pointerX = useRef(0);
  const finishArmed = useRef(true);
  const [shine, setShine] = useState(0);

  const paintDivider = (next: number) => {
    const el = ref.current;
    if (!el) return;
    const value = clamp(next);
    position.current = value;
    el.style.setProperty("--split", `${value}%`);
    const rounded = String(Math.round(value));
    if (el.getAttribute("aria-valuenow") !== rounded) {
      el.setAttribute("aria-valuenow", rounded);
      el.setAttribute("aria-valuetext", `${rounded}% before`);
    }
  };

  const moveDivider = (next: number) => {
    const value = clamp(next);
    touchedRef.current = true;
    ref.current?.setAttribute("data-interacted", "true");
    paintDivider(value);
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
            paintDivider(value);
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
    const rect = bounds.current;
    if (!rect || rect.width <= 0) return;
    moveDivider(((clientX - rect.left) / rect.width) * 100);
  };

  const queueUpdate = (clientX: number) => {
    pointerX.current = clientX;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      update(pointerX.current);
    });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    update(event.clientX);
    dragging.current = false;
    bounds.current = null;
  };

  const cancelDrag = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    dragging.current = false;
    bounds.current = null;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const refreshBounds = () => {
      if (dragging.current) bounds.current = el.getBoundingClientRect();
    };
    const observer = new ResizeObserver(refreshBounds);
    observer.observe(el);
    window.addEventListener("resize", refreshBounds);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", refreshBounds);
      cancelAnimationFrame(frame.current);
    };
  }, []);

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
      aria-valuenow={50}
      aria-valuetext="50% before"
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
        bounds.current = e.currentTarget.getBoundingClientRect();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && queueUpdate(e.clientX)}
      onPointerUp={endDrag}
      onPointerCancel={cancelDrag}
      onLostPointerCapture={cancelDrag}
      style={{ "--split": "50%" } as React.CSSProperties}
      className={cn(
        styles.slider,
        "group relative cursor-ew-resize touch-pan-y overflow-hidden rounded-[1.75rem] bg-navy-800 select-none focus-visible:outline-brand-300",
        className,
      )}
    >
      {/* After (full) */}
      <Image
        src={src}
        alt={`After: ${alt}`}
        fill
        sizes="(min-width: 1312px) 1216px, (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
        className="pointer-events-none object-cover"
        draggable={false}
      />

      {/* Before (clipped) */}
      <div
        className={cn("absolute inset-0", styles.before)}
      >
        <Image
          src={src}
          alt={`Before: ${alt}`}
          fill
          sizes="(min-width: 1312px) 1216px, (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
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
        className={cn("pointer-events-none absolute inset-0", styles.divider)}
      >
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white/90 shadow-[0_0_12px_rgb(0_0_0/0.25)]" />
        <div className="absolute top-1/2 left-0 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-900 shadow-lift ring-4 ring-white/30 transition-transform group-active:scale-95">
          <MoveHorizontal className="size-5" aria-hidden />
        </div>
      </div>

      <span
        className={cn(
          "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-navy-950/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur transition-opacity duration-500",
          styles.hint,
        )}
      >
        Drag to compare
      </span>
    </div>
  );
}
