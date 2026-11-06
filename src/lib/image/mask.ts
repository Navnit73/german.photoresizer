/** Alpha-mask helpers for the cut-out editor. Masks are 1 byte per pixel. */

/** Separable box blur ×3 (≈ Gaussian) on an alpha mask. Safari-safe (no ctx.filter). */
export function blurMask(src: Uint8ClampedArray, w: number, h: number, radius: number): Uint8ClampedArray {
  const r = Math.round(radius);
  if (r < 1) return src;
  const a = new Uint8ClampedArray(src);
  const b = new Uint8ClampedArray(src.length);
  for (let pass = 0; pass < 3; pass++) {
    // horizontal
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let sum = 0;
      for (let x = -r; x <= r; x++) sum += a[row + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) {
        b[row + x] = sum / (2 * r + 1);
        sum += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)];
      }
    }
    // vertical
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let y = -r; y <= r; y++) sum += b[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = sum / (2 * r + 1);
        sum += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x];
      }
    }
  }
  return a;
}

export function maskFromCanvasAlpha(data: Uint8ClampedArray): Uint8ClampedArray {
  const m = new Uint8ClampedArray(data.length / 4);
  for (let i = 0; i < m.length; i++) m[i] = data[i * 4 + 3];
  return m;
}

export function maskToImageData(mask: Uint8ClampedArray, w: number, h: number): ImageData {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < mask.length; i++) {
    d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 255;
    d[i * 4 + 3] = mask[i];
  }
  return new ImageData(d, w, h);
}

/** Bounding box of pixels with alpha above threshold, or null if empty. */
export function maskBounds(mask: Uint8ClampedArray, w: number, h: number, threshold = 8) {
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x] > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

export function isMaskEmpty(mask: Uint8ClampedArray): boolean {
  for (let i = 0; i < mask.length; i += 7) if (mask[i] > 8) return false;
  return true;
}
