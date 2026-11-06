/**
 * Minimal GIF89a writer with frame offsets (sub-rectangles), built on the LZW
 * encoder and byte stream of `gifenc` (MIT, © Matt DesLauriers). gifenc's own
 * GIFEncoder always writes frames at (0, 0) in full size; storing only the
 * changed rectangle of each frame is what makes optimised GIFs small.
 */
import lzwEncode from "gifenc/src/lzwEncode.js";
import createStream from "gifenc/src/stream.js";

export type Palette = number[][];

function tableBits(len: number) {
  return Math.max(1, Math.ceil(Math.log2(Math.max(2, len))));
}

export function createGifWriter(width: number, height: number, globalPalette: Palette, loop = 0) {
  const s = createStream(64 * 1024);
  const accum = new Uint8Array(256);
  const htab = new Int32Array(5003);
  const codetab = new Int32Array(5003);
  const u16 = (v: number) => {
    s.writeByte(v & 0xff);
    s.writeByte((v >> 8) & 0xff);
  };
  const ascii = (t: string) => {
    for (let i = 0; i < t.length; i++) s.writeByte(t.charCodeAt(i));
  };
  const table = (p: Palette) => {
    const n = 1 << tableBits(p.length);
    for (let i = 0; i < n; i++) {
      const c = p[i] ?? [0, 0, 0];
      s.writeByte(c[0]);
      s.writeByte(c[1]);
      s.writeByte(c[2]);
    }
  };

  ascii("GIF89a");
  u16(width);
  u16(height);
  s.writeBytes([0x80 | (7 << 4) | (tableBits(globalPalette.length) - 1), 0, 0]);
  table(globalPalette);
  // NETSCAPE2.0 loop extension
  s.writeBytes([0x21, 0xff, 11]);
  ascii("NETSCAPE2.0");
  s.writeBytes([3, 1]);
  u16(loop);
  s.writeByte(0);

  return {
    frame(
      index: Uint8Array,
      x: number,
      y: number,
      w: number,
      h: number,
      opts: { delay: number; transparentIndex?: number; dispose?: number; palette?: Palette },
    ) {
      const t = opts.transparentIndex ?? -1;
      s.writeBytes([0x21, 0xf9, 4, ((opts.dispose ?? 0) & 7) << 2 | (t >= 0 ? 1 : 0)]);
      u16(Math.round(opts.delay / 10));
      s.writeBytes([t >= 0 ? t : 0, 0]);
      s.writeByte(0x2c);
      u16(x);
      u16(y);
      u16(w);
      u16(h);
      if (opts.palette) {
        s.writeByte(0x80 | (tableBits(opts.palette.length) - 1));
        table(opts.palette);
      } else {
        s.writeByte(0);
      }
      lzwEncode(w, h, index, 8, s, accum, htab, codetab);
    },
    finish(): Uint8Array {
      s.writeByte(0x3b);
      return s.bytes();
    },
  };
}
