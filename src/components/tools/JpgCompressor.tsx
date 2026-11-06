"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import BatchTool, { type SourceInfo } from "./BatchTool";
import { Panel, Segmented, Slider, Toggle } from "./ui";
import { encodeCanvas, finishBlob, outputName, renderDecoded } from "@/lib/image/pipeline";

export default function JpgCompressor() {
  const [quality, setQuality] = useState(75);
  const [progressive, setProgressive] = useState(true);
  const [chroma, setChroma] = useState<"420" | "444">("420");
  const [stripMeta, setStripMeta] = useState(true);

  const process = useCallback(
    async (src: SourceInfo) => {
      const dec = await src.decode();
      const data = await encodeCanvas(renderDecoded(dec), { format: "jpeg", quality, progressive, chroma });
      const exif = await src.exif();
      const ext = /\.jpeg$/i.test(src.name) ? "jpeg" : "jpg";
      const blob = finishBlob(data, "jpeg", exif, stripMeta ? "strip" : "keep");
      // Never hand back a larger file – unless metadata must be removed for privacy.
      if (blob.size >= src.file.size && (!stripMeta || !exif)) {
        return {
          blob: src.file,
          width: dec.originalWidth,
          height: dec.originalHeight,
          filename: src.name,
          note: "Bereits gut komprimiert – das Original ist kleiner und wird beibehalten.",
        };
      }
      return {
        blob,
        width: dec.width,
        height: dec.height,
        filename: outputName(src.name, "jpeg").replace(/\.jpg$/, `.${ext}`),
      };
    },
    [quality, progressive, chroma, stripMeta],
  );

  return (
    <BatchTool
      accept=".jpg,.jpeg,image/jpeg"
      acceptTypes={["jpeg"]}
      rejectMessage={
        <>
          Dieses Tool verarbeitet nur JPG/JPEG. Für PNG, WebP oder GIF nutzen Sie{" "}
          <Link href="/bilder-komprimieren/" className="font-semibold underline">
            Bilder komprimieren
          </Link>
          .
        </>
      }
      dropTitle="JPG-Dateien hier ablegen"
      dropFormats="JPG und JPEG · bis zu 50 Dateien"
      previewAlt="JPG komprimieren – Vorher-nachher-Vergleich des Fotos"
      settingsKey={JSON.stringify([quality, progressive, chroma, stripMeta])}
      process={process}
      gpsWarning={!stripMeta}
      settings={
        <Panel title="JPEG-Einstellungen">
          <Slider
            label="Qualitätsstufe"
            value={quality}
            min={10}
            max={100}
            onChange={setQuality}
            hints={["kleinere Datei", "höhere Qualität"]}
          />
          <div className="flex flex-wrap gap-1.5">
            {[
              { q: 60, l: "Messenger" },
              { q: 75, l: "Web" },
              { q: 90, l: "Druck" },
            ].map((p) => (
              <button
                key={p.q}
                type="button"
                onClick={() => setQuality(p.q)}
                className={`min-h-9 rounded-lg border px-3 text-xs font-medium ${quality === p.q ? "border-lime-700 bg-lime-50 text-lime-900" : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`}
              >
                {p.l} · {p.q}
              </button>
            ))}
          </div>
          <Toggle label="Progressives JPG" checked={progressive} onChange={setProgressive} description="Baut sich beim Laden schrittweise auf, oft etwas kleiner." />
          <Segmented
            label="Farbunterabtastung"
            value={chroma}
            onChange={setChroma}
            options={[
              { value: "420", label: "4:2:0", sub: "kleiner, für Fotos" },
              { value: "444", label: "4:4:4", sub: "für Grafiken" },
            ]}
          />
          <Toggle
            label="Metadaten (EXIF) entfernen"
            checked={stripMeta}
            onChange={setStripMeta}
            description={stripMeta ? "Kamera, Aufnahmezeit und GPS-Standort werden entfernt." : "EXIF bleibt erhalten – inklusive eventueller GPS-Daten."}
          />
        </Panel>
      }
    />
  );
}
