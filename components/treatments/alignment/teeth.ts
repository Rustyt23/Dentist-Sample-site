// Frontal "smile" view of both arches. Scene viewBox: 70 40 460 280.

export type ToothType = "central" | "lateral" | "canine" | "premolar";

export type Tooth = {
  id: string;
  arch: "upper" | "lower";
  type: ToothType;
  /** Final (aligned) position: centre x and gum-line y */
  cx: number;
  cy: number;
  w: number;
  /** Visible crown height from the gum line to the biting edge */
  h: number;
  /** Crowded starting offsets: translation, rotation (deg), scale and how far back it sits (0–1) */
  dx: number;
  dy: number;
  rot: number;
  s: number;
  shade: number;
  /** Fraction of the treatment before this tooth starts moving */
  delay: number;
};

type Def = [string, ToothType, number, number, number, number, number, number, number, number, number, number];

// id, type, cx, cy, w, h, dx, dy, rot, s, shade, delay
const UPPER: Def[] = [
  ["U5L", "premolar", 105, 124, 27, 64, 1, 3, 5, 0.98, 0.1, 0.05],
  ["U4L", "premolar", 135, 117, 32, 74, 4, 3, 8, 1, 0.05, 0.08],
  ["U3L", "canine", 170, 108, 40, 92, -2, -18, -6, 1.06, 0, 0.16],
  ["U2L", "lateral", 213, 112, 46, 80, 10, -9, 15, 0.86, 0.45, 0.26],
  ["U1L", "central", 268, 106, 62, 94, 4, 3, -7, 1.02, 0, 0.1],
  ["U1R", "central", 332, 106, 62, 94, -8, -2, 10, 1.04, 0, 0.14],
  ["U2R", "lateral", 387, 112, 46, 80, -6, 4, -12, 1.03, 0, 0.2],
  ["U3R", "canine", 430, 108, 40, 92, 6, -8, 9, 0.98, 0.1, 0.12],
  ["U4R", "premolar", 465, 117, 32, 74, -4, -2, -8, 1, 0.05, 0.06],
  ["U5R", "premolar", 495, 124, 27, 64, -1, 2, -4, 0.98, 0.1, 0.04],
];

const LOWER: Def[] = [
  ["L5L", "premolar", 140, 292, 30, 62, 1, 1, -3, 0.98, 0.1, 0.04],
  ["L4L", "premolar", 172, 290, 33, 70, 2, 2, -6, 1, 0.05, 0.07],
  ["L3L", "canine", 207, 288, 38, 80, 4, -6, 9, 1, 0, 0.12],
  ["L2L", "lateral", 244, 286, 37, 74, -6, -6, -12, 1.03, 0, 0.16],
  ["L1L", "central", 281, 284, 37, 72, 7, 5, 16, 0.86, 0.4, 0.28],
  ["L1R", "central", 319, 284, 37, 72, -9, -4, -15, 1.06, 0, 0.2],
  ["L2R", "lateral", 356, 286, 37, 74, 9, 6, 18, 0.86, 0.42, 0.3],
  ["L3R", "canine", 393, 288, 38, 80, -6, -9, -11, 1.04, 0, 0.14],
  ["L4R", "premolar", 428, 290, 33, 70, -2, 3, 6, 1, 0.05, 0.06],
  ["L5R", "premolar", 460, 292, 30, 62, -1, 1, 3, 0.98, 0.1, 0.03],
];

const toTooth =
  (arch: Tooth["arch"]) =>
  ([id, type, cx, cy, w, h, dx, dy, rot, s, shade, delay]: Def): Tooth => ({
    id,
    arch,
    type,
    cx,
    cy,
    w,
    h,
    dx,
    dy,
    rot,
    s,
    shade,
    delay,
  });

export const UPPER_TEETH = UPPER.map(toTooth("upper"));
export const LOWER_TEETH = LOWER.map(toTooth("lower"));

