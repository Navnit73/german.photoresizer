export type AnyCanvas = OffscreenCanvas | HTMLCanvasElement;
export type Ctx2D = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

export function createCanvas(width: number, height: number): AnyCanvas {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  if (typeof OffscreenCanvas !== "undefined") {
    try {
      return new OffscreenCanvas(w, h);
    } catch {
      /* fall through */
    }
  }
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

export function getCtx(canvas: AnyCanvas, opts?: CanvasRenderingContext2DSettings): Ctx2D {
  const ctx = canvas.getContext("2d", opts) as Ctx2D | null;
  if (!ctx) throw new Error("Canvas 2D wird von diesem Browser nicht unterstützt.");
  return ctx;
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // iPadOS 13+ reports as Mac – detect via touch support.
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && navigator.maxTouchPoints > 1);
}

/**
 * Pixel budget per image. Safari on iOS/iPadOS refuses canvases above
 * 16.777.216 px; desktop browsers handle far more but memory still matters.
 */
export function maxPixels(): number {
  return isIOS() ? 16_777_216 : 50_000_000;
}

export async function canvasToBlob(canvas: AnyCanvas, type: string, quality?: number): Promise<Blob> {
  if ("convertToBlob" in canvas) return canvas.convertToBlob({ type, quality });
  return new Promise((resolve, reject) =>
    (canvas as HTMLCanvasElement).toBlob((b) => (b ? resolve(b) : reject(new Error("Export fehlgeschlagen."))), type, quality),
  );
}

/** Lets the browser paint between heavy steps (keeps the UI responsive). */
export function yieldToMain(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}
