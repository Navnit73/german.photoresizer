/// <reference lib="webworker" />
/**
 * Image worker: WASM encoding, colour adjustments and GIF optimisation run
 * here so the page stays responsive during large batches.
 *
 * IMPORTANT: only import pure modules (codecs, gif, filters). Never import
 * encode.ts / workerClient.ts – a worker bundle that references its own
 * `new Worker(...)` deadlocks the Turbopack build.
 */
import { encodePixelsLocal, type EncodeOptions } from "./codecs";
import { applyAdjustments, type Adjustments } from "./filters";
import { decodeGif, encodeGif, type DecodedGif, type GifOptions } from "./gif";

export type WorkerRequest =
  | { id: number; type: "encode"; width: number; height: number; buffer: ArrayBuffer; opts: EncodeOptions; adjust?: Adjustments }
  | { id: number; type: "gif"; key: string; buffer: ArrayBuffer; opts: GifOptions }
  | { id: number; type: "cancel" };

export type WorkerResponse =
  | { id: number; ok: true; bytes: ArrayBuffer; width?: number; height?: number; frameCount?: number; sourceFrames?: number }
  | { id: number; ok: false; error: string };

const scope = self as unknown as DedicatedWorkerGlobalScope;
const cancelled = new Set<number>();
const gifCache = new Map<string, Promise<DecodedGif>>();

function cachedGif(key: string, buffer: ArrayBuffer) {
  let p = gifCache.get(key);
  if (!p) {
    p = decodeGif(buffer);
    gifCache.set(key, p);
    p.catch(() => gifCache.delete(key));
    // Keep memory bounded: decoded GIFs can be large.
    while (gifCache.size > 3) gifCache.delete(gifCache.keys().next().value!);
  }
  return p;
}

function reply(msg: WorkerResponse, transfer: Transferable[] = []) {
  scope.postMessage(msg, transfer);
}

scope.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const req = e.data;
  if (req.type === "cancel") {
    cancelled.add(req.id);
    return;
  }
  try {
    if (req.type === "encode") {
      const img = new ImageData(new Uint8ClampedArray(req.buffer), req.width, req.height);
      if (req.adjust) applyAdjustments(img, req.adjust);
      const bytes = await encodePixelsLocal(img, req.opts);
      const out = bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength ? bytes.buffer : bytes.slice().buffer;
      reply({ id: req.id, ok: true, bytes: out as ArrayBuffer }, [out as ArrayBuffer]);
    } else {
      const gif = await cachedGif(req.key, req.buffer);
      const res = await encodeGif(gif, req.opts, undefined, () => cancelled.has(req.id));
      const out = res.bytes.slice().buffer;
      reply({ id: req.id, ok: true, bytes: out, width: res.width, height: res.height, frameCount: res.frameCount, sourceFrames: gif.frames.length }, [out]);
    }
  } catch (err) {
    reply({ id: req.id, ok: false, error: err instanceof Error ? err.message : String(err) });
  } finally {
    cancelled.delete(req.id);
  }
};
