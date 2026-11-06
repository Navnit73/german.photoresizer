import { createCanvas, getCtx, maxPixels } from "./canvas";

export type SniffedType = "jpeg" | "png" | "webp" | "gif" | "heic" | "avif" | "bmp" | "tiff" | "unknown";

/** Detects the real file type from magic bytes (extensions and MIME types lie). */
export async function sniffType(file: Blob): Promise<SniffedType> {
  const b = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const ascii = (from: number, len: number) => String.fromCharCode(...b.slice(from, from + len));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b[0] === 0x89 && ascii(1, 3) === "PNG") return "png";
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") return "webp";
  if (ascii(0, 3) === "GIF") return "gif";
  if (ascii(0, 2) === "BM") return "bmp";
  if ((b[0] === 0x49 && b[1] === 0x49) || (b[0] === 0x4d && b[1] === 0x4d)) return "tiff";
  if (ascii(4, 4) === "ftyp") {
    const brand = ascii(8, 4);
    if (/^(avif|avis)$/.test(brand)) return "avif";
    if (/^(heic|heix|hevc|hevx|heim|heis|mif1|msf1)$/.test(brand)) return "heic";
  }
  return "unknown";
}

export const TYPE_LABEL: Record<SniffedType, string> = {
  jpeg: "JPG",
  png: "PNG",
  webp: "WebP",
  gif: "GIF",
  heic: "HEIC",
  avif: "AVIF",
  bmp: "BMP",
  tiff: "TIFF",
  unknown: "Unbekannt",
};

export interface DecodedImage {
  bitmap: ImageBitmap;
  width: number;
  height: number;
  /** Size before the pixel-budget downscale (equals width/height if none). */
  originalWidth: number;
  originalHeight: number;
  downscaled: boolean;
  type: SniffedType;
}

export class DecodeError extends Error {}

async function decodeHeic(file: Blob): Promise<ImageBitmap> {
  const { heicTo } = await import("heic-to/next");
  return heicTo({ blob: file, type: "bitmap" });
}

async function viaImgElement(file: Blob): Promise<ImageBitmap> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return await createImageBitmap(img);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Decodes any browser-supported image plus HEIC/HEIF into an ImageBitmap with
 * EXIF orientation applied. Images above the device pixel budget are
 * downscaled proportionally (flagged via `downscaled`).
 */
export async function decodeImage(file: Blob): Promise<DecodedImage> {
  const type = await sniffType(file);
  let bitmap: ImageBitmap | null = null;

  if (type === "tiff") {
    // Only Safari decodes TIFF natively.
    bitmap = await viaImgElement(file).catch(() => null);
    if (!bitmap) throw new DecodeError("TIFF-Dateien kann dieser Browser nicht öffnen. Bitte nutzen Sie Safari oder wandeln Sie die Datei zuerst um.");
  } else {
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      bitmap = null;
    }
    if (!bitmap && type === "heic") {
      try {
        bitmap = await decodeHeic(file);
      } catch {
        throw new DecodeError("Diese HEIC-Datei konnte nicht gelesen werden. Möglicherweise ist sie beschädigt oder nutzt eine nicht unterstützte Variante.");
      }
    }
    if (!bitmap) bitmap = await viaImgElement(file).catch(() => null);
  }
  if (!bitmap) throw new DecodeError("Diese Datei ist kein unterstütztes Bild.");

  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;
  const budget = maxPixels();
  if (originalWidth * originalHeight > budget) {
    const scale = Math.sqrt(budget / (originalWidth * originalHeight)) * 0.999;
    const w = Math.floor(originalWidth * scale);
    const h = Math.floor(originalHeight * scale);
    let scaled: ImageBitmap;
    try {
      scaled = await createImageBitmap(bitmap, { resizeWidth: w, resizeHeight: h, resizeQuality: "high" });
    } catch {
      const c = createCanvas(w, h);
      const ctx = getCtx(c);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, w, h);
      scaled = await createImageBitmap(c);
    }
    bitmap.close();
    return { bitmap: scaled, width: w, height: h, originalWidth, originalHeight, downscaled: true, type };
  }
  return { bitmap, width: originalWidth, height: originalHeight, originalWidth, originalHeight, downscaled: false, type };
}
