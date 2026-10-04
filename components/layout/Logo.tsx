import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-10 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-brand-400 via-brand-600 to-navy-800 text-white shadow-glow",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinejoin="round"
          d="M7.5 3C5 3 3.5 5 3.5 7.6c0 1.9.6 3.2 1.1 4.6.6 1.7.8 3.4 1.1 5.4.3 2 .9 3.4 2 3.4 1.2 0 1.5-1.5 1.8-3.2.3-1.8.8-3.3 2.5-3.3s2.2 1.5 2.5 3.3c.3 1.7.6 3.2 1.8 3.2 1.1 0 1.7-1.4 2-3.4.3-2 .5-3.7 1.1-5.4.5-1.4 1.1-2.7 1.1-4.6C20.5 5 19 3 16.5 3c-1.9 0-2.8 1-4.5 1S9.4 3 7.5 3Z"
        />
        <path strokeLinecap="round" d="M8.6 9.2c.9 1.1 2.1 1.7 3.4 1.7s2.5-.6 3.4-1.7" />
      </svg>
    </span>
  );
}

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="SmileCare Dental Clinic — home"
    >
      <LogoMark className="transition-transform duration-500 group-hover:rotate-[-6deg]" />
      <span className="flex flex-col leading-none">
        <span
          className={cn("text-[1.15rem] font-bold tracking-tight", tone === "dark" ? "text-navy-900" : "text-white")}
        >
          SmileCare
        </span>
        <span
          className={cn(
            "mt-1 text-[0.62rem] font-semibold tracking-[0.22em] uppercase",
            tone === "dark" ? "text-brand-600" : "text-brand-300",
          )}
        >
          Dental Clinic
        </span>
      </span>
    </Link>
  );
}
