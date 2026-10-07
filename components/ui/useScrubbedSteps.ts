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
  const activeRef = useRef(0);
  const invalidateRef = useRef<(() => void) | null>(null);
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
    let dirty = true;
    let disposed = false;
    let geometry: { tops: number[]; top: number; height: number; focus: number; viewportHeight: number } | null = null;
    const written = new Map<string, string>();

    // Document coordinates stay stable during scrolling. Re-measure only after a layout change.
    const measure = () => {
      const refs = stepRefs.current ?? [];
      if (refs.length === 0 || refs.some((el) => !el?.isConnected)) return false;
      const scrollY = window.scrollY;
      const rect = section.getBoundingClientRect();
      geometry = {
        tops: (refs as HTMLElement[]).map((el) => el.getBoundingClientRect().top + scrollY),
        top: rect.top + scrollY,
        height: rect.height,
        focus: focusLine(mobileFocus),
        viewportHeight: window.innerHeight,
      };
      dirty = false;
      return true;
    };

    const update = () => {
      raf = 0;
      // A final scroll can arrive after navigating away (refs already detached, listener not yet removed).
      if (disposed || !near || document.hidden || !section.isConnected) return;
      if ((dirty || !geometry) && !measure()) return;
      const { tops, top, height, focus, viewportHeight } = geometry!;
      const readingLine = window.scrollY + focus;

      let i = 0;
      tops.forEach((top, k) => {
        if (top < readingLine) i = k;
      });
      let t = i;
      const span = tops[i + 1] - tops[i];
      if (i < tops.length - 1 && span > 0) {
        const frac = clamp01((readingLine - tops[i]) / span);
        t = i + smooth(clamp01((frac - 0.25) / 0.75));
      }
      if (!Number.isFinite(t)) return;
      const nextActive = Math.round(t);
      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }

      const progress = clamp01((viewportHeight - (top - window.scrollY)) / (height + viewportHeight));
      const vars = frameRef.current(t, progress);
      if (vars) for (const key in vars) {
        if (written.get(key) === vars[key]) continue;
        stage.style.setProperty(key, vars[key]);
        written.set(key, vars[key]);
      }
    };

    const onScroll = () => {
      if (near && !document.hidden && !raf) raf = requestAnimationFrame(update);
    };
    const invalidate = () => {
      dirty = true;
      onScroll();
    };
    invalidateRef.current = invalidate;

    // Only track scrolling while the section is on (or near) screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) invalidate();
        else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "200px 0px" },
    );
    const resizeObserver = new ResizeObserver(invalidate);
    // Body changes cover content above the section, including image/font layout shifts.
    resizeObserver.observe(document.body);
    resizeObserver.observe(section);
    stepRefs.current.forEach((el) => { if (el) resizeObserver.observe(el); });
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", invalidate);
    window.addEventListener("load", invalidate);
    document.addEventListener("visibilitychange", invalidate);
    document.fonts?.addEventListener("loadingdone", invalidate);
    return () => {
      disposed = true;
      if (invalidateRef.current === invalidate) invalidateRef.current = null;
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("load", invalidate);
      document.removeEventListener("visibilitychange", invalidate);
      document.fonts?.removeEventListener("loadingdone", invalidate);
      cancelAnimationFrame(raf);
    };
  }, [sectionRef, stageRef, stepRefs, mobileFocus, reduced]);

  /** Scroll so a step sits on the reading line — the scrubbed animation plays on the way there. */
  const goTo = (step: number) => {
    const el = stepRefs.current?.[step];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - focusLine(mobileFocus) + 4;
    invalidateRef.current?.();
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return { active, goTo };
}
