import { cn } from "@/lib/utils";
import {
  BONE,
  CROWN,
  DECAY_DEEP,
  DECAY_DENTIN,
  DECAY_ENAMEL,
  DECAY_SPOT,
  DENTIN,
  ENAMEL,
  GUM_LEFT,
  GUM_RIGHT,
  NERVE_LEFT,
  NERVE_RIGHT,
  PULP,
  TOOTH,
  TUBULES,
  VIEW_H,
  VIEW_W,
} from "./geometry";

export type Layer = "enamel" | "dentin" | "pulp" | "root";

export type Hotspot = {
  layer: Layer;
  step: number;
  label: string;
  x: number;
  y: number;
  /** Which moving layer the hotspot rides on */
  on: "enamel" | "tooth";
  /** Side the desktop label sits on */
  side: "left" | "right";
};

export const HOTSPOTS: Hotspot[] = [
  { layer: "enamel", step: 1, label: "Enamel", x: 292, y: 100, on: "enamel", side: "right" },
  { layer: "dentin", step: 2, label: "Dentin", x: 262, y: 176, on: "tooth", side: "right" },
  { layer: "pulp", step: 3, label: "Pulp & Nerve", x: 148, y: 300, on: "tooth", side: "left" },
  { layer: "root", step: 4, label: "Root & Bone", x: 276, y: 340, on: "tooth", side: "right" },
];

const VIEWBOX = `0 0 ${VIEW_W} ${VIEW_H}`;
const svgClass = "absolute inset-0 h-full w-full overflow-visible";
const v = (name: string) => `var(${name})`;
const growStyle = (name: string): React.CSSProperties => ({
  opacity: v(name),
  transform: `scale(calc(0.55 + 0.45 * ${v(name)}))`,
  transformBox: "fill-box",
  transformOrigin: "50% 0%",
});

function Glow({ d, active, animate }: { d: string; active: boolean; animate: boolean }) {
  if (!active) return null;
  return (
    <g aria-hidden>
      <path
        d={d}
        fill="none"
        stroke="#43b3a8"
        strokeWidth="7"
        strokeLinejoin="round"
        opacity="0.25"
        className={animate ? "animate-glow-pulse" : undefined}
      />
      <path d={d} fill="none" stroke="#5cc2b8" strokeWidth="1.6" strokeLinejoin="round" />
    </g>
  );
}

/** Gradients and patterns shared by every layer (must stay rendered, so it's zero-size rather than hidden). */
function SharedDefs() {
  return (
    <svg className="absolute size-0" aria-hidden focusable="false">
      <defs>
        <linearGradient id="iyt-enamel" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f1f7fb" />
          <stop offset="1" stopColor="#d4e6f1" />
        </linearGradient>
        <radialGradient id="iyt-dentin" cx="0.5" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#fcf4e4" />
          <stop offset="0.55" stopColor="#efdcb9" />
          <stop offset="1" stopColor="#dcc093" />
        </radialGradient>
        <radialGradient id="iyt-pulp" cx="0.5" cy="0.22" r="0.85">
          <stop offset="0" stopColor="#ffc2ca" />
          <stop offset="0.45" stopColor="#ec7d8f" />
          <stop offset="1" stopColor="#c94a62" />
        </radialGradient>
        <radialGradient id="iyt-decay" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#2f1d13" />
          <stop offset="0.6" stopColor="#5e3d28" />
          <stop offset="1" stopColor="#8f6844" stopOpacity="0.85" />
        </radialGradient>
        <linearGradient id="iyt-root-ext" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9ae84" />
          <stop offset="0.22" stopColor="#eedec0" />
          <stop offset="0.52" stopColor="#f8eedc" />
          <stop offset="0.82" stopColor="#e4cda6" />
          <stop offset="1" stopColor="#c2a679" />
        </linearGradient>
        <linearGradient id="iyt-crown-ext" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c3d8e5" />
          <stop offset="0.2" stopColor="#f2f8fb" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="0.8" stopColor="#e6f0f6" />
          <stop offset="1" stopColor="#b6cddc" />
        </linearGradient>
        <linearGradient id="iyt-top-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="iyt-neck-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6f4a" stopOpacity="0" />
          <stop offset="0.5" stopColor="#8a6f4a" stopOpacity="0.18" />
          <stop offset="1" stopColor="#8a6f4a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="iyt-spec" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="iyt-bone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e9d8" />
          <stop offset="1" stopColor="#e2cfb1" />
        </linearGradient>
        <linearGradient id="iyt-gum" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8cdd4" />
          <stop offset="1" stopColor="#e79cab" />
        </linearGradient>
        <radialGradient id="iyt-cap-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#0a1f3c" stopOpacity="0.28" />
          <stop offset="1" stopColor="#0a1f3c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="iyt-fade-grad" cx="0.48" cy="0.2" r="0.64">
          <stop offset="0.42" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="iyt-fade" maskUnits="userSpaceOnUse" x="0" y="180" width="440" height="340">
          <rect x="0" y="180" width="440" height="340" fill="url(#iyt-fade-grad)" />
        </mask>
        <pattern id="iyt-trabecular" width="22" height="18" patternUnits="userSpaceOnUse">
          <ellipse cx="7" cy="6" rx="5" ry="3.4" fill="none" stroke="#cdb48d" strokeWidth="1.1" />
          <ellipse cx="17" cy="14" rx="3.6" ry="2.6" fill="none" stroke="#cdb48d" strokeWidth="1" />
        </pattern>
        <clipPath id="iyt-bone-clip">
          <path d={BONE} />
        </clipPath>
        <clipPath id="iyt-dentin-clip">
          <path d={DENTIN} />
        </clipPath>
      </defs>
    </svg>
  );
}

