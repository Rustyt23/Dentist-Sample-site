import { Baby, Crown, ScanSearch, Smile, Sparkles, Sun, WandSparkles, type LucideProps } from "lucide-react";
import type { TreatmentIconKey } from "@/lib/data/treatments";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, strokeWidth = 1.75, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

const toothPath =
  "M7.5 3C5 3 3.5 5 3.5 7.6c0 1.9.6 3.2 1.1 4.6.6 1.7.8 3.4 1.1 5.4.3 2 .9 3.4 2 3.4 1.2 0 1.5-1.5 1.8-3.2.3-1.8.8-3.3 2.5-3.3s2.2 1.5 2.5 3.3c.3 1.7.6 3.2 1.8 3.2 1.1 0 1.7-1.4 2-3.4.3-2 .5-3.7 1.1-5.4.5-1.4 1.1-2.7 1.1-4.6C20.5 5 19 3 16.5 3c-1.9 0-2.8 1-4.5 1S9.4 3 7.5 3Z";

export function ToothIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d={toothPath} />
    </svg>
  );
}

export function RootCanalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d={toothPath} />
      <path d="M9.5 8.5c.6 1.5.8 3 .7 4.5M14.5 8.5c-.6 1.5-.8 3-.7 4.5" />
    </svg>
  );
}

export function ExtractionIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 8.5C6.3 8.5 5 9.9 5 11.6c0 1.3.4 2.2.8 3.2.4 1.2.6 2.4.8 3.8.2 1.4.6 2.4 1.4 2.4.9 0 1.1-1 1.3-2.2.2-1.3.6-2.3 1.7-2.3s1.5 1 1.7 2.3c.2 1.2.4 2.2 1.3 2.2.8 0 1.2-1 1.4-2.4.2-1.4.4-2.6.8-3.8.4-1 .8-1.9.8-3.2 0-1.7-1.3-3.1-3-3.1-1.3 0-2 .7-3 .7s-1.7-.7-3-.7Z" />
      <path d="M11 6V2.5m0 0L9.2 4.3M11 2.5l1.8 1.8" />
    </svg>
  );
}

export function ImplantIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 3.6C7 2.7 7.7 2 8.6 2h6.8c.9 0 1.6.7 1.6 1.6v1.9C17 7.4 15.4 9 13.5 9h-3C8.6 9 7 7.4 7 5.5V3.6Z" />
      <path d="M10.5 9v2M13.5 9v2" />
      <path d="M9.5 11h5l-.6 9.2c-.1 1-.9 1.8-1.9 1.8s-1.8-.8-1.9-1.8L9.5 11Z" />
      <path d="M9.6 13.8h4.8M9.8 16.6h4.4M10 19.2h4" />
    </svg>
  );
}

const lucideMap: Partial<Record<TreatmentIconKey, React.ComponentType<LucideProps>>> = {
  checkup: ScanSearch,
  cleaning: Sparkles,
  aligners: Smile,
  whitening: Sun,
  crown: Crown,
  kids: Baby,
  makeover: WandSparkles,
};

const customMap: Partial<Record<TreatmentIconKey, React.ComponentType<IconProps>>> = {
  rootCanal: RootCanalIcon,
  implant: ImplantIcon,
  extraction: ExtractionIcon,
};

export function TreatmentIcon({
  icon,
  className,
  size = 24,
}: {
  icon: TreatmentIconKey;
  className?: string;
  size?: number;
}) {
  const Custom = customMap[icon];
  if (Custom) return <Custom size={size} className={className} />;
  const Lucide = lucideMap[icon] ?? ScanSearch;
  return <Lucide size={size} strokeWidth={1.75} className={className} aria-hidden />;
}
