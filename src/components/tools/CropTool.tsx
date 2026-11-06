"use client";

import { errorCode, track } from "@/lib/track";
import { useMemo, useState } from "react";
import { Download, FlipHorizontal2, FlipVertical2, Loader2, RotateCcw, RotateCw, ScanLine, Undo2, ImagePlus } from "lucide-react";
import CropStage from "./CropStage";
import { useSingleImage } from "./useSingleImage";
import { Dropzone, ErrorBanner, NumberField, Panel, Segmented, Slider, Toggle, btnIcon, btnPrimary, btnSecondary } from "./ui";
import { IDENTITY, clampRect, detectBorders, fitRatio, orientedSize, renderCrop, safeRect, type Rect, type Transform } from "@/lib/image/transform";
import { encodeCanvas, finishBlob, outputName, sourceFormat } from "@/lib/image/pipeline";
import { formatBytes, saveBlob } from "@/lib/image/files";
import type { OutputFormat } from "@/lib/image/encode";

const RATIOS: { key: string; label: string; value: number | "orig" | null }[] = [
  { key: "free", label: "Frei", value: null },
  { key: "orig", label: "Original", value: "orig" },
  { key: "1:1", label: "1:1", value: 1 },
  { key: "4:5", label: "4:5", value: 4 / 5 },
  { key: "4:3", label: "4:3", value: 4 / 3 },
  { key: "3:2", label: "3:2", value: 3 / 2 },
  { key: "16:9", label: "16:9", value: 16 / 9 },
  { key: "9:16", label: "9:16", value: 9 / 16 },
];

function shrinkInto(r: Rect, b: Rect): Rect {
  const s = Math.min(1, b.w / r.w, b.h / r.h);
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  return clampRect({ x: cx - (r.w * s) / 2, y: cy - (r.h * s) / 2, w: r.w * s, h: r.h * s }, b);
}

