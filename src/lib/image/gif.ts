/**
 * Animated GIF optimiser: decode (gifuct-js) → optional frame skipping,
 * scaling and colour reduction → inter-frame optimisation → encode (gifenc).
 *
 * "Tolerance" is our lossy step: pixels whose colour changed less than the
 * threshold since the previously displayed frame are written as transparent
 * (= keep the previous pixel). Long transparent runs compress very well.
 */
import { createCanvas, getCtx, yieldToMain } from "./canvas";
import { scaleSource } from "./resize";

export interface GifFrame {
  rgba: Uint8ClampedArray;
  delay: number; // ms
}

export interface DecodedGif {
  width: number;
  height: number;
  frames: GifFrame[];
  hasAlpha: boolean;
}

export interface GifOptions {
  colors: number; // 2–256
  frameStep: 1 | 2 | 3;
  scale: number; // 0.1–1
  tolerance: number; // 0–100
}

const MAX_DECODED_BYTES = 600 * 1024 * 1024;

export async function decodeGif(buffer: ArrayBuffer): Promise<DecodedGif> {
  const { parseGIF, decompressFrames } = await import("gifuct-js");
  const gif = parseGIF(buffer);
  const raw = decompressFrames(gif, true);
  const width = gif.lsd.width;
  const height = gif.lsd.height;
  if (!raw.length) throw new Error("Die GIF-Datei enthält keine Bilder.");
  if (width * height * 4 * raw.length > MAX_DECODED_BYTES) {
    throw new Error("Dieses GIF ist zu groß für die Verarbeitung im Browser (zu viele oder zu große Frames).");
  }

  const canvas = new Uint8ClampedArray(width * height * 4);
  const frames: GifFrame[] = [];
  let hasAlpha = false;

  for (const f of raw) {
    const { left, top, width: fw, height: fh } = f.dims;
    const saved = f.disposalType === 3 ? canvas.slice() : null;
    for (let y = 0; y < fh; y++) {
      const cy = top + y;
      if (cy < 0 || cy >= height) continue;
      for (let x = 0; x < fw; x++) {
        const cx = left + x;
        if (cx < 0 || cx >= width) continue;
        const s = (y * fw + x) * 4;
        if (f.patch[s + 3] === 0) continue;
        const d = (cy * width + cx) * 4;
        canvas[d] = f.patch[s];
        canvas[d + 1] = f.patch[s + 1];
        canvas[d + 2] = f.patch[s + 2];
        canvas[d + 3] = 255;
      }
    }
    const snapshot = canvas.slice();
    if (!hasAlpha) {
      for (let i = 3; i < snapshot.length; i += 4) {
        if (snapshot[i] === 0) {
          hasAlpha = true;
          break;
        }
      }
    }
    frames.push({ rgba: snapshot, delay: Math.max(20, f.delay || 100) });

    if (f.disposalType === 2) {
      for (let y = Math.max(0, top); y < Math.min(height, top + fh); y++) {
        canvas.fill(0, (y * width + Math.max(0, left)) * 4, (y * width + Math.min(width, left + fw)) * 4);
      }
    } else if (saved) {
      canvas.set(saved);
    }
  }
  return { width, height, frames, hasAlpha };
}

