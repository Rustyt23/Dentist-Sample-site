"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/components/ui/useMediaQuery";
import styles from "./ImplantTeaser.module.css";

const stages = ["Implant", "Abutment", "Crown", "Complete Tooth"];

/** A single five-second assembly preview, independent of the full treatment animation. */
export function ImplantTeaser() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <aside ref={ref} aria-label="How a dental implant works" data-started={started || undefined} className={styles.teaser}>
      <svg viewBox="0 0 100 110" role="img" aria-label="A titanium implant supports an abutment and ceramic crown to replace a tooth" className={styles.visual}>
        <path d="M8 58 Q28 51 50 57 T92 58" fill="none" stroke="#ace4dc" strokeWidth="2" />
        <g className={styles.screw}>
          <path d="M42 54h16l-3 38q-5 9-10 0Z" fill="#d9e0eb" stroke="#56709a" strokeWidth="1.5" />
          {[62, 69, 76, 83].map((y) => <path key={y} d={`M43 ${y}l14 3`} stroke="#8597b6" strokeWidth="1.5" />)}
        </g>
        <path className={styles.abutment} d="M44 54V43q6-8 12 0v11Z" fill="#b5c1d5" stroke="#56709a" strokeWidth="1.5" />
        <path className={styles.crown} d="M32 24q1-12 10-9q8 4 16 0q9-3 10 9l-3 13q-15 7-30 0Z" fill="white" stroke="#78cfc5" strokeWidth="1.5" />
        <path className={styles.shine} d="M39 21q0-2 4-1" fill="none" stroke="#43b3a8" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold tracking-tight">How does a dental implant work?</h3>
        <ol className={styles.stages} aria-label="Dental implant assembly sequence">
          {stages.map((stage, i) => <li key={stage} style={{ "--stage-delay": `${i * 1.2}s` } as React.CSSProperties}>{stage}</li>)}
        </ol>
        <Link href="/treatments#implant-journey" className="mt-4 inline-flex items-center gap-2 py-1 text-sm font-semibold text-brand-700 transition-colors hover:text-navy-900">
          Explore Dental Implants <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </aside>
  );
}
