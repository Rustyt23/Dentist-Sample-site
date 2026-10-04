import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline-light" | "whatsapp";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-glow hover:bg-brand-700 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white text-navy-900 ring-1 ring-navy-200 shadow-soft hover:ring-navy-300 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-navy-800 hover:bg-mist-100",
  light: "bg-white text-navy-900 shadow-soft hover:bg-mist-50 hover:-translate-y-0.5 active:translate-y-0",
  "outline-light": "text-white ring-1 ring-white/30 hover:bg-white/10 hover:ring-white/50",
  whatsapp:
    "bg-[#1fa855] text-white shadow-[0_12px_28px_-10px_rgb(31_168_85/0.6)] hover:bg-[#1a9149] hover:-translate-y-0.5 active:translate-y-0",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm gap-2",
  md: "h-12 px-6 text-[0.95rem] gap-2",
  lg: "h-14 px-7 text-base gap-2.5",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition duration-300 ease-out",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
  "aria-label"?: string;
};

export function ButtonLink({ href, variant, size, className, children, external, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });
  const isNative = external || href.startsWith("tel:") || href.startsWith("mailto:");

  if (isNative) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
