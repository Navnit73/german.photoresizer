/**
 * Local AI background removal via @imgly/background-removal (ISNet model).
 *
 * Runs client-side in the browser using WebAssembly / WebGPU. The photo never
 * leaves the device. The ISNet ONNX model is automatically downloaded by the
 * library on first run and cached by the browser for subsequent runs.
 */

export type SegmentModel = "isnet";

export const MODELS: Record<SegmentModel, { id: string; label: string; size: string; hint: string }> = {
  isnet: {
    id: "isnet_fp16",
    label: "ISNet (IMG.LY)",
    size: "≈ 84 MB",
    hint: "Präzises KI-Modell für Personen, Produkte und beliebige Motive",
  },
};

export interface LoadProgress {
  /** 0–1, or null when unknown */
  ratio: number | null;
  loadedBytes: number;
  totalBytes?: number;
  stage?: "download" | "analyse";
}

/** Set once WebGPU fails in this session – everything then falls back to CPU/WASM. */
let forceCpu = false;

async function hasWebGpu(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } };
  if (!nav.gpu) return false;
  try {
    const adapter = await nav.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

/**
 * Runs client-side ISNet background segmentation on the provided canvas.
 * Returns an alpha mask (0–255, one byte per pixel) matching the canvas dimensions.
 */
export async function segment(
  canvas: HTMLCanvasElement,
  onProgressOrModel?: SegmentModel | ((p: LoadProgress) => void),
  onProgress?: (p: LoadProgress) => void,
): Promise<Uint8ClampedArray> {
  const cb = typeof onProgressOrModel === "function" ? onProgressOrModel : onProgress;

  // 1. Convert canvas to PNG blob
  const inputBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Konnte Bilddaten nicht für die KI vorbereiten."))), "image/png");
  });

  // 2. Dynamically import @imgly/background-removal (ensures client-only execution)
  const { removeBackground } = await import("@imgly/background-removal");

  const canGpu = !forceCpu && (await hasWebGpu());
  const publicPath = process.env.NEXT_PUBLIC_MODEL_HOST || undefined;

  const buildConfig = (device: "gpu" | "cpu") => ({
    model: "isnet_fp16" as const,
    device,
    publicPath,
    progress: (key: string, current: number, total: number) => {
      if (!cb) return;
      if (key.startsWith("fetch:")) {
        const ratio = total > 0 ? Math.min(1, current / total) : null;
        cb({ ratio, loadedBytes: current, totalBytes: total, stage: "download" });
      } else if (key.startsWith("compute:")) {
        cb({ ratio: 1, loadedBytes: total, totalBytes: total, stage: "analyse" });
      }
    },
  });

  // 3. Run background removal with GPU -> CPU fallback
  let outBlob: Blob;
  try {
    outBlob = await removeBackground(inputBlob, buildConfig(canGpu ? "gpu" : "cpu"));
  } catch (err) {
    if (canGpu && !forceCpu) {
      console.warn("[segment] WebGPU inference failed, retrying on CPU/WASM", err);
      forceCpu = true;
      outBlob = await removeBackground(inputBlob, buildConfig("cpu"));
    } else {
      throw err;
    }
  }

  // 4. Extract alpha channel mask from the resulting cutout
  const outCanvas = document.createElement("canvas");
  outCanvas.width = canvas.width;
  outCanvas.height = canvas.height;
  const ctx = outCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D-Canvas-Kontext nicht verfügbar.");

  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(outBlob);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
  } else {
    await new Promise<void>((resolve, reject) => {
      const url = URL.createObjectURL(outBlob);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Ergebnisbild konnte nicht geladen werden."));
      };
      img.src = url;
    });
  }

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const total = canvas.width * canvas.height;
  const mask = new Uint8ClampedArray(total);
  for (let i = 0; i < total; i++) {
    mask[i] = imgData.data[i * 4 + 3];
  }
  return mask;
}
