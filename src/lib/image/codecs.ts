/**
 * Codec implementations (run inside the image worker, or on the main thread as
 * fallback). MUST NOT import workerClient/encode – the worker bundle may never
 * reference `new Worker(...)` itself (Turbopack deadlock, see audit §7).
 * All codecs are WebAssembly builds loaded on first use only:
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
// OxiPNG: import the single-threaded wasm-bindgen build directly. The package
// entry also references the multi-threaded build (wasm-bindgen-rayon worker that
// imports itself), which deadlocks the Turbopack production build.
type OxiModule = typeof import("@jsquash/oxipng/codec/pkg/squoosh_oxipng.js");
let oxiMod: Promise<OxiModule> | null = null;

function loadJpeg() {
  return (jpegMod ??= import("@jsquash/jpeg/encode"));
}
function loadWebp() {
  return (webpMod ??= import("@jsquash/webp/encode"));
}
function loadOxi() {
  return (oxiMod ??= import("@jsquash/oxipng/codec/pkg/squoosh_oxipng.js").then(async (m) => {
    await m.default();
    return m;
  }));
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

export async function encodePixelsLocal(img: ImageData, opts: EncodeOptions): Promise<Uint8Array> {
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
  const oxi = await loadOxi();
  if (opts.pngMode === "palette") {
    const UPNG = (await import("upng-js")).default;
    const colors = Math.min(256, Math.max(2, Math.round(opts.colors ?? 256)));
    const rgba = img.data.buffer.slice(img.data.byteOffset, img.data.byteOffset + img.data.byteLength) as ArrayBuffer;
    const quantised = UPNG.encode([rgba], img.width, img.height, colors);
    return oxi.optimise(new Uint8Array(quantised), 2, false, true);
  }
  return oxi.optimise_raw(img.data, img.width, img.height, 2, false, true);
}
