/**
 * Minimal EXIF handling without dependencies:
 * - read the TIFF/EXIF block from JPEG (APP1) or HEIC (ISOBMFF "Exif" item)
 * - reset the orientation tag (pixels are already rotated when decoding)
 * - optionally wipe the GPS IFD
 * - insert the block into a freshly encoded JPEG
 */

const EXIF_HEADER = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00]; // "Exif\0\0"

export function extractJpegExif(bytes: Uint8Array): Uint8Array | null {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let i = 2;
  while (i + 4 < bytes.length) {
    if (bytes[i] !== 0xff) return null;
    const marker = bytes[i + 1];
    if (marker === 0xda || marker === 0xd9) return null; // start of scan / end
    const len = (bytes[i + 2] << 8) | bytes[i + 3];
    if (marker === 0xe1 && EXIF_HEADER.every((v, k) => bytes[i + 4 + k] === v)) {
      return bytes.slice(i + 10, i + 2 + len);
    }
    i += 2 + len;
  }
  return null;
}

/* ---------------------------- HEIC (ISOBMFF) ---------------------------- */

interface Box {
  type: string;
  start: number; // content start
  end: number;
}

function readBoxes(v: DataView, from: number, to: number): Box[] {
  const boxes: Box[] = [];
  let p = from;
  while (p + 8 <= to) {
    let size = v.getUint32(p);
    const type = String.fromCharCode(v.getUint8(p + 4), v.getUint8(p + 5), v.getUint8(p + 6), v.getUint8(p + 7));
    let header = 8;
    if (size === 1) {
      size = Number(v.getBigUint64(p + 8));
      header = 16;
    } else if (size === 0) {
      size = to - p;
    }
    if (size < header || p + size > to) break;
    boxes.push({ type, start: p + header, end: p + size });
    p += size;
  }
  return boxes;
}

function readUint(v: DataView, p: number, size: number): number {
  if (size === 0) return 0;
  if (size === 2) return v.getUint16(p);
  if (size === 4) return v.getUint32(p);
  if (size === 8) return Number(v.getBigUint64(p));
  return 0;
}

export function extractHeicExif(bytes: Uint8Array): Uint8Array | null {
  try {
    const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const meta = readBoxes(v, 0, bytes.length).find((b) => b.type === "meta");
    if (!meta) return null;
    const children = readBoxes(v, meta.start + 4, meta.end); // FullBox header
    const iinf = children.find((b) => b.type === "iinf");
    const iloc = children.find((b) => b.type === "iloc");
    if (!iinf || !iloc) return null;

    // Find the item id of type "Exif"
    const iinfVersion = v.getUint8(iinf.start);
    const entriesStart = iinf.start + 4 + (iinfVersion === 0 ? 2 : 4);
    let exifId = -1;
    for (const infe of readBoxes(v, entriesStart, iinf.end)) {
      if (infe.type !== "infe") continue;
      const ver = v.getUint8(infe.start);
      if (ver < 2) continue;
      const idSize = ver === 2 ? 2 : 4;
      const id = readUint(v, infe.start + 4, idSize);
      const typeAt = infe.start + 4 + idSize + 2;
      const t = String.fromCharCode(v.getUint8(typeAt), v.getUint8(typeAt + 1), v.getUint8(typeAt + 2), v.getUint8(typeAt + 3));
      if (t === "Exif") {
        exifId = id;
        break;
      }
    }
    if (exifId < 0) return null;

    // Locate it via iloc
    const ver = v.getUint8(iloc.start);
    let p = iloc.start + 4;
    const s1 = v.getUint8(p++);
    const s2 = v.getUint8(p++);
    const offsetSize = s1 >> 4;
    const lengthSize = s1 & 15;
    const baseOffsetSize = s2 >> 4;
    const indexSize = ver === 1 || ver === 2 ? s2 & 15 : 0;
    const itemCount = ver < 2 ? v.getUint16(p) : v.getUint32(p);
    p += ver < 2 ? 2 : 4;
    for (let i = 0; i < itemCount; i++) {
      const id = ver < 2 ? v.getUint16(p) : v.getUint32(p);
      p += ver < 2 ? 2 : 4;
      let method = 0;
      if (ver === 1 || ver === 2) {
        method = v.getUint16(p) & 15;
        p += 2;
      }
      p += 2; // data_reference_index
      const base = readUint(v, p, baseOffsetSize);
      p += baseOffsetSize;
      const extents = v.getUint16(p);
      p += 2;
      let first: { off: number; len: number } | null = null;
      for (let e = 0; e < extents; e++) {
        p += indexSize;
        const off = readUint(v, p, offsetSize);
        p += offsetSize;
        const len = readUint(v, p, lengthSize);
        p += lengthSize;
        if (!first) first = { off, len };
      }
      if (id === exifId && first) {
        if (method !== 0) return null; // idat-based storage: rare, skip
        const start = base + first.off;
        const data = bytes.subarray(start, start + first.len);
        const tiffOffset = new DataView(data.buffer, data.byteOffset).getUint32(0);
        return data.slice(4 + tiffOffset);
      }
    }
  } catch {
    /* malformed container – treat as no EXIF */
  }
  return null;
}

