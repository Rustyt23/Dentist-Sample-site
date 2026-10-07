"use client";

import { useEffect, type RefObject } from "react";

type Options = { rootMargin?: string };

/** Pause decorative animations and notify imperative players without rendering React. */
export function useAnimationVisibility(sectionRef: RefObject<HTMLElement | null>, { rootMargin = "200px 0px" }: Options = {}): void {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let near = false;
    let lastActive: boolean | null = null;

    const sync = () => {
      const active = near && !document.hidden;
      if (active === lastActive) return;
      lastActive = active;
      if (active) section.removeAttribute("data-animation-paused");
      else section.setAttribute("data-animation-paused", "true");
      section.dispatchEvent(new CustomEvent("animationvisibilitychange", { detail: { active } }));
    };

    const observer = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      sync();
    }, { rootMargin });
    observer.observe(section);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      section.removeAttribute("data-animation-paused");
    };
  }, [sectionRef, rootMargin]);
}
