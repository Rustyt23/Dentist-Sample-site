import {
  LOWER_TEETH,
  PAINT_ORDER,
  UPPER_TEETH,
  bracketOffset,
  crookedness,
  gumLinePath,
  gumPath,
  lobePath,
  toothPath,
  toothTransform,
  wireFor,
  type Tooth,
} from "./teeth";

export const VIEWBOX = "70 40 460 280";

const UPPER_GUM = gumPath(UPPER_TEETH, "upper");
const LOWER_GUM = gumPath(LOWER_TEETH, "lower");
const UPPER_LINE = gumLinePath(UPPER_TEETH, "upper");
const LOWER_LINE = gumLinePath(LOWER_TEETH, "lower");

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** The appliance goes on once movement starts and comes off for the final smile. */
export const applianceAt = (p: number) => clamp01((p - 0.04) / 0.1) * (1 - clamp01((p - 0.86) / 0.1));

/** Shared gradients — rendered once per page in a zero-size SVG. */
export function DentitionDefs() {
  return (
    <svg className="absolute size-0" aria-hidden focusable="false">
      <defs>
        <linearGradient id="al-enamel-L" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b7c0c6" />
          <stop offset="0.2" stopColor="#e2e6e8" />
          <stop offset="0.48" stopColor="#fbfaf7" />
          <stop offset="0.78" stopColor="#f3f3f0" />
          <stop offset="1" stopColor="#d3d9dc" />
        </linearGradient>
        <linearGradient id="al-enamel-R" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#b7c0c6" />
          <stop offset="0.2" stopColor="#e2e6e8" />
          <stop offset="0.48" stopColor="#fbfaf7" />
          <stop offset="0.78" stopColor="#f3f3f0" />
          <stop offset="1" stopColor="#d3d9dc" />
        </linearGradient>
        <linearGradient id="al-cervical-up" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6bf96" stopOpacity="0.75" />
          <stop offset="0.34" stopColor="#efe2c8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="al-cervical-down" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d6bf96" stopOpacity="0.75" />
          <stop offset="0.34" stopColor="#efe2c8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="al-incisal-up" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.76" stopColor="#a9c0cf" stopOpacity="0" />
          <stop offset="1" stopColor="#a9c0cf" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="al-incisal-down" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0.76" stopColor="#a9c0cf" stopOpacity="0" />
          <stop offset="1" stopColor="#a9c0cf" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id="al-lobe" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="al-cavity" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#5b2634" />
          <stop offset="0.55" stopColor="#3a1621" />
          <stop offset="1" stopColor="#1f0b12" />
        </radialGradient>
        <linearGradient id="al-gum-up" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c9d1" stopOpacity="0" />
          <stop offset="0.36" stopColor="#f2b0bc" />
          <stop offset="0.82" stopColor="#ea93a3" />
          <stop offset="1" stopColor="#df7f92" />
        </linearGradient>
        <linearGradient id="al-gum-down" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f6c9d1" stopOpacity="0" />
          <stop offset="0.3" stopColor="#f2b0bc" />
          <stop offset="0.82" stopColor="#ea93a3" />
          <stop offset="1" stopColor="#df7f92" />
        </linearGradient>
        <linearGradient id="al-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f7f9" />
          <stop offset="0.5" stopColor="#b9c3cc" />
          <stop offset="1" stopColor="#7d8995" />
        </linearGradient>
        <linearGradient id="al-sides-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.1" stopColor="#fff" />
          <stop offset="0.9" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="al-sides" maskUnits="userSpaceOnUse" x="70" y="30" width="460" height="300">
          <rect x="70" y="30" width="460" height="300" fill="url(#al-sides-grad)" />
        </mask>
      </defs>
    </svg>
  );
}