function HotspotButton({
  spot,
  active,
  showLabel,
  onSelect,
}: {
  spot: Hotspot;
  active: boolean;
  showLabel: boolean;
  onSelect: (step: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(spot.step)}
      aria-label={`Explore ${spot.label}`}
      aria-pressed={active}
      className="pointer-events-auto absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full lg:size-11"
      style={{ left: `${(spot.x / VIEW_W) * 100}%`, top: `${(spot.y / VIEW_H) * 100}%` }}
    >
      {active ? (
        <span
          className="absolute size-6 animate-ping rounded-full bg-brand-400/50 [animation-duration:2s]"
          aria-hidden
        />
      ) : null}
      <span
        className={cn(
          "relative grid size-[1.375rem] place-items-center rounded-full text-[0.65rem] font-bold shadow-soft ring-2 transition duration-300",
          active ? "scale-110 bg-brand-600 text-white ring-white" : "bg-white/95 text-navy-700 ring-brand-200",
        )}
      >
        {spot.step}
      </span>
      {showLabel ? (
        <span
          className={cn(
            "animate-step-in absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-navy-900 shadow-soft ring-1 ring-brand-200 lg:block",
            spot.side === "right" ? "left-full ml-1" : "right-full mr-1",
          )}
        >
          {spot.label}
        </span>
      ) : null}
    </button>
  );
}

type ToothStageProps = {
  active: number;
  glow: Layer | null;
  animate: boolean;
  /** Show every label at once (reduced motion) */
  allLabels: boolean;
  onSelect: (step: number) => void;
};

