import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  size?: "default" | "quiet";
};

export function Eyebrow({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase",
        tone === "dark" ? "text-brand-600" : "text-brand-300",
      )}
    >
      <span className={cn("h-px w-6", tone === "dark" ? "bg-brand-500" : "bg-brand-300")} aria-hidden />
      {children}
    </span>
  );
}

/** Serif italic accent used inside headings, e.g. <Accent>trust</Accent> */
export function Accent({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "font-serif font-normal italic tracking-normal",
        tone === "dark" ? "text-brand-600" : "text-brand-300",
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
  size = "default",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "leading-[1.12] font-semibold tracking-tight",
          size === "quiet" ? "text-2xl sm:text-3xl lg:text-4xl" : "text-3xl sm:text-4xl lg:text-[2.75rem]",
          tone === "light" && "text-white",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-navy-500" : "text-navy-200")}>
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
