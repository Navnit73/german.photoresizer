"use client";

import { useCallback, useState } from "react";
import BatchTool, { type SourceInfo } from "./BatchTool";
import { Panel, Segmented, Slider } from "./ui";
import { decodeGif, encodeGif, type DecodedGif } from "@/lib/image/gif";
import { baseName } from "@/lib/image/files";

const decodedCache = new WeakMap<File, Promise<DecodedGif>>();
function decodeCached(file: File) {
  let p = decodedCache.get(file);
  if (!p) {
    p = file.arrayBuffer().then(decodeGif);
    decodedCache.set(file, p);
    p.catch(() => decodedCache.delete(file));
  }
  return p;
}

export default function GifCompressor() {
  const [colors, setColors] = useState(128);
  const [frameStep, setFrameStep] = useState<1 | 2 | 3>(1);
  const [scale, setScale] = useState(100);
  const [tolerance, setTolerance] = useState(20);

  const process = useCallback(
    async (src: SourceInfo, isStale: () => boolean) => {
      const gif = await decodeCached(src.file);
      const out = await encodeGif(gif, { colors, frameStep, scale: scale / 100, tolerance }, undefined, isStale);
      const blob = new Blob([out.bytes as Uint8Array<ArrayBuffer>], { type: "image/gif" });
      const frames = gif.frames.length;
      return {
        blob,
        width: out.width,
        height: out.height,
        filename: `${baseName(src.name)}-komprimiert.gif`,
        note:
          frames === 1
            ? "Dieses GIF ist nicht animiert."
            : `${out.frameCount} von ${frames} Frames${blob.size >= src.file.size ? " · kaum Ersparnis – reduzieren Sie Farben, Frames oder Größe" : ""}`,
      };
    },
    [colors, frameStep, scale, tolerance],
  );

  return (
    <BatchTool
      accept=".gif,image/gif"
      acceptTypes={["gif"]}
      rejectMessage="Hier werden nur GIF-Dateien verarbeitet."
      maxFiles={20}
      dropTitle="GIF hier ablegen"
      dropFormats="Animierte GIFs · bis zu 20 Dateien"
      previewAlt="GIF komprimieren – animierte Vorschau des verkleinerten GIFs"
      settingsKey={JSON.stringify([colors, frameStep, scale, tolerance])}
      process={process}
      checker
      settings={
        <Panel title="GIF-Optimierung">
          <Segmented
            label="Farbanzahl"
            value={colors}
            onChange={setColors}
            columns={5}
            options={[256, 128, 64, 32, 16].map((c) => ({ value: c, label: String(c) }))}
          />
          <Segmented
            label="Frames"
            value={frameStep}
            onChange={setFrameStep}
            options={[
              { value: 1, label: "Alle" },
              { value: 2, label: "Jeden 2." },
              { value: 3, label: "Jeden 3." },
            ]}
          />
          <Slider label="Größe" value={scale} min={10} max={100} step={5} onChange={setScale} display={`${scale} %`} />
          <Slider
            label="Verlustbehaftete Optimierung"
            value={tolerance}
            min={0}
            max={100}
            step={5}
            onChange={setTolerance}
            hints={["aus (verlustfrei)", "stark"]}
          />
          <p className="text-xs leading-snug text-zinc-600">
            Beim Überspringen von Frames werden die Anzeigezeiten zusammengelegt – die Animation läuft gleich schnell.
          </p>
        </Panel>
      }
    />
  );
}
