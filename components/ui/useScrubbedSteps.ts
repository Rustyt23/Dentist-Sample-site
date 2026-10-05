"use client";

import { useEffect, useRef, useState } from "react";

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (n: number) => n * n * (3 - 2 * n);

/** The "reading line": below the pinned stage on phones, mid-screen on desktop. */
function focusLine(mobileFocus: number) {
  return window.innerHeight * (window.innerWidth >= 1024 ? 0.5 : mobileFocus);
}

type Options = {
  sectionRef: React.RefObject<HTMLElement | null>;
  stageRef: React.RefObject<HTMLElement | null>;
  stepRefs: React.RefObject<(HTMLElement | null)[]>;
  /**
   * Called on every animation frame while the section is near the viewport, with the continuous step
   * position `t` (e.g. 2.4 = 40% of the way from step 2 to 3) and overall section progress (0–1).
   * Returns CSS variables to write onto the stage, or null to leave it untouched.
   */
  frame: (t: number, progress: number) => Record<string, string> | null;
  reduced: boolean;
  /** Reading-line position on small screens, as a fraction of viewport height */
  mobileFocus?: number;
};

/**
 * Scroll-scrubbed storytelling: tracks which step block is on the reading line and writes
 * interpolated CSS variables straight to the stage element, so the visual follows the scroll
 * without re-rendering React on every frame.
 */
export function useScrubbedSteps({ sectionRef, stageRef, stepRefs, frame, reduced, mobileFocus = 0.56 }: Options) {
  const [active, setActive] = useState(0);
  const frameRef = useRef(frame);
  useEffect(() => {
    frameRef.current = frame;
  });

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    let raf = 0;
    let near = false;

    const update = () => {
      raf = 0;
      // A final scroll can arrive after navigating away (refs already detached, listener not yet removed).
      if (!section.isConnected) return;
      const refs = stepRefs.current ?? [];
      if (refs.length === 0 || refs.some((el) => !el?.isConnected)) return;
      const steps = refs as HTMLElement[];

      const focus = focusLine(mobileFocus);
      const tops = steps.map((el) => el.getBoundingClientRect().top);

      let i = 0;
      tops.forEach((top, k) => {
        if (top < focus) i = k;
      });
      let t = i;
      const span = tops[i + 1] - tops[i];
      if (i < tops.length - 1 && span > 0) {
        const frac = clamp01((focus - tops[i]) / span);
        t = i + smooth(clamp01((frac - 0.25) / 0.75));
      }
      if (!Number.isFinite(t)) return;
      setActive(Math.round(t));

      const rect = section.getBoundingClientRect();
      const progress = clamp01((window.innerHeight - rect.top) / (rect.height + window.innerHeight));
      const vars = frameRef.current(t, progress);
      if (vars) for (const key in vars) stage.style.setProperty(key, vars[key]);
    };

    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(update);
    };

    // Only track scrolling while the section is on (or near) screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) onScroll();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sectionRef, stageRef, stepRefs, mobileFocus]);

  /** Scroll so a step sits on the reading line — the scrubbed animation plays on the way there. */
  const goTo = (step: number) => {
    const el = stepRefs.current?.[step];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - focusLine(mobileFocus) + 4;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return { active, goTo };
}