/* ------------------------------- TIFF ---------------------------------- */

const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 };

function tiffView(tiff: Uint8Array) {
  const v = new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength);
  const le = tiff[0] === 0x49;
  return {
    v,
    u16: (p: number) => v.getUint16(p, le),
    u32: (p: number) => v.getUint32(p, le),
    set16: (p: number, x: number) => v.setUint16(p, x, le),
    set32: (p: number, x: number) => v.setUint32(p, x, le),
  };
}

function findTag(tiff: Uint8Array, ifd: number, tag: number): number {
  const t = tiffView(tiff);
  const n = t.u16(ifd);
  for (let i = 0; i < n; i++) {
    const e = ifd + 2 + i * 12;
    if (t.u16(e) === tag) return e;
  }
  return -1;
}

export function hasGps(tiff: Uint8Array): boolean {
  try {
    const t = tiffView(tiff);
    const e = findTag(tiff, t.u32(4), 0x8825);
    if (e < 0) return false;
    const gps = t.u32(e + 8);
    return gps > 0 && gps < tiff.length && t.u16(gps) > 0;
  } catch {
    return false;
  }
}

/** Returns a cleaned copy: orientation = 1, GPS wiped if requested. */
export function prepareExif(source: Uint8Array, { stripGps }: { stripGps: boolean }): Uint8Array | null {
  try {
    const tiff = source.slice();
    const t = tiffView(tiff);
    if (t.u16(2) !== 42) return null;
    const ifd0 = t.u32(4);
    const orient = findTag(tiff, ifd0, 0x0112);
    if (orient >= 0) t.set16(orient + 8, 1);
    if (stripGps) {
      const ptr = findTag(tiff, ifd0, 0x8825);
      if (ptr >= 0) {
        const gps = t.u32(ptr + 8);
        if (gps > 0 && gps + 2 < tiff.length) {
          const n = t.u16(gps);
          for (let i = 0; i < n; i++) {
            const e = gps + 2 + i * 12;
            const size = (TYPE_SIZE[t.u16(e + 2)] ?? 1) * t.u32(e + 4);
            if (size > 4) {
              const off = t.u32(e + 8);
              if (off + size <= tiff.length) tiff.fill(0, off, off + size);
            }
            tiff.fill(0, e, e + 12);
          }
          t.set16(gps, 0);
        }
      }
    }
    return tiff;
  } catch {
    return null;
  }
}

/** Inserts a TIFF/EXIF block as APP1 into a JPEG (after SOI/APP0). */
export function insertExif(jpeg: Uint8Array, tiff: Uint8Array): Uint8Array {
  const segLen = 2 + EXIF_HEADER.length + tiff.length;
  if (segLen > 0xffff || jpeg[0] !== 0xff || jpeg[1] !== 0xd8) return jpeg;
  let insertAt = 2;
  if (jpeg[2] === 0xff && jpeg[3] === 0xe0) insertAt = 4 + ((jpeg[4] << 8) | jpeg[5]);
  const out = new Uint8Array(jpeg.length + 2 + segLen);
  out.set(jpeg.subarray(0, insertAt), 0);
  let p = insertAt;
  out[p++] = 0xff;
  out[p++] = 0xe1;
  out[p++] = segLen >> 8;
  out[p++] = segLen & 0xff;
  out.set(EXIF_HEADER, p);
  p += EXIF_HEADER.length;
  out.set(tiff, p);
  p += tiff.length;
  out.set(jpeg.subarray(insertAt), p);
  return out;
}

/** Reads EXIF from a JPEG or HEIC file (null if none). */
export async function readExif(file: Blob, type: string): Promise<Uint8Array | null> {
  if (type !== "jpeg" && type !== "heic") return null;
  const bytes = new Uint8Array(await file.arrayBuffer());
  return type === "jpeg" ? extractJpegExif(bytes) : extractHeicExif(bytes);
}
