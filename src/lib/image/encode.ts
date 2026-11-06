/**
 * Encoders. All codecs are WebAssembly builds loaded on first use only:
 * MozJPEG (@jsquash/jpeg), libwebp (@jsquash/webp), OxiPNG (@jsquash/oxipng)
 * and UPNG.js for palette (colour-reduced) PNGs.
 */
import { createCanvas, getCtx, type AnyCanvas } from "./canvas";

export type OutputFormat = "jpeg" | "png" | "webp";

export interface EncodeOptions {
  format: OutputFormat;
  /** 1–100, used for JPEG/WebP. */
  quality: number;
  /** JPEG: progressive scan (default true). */
  progressive?: boolean;
  /** JPEG chroma subsampling. "auto" lets MozJPEG decide. */
  chroma?: "420" | "444" | "auto";
  /** PNG optimisation mode. */
  pngMode?: "lossless" | "palette";
  /** Palette size for pngMode "palette" (2–256). */
  colors?: number;
  /** Background used to flatten transparency for JPEG (default white). */
  background?: string;
}

export const MIME: Record<OutputFormat, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
export const EXT: Record<OutputFormat, string> = { jpeg: "jpg", png: "png", webp: "webp" };

let jpegMod: Promise<typeof import("@jsquash/jpeg/encode")> | null = null;
let webpMod: Promise<typeof import("@jsquash/webp/encode")> | null = null;
let oxiMod: Promise<typeof import("@jsquash/oxipng/optimise")> | null = null;

function loadJpeg() {
  return (jpegMod ??= import("@jsquash/jpeg/encode"));
}
function loadWebp() {
  return (webpMod ??= import("@jsquash/webp/encode"));
}
function loadOxi() {
  return (oxiMod ??= import("@jsquash/oxipng/optimise"));
}

/** Warm up a codec (e.g. when the user picks a format) to hide load latency. */
export function preloadCodec(format: OutputFormat) {
  if (format === "jpeg") void loadJpeg();
  else if (format === "webp") void loadWebp();
  else void loadOxi();
}

export function readPixels(canvas: AnyCanvas): ImageData {
  return getCtx(canvas, { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height);
}

export function hasTransparency(img: ImageData): boolean {
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) if (d[i] < 255) return true;
  return false;
}

/** Composites RGBA onto a solid colour (JPEG has no alpha channel). */
function flatten(img: ImageData, background = "#ffffff"): ImageData {
  if (!hasTransparency(img)) return img;
  const c = createCanvas(img.width, img.height);
  const ctx = getCtx(c, { willReadFrequently: true });
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, img.width, img.height);
  const tmp = createCanvas(img.width, img.height);
  getCtx(tmp).putImageData(img, 0, 0);
  ctx.drawImage(tmp, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

export async function encodePixels(img: ImageData, opts: EncodeOptions): Promise<Uint8Array> {
  const quality = Math.min(100, Math.max(1, Math.round(opts.quality)));
  if (opts.format === "jpeg") {
    const { default: encode } = await loadJpeg();
    const chroma = opts.chroma ?? "auto";
    const buf = await encode(flatten(img, opts.background), {
      quality,
      progressive: opts.progressive ?? true,
      baseline: !(opts.progressive ?? true),
      optimize_coding: true,
      auto_subsample: chroma === "auto",
      chroma_subsample: chroma === "444" ? 1 : 2,
    });
    return new Uint8Array(buf);
  }
  if (opts.format === "webp") {
    const { default: encode } = await loadWebp();
    return new Uint8Array(await encode(img, { quality }));
  }
  // PNG
  const { default: optimise } = await loadOxi();
  if (opts.pngMode === "palette") {
    const UPNG = (await import("upng-js")).default;
    const colors = Math.min(256, Math.max(2, Math.round(opts.colors ?? 256)));
    const rgba = img.data.buffer.slice(img.data.byteOffset, img.data.byteOffset + img.data.byteLength) as ArrayBuffer;
    const quantised = UPNG.encode([rgba], img.width, img.height, colors);
    return new Uint8Array(await optimise(quantised, { level: 2, interlace: false, optimiseAlpha: true }));
  }
  return new Uint8Array(await optimise(img, { level: 2, interlace: false, optimiseAlpha: true }));
}

/**
 * Finds the highest quality whose output fits `targetBytes` (binary search),
 * reducing pixel dimensions when even low quality is too large.
 * `render(scale)` must return the image at the given scale factor.
 */
export async function encodeToTargetSize(
  render: (scale: number) => ImageData,
  format: "jpeg" | "webp",
  targetBytes: number,
  base: Omit<EncodeOptions, "format" | "quality">,
): Promise<{ data: Uint8Array; img: ImageData; quality: number; reachedTarget: boolean }> {
  let scale = 1;
  let best: { data: Uint8Array; img: ImageData; quality: number } | null = null;
  for (let round = 0; round < 6; round++) {
    const img = render(scale);
    let lo = 30;
    let hi = 95;
    let found: { data: Uint8Array; quality: number } | null = null;
    let smallest: { data: Uint8Array; quality: number } | null = null;
    while (lo <= hi) {
      const q = Math.round((lo + hi) / 2);
      const data = await encodePixels(img, { ...base, format, quality: q });
      if (!smallest || data.length < smallest.data.length) smallest = { data, quality: q };
      if (data.length <= targetBytes) {
        found = { data, quality: q };
        lo = q + 1;
      } else {
        hi = q - 1;
      }
    }
    if (found) return { data: found.data, img, quality: found.quality, reachedTarget: true };
    if (smallest) best = { data: smallest.data, img, quality: smallest.quality };
    const ratio = targetBytes / (smallest?.data.length ?? targetBytes * 2);
    scale *= Math.min(0.9, Math.max(0.3, Math.sqrt(ratio) * 0.95));
    if (img.width * scale < 16 || img.height * scale < 16) break;
  }
  return { ...best!, reachedTarget: false };
}
