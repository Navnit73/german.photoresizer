/**
 * Colour adjustments implemented with the exact formulas of CSS filter
 * functions (Filter Effects spec). The live preview uses CSS `filter` on the
 * stage (GPU, fast); the export applies the same math per pixel, so preview
 * and download match – also in Safari, which lacks CanvasRenderingContext2D.filter.
 */

export interface Adjustments {
  brightness: number; // 1 = unchanged (0–2)
  contrast: number; // 1 = unchanged (0–2)
  saturate: number; // 1 = unchanged (0–2)
  grayscale: number; // 0–1
  sepia: number; // 0–1
  invert: number; // 0–1
}

export const NEUTRAL: Adjustments = { brightness: 1, contrast: 1, saturate: 1, grayscale: 0, sepia: 0, invert: 0 };

export function isNeutral(a: Adjustments): boolean {
  return (Object.keys(NEUTRAL) as (keyof Adjustments)[]).every((k) => Math.abs(a[k] - NEUTRAL[k]) < 1e-6);
}

/** CSS filter string in the order applied by `applyAdjustments`. */
export function cssFilter(a: Adjustments): string {
  return `grayscale(${a.grayscale}) sepia(${a.sepia}) saturate(${a.saturate}) brightness(${a.brightness}) contrast(${a.contrast}) invert(${a.invert})`;
}

type M = number[]; // 3×3 row-major

function grayscaleM(a: number): M {
  const s = 1 - a;
  return [0.2126 + 0.7874 * s, 0.7152 - 0.7152 * s, 0.0722 - 0.0722 * s, 0.2126 - 0.2126 * s, 0.7152 + 0.2848 * s, 0.0722 - 0.0722 * s, 0.2126 - 0.2126 * s, 0.7152 - 0.7152 * s, 0.0722 + 0.9278 * s];
}
function sepiaM(a: number): M {
  const s = 1 - a;
  return [0.393 + 0.607 * s, 0.769 - 0.769 * s, 0.189 - 0.189 * s, 0.349 - 0.349 * s, 0.686 + 0.314 * s, 0.168 - 0.168 * s, 0.272 - 0.272 * s, 0.534 - 0.534 * s, 0.131 + 0.869 * s];
}
function saturateM(s: number): M {
  return [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s];
}
function mul(a: M, b: M): M {
  // returns b·a (apply a first, then b)
  const r: M = new Array(9);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) r[i * 3 + j] = b[i * 3] * a[j] + b[i * 3 + 1] * a[3 + j] + b[i * 3 + 2] * a[6 + j];
  return r;
}

/** Applies adjustments in place (alpha untouched). */
export function applyAdjustments(img: ImageData, a: Adjustments): void {
  if (isNeutral(a)) return;
  const m = mul(mul(grayscaleM(a.grayscale), sepiaM(a.sepia)), saturateM(a.saturate));
  const d = img.data;
  const br = a.brightness;
  const ct = a.contrast;
  const ctOff = 0.5 - 0.5 * ct;
  const inv = a.invert;
  for (let i = 0; i < d.length; i += 4) {
    const r0 = d[i] / 255;
    const g0 = d[i + 1] / 255;
    const b0 = d[i + 2] / 255;
    let r = Math.min(1, Math.max(0, m[0] * r0 + m[1] * g0 + m[2] * b0));
    let g = Math.min(1, Math.max(0, m[3] * r0 + m[4] * g0 + m[5] * b0));
    let b = Math.min(1, Math.max(0, m[6] * r0 + m[7] * g0 + m[8] * b0));
    r = Math.min(1, r * br);
    g = Math.min(1, g * br);
    b = Math.min(1, b * br);
    r = Math.min(1, Math.max(0, r * ct + ctOff));
    g = Math.min(1, Math.max(0, g * ct + ctOff));
    b = Math.min(1, Math.max(0, b * ct + ctOff));
    if (inv) {
      r = inv * (1 - r) + (1 - inv) * r;
      g = inv * (1 - g) + (1 - inv) * g;
      b = inv * (1 - b) + (1 - inv) * b;
    }
    d[i] = r * 255 + 0.5;
    d[i + 1] = g * 255 + 0.5;
    d[i + 2] = b * 255 + 0.5;
  }
}