/** Paint order: teeth sitting further back are drawn first so forward teeth overlap them. */
export const PAINT_ORDER = [
  ...[...LOWER_TEETH].sort((a, b) => a.s - b.s),
  ...[...UPPER_TEETH].sort((a, b) => a.s - b.s),
];

const f = (n: number) => n.toFixed(1);

/**
 * Tooth outline in local coordinates: origin at the gum line, crown growing downwards for upper
 * teeth and upwards for lower teeth. Extends a little under the gum.
 */
export function toothPath({ type, w, h, arch }: Pick<Tooth, "type" | "w" | "h" | "arch">) {
  const d = arch === "upper" ? 1 : -1;
  const X = (v: number) => f(v * w);
  const Y = (v: number) => f(v * h * d);
  const under = f(-15 * d);

  if (type === "central" || type === "lateral") {
    const neck = type === "central" ? 0.36 : 0.34;
    const max = type === "central" ? 0.5 : 0.48;
    const r = type === "central" ? 0.1 : 0.2; // corner rounding
    const corner = 1 - r * 0.9;
    return [
      `M ${X(-neck + 0.02)} ${under} L ${X(-neck)} 0`,
      `C ${X(-neck - 0.09)} ${Y(0.28)}, ${X(-max)} ${Y(0.52)}, ${X(-max)} ${Y(corner)}`,
      `Q ${X(-max)} ${Y(1)}, ${X(-max + r)} ${Y(1)}`,
      `Q 0 ${Y(1.015)}, ${X(max - r)} ${Y(1)}`,
      `Q ${X(max)} ${Y(1)}, ${X(max)} ${Y(corner)}`,
      `C ${X(max)} ${Y(0.52)}, ${X(neck + 0.09)} ${Y(0.28)}, ${X(neck)} 0 L ${X(neck - 0.02)} ${under} Z`,
    ].join(" ");
  }

  if (type === "canine") {
    return [
      `M ${X(-0.34)} ${under} L ${X(-0.36)} 0`,
      `C ${X(-0.46)} ${Y(0.26)}, ${X(-0.5)} ${Y(0.48)}, ${X(-0.49)} ${Y(0.66)}`,
      `C ${X(-0.47)} ${Y(0.82)}, ${X(-0.26)} ${Y(0.94)}, ${X(-0.07)} ${Y(1.0)}`,
      `Q 0 ${Y(1.025)}, ${X(0.07)} ${Y(1.0)}`,
      `C ${X(0.26)} ${Y(0.94)}, ${X(0.47)} ${Y(0.82)}, ${X(0.49)} ${Y(0.66)}`,
      `C ${X(0.5)} ${Y(0.48)}, ${X(0.46)} ${Y(0.26)}, ${X(0.36)} 0 L ${X(0.34)} ${under} Z`,
    ].join(" ");
  }

  // premolar
  return [
    `M ${X(-0.36)} ${under} L ${X(-0.38)} 0`,
    `C ${X(-0.48)} ${Y(0.24)}, ${X(-0.5)} ${Y(0.46)}, ${X(-0.49)} ${Y(0.62)}`,
    `C ${X(-0.48)} ${Y(0.86)}, ${X(-0.24)} ${Y(1.0)}, 0 ${Y(1.0)}`,
    `C ${X(0.24)} ${Y(1.0)}, ${X(0.48)} ${Y(0.86)}, ${X(0.49)} ${Y(0.62)}`,
    `C ${X(0.5)} ${Y(0.46)}, ${X(0.48)} ${Y(0.24)}, ${X(0.38)} 0 L ${X(0.36)} ${under} Z`,
  ].join(" ");
}

/** Soft vertical highlight following the curve of the tooth's front surface. */
export function lobePath({ w, h, arch }: Pick<Tooth, "w" | "h" | "arch">) {
  const d = arch === "upper" ? 1 : -1;
  const x = -w * 0.14;
  const top = h * 0.16 * d;
  const bottom = h * 0.8 * d;
  const mid = (top + bottom) / 2;
  return `M ${f(x)} ${f(top)} Q ${f(x - w * 0.09)} ${f(mid)}, ${f(x)} ${f(bottom)} Q ${f(x + w * 0.07)} ${f(mid)}, ${f(x)} ${f(top)} Z`;
}

