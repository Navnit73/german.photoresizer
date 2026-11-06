"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import BatchTool, { type SourceInfo } from "./BatchTool";
import { Panel, Segmented, Slider } from "./ui";
import { encodeCanvas, finishBlob, outputName, renderDecoded } from "@/lib/image/pipeline";

export default function PngCompressor() {
  const [mode, setMode] = useState<"palette" | "lossless">("palette");
  const [colors, setColors] = useState(256);

  const process = useCallback(
    async (src: SourceInfo) => {
      const dec = await src.decode();
      const data = await encodeCanvas(renderDecoded(dec), { format: "png", quality: 100, pngMode: mode, colors });
      const blob = finishBlob(data, "png", null, "strip");
      const saved = 1 - blob.size / src.file.size;
      if (blob.size >= src.file.size) {
        return {
          blob: src.file,
          width: dec.width,
          height: dec.height,
          filename: src.name,
          note: "Bereits optimal – kleiner wird es nur mit Farbreduzierung oder als WebP/JPG.",
        };
      }
      return {
        blob,
        width: dec.width,
        height: dec.height,
        filename: outputName(src.name, "png"),
        note: saved < 0.1 ? "Geringe Ersparnis – für Fotos ist WebP oder JPG meist deutlich kleiner." : undefined,
      };
    },
    [mode, colors],
  );

  return (
    <BatchTool
      accept=".png,image/png"
      acceptTypes={["png"]}
      rejectMessage={
        <>
          Hier werden nur PNG-Dateien optimiert. Für JPG, WebP und GIF nutzen Sie{" "}
          <Link href="/bilder-komprimieren/" className="font-semibold underline">
            Bilder komprimieren
          </Link>
          .
        </>
      }
      dropTitle="PNG-Dateien hier ablegen"
      dropFormats="PNG mit oder ohne Transparenz · bis zu 50 Dateien"
      previewAlt="PNG komprimieren – Vorher-nachher-Vergleich mit Transparenz"
      settingsKey={JSON.stringify([mode, colors])}
      process={process}
      checker
      settings={
        <Panel title="PNG-Optimierung">
          <Segmented
            label="Modus"
            value={mode}
            onChange={setMode}
            options={[
              { value: "palette", label: "Farbreduzierung", sub: "deutlich kleiner" },
              { value: "lossless", label: "Verlustfrei", sub: "pixelgenau" },
            ]}
          />
          {mode === "palette" && (
            <>
              <Slider label="Anzahl Farben" value={colors} min={2} max={256} onChange={setColors} hints={["2", "256"]} />
              <div className="flex flex-wrap gap-1.5">
                {[256, 128, 64, 32, 16].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColors(c)}
                    className={`min-h-9 rounded-lg border px-3 text-xs font-medium ${colors === c ? "border-lime-700 bg-lime-50 text-lime-900" : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}
          <p className="text-xs leading-snug text-zinc-600">
            {mode === "palette"
              ? "Speichert eine Palette (wie PNG-8). Bei Verläufen und sehr wenigen Farben können Stufen sichtbar werden."
              : "OxiPNG optimiert Filter und Kompression. Alle Pixel bleiben identisch."}{" "}
            Transparenz bleibt in beiden Modi erhalten.
          </p>
        </Panel>
      }
    />
  );
}