export function ToothStage({ active, glow, animate, allLabels, onSelect }: ToothStageProps) {
  const spots = (on: Hotspot["on"]) =>
    HOTSPOTS.filter((s) => s.on === on).map((s) => (
      <HotspotButton
        key={s.layer}
        spot={s}
        active={active === s.step}
        showLabel={allLabels || active === s.step}
        onSelect={onSelect}
      />
    ));

  return (
    <div className="absolute inset-0">
      <SharedDefs />

      {/* Halo */}
      <div
        className="absolute inset-[-6%] rounded-full bg-[radial-gradient(closest-side,rgb(172_228_220/0.7),rgb(216_233_244/0.35)_60%,transparent)]"
        style={{ opacity: v("--halo-o") }}
        aria-hidden
      />

      {/* Jawbone, socket and gums — fades as a single composited layer */}
      <div className="absolute inset-0 will-change-[opacity]" style={{ opacity: v("--bone-o") }} aria-hidden>
        <svg viewBox={VIEWBOX} className={svgClass}>
          <g mask="url(#iyt-fade)">
            <path d={BONE} fill="url(#iyt-bone)" stroke="#d6c09c" strokeWidth="3" />
            <path d={BONE} fill="url(#iyt-trabecular)" opacity="0.55" />
            <g clipPath="url(#iyt-bone-clip)">
              <path d={DENTIN} fill="#d3b98f" stroke="#bf9f72" strokeWidth="5" opacity="0.9" />
              <Glow d={DENTIN} active={glow === "root"} animate={animate} />
            </g>
            <path d={GUM_LEFT} fill="url(#iyt-gum)" />
            <path d={GUM_RIGHT} fill="url(#iyt-gum)" />
            <path
              d="M 18 246 C 50 232, 86 214, 108 204"
              fill="none"
              stroke="#fde3e7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 382 246 C 350 232, 314 214, 292 204"
              fill="none"
              stroke="#fde3e7"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* The tooth — lifts out of its socket as one layer */}
      <div
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ transform: "translate3d(0, var(--tooth-y), 0)" }}
      >
        <svg viewBox={VIEWBOX} className={svgClass} aria-hidden>
          {/* Dentin */}
          <path d={DENTIN} fill="url(#iyt-dentin)" />
          <g clipPath="url(#iyt-dentin-clip)" opacity="0.55">
            {TUBULES.map((d) => (
              <path key={d} d={d} fill="none" stroke="#cfb185" strokeWidth="1.2" strokeLinecap="round" />
            ))}
          </g>
          <path d={DENTIN} fill="#f5f9fc" style={{ opacity: v("--fade-d") }} />
          <Glow d={DENTIN} active={glow === "dentin" || glow === "root"} animate={animate} />

          {/* Pulp, nerves and vessels */}
          <path d={PULP} fill="url(#iyt-pulp)" />
          <path d={PULP} fill="#ff2f55" style={{ opacity: v("--inflame") }} />
          <path
            d="M 172 132 C 184 146, 216 146, 228 132"
            fill="none"
            stroke="#ffd9de"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
          <g style={{ opacity: v("--nerves-o") }}>
            {[NERVE_LEFT, NERVE_RIGHT].map((d) => (
              <g key={d}>
                <path
                  d={d}
                  fill="none"
                  stroke="#e5484d"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  transform="translate(-2.5 0)"
                />
                <path
                  d={d}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  transform="translate(2.5 0)"
                />
                <path
                  d={d}
                  fill="none"
                  stroke="#fff6c8"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeDasharray="4 10"
                  className={animate && active === 3 ? "animate-nerve-flow" : undefined}
                />
              </g>
            ))}
          </g>
          <path d={PULP} fill="#f5f9fc" style={{ opacity: v("--fade-p") }} />
          <Glow d={PULP} active={glow === "pulp"} animate={animate} />

          {/* Decay spreading through the dentin */}
          <path d={DECAY_DENTIN} fill="url(#iyt-decay)" style={growStyle("--decay-dentin")} />
          <path d={DECAY_DEEP} fill="url(#iyt-decay)" style={growStyle("--decay-deep")} />

          {/* Shadow cast by the lifted enamel cap */}
          <ellipse cx="200" cy="108" rx="118" ry="34" fill="url(#iyt-cap-shadow)" style={{ opacity: v("--cap-o") }} />
        </svg>

        {/* Enamel cap */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: "translate3d(0, var(--enamel-y), 0)" }}
        >
          <svg viewBox={VIEWBOX} className={svgClass} aria-hidden>
            <path d={ENAMEL} fill="url(#iyt-enamel)" stroke="#c9dfeb" strokeWidth="1.2" />
            <path
              d="M 104 132 C 106 104, 120 84, 142 76"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.9"
            />
            <ellipse cx="140" cy="104" rx="10" ry="24" transform="rotate(28 140 104)" fill="url(#iyt-spec)" />
            <path d={DECAY_SPOT} fill="url(#iyt-decay)" style={growStyle("--decay-spot")} />
            <path d={DECAY_ENAMEL} fill="url(#iyt-decay)" style={growStyle("--decay-enamel")} />
            <path d={ENAMEL} fill="#f5f9fc" style={{ opacity: v("--fade-e") }} />
            <Glow d={ENAMEL} active={glow === "enamel"} animate={animate} />
          </svg>
        </div>

        {/* Complete, exterior view of the tooth */}
        <div
          className="absolute inset-0 will-change-[transform,opacity]"
          style={{ opacity: v("--ext-o"), transform: "translate3d(var(--ext-x), 0, 0)" }}
          aria-hidden
        >
          <svg viewBox={VIEWBOX} className={svgClass}>
            <path d={TOOTH} fill="url(#iyt-root-ext)" />
            <path d={CROWN} fill="url(#iyt-crown-ext)" />
            <path d={TOOTH} fill="url(#iyt-top-light)" />
            <rect
              x="100"
              y="186"
              width="200"
              height="34"
              fill="url(#iyt-neck-shade)"
              clipPath="url(#iyt-dentin-clip)"
            />
            <path
              d="M 150 78 C 156 96, 160 110, 168 120 M 250 78 C 244 96, 240 110, 232 120 M 200 66 C 199 84, 200 100, 200 112"
              fill="none"
              stroke="#b9cfdd"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M 102 140 C 102 108, 114 84, 136 72"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <ellipse cx="146" cy="110" rx="12" ry="30" transform="rotate(26 146 110)" fill="url(#iyt-spec)" />
            <ellipse
              cx="128"
              cy="300"
              rx="6"
              ry="60"
              transform="rotate(-4 128 300)"
              fill="url(#iyt-spec)"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Hotspots sit above every layer, riding along with the part they point at */}
        <div className="absolute inset-0" style={{ transform: "translate3d(0, var(--enamel-y), 0)" }}>
          {spots("enamel")}
        </div>
        {spots("tooth")}
      </div>
    </div>
  );
}
