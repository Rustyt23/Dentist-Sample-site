import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BONE, CROWN, GUM_FULL, TOOTH } from "@/components/sections/inside-tooth/geometry";

// Scene coordinates: viewBox 0 30 400 450, implant centred on x = 200.
const VIEWBOX = "0 30 400 450";
const xPct = (x: number) => `${(x / 400) * 100}%`;
const yPct = (y: number) => `${((y - 30) / 450) * 100}%`;
const v = (name: string) => `var(${name})`;
const svgClass = "absolute inset-0 h-full w-full overflow-visible";

const SCREW_BODY = "M 184 236 L 216 236 L 212 376 C 210 393, 190 393, 188 376 Z";
const ABUTMENT = "M 189 233 L 211 233 L 214 206 C 214 198, 208 194, 200 194 C 192 194, 186 198, 186 206 Z";
/** Gum line as it looks in the mouth: scalloped around each tooth, with papillae between them */
const NATURAL_GUM =
  "M 0 214 C 30 224, 70 224, 100 202 C 130 224, 168 232, 200 232 C 232 232, 270 224, 300 202 C 330 224, 370 224, 400 214 L 400 480 L 0 480 Z";
const THREADS = Array.from({ length: 14 }, (_, i) => 222 + i * 14).map((y) => {
  const half = 17 - ((y - 236) / 150) * 4;
  return `M ${200 - half} ${y} L ${200 + half} ${y + 6}`;
});

export type Callout = { step: number; label: string; x: number; y: number };

/** Labels ride on the part they describe; `step` is when each one is shown. */
export const CALLOUTS: Record<"gap" | "screw" | "heal" | "abutment" | "crown" | "complete", Callout> = {
  gap: { step: 0, label: "Missing tooth", x: 236, y: 150 },
  screw: { step: 1, label: "Titanium implant", x: 214, y: 300 },
  heal: { step: 2, label: "Bone fuses to the implant", x: 228, y: 338 },
  abutment: { step: 3, label: "Abutment", x: 213, y: 212 },
  crown: { step: 4, label: "Ceramic crown", x: 302, y: 150 },
  complete: { step: 5, label: "Looks & feels natural", x: 262, y: 100 },
};

function Defs() {
  return (
    <svg className="absolute size-0" aria-hidden focusable="false">
      <defs>
        <linearGradient id="im-bone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e9d8" />
          <stop offset="1" stopColor="#e2cfb1" />
        </linearGradient>
        <pattern id="im-trabecular" width="22" height="18" patternUnits="userSpaceOnUse">
          <ellipse cx="7" cy="6" rx="5" ry="3.4" fill="none" stroke="#cdb48d" strokeWidth="1.1" />
          <ellipse cx="17" cy="14" rx="3.6" ry="2.6" fill="none" stroke="#cdb48d" strokeWidth="1" />
        </pattern>
        <clipPath id="im-bone-clip">
          <path d={BONE} />
        </clipPath>
        <radialGradient id="im-fade-grad" cx="0.5" cy="0.12" r="0.75">
          <stop offset="0.45" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="im-fade" maskUnits="userSpaceOnUse" x="0" y="190" width="400" height="300">
          <rect x="0" y="190" width="400" height="300" fill="url(#im-fade-grad)" />
        </mask>
        <linearGradient id="im-gum" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8cdd4" />
          <stop offset="0.6" stopColor="#eca5b3" />
          <stop offset="1" stopColor="#e79cab" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="im-gum-natural" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c2cb" />
          <stop offset="0.35" stopColor="#eeaab7" />
          <stop offset="1" stopColor="#ebf4fa" />
        </linearGradient>
        <linearGradient id="im-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#76828e" />
          <stop offset="0.32" stopColor="#eef2f5" />
          <stop offset="0.58" stopColor="#b9c3cc" />
          <stop offset="1" stopColor="#5f6a76" />
        </linearGradient>
        <linearGradient id="im-crown" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c3d8e5" />
          <stop offset="0.2" stopColor="#f2f8fb" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="0.8" stopColor="#e6f0f6" />
          <stop offset="1" stopColor="#b6cddc" />
        </linearGradient>
        <linearGradient id="im-root" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9ae84" />
          <stop offset="0.5" stopColor="#f8eedc" />
          <stop offset="1" stopColor="#c2a679" />
        </linearGradient>
        <linearGradient id="im-top-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="im-spec" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="im-heal" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#43b3a8" stopOpacity="0.45" />
          <stop offset="0.7" stopColor="#78cfc5" stopOpacity="0.18" />
          <stop offset="1" stopColor="#78cfc5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="im-contact" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#0a1f3c" stopOpacity="0.35" />
          <stop offset="1" stopColor="#0a1f3c" stopOpacity="0" />
        </radialGradient>
        <clipPath id="im-screw-clip">
          <path d={SCREW_BODY} />
        </clipPath>
      </defs>
    </svg>
  );
}

