"use client";

import { useCallback, useState } from "react";
import BatchTool, { type SourceInfo } from "./BatchTool";
import { Panel, Segmented, Slider } from "./ui";
import { encodeCanvas, finishBlob, outputName, renderDecoded, sourceFormat } from "@/lib/image/pipeline";
import { gifInWorker } from "@/lib/image/workerClient";

type Preset = "strong" | "balanced" | "high";
const PRESET_QUALITY: Record<Preset, number> = { strong: 55, balanced: 75, high: 88 };
const PRESET_GIF: Record<Preset, { colors: number; tolerance: number }> = {
  strong: { colors: 64, tolerance: 40 },
  balanced: { colors: 128, tolerance: 15 },
  high: { colors: 256, tolerance: 0 },
};

export default function ImageCompressor() {
  const [preset, setPreset] = useState<Preset>("balanced");
  const [quality, setQuality] = useState(PRESET_QUALITY.balanced);
  const [pngMode, setPngMode] = useState<"lossless" | "palette">("palette");

  const choosePreset = (p: Preset) => {
    setPreset(p);
    setQuality(PRESET_QUALITY[p]);
  };

  const process = useCallback(
    async (src: SourceInfo, isStale: () => boolean) => {
      let blob: Blob;
      let width: number;
      let height: number;
      const exif = await src.exif();

      if (src.type === "gif") {
        const g = PRESET_GIF[preset];
        const out = await gifInWorker(src.file, { colors: g.colors, tolerance: g.tolerance, frameStep: 1, scale: 1 }, isStale);
        blob = new Blob([out.bytes as Uint8Array<ArrayBuffer>], { type: "image/gif" });
        width = out.width;
        height = out.height;
      } else {
        const dec = await src.decode();
        const format = sourceFormat(src.type);
        const data = await encodeCanvas(renderDecoded(dec), {
          format,
          quality,
          pngMode,
          colors: preset === "strong" ? 128 : 256,
        });
        blob = finishBlob(data, format, null, "strip");
        width = dec.width;
        height = dec.height;
      }
      if (blob.size >= src.file.size && !exif) {
        return { blob: src.file, width, height, filename: src.name, note: "Bereits gut komprimiert – das Original ist kleiner und wird beibehalten." };
      }
      const format = src.type === "gif" ? null : sourceFormat(src.type);
      return { blob, width, height, filename: format ? outputName(src.name, format) : src.name };
    },
    [preset, quality, pngMode],
  );

  return (
    <BatchTool
      accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
      acceptTypes={["jpeg", "png", "webp", "gif"]}
      rejectMessage="Unterstützt werden JPG, PNG, WebP und GIF. HEIC-Fotos wandeln Sie zuerst in JPG um."
      dropTitle="Bilder hier ablegen"
      dropFormats="JPG, PNG, WebP und GIF · bis zu 50 Dateien"
      previewAlt="Bilder komprimieren – Vorher-nachher-Vergleich"
      settingsKey={JSON.stringify([preset, quality, pngMode])}
      process={process}
      checker
      settings={
        <Panel title="Komprimierung">
          <Segmented
            label="Stufe"
            value={preset}
            onChange={choosePreset}
            options={[
              { value: "strong", label: "Stark", sub: "kleinste Datei" },
              { value: "balanced", label: "Ausgewogen", sub: "empfohlen" },
              { value: "high", label: "Hohe Qualität", sub: "wenig Ersparnis" },
            ]}
          />
          <Slider label="Qualität für JPG und WebP" value={quality} min={10} max={100} onChange={setQuality} hints={["kleiner", "besser"]} />
          <Segmented
            label="PNG-Methode"
            value={pngMode}
            onChange={setPngMode}
            options={[
              { value: "palette", label: "Farbreduzierung", sub: "deutlich kleiner" },
              { value: "lossless", label: "Verlustfrei", sub: "pixelgenau" },
            ]}
          />
          <p className="text-xs leading-snug text-zinc-600">
            Format und Pixelmaße bleiben erhalten. Metadaten wie GPS-Standort werden entfernt. GIF-Animationen bleiben vollständig erhalten.
          </p>
        </Panel>
      }
    />
  );
}
