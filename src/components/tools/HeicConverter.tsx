"use client";

import { useCallback, useState } from "react";
import BatchTool, { type SourceInfo } from "./BatchTool";
import { Panel, Segmented, Slider } from "./ui";
import { encodeCanvas, finishBlob, outputName, renderDecoded, type MetadataMode } from "@/lib/image/pipeline";

export default function HeicConverter() {
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [quality, setQuality] = useState(90);
  const [meta, setMeta] = useState<MetadataMode>("keep");

  const process = useCallback(
    async (src: SourceInfo) => {
      const dec = await src.decode();
      const data = await encodeCanvas(renderDecoded(dec), { format, quality, pngMode: "lossless" });
      const exif = format === "jpeg" ? await src.exif() : null;
      return { blob: finishBlob(data, format, exif, meta), width: dec.width, height: dec.height, filename: outputName(src.name, format) };
    },
    [format, quality, meta],
  );

  return (
    <BatchTool
      accept=".heic,.heif,image/heic,image/heif"
      acceptTypes={["heic"]}
      rejectMessage="Hier werden nur HEIC- und HEIF-Dateien umgewandelt. Andere Formate können Sie direkt weiterverwenden."
      dropTitle="HEIC-Fotos hier ablegen"
      dropFormats="HEIC und HEIF vom iPhone/iPad · bis zu 50 Dateien"
      previewAlt="HEIC in JPG umwandeln – Vorschau des konvertierten iPhone-Fotos"
      settingsKey={JSON.stringify([format, quality, meta])}
      process={process}
      compare={false}
      gpsWarning={format === "jpeg" && meta === "keep"}
      settings={
        <Panel title="Umwandlung">
          <Segmented
            label="Zielformat"
            value={format}
            onChange={setFormat}
            options={[
              { value: "jpeg", label: "JPG", sub: "empfohlen" },
              { value: "png", label: "PNG", sub: "verlustfrei, groß" },
            ]}
          />
          {format === "jpeg" && <Slider label="JPG-Qualität" value={quality} min={50} max={100} onChange={setQuality} hints={["kleiner", "besser"]} />}
          {format === "jpeg" ? (
            <Segmented
              label="Metadaten (Aufnahmedatum, Kamera, Ort)"
              value={meta}
              onChange={setMeta}
              columns={3}
              options={[
                { value: "keep", label: "Alle behalten" },
                { value: "keep-no-gps", label: "Ohne Standort" },
                { value: "strip", label: "Alle entfernen" },
              ]}
            />
          ) : (
            <p className="text-xs text-zinc-600">PNG-Dateien werden ohne EXIF-Metadaten gespeichert.</p>
          )}
          <p className="text-xs leading-snug text-zinc-600">
            Der HEIC-Decoder (libheif) wird beim ersten Bild einmalig geladen (ca. 3 MB). Ihre Fotos bleiben auf Ihrem Gerät.
          </p>
        </Panel>
      }
    />
  );
}
