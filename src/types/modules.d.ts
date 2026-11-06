declare module "gifenc" {
  export type Palette = number[][];
  export interface GIFEncoderInstance {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      opts?: {
        palette?: Palette;
        delay?: number;
        transparent?: boolean;
        transparentIndex?: number;
        repeat?: number;
        dispose?: number;
        colorDepth?: number;
      },
    ): void;
    finish(): void;
    bytes(): Uint8Array;
  }
  export function GIFEncoder(opts?: { auto?: boolean }): GIFEncoderInstance;
  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    opts?: { format?: "rgb565" | "rgb444" | "rgba4444"; oneBitAlpha?: boolean | number; clearAlpha?: boolean },
  ): Palette;
  export function applyPalette(rgba: Uint8Array | Uint8ClampedArray, palette: Palette, format?: "rgb565" | "rgb444" | "rgba4444"): Uint8Array;
}

declare module "gifuct-js" {
  export interface ParsedGif {
    lsd: { width: number; height: number };
  }
  export interface ParsedFrame {
    dims: { top: number; left: number; width: number; height: number };
    delay: number;
    disposalType: number;
    patch: Uint8ClampedArray;
  }
  export function parseGIF(buffer: ArrayBuffer): ParsedGif;
  export function decompressFrames(gif: ParsedGif, buildPatch: boolean): ParsedFrame[];
}

declare module "gifenc/src/stream.js" {
  export interface ByteStream {
    writeByte(b: number): void;
    writeBytes(data: ArrayLike<number>, offset?: number, byteLength?: number): void;
    bytes(): Uint8Array;
  }
  export default function createStream(initialCapacity?: number): ByteStream;
}

declare module "gifenc/src/lzwEncode.js" {
  import type { ByteStream } from "gifenc/src/stream.js";
  export default function lzwEncode(
    width: number,
    height: number,
    pixels: Uint8Array,
    colorDepth: number,
    outStream: ByteStream,
    accum: Uint8Array,
    htab: Int32Array,
    codetab: Int32Array,
  ): void;
}