function ToothShape({
  t,
  k,
  register,
}: {
  t: Tooth;
  k: number;
  register?: (id: string, el: SVGGElement | null) => void;
}) {
  const d = toothPath(t);
  const up = t.arch === "upper";
  const mid = (t.h / 2) * (up ? 1 : -1);
  const side = t.cx < 300 ? "L" : "R";
  const bw = Math.min(13, t.w * 0.36);
  const bh = bw * 0.82;

  return (
    <g ref={register ? (el) => register(t.id, el) : undefined} transform={toothTransform(t, k)}>
      <path d={d} fill={`url(#al-enamel-${side})`} />
      <path d={d} fill={up ? "url(#al-cervical-up)" : "url(#al-cervical-down)"} />
      {t.type !== "premolar" ? <path d={d} fill={up ? "url(#al-incisal-up)" : "url(#al-incisal-down)"} /> : null}
      <path d={lobePath(t)} fill="url(#al-lobe)" />
      {/* Teeth sitting further back fall into shadow */}
      <path d={d} fill="#240d15" data-shade={t.shade} style={{ opacity: (t.shade * 0.5 * k).toFixed(3) }} />
      <path d={d} fill="none" stroke="#8e9aa3" strokeOpacity="0.35" strokeWidth="0.8" />

      {/* Clear aligner shell */}
      <path
        d={d}
        transform={`translate(0 ${mid}) scale(1.07) translate(0 ${-mid})`}
        fill="#ffffff"
        fillOpacity="0.14"
        stroke="#ffffff"
        strokeOpacity="0.9"
        strokeWidth="1.5"
        style={{ opacity: "calc(var(--appliance) * var(--show-aligner))" }}
      />

      {/* Bracket with a teal elastic tie */}
      <g
        transform={`translate(0 ${bracketOffset(t).toFixed(1)})`}
        style={{ opacity: "calc(var(--appliance) * var(--show-braces))" }}
      >
        <rect
          x={-bw / 2}
          y={-bh / 2}
          width={bw}
          height={bh}
          rx="2"
          fill="url(#al-metal)"
          stroke="#7b8794"
          strokeWidth="0.6"
        />
        <rect
          x={-bw / 2 - 1.2}
          y={-bh / 2 - 1.2}
          width={bw + 2.4}
          height={bh + 2.4}
          rx="3"
          fill="none"
          stroke="#2bb3a6"
          strokeWidth="1.6"
        />
        <line x1={-bw / 2} x2={bw / 2} y1="0" y2="0" stroke="#5b6672" strokeWidth="1.1" />
      </g>
    </g>
  );
}

type DentitionProps = {
  /** Treatment progress to render (0 = crowded, 1 = straight) */
  p: number;
  mode: "aligners" | "braces";
  label: string;
  className?: string;
  /** For the animated scene: collect the moving parts */
  refs?: {
    svg: React.Ref<SVGSVGElement>;
    upperWire: React.Ref<SVGPathElement>;
    lowerWire: React.Ref<SVGPathElement>;
    register: (id: string, el: SVGGElement | null) => void;
  };
};

export function Dentition({ p, mode, label, className, refs }: DentitionProps) {
  return (
    <svg
      ref={refs?.svg}
      viewBox={VIEWBOX}
      className={className}
      role="img"
      aria-label={label}
      style={
        {
          "--appliance": applianceAt(p).toFixed(3),
          "--show-aligner": mode === "aligners" ? "1" : "0",
          "--show-braces": mode === "braces" ? "1" : "0",
        } as React.CSSProperties
      }
    >
      <g mask="url(#al-sides)">
        {/* Inside of the mouth, visible between and around the teeth */}
        <path
          d="M 66 210 C 76 124, 118 100, 200 98 L 400 98 C 482 100, 524 124, 534 210 C 524 298, 482 322, 400 322 L 200 322 C 118 322, 76 298, 66 210 Z"
          fill="url(#al-cavity)"
        />

        {PAINT_ORDER.map((t) => (
          <ToothShape key={t.id} t={t} k={crookedness(t, p)} register={refs?.register} />
        ))}

        <g style={{ opacity: "calc(var(--appliance) * var(--show-braces))" }} fill="none" strokeLinecap="round">
          <path ref={refs?.upperWire} d={wireFor(UPPER_TEETH, p)} stroke="#9aa6b1" strokeWidth="1.8" />
          <path ref={refs?.lowerWire} d={wireFor(LOWER_TEETH, p)} stroke="#9aa6b1" strokeWidth="1.8" />
        </g>

        <g style={{ opacity: "calc(var(--appliance) * var(--show-aligner))" }} fill="none" stroke="#ffffff">
          <path d="M 120 170 C 200 198, 400 198, 480 170" strokeWidth="2.4" strokeOpacity="0.55" />
          <path d="M 150 248 C 230 228, 370 228, 450 248" strokeWidth="2" strokeOpacity="0.45" />
        </g>

        <path d={UPPER_GUM} fill="url(#al-gum-up)" />
        <path d={LOWER_GUM} fill="url(#al-gum-down)" />
        <path d={UPPER_LINE} fill="none" stroke="#ffd8de" strokeWidth="1.4" strokeOpacity="0.7" />
        <path d={LOWER_LINE} fill="none" stroke="#ffd8de" strokeWidth="1.4" strokeOpacity="0.7" />
      </g>
    </svg>
  );
}
