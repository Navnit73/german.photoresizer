import { getCtx, type AnyCanvas } from "./canvas";
import type { DecodedImage, SniffedType } from "./decode";
import { EXT, MIME, encodePixels, readPixels, type EncodeOptions, type OutputFormat } from "./encode";
import { insertExif, prepareExif } from "./exif";
import { baseName } from "./files";
import { scaleSource, type Resampling } from "./resize";

export type MetadataMode = "strip" | "keep" | "keep-no-gps";

/** Pixels of the decoded image, optionally scaled. */
export function renderDecoded(dec: DecodedImage, width = dec.width, height = dec.height, resampling: Resampling = "smooth"): AnyCanvas {
  return scaleSource(dec.bitmap, dec.width, dec.height, width, height, resampling);
}

export function sourceFormat(type: SniffedType): OutputFormat {
  if (type === "png" || type === "gif") return "png";
  if (type === "webp") return "webp";
  return "jpeg";
}

export async function encodeCanvas(canvas: AnyCanvas, opts: EncodeOptions): Promise<Uint8Array> {
  return encodePixels(readPixels(canvas), opts);
}

/** Wraps encoded bytes as a Blob, re-inserting cleaned EXIF for JPEG output if requested. */
export function finishBlob(data: Uint8Array, format: OutputFormat, exif: Uint8Array | null, metadata: MetadataMode): Blob {
  let bytes = data;
  if (format === "jpeg" && exif && metadata !== "strip") {
    const cleaned = prepareExif(exif, { stripGps: metadata === "keep-no-gps" });
    if (cleaned) bytes = insertExif(data, cleaned);
  }
  return new Blob([bytes as Uint8Array<ArrayBuffer>], { type: MIME[format] });
}

export function outputName(original: string, format: OutputFormat, suffix = ""): string {
  return `${baseName(original)}${suffix}.${EXT[format]}`;
}

/** Draws a canvas onto another canvas of the same size with a solid background. */
export function withBackground(canvas: AnyCanvas, color: string): AnyCanvas {
  const ctx = getCtx(canvas);
  ctx.save();
  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  return canvas;
}