function CrownShape() {
  return (
    <g transform="translate(0 30)">
      <path d={CROWN} fill="url(#im-crown)" stroke="#c9dfeb" strokeWidth="1.2" />
      <path d={CROWN} fill="url(#im-top-light)" />
      <path
        d="M 150 78 C 156 96, 160 110, 168 120 M 250 78 C 244 96, 240 110, 232 120 M 200 66 C 199 84, 200 100, 200 112"
        fill="none"
        stroke="#b9cfdd"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M 102 140 C 102 108, 114 84, 136 72"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx="146" cy="110" rx="11" ry="28" transform="rotate(26 146 110)" fill="url(#im-spec)" />
    </g>
  );
}

function Neighbour({ dx }: { dx: number }) {
  return (
    <g transform={`translate(${dx} 22)`}>
      <path d={TOOTH} fill="url(#im-root)" />
      <CrownShape />
    </g>
  );
}

function CalloutPin({ callout, show }: { callout: Callout; show: boolean }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0",
      )}
      style={{ left: xPct(callout.x), top: yPct(callout.y) }}
      aria-hidden
    >
      <span className="relative grid size-4 place-items-center">
        {show ? (
          <span className="absolute size-4 animate-ping rounded-full bg-brand-400/50 [animation-duration:2s]" />
        ) : null}
        <span className="relative size-2.5 rounded-full bg-brand-600 ring-2 ring-white" />
      </span>
      <span className="absolute left-full ml-1.5 hidden rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-navy-900 shadow-soft ring-1 ring-brand-200 lg:block">
        {callout.label}
      </span>
    </span>
  );
}

type ImplantStageProps = {
  active: number;
  /** Steps whose labels are shown (all at once for reduced motion) */
  labelled: (step: number) => boolean;
  animate: boolean;
};

