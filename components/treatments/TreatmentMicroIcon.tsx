import { useId } from "react";
import type { TreatmentIconKey } from "@/lib/data/treatments";
import styles from "./TreatmentCard.module.css";

const tooth = "M7.5 3C5 3 3.5 5 3.5 7.6c0 1.9.6 3.2 1.1 4.6.6 1.7.8 3.4 1.1 5.4.3 2 .9 3.4 2 3.4 1.2 0 1.5-1.5 1.8-3.2.3-1.8.8-3.3 2.5-3.3s2.2 1.5 2.5 3.3c.3 1.7.6 3.2 1.8 3.2 1.1 0 1.7-1.4 2-3.4.3-2 .5-3.7 1.1-5.4.5-1.4 1.1-2.7 1.1-4.6C20.5 5 19 3 16.5 3c-1.9 0-2.8 1-4.5 1S9.4 3 7.5 3Z";

/** Tiny one-shot variations on the site's existing tooth and implant outlines. */
export function TreatmentMicroIcon({ icon }: { icon: TreatmentIconKey }) {
  const id = useId();
  return (
    <svg viewBox="-4 -4 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={styles.microIcon} aria-hidden focusable="false">
      {icon === "implant" ? (
        <>
          <path d="M7 3.6C7 2.7 7.7 2 8.6 2h6.8c.9 0 1.6.7 1.6 1.6v1.9C17 7.4 15.4 9 13.5 9h-3C8.6 9 7 7.4 7 5.5V3.6Z" fill="var(--color-brand-50)" />
          <path d="M10.5 9v2M13.5 9v2" />
          <g className={styles.implant}>
            <path d="M9.5 11h5l-.6 9.2c-.1 1-.9 1.8-1.9 1.8s-1.8-.8-1.9-1.8L9.5 11Z" />
            <path d="M9.6 13.8h4.8M9.8 16.6h4.4M10 19.2h4" />
          </g>
        </>
      ) : icon === "aligners" ? (
        <>
          <g transform="translate(-2 3) scale(.6)"><path d={tooth} className={styles.alignLeft} /></g>
          <g transform="translate(11 1) scale(.6)"><path d={tooth} className={styles.alignRight} /></g>
          <path d="M2 10 Q12 14 23 9" strokeOpacity=".4" />
          <path d="M5 10v3M18 9v3" />
        </>
      ) : (
        <>
          <g className={icon === "kids" ? styles.kids : undefined}>
            <path d={tooth} fill="var(--color-brand-50)" />
            {icon === "kids" && <><path d="M9 10h.01M15 10h.01" strokeWidth="2.2" /><path d="M9 12q3 3 6 0" /></>}
          </g>
          {icon === "checkup" && <g className={styles.inspect}><circle cx="17" cy="9" r="4" fill="white" fillOpacity=".8" /><path d="m20 12 3 3" /></g>}
          {icon === "rootCanal" && <path className={styles.pulse} d="M9.5 8.5c.6 1.5.8 3 .7 6M14.5 8.5c-.6 1.5-.8 3-.7 6" />}
          {icon === "whitening" && <>
            <defs><clipPath id={id}><path d={tooth} /></clipPath></defs>
            <g clipPath={`url(#${id})`}><path className={styles.whiten} d="M-3 0 3 0 16 25 10 25Z" fill="white" stroke="none" /></g>
            <path className={styles.spark} d="M21 0v5M18.5 2.5h5" />
          </>}
        </>
      )}
    </svg>
  );
}
