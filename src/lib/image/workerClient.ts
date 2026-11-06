/**
 * Main-thread client for image.worker.ts. Falls back to running the same code
 * on the main thread when Workers or OffscreenCanvas (needed inside the worker)
 * are unavailable, or when the worker fails to start.
 */
import type { EncodeOptions } from "./codecs";
import type { Adjustments } from "./filters";
import type { GifOptions } from "./gif";
import type { WorkerRequest, WorkerResponse } from "./image.worker";

type Pending = { resolve: (r: Extract<WorkerResponse, { ok: true }>) => void; reject: (e: Error) => void };

let worker: Worker | null = null;
let broken = false;
let nextId = 1;
const pending = new Map<number, Pending>();

function supported(): boolean {
  return (
    !broken &&
    typeof window !== "undefined" &&
    typeof Worker !== "undefined" &&
    typeof OffscreenCanvas !== "undefined" &&
    typeof OffscreenCanvas.prototype.getContext === "function"
  );
}

function getWorker(): Worker | null {
  if (!supported()) return null;
  if (worker) return worker;
  try {
    worker = new Worker(new URL("./image.worker.ts", import.meta.url), { type: "module", name: "image-worker" });
  } catch {
    broken = true;
    return null;
  }
  worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
    const p = pending.get(e.data.id);
    if (!p) return;
    pending.delete(e.data.id);
    if (e.data.ok) p.resolve(e.data);
    else p.reject(new Error(e.data.error));
  };
  worker.onerror = (e) => {
    // Worker could not load (e.g. old Safari): fail pending jobs, fall back from now on.
    e.preventDefault();
    broken = true;
    worker?.terminate();
    worker = null;
    pending.forEach((p) => p.reject(new WorkerUnavailable()));
    pending.clear();
  };
  return worker;
}

class WorkerUnavailable extends Error {}

type JobRequest = WorkerRequest extends infer R ? (R extends { type: "encode" | "gif" } ? Omit<R, "id"> : never) : never;

function call(req: JobRequest, transfer: Transferable[], isStale?: () => boolean) {
  const w = getWorker();
  if (!w) return Promise.reject(new WorkerUnavailable());
  const id = nextId++;
  return new Promise<Extract<WorkerResponse, { ok: true }>>((resolve, reject) => {
    pending.set(id, { resolve, reject });
    w.postMessage({ ...req, id } as WorkerRequest, transfer);
    if (isStale) {
      const timer = setInterval(() => {
        if (!pending.has(id)) return clearInterval(timer);
        if (isStale()) {
          clearInterval(timer);
          w.postMessage({ type: "cancel", id } satisfies WorkerRequest);
        }
      }, 120);
    }
  });
}

/** Encode pixels (optionally applying colour adjustments first). */
export async function encodeInWorker(img: ImageData, opts: EncodeOptions, adjust?: Adjustments): Promise<Uint8Array> {
  // Copy: callers may reuse `img` (e.g. target-size search encodes it repeatedly).
  const buffer = img.data.slice().buffer;
  try {
    const r = await call({ type: "encode", width: img.width, height: img.height, buffer, opts, adjust }, [buffer]);
    return new Uint8Array(r.bytes);
  } catch (e) {
    if (!(e instanceof WorkerUnavailable)) throw e;
    const [{ encodePixelsLocal }, { applyAdjustments }] = await Promise.all([import("./codecs"), import("./filters")]);
    const copy = new ImageData(new Uint8ClampedArray(img.data), img.width, img.height);
    if (adjust) applyAdjustments(copy, adjust);
    return encodePixelsLocal(copy, opts);
  }
}

const fileKeys = new WeakMap<Blob, string>();
let keyCounter = 0;

/** Optimise an animated GIF; the decoded frames are cached inside the worker per file. */
export async function gifInWorker(file: Blob, opts: GifOptions, isStale?: () => boolean) {
  let key = fileKeys.get(file);
  if (!key) {
    key = `gif${++keyCounter}`;
    fileKeys.set(file, key);
  }
  const buffer = await file.arrayBuffer();
  try {
    const r = await call({ type: "gif", key, buffer, opts }, [buffer], isStale);
    return { bytes: new Uint8Array(r.bytes), width: r.width!, height: r.height!, frameCount: r.frameCount!, sourceFrames: r.sourceFrames! };
  } catch (e) {
    if (!(e instanceof WorkerUnavailable)) throw e;
    const { decodeGif, encodeGif } = await import("./gif");
    const gif = await decodeGif(await file.arrayBuffer());
    const res = await encodeGif(gif, opts, undefined, isStale);
    return { ...res, sourceFrames: gif.frames.length };
  }
}
