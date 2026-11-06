/**
 * Main-thread encoding API. Heavy work runs in the image worker
 * (image.worker.ts) with a transparent main-thread fallback.
 */
import { encodeInWorker } from "./workerClient";
import type { EncodeOptions } from "./codecs";
import type { Adjustments } from "./filters";

export { EXT, MIME, hasTransparency, readPixels, type EncodeOptions, type OutputFormat } from "./codecs";

export function encodePixels(img: ImageData, opts: EncodeOptions, adjust?: Adjustments): Promise<Uint8Array> {
  return encodeInWorker(img, opts, adjust);
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