export function ImplantStage({ active, labelled, animate }: ImplantStageProps) {
  const pin = (key: keyof typeof CALLOUTS) => (
    <CalloutPin callout={CALLOUTS[key]} show={labelled(CALLOUTS[key].step)} />
  );

  return (
    <div className="absolute inset-0">
      <Defs />

      <div
        className="absolute inset-[-4%] rounded-full bg-[radial-gradient(closest-side,rgb(172_228_220/0.6),rgb(216_233_244/0.35)_60%,transparent)]"
        style={{ opacity: v("--halo") }}
        aria-hidden
      />

      {/* Jawbone cross-section with the neighbouring teeth */}
      <svg viewBox={VIEWBOX} className={svgClass} aria-hidden>
        <g mask="url(#im-fade)">
          <path d={BONE} fill="url(#im-bone)" />
          <path d={BONE} fill="url(#im-trabecular)" opacity="0.5" />
          <path d={BONE} fill="none" stroke="#dcc6a2" strokeWidth="12" clipPath="url(#im-bone-clip)" />
        </g>
        <Neighbour dx={-205} />
        <Neighbour dx={205} />
      </svg>

      {/* Outline of the missing tooth */}
      <div className="absolute inset-0" style={{ opacity: v("--ghost") }}>
        <svg viewBox={VIEWBOX} className={svgClass} aria-hidden>
          <path
            d={TOOTH}
            transform="translate(0 22)"
            fill="none"
            stroke="#78cfc5"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        </svg>
        {pin("gap")}
      </div>

      {/* Osseointegration glow */}
      <div className="absolute inset-0 will-change-[opacity]" style={{ opacity: v("--heal") }}>
        <svg viewBox={VIEWBOX} className={svgClass} aria-hidden>
          <ellipse cx="200" cy="318" rx="58" ry="96" fill="url(#im-heal)" />
          {[
            [176, 262],
            [224, 280],
            [174, 304],
            [226, 322],
            [178, 346],
            [222, 362],
            [184, 382],
            [216, 392],
          ].map(([cx, cy], i) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3.2"
              fill="#2a9d93"
              className={animate && active === 2 ? "animate-glow-pulse" : undefined}
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </svg>
        {pin("heal")}
      </div>

      {/* Titanium implant — threads turn as it screws in */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ opacity: v("--screw-o"), transform: "translate3d(0, var(--screw-y), 0)" }}
      >
        <svg viewBox={VIEWBOX} className={svgClass} aria-hidden>
          <path d={SCREW_BODY} fill="url(#im-metal)" />
          <g clipPath="url(#im-screw-clip)">
            <g style={{ transform: "translateY(calc(var(--thread-shift, 0) * 1px))" }}>
              {THREADS.map((d) => (
                <path key={d} d={d} stroke="#4f5a66" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
              ))}
            </g>
          </g>
          <path d="M 190 240 L 189 372" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
          <rect x="181" y="229" width="38" height="10" rx="2.5" fill="url(#im-metal)" />
        </svg>
        {pin("screw")}
      </div>

      {/* Gum (cross-section) */}
      <svg viewBox={VIEWBOX} className={svgClass} aria-hidden>
        <path d={GUM_FULL} fill="url(#im-gum)" mask="url(#im-fade)" />
      </svg>

      {/* Abutment */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ opacity: v("--abut-o"), transform: "translate3d(0, var(--abut-y), 0)" }}
      >
        <svg viewBox={VIEWBOX} className={svgClass} aria-hidden>
          <path d={ABUTMENT} fill="url(#im-metal)" />
          <path d="M 193 202 C 195 198, 205 198, 207 202" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
        </svg>
        {pin("abutment")}
      </div>

      {/* Contact shadow as the crown comes down */}
      <div className="absolute inset-0" style={{ opacity: v("--contact") }} aria-hidden>
        <svg viewBox={VIEWBOX} className={svgClass}>
          <ellipse cx="200" cy="226" rx="70" ry="10" fill="url(#im-contact)" />
        </svg>
      </div>

      {/* Ceramic crown */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ opacity: v("--crown-o"), transform: "translate3d(0, var(--crown-y), 0)" }}
      >
        <svg viewBox={VIEWBOX} className={svgClass} aria-hidden>
          <CrownShape />
        </svg>
        {pin("crown")}
      </div>

      {/* Natural view: gums close around the new tooth, hiding the hardware */}
      <div className="absolute inset-0 will-change-[opacity]" style={{ opacity: v("--natural") }} aria-hidden>
        <svg viewBox={VIEWBOX} className={svgClass}>
          <path d={NATURAL_GUM} fill="url(#im-gum-natural)" />
          <path
            d="M 0 214 C 30 224, 70 224, 100 202 C 130 224, 168 232, 200 232 C 232 232, 270 224, 300 202 C 330 224, 370 224, 400 214"
            fill="none"
            stroke="#fde3e7"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="absolute inset-0" style={{ transform: "translate3d(0, var(--crown-y), 0)" }}>
        {pin("complete")}
      </div>

      {active >= 5 && animate
        ? [
            [32, 12],
            [64, 8],
            [70, 26],
            [28, 30],
          ].map(([x, y], i) => (
            <Sparkles
              key={`${x}-${y}`}
              className="animate-sparkle pointer-events-none absolute size-4 text-brand-400"
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 150}ms` }}
              aria-hidden
            />
          ))
        : null}
    </div>
  );
}
