"use client";

import { useCallback, useState } from "react";
import BatchTool, { type SourceInfo } from "./BatchTool";
import { DimensionFields, NumberField, Panel, Segmented, Slider, Toggle } from "./ui";
import { encodeCanvas, finishBlob, outputName, renderDecoded, sourceFormat } from "@/lib/image/pipeline";
import { encodeToTargetSize, readPixels, type OutputFormat } from "@/lib/image/encode";
import { fitLongEdge } from "@/lib/image/resize";
import { formatBytes } from "@/lib/image/files";

type Mode = "pixels" | "target";
type Sizing = "1920" | "1280" | "800" | "percent" | "custom";

export default function ImageResizer() {
  const [mode, setMode] = useState<Mode>("pixels");
  const [sizing, setSizing] = useState<Sizing>("1920");
  const [percent, setPercent] = useState(50);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [lock, setLock] = useState(true);
  const [lockBy, setLockBy] = useState<"width" | "height">("width");
  const [format, setFormat] = useState<"keep" | OutputFormat>("keep");
  const [target, setTarget] = useState(500);
  const [unit, setUnit] = useState<"KB" | "MB">("KB");
  const [targetFormat, setTargetFormat] = useState<"jpeg" | "webp">("jpeg");
  const [stripMeta, setStripMeta] = useState(true);

  const process = useCallback(
    async (src: SourceInfo) => {
      const dec = await src.decode();
      const exif = await src.exif();
      const meta = stripMeta ? "strip" : "keep";

      if (mode === "target") {
        const bytes = Math.round(target * (unit === "MB" ? 1024 * 1024 : 1024));
        const res = await encodeToTargetSize(
          (s) => readPixels(renderDecoded(dec, Math.max(1, Math.round(dec.width * s)), Math.max(1, Math.round(dec.height * s)))),
          targetFormat,
          bytes,
          { progressive: true },
        );
        return {
          blob: finishBlob(res.data, targetFormat, exif, meta),
          width: res.img.width,
          height: res.img.height,
          filename: outputName(src.name, targetFormat),
          note: res.reachedTarget ? undefined : `Zielgröße ${formatBytes(bytes)} nicht ganz erreicht – kleinstmögliches Ergebnis.`,
        };
      }

      let w = dec.width;
      let h = dec.height;
      // Sizes refer to the original dimensions (before any pixel-budget downscale).
      const ow = dec.originalWidth;
      const oh = dec.originalHeight;
      if (sizing === "percent") {
        w = Math.round((ow * percent) / 100);
        h = Math.round((oh * percent) / 100);
      } else if (sizing === "custom") {
        if (lock && lockBy === "height") {
          h = height;
          w = Math.round((height * ow) / oh);
        } else if (lock) {
          w = width;
          h = Math.round((width * oh) / ow);
        } else {
          w = width;
          h = height;
        }
      } else {
        ({ width: w, height: h } = fitLongEdge(ow, oh, Number(sizing)));
      }
      w = Math.max(1, w);
      h = Math.max(1, h);
      const outFormat: OutputFormat = format === "keep" ? sourceFormat(src.type) : format;
      const data = await encodeCanvas(renderDecoded(dec, w, h), { format: outFormat, quality: 82, pngMode: "lossless" });
      return { blob: finishBlob(data, outFormat, exif, meta), width: w, height: h, filename: outputName(src.name, outFormat) };
    },
    [mode, sizing, percent, width, height, lock, lockBy, format, target, unit, targetFormat, stripMeta],
  );

  return (
    <BatchTool
      accept="image/*,.heic,.heif"
      acceptTypes={["jpeg", "png", "webp", "gif", "heic"]}
      rejectMessage="Unterstützt werden JPG, PNG, WebP, GIF und HEIC."
      dropTitle="Bilder zum Verkleinern hier ablegen"
      dropFormats="JPG, PNG, WebP, GIF, HEIC · bis zu 50 Dateien"
      previewAlt="Bild verkleinern – Vorschau des verkleinerten Fotos"
      settingsKey={JSON.stringify([mode, sizing, percent, width, height, lock, lockBy, format, target, unit, targetFormat, stripMeta])}
      process={process}
      gpsWarning={!stripMeta}
      settings={
        <Panel title="Verkleinern">
          <Segmented
            label="Was möchten Sie verkleinern?"
            value={mode}
            onChange={setMode}
            options={[
              { value: "pixels", label: "Pixelmaße", sub: "Breite × Höhe" },
              { value: "target", label: "Zielgröße", sub: "KB oder MB" },
            ]}
          />
          {mode === "pixels" ? (
            <>
              <Segmented
                label="Längste Seite"
                value={sizing}
                onChange={setSizing}
                columns={3}
                options={[
                  { value: "1920", label: "1920 px", sub: "Full HD" },
                  { value: "1280", label: "1280 px", sub: "Web" },
                  { value: "800", label: "800 px", sub: "E-Mail" },
                  { value: "percent", label: "Prozent" },
                  { value: "custom", label: "Eigene Maße" },
                ]}
              />
              {sizing !== "percent" && sizing !== "custom" && (
                <p className="text-xs text-zinc-600">Kleinere Bilder bleiben unverändert – es wird nie vergrößert.</p>
              )}
              {sizing === "percent" && <Slider label="Skalierung" value={percent} min={5} max={100} onChange={setPercent} display={`${percent} %`} />}
              {sizing === "custom" && (
                <DimensionFields
                  width={width}
                  height={height}
                  lock={lock}
                  lockBy={lockBy}
                  onWidth={(v) => {
                    setWidth(v);
                    setLockBy("width");
                  }}
                  onHeight={(v) => {
                    setHeight(v);
                    setLockBy("height");
                  }}
                  onLock={setLock}
                  onLockBy={setLockBy}
                />
              )}
              <Segmented
                label="Ausgabeformat"
                value={format}
                onChange={setFormat}
                options={[
                  { value: "keep", label: "Original" },
                  { value: "jpeg", label: "JPG" },
                  { value: "webp", label: "WebP" },
                ]}
              />
            </>
          ) : (
            <>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <NumberField label="Maximale Dateigröße" value={target} onChange={setTarget} min={unit === "KB" ? 10 : 0.1} max={unit === "KB" ? 50000 : 50} step={unit === "KB" ? 10 : 0.1} />
                </div>
                <div className="w-32">
                  <Segmented label="Einheit" value={unit} onChange={(u) => { setUnit(u); setTarget(u === "MB" ? 1 : 500); }} options={[{ value: "KB", label: "KB" }, { value: "MB", label: "MB" }]} />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { v: 100, u: "KB" as const },
                  { v: 200, u: "KB" as const },
                  { v: 500, u: "KB" as const },
                  { v: 1, u: "MB" as const },
                  { v: 2, u: "MB" as const },
                ].map((p) => (
                  <button
                    key={`${p.v}${p.u}`}
                    type="button"
                    onClick={() => {
                      setUnit(p.u);
                      setTarget(p.v);
                    }}
                    className={`min-h-9 rounded-lg border px-3 text-xs font-medium ${target === p.v && unit === p.u ? "border-lime-700 bg-lime-50 text-lime-900" : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`}
                  >
                    {p.v} {p.u}
                  </button>
                ))}
              </div>
              <Segmented
                label="Ausgabeformat"
                value={targetFormat}
                onChange={setTargetFormat}
                options={[
                  { value: "jpeg", label: "JPG" },
                  { value: "webp", label: "WebP" },
                ]}
              />
              <p className="text-xs text-zinc-600">Reicht die Qualitätsstufe nicht, werden zusätzlich die Pixelmaße reduziert.</p>
            </>
          )}
          <Toggle label="Metadaten entfernen" checked={stripMeta} onChange={setStripMeta} description="Entfernt EXIF-Daten wie Aufnahmeort (GPS) – nur bei JPG-Ausgabe relevant." />
        </Panel>
      }
    />
  );
}
