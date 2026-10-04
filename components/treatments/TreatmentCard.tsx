"use client";

import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Treatment } from "@/lib/data/treatments";
import { TreatmentMicroIcon } from "./TreatmentMicroIcon";
import styles from "./TreatmentCard.module.css";

type CardTreatment = Pick<Treatment, "slug" | "name" | "summary" | "icon">;

export function TreatmentCard({ treatment }: { treatment: CardTreatment }) {
  const card = useRef<HTMLAnchorElement>(null);
  const frame = useRef(0);
  const release = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iconRelease = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bounds = useRef<DOMRect | null>(null);
  const start = useRef({ x: 0, y: 0 });
  const hoverEnabled = useRef(false);
  const reduced = useRef(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      reduced.current = motionQuery.matches;
      hoverEnabled.current = hoverQuery.matches && !motionQuery.matches;
      if (!hoverEnabled.current && card.current) {
        card.current.removeAttribute("data-hovered");
        card.current.removeAttribute("style");
      }
    };
    sync();
    motionQuery.addEventListener("change", sync);
    hoverQuery.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      hoverQuery.removeEventListener("change", sync);
      cancelAnimationFrame(frame.current);
      if (release.current) clearTimeout(release.current);
      if (iconRelease.current) clearTimeout(iconRelease.current);
    };
  }, []);

  const reset = () => {
    cancelAnimationFrame(frame.current);
    const element = card.current;
    if (!element) return;
    element.removeAttribute("data-hovered");
    element.removeAttribute("data-pressed");
    element.removeAttribute("data-animating");
    element.style.removeProperty("--rx");
    element.style.removeProperty("--ry");
    element.style.removeProperty("--icon-x");
    element.style.removeProperty("--icon-y");
    element.style.removeProperty("--shadow-x");
  };

  const track = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || !hoverEnabled.current || !bounds.current) return;
    const rect = bounds.current;
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const element = card.current;
      if (!element) return;
      element.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
      element.style.setProperty("--ry", `${(x - 0.5) * 5}deg`);
      element.style.setProperty("--icon-x", `${(x - 0.5) * 5}px`);
      element.style.setProperty("--icon-y", `${(y - 0.5) * 5}px`);
      element.style.setProperty("--spot-x", `${x * 100}%`);
      element.style.setProperty("--spot-y", `${y * 100}%`);
      element.style.setProperty("--shadow-x", `${(0.5 - x) * 12}px`);
    });
  };

  return (
    <div className={styles.scene}>
      <Link
        ref={card}
        href={`/treatments#${treatment.slug}`}
        className={styles.card}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse" || !hoverEnabled.current) return;
          bounds.current = event.currentTarget.parentElement!.getBoundingClientRect();
          event.currentTarget.dataset.hovered = "true";
          track(event);
        }}
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse") {
            if (Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) > 8) reset();
            return;
          }
          track(event);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") reset();
        }}
        onPointerCancel={reset}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" || reduced.current) return;
          if (release.current) clearTimeout(release.current);
          if (iconRelease.current) clearTimeout(iconRelease.current);
          start.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.dataset.pressed = "true";
          event.currentTarget.dataset.animating = "true";
          iconRelease.current = setTimeout(() => card.current?.removeAttribute("data-animating"), 900);
        }}
        onPointerUp={(event) => {
          if (event.pointerType === "mouse") return;
          release.current = setTimeout(() => card.current?.removeAttribute("data-pressed"), 160);
        }}
      >
        <span className={styles.spotlight} aria-hidden />
        <span className={styles.icon}>
          <TreatmentMicroIcon icon={treatment.icon} />
        </span>
        <div className={styles.content}>
          <h3 className="text-base font-semibold tracking-tight">{treatment.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-navy-500">{treatment.summary}</p>
        </div>
        <ArrowUpRight className={styles.arrow} aria-hidden />
      </Link>
    </div>
  );
}