function scallops(teeth: Tooth[], arch: Tooth["arch"]) {
  const d = arch === "upper" ? 1 : -1;
  const sorted = [...teeth].sort((a, b) => a.cx - b.cx);
  const papilla = (t: Tooth) => t.cy + 15 * d;
  const parts: string[] = [];
  sorted.forEach((t) => {
    const zenith = t.cy - 3 * d;
    const control = 2 * zenith - papilla(t);
    parts.push(`Q ${f(t.cx)} ${f(control)}, ${f(t.cx + t.w / 2)} ${f(papilla(t))}`);
  });
  return { sorted, papilla, parts };
}

/** Gum shape with a scalloped margin built from the final tooth positions. */
export function gumPath(teeth: Tooth[], arch: Tooth["arch"]) {
  const d = arch === "upper" ? 1 : -1;
  const { sorted, papilla, parts } = scallops(teeth, arch);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const edgeY = arch === "upper" ? 30 : 330;
  return [
    `M 60 ${edgeY} L 60 ${f(papilla(first) - 6 * d)} L ${f(first.cx - first.w / 2)} ${f(papilla(first))}`,
    ...parts,
    `L 540 ${f(papilla(last) - 6 * d)} L 540 ${edgeY} Z`,
  ].join(" ");
}

/** Just the scalloped gum line, for a soft highlight. */
export function gumLinePath(teeth: Tooth[], arch: Tooth["arch"]) {
  const { sorted, papilla, parts } = scallops(teeth, arch);
  const first = sorted[0];
  return [`M ${f(first.cx - first.w / 2)} ${f(papilla(first))}`, ...parts].join(" ");
}

/** Bracket position in tooth-local coordinates. */
export const bracketOffset = (t: Tooth) => (t.arch === "upper" ? t.h * 0.52 : -t.h * 0.5);

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (n: number) => n * n * (3 - 2 * n);

/** How crooked a tooth still is (1 = starting position, 0 = aligned) at overall progress p. */
export function crookedness(t: Tooth, p: number) {
  return 1 - smooth(clamp01((p - t.delay) / 0.7));
}

export function toothTransform(t: Tooth, k: number) {
  const tx = t.cx + t.dx * k;
  const ty = t.cy + t.dy * k;
  const scale = 1 + (t.s - 1) * k;
  const pivot = (t.h / 2) * (t.arch === "upper" ? 1 : -1);
  return `translate(${f(tx)} ${f(ty)}) rotate(${(t.rot * k).toFixed(2)} 0 ${f(pivot)}) scale(${scale.toFixed(3)})`;
}

/** World position of a tooth's bracket, matching toothTransform. */
export function bracketPoint(t: Tooth, k: number): [number, number] {
  const by = bracketOffset(t);
  const pivot = (t.h / 2) * (t.arch === "upper" ? 1 : -1);
  const a = (t.rot * k * Math.PI) / 180;
  const scale = 1 + (t.s - 1) * k;
  const y0 = by * scale - pivot;
  return [t.cx + t.dx * k - y0 * Math.sin(a), t.cy + t.dy * k + y0 * Math.cos(a) + pivot];
}

/** Smooth wire through bracket points (Catmull-Rom → cubic Bézier). */
export function wirePath(points: [number, number][]) {
  if (points.length < 2) return "";
  let d = `M ${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f(c1[0])} ${f(c1[1])}, ${f(c2[0])} ${f(c2[1])}, ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

const byX = (teeth: Tooth[]) => [...teeth].sort((a, b) => a.cx - b.cx);
export const wireFor = (teeth: Tooth[], p: number) =>
  wirePath(byX(teeth).map((t) => bracketPoint(t, crookedness(t, p))));
