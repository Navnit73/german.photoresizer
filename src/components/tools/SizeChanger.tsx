"use client";

import { useCallback, useState } from "react";
import { Link2, Link2Off } from "lucide-react";
import BatchTool, { type SourceInfo } from "./BatchTool";
import { NumberField, Panel, Segmented, Slider } from "./ui";
import { encodeCanvas, finishBlob, outputName, sourceFormat } from "@/lib/image/pipeline";
import { renderToBox, type FitMode, type Resampling } from "@/lib/image/resize";
import type { OutputFormat } from "@/lib/image/encode";

type Input = "pixels" | "percent";
type Pad = "#ffffff" | "#000000" | "transparent";

const PRESETS = [
  { w: 1920, h: 1080, l: "Full HD" },
  { w: 1280, h: 720, l: "HD" },
  { w: 1080, h: 1080, l: "Quadrat" },
  { w: 800, h: 600, l: "4:3" },
];

export default function SizeChanger() {
  const [input, setInput] = useState<Input>("pixels");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [lock, setLock] = useState(true);
  const [percent, setPercent] = useState(50);
  const [fit, setFit] = useState<FitMode>("cover");
  const [pad, setPad] = useState<Pad>("#ffffff");
  const [resampling, setResampling] = useState<Resampling>("smooth");
  const [format, setFormat] = useState<"keep" | OutputFormat>("keep");
  const [quality, setQuality] = useState(85);

  const process = useCallback(
    async (src: SourceInfo) => {
      const dec = await src.decode();
      const ow = dec.originalWidth;
      const oh = dec.originalHeight;
      let w: number;
      let h: number;
      let mode: FitMode = "stretch";
      if (input === "percent") {
        w = Math.round((ow * percent) / 100);
        h = Math.round((oh * percent) / 100);
      } else if (lock) {
        w = width;
        h = Math.round((width * oh) / ow);
      } else {
        w = width;
        h = height;
        mode = fit;
      }
      w = Math.max(1, Math.min(20000, w));
      h = Math.max(1, Math.min(20000, h));
      const outFormat: OutputFormat = format === "keep" ? sourceFormat(src.type) : format;
      const padColor = pad === "transparent" ? (outFormat === "jpeg" ? "#ffffff" : null) : pad;
      const canvas = renderToBox(dec.bitmap, dec.width, dec.height, w, h, mode, padColor, resampling);
      const data = await encodeCanvas(canvas, { format: outFormat, quality, pngMode: "lossless" });
      return { blob: finishBlob(data, outFormat, null, "strip"), width: w, height: h, filename: outputName(src.name, outFormat, `-${w}x${h}`) };
    },
    [input, width, height, lock, percent, fit, pad, resampling, format, quality],
  );

  return (
    <BatchTool
      accept="image/*,.heic,.heif"
      acceptTypes={["jpeg", "png", "webp", "gif", "heic"]}
      rejectMessage="Unterstützt werden JPG, PNG, WebP, GIF und HEIC."
      dropTitle="Bild hier ablegen"
      dropFormats="JPG, PNG, WebP, GIF, HEIC · auch mehrere Dateien"
      previewAlt="Bildgröße ändern – Vorschau mit neuen Pixelmaßen"
      settingsKey={JSON.stringify([input, width, height, lock, percent, fit, pad, resampling, format, quality])}
      process={process}
      compare={false}
      checker
      settings={
        <Panel title="Neue Bildgröße">
          <Segmented
            label="Angabe in"
            value={input}
            onChange={setInput}
            options={[
              { value: "pixels", label: "Pixel" },
              { value: "percent", label: "Prozent" },
            ]}
          />
          {input === "percent" ? (
            <Slider label="Skalierung" value={percent} min={1} max={400} onChange={setPercent} display={`${percent} %`} hints={["1 %", "400 %"]} />
          ) : (
            <>
              <div>
                <p className="mb-1.5 text-sm font-medium text-zinc-800">Vorlagen</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESETS.map((p) => {
                    const active = !lock && width === p.w && height === p.h;
                    return (
                      <button
                        key={p.l}
                        type="button"
                        onClick={() => {
                          setLock(false);
                          setWidth(p.w);
                          setHeight(p.h);
                        }}
                        className={`min-h-11 rounded-xl border px-2 text-left text-xs ${active ? "border-lime-700 bg-lime-50 ring-1 ring-lime-700" : "border-zinc-200 hover:bg-zinc-50"}`}
                      >
                        <span className="block font-mono font-semibold text-zinc-900">
                          {p.w} × {p.h}
                        </span>
                        <span className="text-zinc-600">{p.l}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <NumberField label="Breite" suffix="px" value={width} onChange={setWidth} max={20000} />
                </div>
                <button
                  type="button"
                  onClick={() => setLock(!lock)}
                  aria-pressed={lock}
                  aria-label={lock ? "Seitenverhältnis gesperrt" : "Seitenverhältnis frei"}
                  title={lock ? "Seitenverhältnis gesperrt" : "Seitenverhältnis frei"}
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${lock ? "border-lime-700 bg-lime-50 text-lime-800" : "border-zinc-300 text-zinc-600"}`}
                >
                  {lock ? <Link2 aria-hidden className="h-4 w-4" /> : <Link2Off aria-hidden className="h-4 w-4" />}
                </button>
                <div className="flex-1">
                  {lock ? (
                    <div>
                      <p className="mb-1 text-xs font-medium text-zinc-700">Höhe</p>
                      <p className="flex h-11 items-center rounded-xl border border-dashed border-zinc-300 px-3 text-xs text-zinc-600">proportional</p>
                    </div>
                  ) : (
                    <NumberField label="Höhe" suffix="px" value={height} onChange={setHeight} max={20000} />
                  )}
                </div>
              </div>
              {!lock && (
                <Segmented
                  label="Wenn das Seitenverhältnis abweicht"
                  value={fit}
                  onChange={setFit}
                  options={[
                    { value: "cover", label: "Zuschneiden", sub: "füllt den Rahmen" },
                    { value: "contain", label: "Einpassen", sub: "mit Rand" },
                    { value: "stretch", label: "Verzerren", sub: "dehnen" },
                  ]}
                />
              )}
              {!lock && fit === "contain" && (
                <Segmented
                  label="Randfarbe"
                  value={pad}
                  onChange={setPad}
                  options={[
                    { value: "#ffffff", label: "Weiß" },
                    { value: "#000000", label: "Schwarz" },
                    { value: "transparent", label: "Transparent" },
                  ]}
                />
              )}
            </>
          )}
          <Segmented
            label="Neuberechnung"
            value={resampling}
            onChange={setResampling}
            options={[
              { value: "smooth", label: "Glatt", sub: "hochwertig" },
              { value: "pixel", label: "Pixelgenau", sub: "Pixel-Art, Icons" },
            ]}
          />
          <Segmented
            label="Format"
            value={format}
            onChange={setFormat}
            columns={4}
            options={[
              { value: "keep", label: "Original" },
              { value: "jpeg", label: "JPG" },
              { value: "png", label: "PNG" },
              { value: "webp", label: "WebP" },
            ]}
          />
          {format !== "png" && <Slider label="Qualität (JPG/WebP)" value={quality} min={10} max={100} onChange={setQuality} />}
        </Panel>
      }
    />
  );
}