export default function CropTool() {
  const { image, loading, error, setError, load, reset } = useSingleImage(
    ["jpeg", "png", "webp", "gif", "heic", "avif", "bmp"],
    "Bitte wählen Sie ein Bild im Format JPG, PNG, WebP, GIF oder HEIC.",
  );
  const [t, setT] = useState<Transform>(IDENTITY);
  const [crop, setCrop] = useState<Rect>({ x: 0, y: 0, w: 1, h: 1 });
  const [ratioKey, setRatioKey] = useState("free");
  const [grid, setGrid] = useState(true);
  const [unit, setUnit] = useState<"px" | "cm">("px");
  const [dpi, setDpi] = useState(300);
  const [format, setFormat] = useState<"keep" | OutputFormat>("keep");
  const [exporting, setExporting] = useState(false);
  const [lastSize, setLastSize] = useState<number | null>(null);
  const [trimMsg, setTrimMsg] = useState<string | null>(null);

  // Reset the crop whenever a new image arrives (adjusting state during render).
  const [seenImage, setSeenImage] = useState<typeof image>(null);
  if (image !== seenImage) {
    setSeenImage(image);
    if (image) {
      setT(IDENTITY);
      setCrop({ x: 0, y: 0, w: image.width, h: image.height });
      setRatioKey("free");
      setLastSize(null);
      setTrimMsg(null);
    }
  }

  const dims = image ? orientedSize(image.width, image.height, t) : { W: 1, H: 1 };
  const bounds = safeRect(dims.W, dims.H, t.straighten);
  const ratio = useMemo(() => {
    const r = RATIOS.find((x) => x.key === ratioKey)?.value ?? null;
    return r === "orig" ? dims.W / dims.H : r;
  }, [ratioKey, dims.W, dims.H]);

  // Downscale factor if the photo exceeded the pixel budget (crop is in decoded px).
  const scaleToOriginal = image ? image.originalWidth / image.width : 1;

  const chooseRatio = (key: string) => {
    setRatioKey(key);
    const r = RATIOS.find((x) => x.key === key)?.value ?? null;
    const value = r === "orig" ? dims.W / dims.H : r;
    if (value) setCrop(fitRatio(value, bounds, { x: crop.x + crop.w / 2, y: crop.y + crop.h / 2 }));
  };

  const rotate = (dir: 1 | -1) => {
    if (!image) return;
    const next = (((t.rotate90 + dir * 90) % 360) + 360) % 360 as Transform["rotate90"];
    const nt = { ...t, rotate90: next };
    const d = orientedSize(image.width, image.height, nt);
    const b = safeRect(d.W, d.H, nt.straighten);
    setT(nt);
    setCrop(ratio && ratioKey !== "orig" ? fitRatio(ratio, b) : b);
  };

  const straighten = (deg: number) => {
    const nt = { ...t, straighten: deg };
    setT(nt);
    const b = safeRect(dims.W, dims.H, deg);
    setCrop((c) => shrinkInto(c, b));
  };

  const autoTrim = () => {
    if (!image) return;
    const r = detectBorders(image.bitmap, image.width, image.height, { ...t, straighten: 0 });
    if (!r) {
      setTrimMsg("Keine einfarbigen Ränder gefunden.");
      return;
    }
    setT({ ...t, straighten: 0 });
    setRatioKey("free");
    setCrop(r);
    setTrimMsg(`Ränder entfernt: ${Math.round(r.w * scaleToOriginal)} × ${Math.round(r.h * scaleToOriginal)} px.`);
  };

  const toUnit = (px: number) => (unit === "px" ? Math.round(px * scaleToOriginal) : Math.round(((px * scaleToOriginal) / dpi) * 2.54 * 10) / 10);
  const fromUnit = (v: number) => (unit === "px" ? v : (v / 2.54) * dpi) / scaleToOriginal;
  const setExact = (w: number, h: number) => {
    setRatioKey("free");
    const cx = crop.x + crop.w / 2;
    const cy = crop.y + crop.h / 2;
    setCrop(clampRect({ x: cx - w / 2, y: cy - h / 2, w, h }, bounds));
  };

  const outFormat: OutputFormat = format === "keep" ? sourceFormat(image?.type ?? "jpeg") : format;

  const download = async () => {
    if (!image) return;
    setExporting(true);
    try {
      const canvas = renderCrop(image.bitmap, image.width, image.height, t, crop);
      const data = await encodeCanvas(canvas, { format: outFormat, quality: outFormat === "webp" ? 90 : 92, pngMode: "lossless" });
      const blob = finishBlob(data, outFormat, null, "strip");
      setLastSize(blob.size);
      saveBlob(blob, outputName(image.file.name, outFormat, "-zugeschnitten"));
      track("download", { kind: "single", format: outFormat });
    } catch (e) {
      track("error", { code: errorCode(e) });
      setError(e instanceof Error ? e.message : "Export fehlgeschlagen.");
    } finally {
      setExporting(false);
    }
  };

  if (!image) {
    return (
      <div>
        {loading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-zinc-700">
            <Loader2 aria-hidden className="mr-2 h-5 w-5 animate-spin text-lime-700" /> Bild wird geöffnet …
          </div>
        ) : (
          <Dropzone onFiles={(f) => load(f[0])} accept="image/*,.heic,.heif" multiple={false} title="Bild zum Zuschneiden hier ablegen" formats="JPG, PNG, WebP, GIF oder HEIC" />
        )}
        {error && (
          <div className="mt-3">
            <ErrorBanner onClose={() => setError(null)}>{error}</ErrorBanner>
          </div>
        )}
      </div>
    );
  }

  const cropOrigW = Math.round(crop.w * scaleToOriginal);
  const cropOrigH = Math.round(crop.h * scaleToOriginal);

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={btnIcon} onClick={() => rotate(-1)} aria-label="90° nach links drehen" title="90° nach links">
              <RotateCcw aria-hidden className="h-4 w-4" />
            </button>
            <button type="button" className={btnIcon} onClick={() => rotate(1)} aria-label="90° nach rechts drehen" title="90° nach rechts">
              <RotateCw aria-hidden className="h-4 w-4" />
            </button>
            <button type="button" className={`${btnIcon} ${t.flipX ? "border-lime-700 bg-lime-50 text-lime-800" : ""}`} onClick={() => setT({ ...t, flipX: !t.flipX })} aria-pressed={t.flipX} aria-label="Horizontal spiegeln" title="Horizontal spiegeln">
              <FlipHorizontal2 aria-hidden className="h-4 w-4" />
            </button>
            <button type="button" className={`${btnIcon} ${t.flipY ? "border-lime-700 bg-lime-50 text-lime-800" : ""}`} onClick={() => setT({ ...t, flipY: !t.flipY })} aria-pressed={t.flipY} aria-label="Vertikal spiegeln" title="Vertikal spiegeln">
              <FlipVertical2 aria-hidden className="h-4 w-4" />
            </button>
            <button type="button" className={btnSecondary} onClick={autoTrim}>
              <ScanLine aria-hidden className="h-4 w-4" /> Ränder entfernen
            </button>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                className={btnIcon}
                onClick={() => {
                  setT(IDENTITY);
                  setRatioKey("free");
                  setCrop({ x: 0, y: 0, w: image.width, h: image.height });
                }}
                aria-label="Alle Änderungen zurücksetzen"
                title="Zurücksetzen"
              >
                <Undo2 aria-hidden className="h-4 w-4" />
              </button>
              <button type="button" className={btnIcon} onClick={reset} aria-label="Anderes Bild wählen" title="Anderes Bild">
                <ImagePlus aria-hidden className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="rounded-xl bg-zinc-100 p-3 sm:p-5">
            <CropStage source={image.bitmap} width={image.width} height={image.height} transform={t} crop={crop} onCrop={setCrop} ratio={ratio} grid={grid} />
          </div>
          <p className="text-center text-sm text-zinc-700">
            Ausschnitt: <span className="font-mono font-semibold text-zinc-950">{cropOrigW} × {cropOrigH} px</span>
            <span className="text-zinc-500"> · bei {dpi} dpi {((cropOrigW / dpi) * 2.54).toLocaleString("de-DE", { maximumFractionDigits: 1 })} × {((cropOrigH / dpi) * 2.54).toLocaleString("de-DE", { maximumFractionDigits: 1 })} cm</span>
          </p>
          {trimMsg && <p className="text-center text-xs text-zinc-600">{trimMsg}</p>}
          {image.downscaled && <p className="text-center text-xs text-amber-700">Das Foto war für diesen Browser zu groß und wurde vorab proportional verkleinert.</p>}
          {error && <ErrorBanner onClose={() => setError(null)}>{error}</ErrorBanner>}
        </div>

        <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <Panel title="Zuschnitt">
            <Segmented label="Seitenverhältnis" value={ratioKey} onChange={chooseRatio} columns={4} options={RATIOS.map((r) => ({ value: r.key, label: r.label }))} />
            <Slider label="Gerade ausrichten" value={t.straighten} min={-45} max={45} step={0.5} onChange={straighten} display={`${t.straighten.toLocaleString("de-DE")}°`} hints={["−45°", "+45°"]} />
            <Toggle label="Drittel-Raster anzeigen" checked={grid} onChange={setGrid} />
          </Panel>
          <Panel title="Exakte Größe">
            <Segmented label="Einheit" value={unit} onChange={setUnit} options={[{ value: "px", label: "Pixel" }, { value: "cm", label: "Zentimeter" }]} />
            <div className="grid grid-cols-2 gap-2">
              <NumberField
                label="Breite"
                suffix={unit}
                value={toUnit(crop.w)}
                step={unit === "px" ? 1 : 0.1}
                min={unit === "px" ? 16 : 0.1}
                max={unit === "px" ? 50000 : 500}
                onChange={(v) => setExact(fromUnit(v), crop.h)}
              />
              <NumberField
                label="Höhe"
                suffix={unit}
                value={toUnit(crop.h)}
                step={unit === "px" ? 1 : 0.1}
                min={unit === "px" ? 16 : 0.1}
                max={unit === "px" ? 50000 : 500}
                onChange={(v) => setExact(crop.w, fromUnit(v))}
              />
            </div>
            {unit === "cm" && <NumberField label="Auflösung" suffix="dpi" value={dpi} min={72} max={1200} onChange={setDpi} />}
          </Panel>
          <div className="space-y-3 border-t border-zinc-200 pt-4">
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
            <button type="button" className={`${btnPrimary} w-full`} onClick={download} disabled={exporting}>
              {exporting ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Download aria-hidden className="h-4 w-4" />}
              Zugeschnittenes Bild speichern
            </button>
            {lastSize !== null && <p className="text-center text-xs text-zinc-600">Gespeichert: {formatBytes(lastSize)}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