export async function encodeGif(
  src: DecodedGif,
  opts: GifOptions,
  onProgress?: (done: number, total: number) => void,
  isCancelled?: () => boolean,
): Promise<{ bytes: Uint8Array; width: number; height: number; frameCount: number }> {
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

  // 1. Frame selection (delays merged so the animation keeps its speed)
  const picked: GifFrame[] = [];
  for (let i = 0; i < src.frames.length; i += opts.frameStep) {
    let delay = 0;
    for (let k = i; k < Math.min(i + opts.frameStep, src.frames.length); k++) delay += src.frames[k].delay;
    picked.push({ rgba: src.frames[i].rgba, delay });
  }

  // 2. Scaling
  const scale = Math.min(1, Math.max(0.05, opts.scale));
  const w = Math.max(1, Math.round(src.width * scale));
  const h = Math.max(1, Math.round(src.height * scale));
  const srcCanvas = createCanvas(src.width, src.height);
  const srcCtx = getCtx(srcCanvas, { willReadFrequently: true });
  const frames: { rgba: Uint8ClampedArray; delay: number }[] = [];
  for (const f of picked) {
    if (scale === 1) {
      frames.push(f);
      continue;
    }
    srcCtx.putImageData(new ImageData(new Uint8ClampedArray(f.rgba), src.width, src.height), 0, 0);
    const out = scaleSource(srcCanvas, src.width, src.height, w, h, "smooth");
    const data = getCtx(out, { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    if (src.hasAlpha) for (let i = 3; i < data.length; i += 4) data[i] = data[i] < 128 ? 0 : 255;
    frames.push({ rgba: data, delay: f.delay });
  }

  const colors = Math.min(256, Math.max(2, Math.round(opts.colors)));
  const gif = GIFEncoder();
  const threshold = Math.round(Math.max(0, Math.min(100, opts.tolerance)) * 0.5);

  if (src.hasAlpha) {
    // Transparent GIFs: full frames, per-frame palette, cleared between frames.
    for (let i = 0; i < frames.length; i++) {
      if (isCancelled?.()) throw new Error("cancelled");
      const f = frames[i];
      const palette = quantize(f.rgba, colors, { format: "rgba4444", oneBitAlpha: true });
      const index = applyPalette(f.rgba, palette, "rgba4444");
      const tIdx = palette.findIndex((c) => c[3] === 0);
      gif.writeFrame(index, w, h, { palette, delay: f.delay, transparent: tIdx >= 0, transparentIndex: Math.max(0, tIdx), dispose: 2 });
      onProgress?.(i + 1, frames.length);
      if (i % 4 === 3) await yieldToMain();
    }
  } else {
    // Opaque GIFs: one global palette from sampled frames + reserved transparent
    // slot used for "unchanged" pixels.
    const sampleCount = Math.min(frames.length, 8);
    const pixelsPerFrame = w * h * 4;
    const sample = new Uint8ClampedArray(sampleCount * pixelsPerFrame);
    for (let s = 0; s < sampleCount; s++) {
      const idx = Math.floor((s * frames.length) / sampleCount);
      sample.set(frames[idx].rgba, s * pixelsPerFrame);
    }
    const palette = quantize(sample, Math.max(2, colors - 1), { format: "rgb565" });
    const tIdx = palette.length;
    palette.push([0, 0, 0]);
    const displayed = new Uint8ClampedArray(w * h * 3);

    for (let i = 0; i < frames.length; i++) {
      if (isCancelled?.()) throw new Error("cancelled");
      const f = frames[i];
      const index = applyPalette(f.rgba, palette, "rgb565");
      for (let p = 0; p < w * h; p++) {
        const c = palette[index[p]];
        const d = p * 3;
        if (i > 0) {
          const diff = Math.max(Math.abs(c[0] - displayed[d]), Math.abs(c[1] - displayed[d + 1]), Math.abs(c[2] - displayed[d + 2]));
          if (diff <= threshold) {
            index[p] = tIdx;
            continue;
          }
        }
        displayed[d] = c[0];
        displayed[d + 1] = c[1];
        displayed[d + 2] = c[2];
      }
      gif.writeFrame(index, w, h, {
        palette: i === 0 ? palette : undefined,
        delay: f.delay,
        transparent: true,
        transparentIndex: tIdx,
        dispose: 1,
      });
      onProgress?.(i + 1, frames.length);
      if (i % 4 === 3) await yieldToMain();
    }
  }
  gif.finish();
  return { bytes: gif.bytes(), width: w, height: h, frameCount: frames.length };
}
