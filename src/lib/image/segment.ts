/**
 * Local AI background segmentation via transformers.js (ONNX Runtime Web).
 * The photo never leaves the device. Model weights are fetched once from
 * Hugging Face (or NEXT_PUBLIC_MODEL_HOST if self-hosted) and cached by the
 * browser; the ONNX runtime WASM is fetched from jsDelivr by default.
 */

export type SegmentModel = "portrait" | "object";

export const MODELS: Record<SegmentModel, { id: string; label: string; size: string; hint: string }> = {
  portrait: { id: "Xenova/modnet", label: "Personen & Porträts", size: "≈ 13 MB", hint: "Schnell, optimiert für Menschen" },
  object: { id: "onnx-community/BiRefNet_lite-ONNX", label: "Produkte & Objekte", size: "≈ 115 MB", hint: "Präzise für alle Motive" },
};

type Segmenter = (input: unknown) => Promise<{ data: Uint8ClampedArray | Uint8Array; width: number; height: number; channels: number }>;

const cache = new Map<SegmentModel, Promise<Segmenter>>();

export interface LoadProgress {
  /** 0–1, or null when unknown */
  ratio: number | null;
  loadedBytes: number;
}

async function hasWebGPU(): Promise<boolean> {
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
  if (!gpu) return false;
  try {
    return !!(await gpu.requestAdapter());
  } catch {
    return false;
  }
}

export function loadSegmenter(model: SegmentModel, onProgress?: (p: LoadProgress) => void): Promise<Segmenter> {
  const existing = cache.get(model);
  if (existing) return existing;
  const p = (async () => {
    const tf = await import("@huggingface/transformers");
    tf.env.allowLocalModels = false;
    const host = process.env.NEXT_PUBLIC_MODEL_HOST;
    if (host) tf.env.remoteHost = host;
    const device = (await hasWebGPU()) ? "webgpu" : "wasm";
    const files = new Map<string, { loaded: number; total: number }>();
    const pipe = await tf.pipeline("background-removal", MODELS[model].id, {
      device,
      dtype: "fp16",
      progress_callback: (e: { status: string; file?: string; loaded?: number; total?: number }) => {
        if (e.status !== "progress" || !e.file) return;
        files.set(e.file, { loaded: e.loaded ?? 0, total: e.total ?? 0 });
        let loaded = 0;
        let total = 0;
        files.forEach((f) => {
          loaded += f.loaded;
          total += f.total;
        });
        onProgress?.({ ratio: total > 0 ? loaded / total : null, loadedBytes: loaded });
      },
    });
    return pipe as unknown as Segmenter;
  })();
  cache.set(model, p);
  p.catch(() => cache.delete(model));
  return p;
}

/**
 * Returns an alpha mask (0–255, one byte per pixel) at the canvas size.
 */
export async function segment(canvas: HTMLCanvasElement, model: SegmentModel, onProgress?: (p: LoadProgress) => void): Promise<Uint8ClampedArray> {
  const segmenter = await loadSegmenter(model, onProgress);
  const { RawImage } = await import("@huggingface/transformers");
  const input = RawImage.fromCanvas(canvas);
  const out = await segmenter(input);
  const n = canvas.width * canvas.height;
  const mask = new Uint8ClampedArray(n);
  if (out.width === canvas.width && out.height === canvas.height && out.channels === 4) {
    for (let i = 0; i < n; i++) mask[i] = out.data[i * 4 + 3];
    return mask;
  }
  // Unexpected output size: resample the alpha channel.
  const alpha = new Uint8ClampedArray(out.width * out.height * 4);
  for (let i = 0; i < out.width * out.height; i++) {
    const a = out.channels === 4 ? out.data[i * 4 + 3] : out.data[i * out.channels];
    alpha[i * 4] = alpha[i * 4 + 1] = alpha[i * 4 + 2] = 255;
    alpha[i * 4 + 3] = a;
  }
  const tmp = document.createElement("canvas");
  tmp.width = out.width;
  tmp.height = out.height;
  tmp.getContext("2d")!.putImageData(new ImageData(alpha, out.width, out.height), 0, 0);
  const dst = document.createElement("canvas");
  dst.width = canvas.width;
  dst.height = canvas.height;
  const dctx = dst.getContext("2d", { willReadFrequently: true })!;
  dctx.imageSmoothingQuality = "high";
  dctx.drawImage(tmp, 0, 0, dst.width, dst.height);
  const d = dctx.getImageData(0, 0, dst.width, dst.height).data;
  for (let i = 0; i < n; i++) mask[i] = d[i * 4 + 3];
  return mask;
}
