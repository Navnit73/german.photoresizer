import { createCanvas, getCtx, type AnyCanvas } from "./canvas";

export type Resampling = "smooth" | "pixel";

/**
 * High-quality downscale: halves the image repeatedly before the final draw,
 * which avoids the aliasing of a single large drawImage step in browsers
 * whose "high" smoothing is only bilinear.
 */
export function scaleSource(
  src: CanvasImageSource,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
  resampling: Resampling = "smooth",
): AnyCanvas {
  const tw = Math.max(1, Math.round(dstW));
  const th = Math.max(1, Math.round(dstH));

  if (resampling === "pixel") {
    const out = createCanvas(tw, th);
    const ctx = getCtx(out);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(src, 0, 0, srcW, srcH, 0, 0, tw, th);
    return out;
  }

  let cur: CanvasImageSource = src;
  let cw = srcW;
  let ch = srcH;
  while (cw / 2 >= tw && ch / 2 >= th) {
    const nw = Math.round(cw / 2);
    const nh = Math.round(ch / 2);
    const step = createCanvas(nw, nh);
    const sctx = getCtx(step);
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = "high";
    sctx.drawImage(cur, 0, 0, cw, ch, 0, 0, nw, nh);
    cur = step;
    cw = nw;
    ch = nh;
  }
  const out = createCanvas(tw, th);
  const ctx = getCtx(out);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(cur, 0, 0, cw, ch, 0, 0, tw, th);
  return out;
}

export type FitMode = "stretch" | "cover" | "contain";

/**
 * Renders the source into a target box.
 * - stretch: distort to exactly w×h
 * - cover:   fill the box, crop overflow (centered)
 * - contain: fit inside the box, pad with `padColor` (null = transparent)
 */
export function renderToBox(
  src: CanvasImageSource,
  srcW: number,
  srcH: number,
  boxW: number,
  boxH: number,
  fit: FitMode,
  padColor: string | null,
  resampling: Resampling,
): AnyCanvas {
  const bw = Math.max(1, Math.round(boxW));
  const bh = Math.max(1, Math.round(boxH));
  if (fit === "stretch") return scaleSource(src, srcW, srcH, bw, bh, resampling);

  const scale = fit === "cover" ? Math.max(bw / srcW, bh / srcH) : Math.min(bw / srcW, bh / srcH);
  const sw = Math.max(1, Math.round(srcW * scale));
  const sh = Math.max(1, Math.round(srcH * scale));
  const scaled = scaleSource(src, srcW, srcH, sw, sh, resampling);
  const out = createCanvas(bw, bh);
  const ctx = getCtx(out);
  if (fit === "contain" && padColor) {
    ctx.fillStyle = padColor;
    ctx.fillRect(0, 0, bw, bh);
  }
  ctx.drawImage(scaled, Math.round((bw - sw) / 2), Math.round((bh - sh) / 2));
  return out;
}

/** Dimensions for "scale so the long edge is at most `px`" (never upscales). */
export function fitLongEdge(w: number, h: number, px: number): { width: number; height: number } {
  const long = Math.max(w, h);
  if (long <= px) return { width: w, height: h };
  const s = px / long;
  return { width: Math.max(1, Math.round(w * s)), height: Math.max(1, Math.round(h * s)) };
}
