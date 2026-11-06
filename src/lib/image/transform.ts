import { createCanvas, getCtx, type AnyCanvas } from "./canvas";
import { scaleSource } from "./resize";

export interface Transform {
  rotate90: 0 | 90 | 180 | 270;
  flipX: boolean;
  flipY: boolean;
  /** Fine rotation in degrees (−45…45). */
  straighten: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const IDENTITY: Transform = { rotate90: 0, flipX: false, flipY: false, straighten: 0 };

/** Size of the image after 90° steps (straighten keeps the frame size). */
export function orientedSize(w: number, h: number, t: Transform): { W: number; H: number } {
  return t.rotate90 % 180 === 0 ? { W: w, H: h } : { W: h, H: w };
}

/**
 * Largest centred axis-aligned rectangle (same aspect as the frame) that lies
 * completely inside the frame rotated by `deg` – guarantees no empty corners.
 */
export function safeRect(W: number, H: number, deg: number): Rect {
  const a = Math.abs((deg * Math.PI) / 180);
  if (a < 1e-6) return { x: 0, y: 0, w: W, h: H };
  const c = Math.cos(a);
  const s = Math.sin(a);
  const k = Math.min(W / (W * c + H * s), H / (W * s + H * c));
  const w = W * k;
  const h = H * k;
  return { x: (W - w) / 2, y: (H - h) / 2, w, h };
}

/** Draws the full transformed image (oriented + straightened) into ctx at `scale`. */
export function drawTransformed(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  src: CanvasImageSource,
  w: number,
  h: number,
  t: Transform,
  scale = 1,
) {
  const { W, H } = orientedSize(w, h, t);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(W / 2, H / 2);
  ctx.rotate((t.straighten * Math.PI) / 180);
  ctx.rotate((t.rotate90 * Math.PI) / 180);
  ctx.scale(t.flipX ? -1 : 1, t.flipY ? -1 : 1);
  ctx.drawImage(src, -w / 2, -h / 2, w, h);
  ctx.restore();
}

/**
 * Renders the crop region (in oriented-image pixels) at full resolution,
 * optionally scaled to outW × outH.
 */
export function renderCrop(src: CanvasImageSource, w: number, h: number, t: Transform, crop: Rect, outW?: number, outH?: number): AnyCanvas {
  const cw = Math.max(1, Math.round(crop.w));
  const ch = Math.max(1, Math.round(crop.h));
  const c = createCanvas(cw, ch);
  const ctx = getCtx(c);
  ctx.imageSmoothingQuality = "high";
  ctx.translate(-crop.x, -crop.y);
  drawTransformed(ctx, src, w, h, t);
  if (outW && outH && (Math.round(outW) !== cw || Math.round(outH) !== ch)) {
    return scaleSource(c, cw, ch, outW, outH, "smooth");
  }
  return c;
}

/** Clamp a rect into bounds (moving, then shrinking if needed). */
export function clampRect(r: Rect, b: Rect): Rect {
  const w = Math.min(r.w, b.w);
  const h = Math.min(r.h, b.h);
  const x = Math.min(Math.max(r.x, b.x), b.x + b.w - w);
  const y = Math.min(Math.max(r.y, b.y), b.y + b.h - h);
  return { x, y, w, h };
}

/** Largest rect of `ratio` (w/h) centred on `center` that fits in bounds. */
export function fitRatio(ratio: number, b: Rect, center?: { x: number; y: number }): Rect {
  let w = b.w;
  let h = w / ratio;
  if (h > b.h) {
    h = b.h;
    w = h * ratio;
  }
  const cx = center?.x ?? b.x + b.w / 2;
  const cy = center?.y ?? b.y + b.h / 2;
  return clampRect({ x: cx - w / 2, y: cy - h / 2, w, h }, b);
}

export type Handle = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
const MIN = 16;

/** New crop rect after dragging `handle` by (dx, dy) image pixels. */
export function dragRect(start: Rect, handle: Handle, dx: number, dy: number, ratio: number | null, b: Rect): Rect {
  if (handle === "move") return clampRect({ ...start, x: start.x + dx, y: start.y + dy }, b);
  const right = b.x + b.w;
  const bottom = b.y + b.h;

  if (handle.length === 2) {
    const dirX = handle.includes("e") ? 1 : -1;
    const dirY = handle.includes("s") ? 1 : -1;
    const ax = dirX > 0 ? start.x : start.x + start.w;
    const ay = dirY > 0 ? start.y : start.y + start.h;
    const px = (dirX > 0 ? start.x + start.w : start.x) + dx;
    const py = (dirY > 0 ? start.y + start.h : start.y) + dy;
    let w = Math.max(MIN, (px - ax) * dirX);
    let h = Math.max(MIN, (py - ay) * dirY);
    const maxW = dirX > 0 ? right - ax : ax - b.x;
    const maxH = dirY > 0 ? bottom - ay : ay - b.y;
    if (ratio) {
      if (w / h > ratio) w = h * ratio;
      else h = w / ratio;
      if (w > maxW) {
        w = maxW;
        h = w / ratio;
      }
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
    } else {
      w = Math.min(w, maxW);
      h = Math.min(h, maxH);
    }
    return { x: dirX > 0 ? ax : ax - w, y: dirY > 0 ? ay : ay - h, w, h };
  }

  // Edge handles
  const cx = start.x + start.w / 2;
  const cy = start.y + start.h / 2;
  if (handle === "e" || handle === "w") {
    const ax = handle === "e" ? start.x : start.x + start.w;
    const dir = handle === "e" ? 1 : -1;
    let w = Math.max(MIN, (handle === "e" ? start.w + dx : start.w - dx));
    w = Math.min(w, dir > 0 ? right - ax : ax - b.x);
    let h = start.h;
    if (ratio) {
      h = w / ratio;
      const maxH = 2 * Math.min(cy - b.y, bottom - cy);
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
    }
    return { x: dir > 0 ? ax : ax - w, y: ratio ? cy - h / 2 : start.y, w, h };
  }
  const ay = handle === "s" ? start.y : start.y + start.h;
  const dir = handle === "s" ? 1 : -1;
  let h = Math.max(MIN, handle === "s" ? start.h + dy : start.h - dy);
  h = Math.min(h, dir > 0 ? bottom - ay : ay - b.y);
  let w = start.w;
  if (ratio) {
    w = h * ratio;
    const maxW = 2 * Math.min(cx - b.x, right - cx);
    if (w > maxW) {
      w = maxW;
      h = w / ratio;
    }
  }
  return { x: ratio ? cx - w / 2 : start.x, y: dir > 0 ? ay : ay - h, w, h };
}

/**
 * Detects uniform borders (e.g. white scan margins) and returns the content
 * rectangle in oriented-image pixels, or null if there is no border.
 */
export function detectBorders(src: CanvasImageSource, w: number, h: number, t: Transform, tolerance = 24): Rect | null {
  const { W, H } = orientedSize(w, h, t);
  const s = Math.min(1, 1000 / Math.max(W, H));
  const sw = Math.max(1, Math.round(W * s));
  const sh = Math.max(1, Math.round(H * s));
  const c = createCanvas(sw, sh);
  const ctx = getCtx(c, { willReadFrequently: true });
  drawTransformed(ctx, src, w, h, { ...t, straighten: 0 }, s);
  const d = ctx.getImageData(0, 0, sw, sh).data;
  const ref = [d[0], d[1], d[2], d[3]];
  const same = (i: number) =>
    Math.abs(d[i] - ref[0]) <= tolerance && Math.abs(d[i + 1] - ref[1]) <= tolerance && Math.abs(d[i + 2] - ref[2]) <= tolerance && Math.abs(d[i + 3] - ref[3]) <= tolerance;
  const rowSame = (y: number) => {
    for (let x = 0; x < sw; x++) if (!same((y * sw + x) * 4)) return false;
    return true;
  };
  const colSame = (x: number, y0: number, y1: number) => {
    for (let y = y0; y <= y1; y++) if (!same((y * sw + x) * 4)) return false;
    return true;
  };
  let top = 0;
  while (top < sh - 1 && rowSame(top)) top++;
  let bottom = sh - 1;
  while (bottom > top && rowSame(bottom)) bottom--;
  let left = 0;
  while (left < sw - 1 && colSame(left, top, bottom)) left++;
  let right = sw - 1;
  while (right > left && colSame(right, top, bottom)) right--;
  if (top === 0 && left === 0 && bottom === sh - 1 && right === sw - 1) return null;
  if (right - left < 4 || bottom - top < 4) return null;
  const inv = 1 / s;
  const x = Math.max(0, Math.floor(left * inv));
  const y = Math.max(0, Math.floor(top * inv));
  return { x, y, w: Math.min(W - x, Math.ceil((right - left + 1) * inv)), h: Math.min(H - y, Math.ceil((bottom - top + 1) * inv)) };
}
