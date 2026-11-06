"use client";

import { errorCode, track } from "@/lib/track";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Crop as CropIcon,
  Download,
  FlipHorizontal2,
  FlipVertical2,
  ImagePlus,
  Link2,
  Link2Off,
  Loader2,
  RotateCcw,
  RotateCw,
  SlidersHorizontal,
  Undo2,
  FileDown,
} from "lucide-react";
import CropStage from "./tools/CropStage";
import { useSingleImage } from "./tools/useSingleImage";
import { Dropzone, ErrorBanner, NumberField, Segmented, Slider, Toggle, btnIcon, btnPrimary, btnSecondary } from "./tools/ui";
import { IDENTITY, clampRect, fitRatio, orientedSize, renderCrop, safeRect, type Rect, type Transform } from "@/lib/image/transform";
import { NEUTRAL, cssFilter, isNeutral, type Adjustments } from "@/lib/image/filters";
import { encodePixels, readPixels, MIME, type OutputFormat } from "@/lib/image/encode";
import { formatBytes, saveBlob, savingPercent } from "@/lib/image/files";
import { outputName, sourceFormat } from "@/lib/image/pipeline";

type Tab = "crop" | "rotate" | "adjust" | "export";

const TABS: { id: Tab; label: string; icon: typeof CropIcon }[] = [
  { id: "crop", label: "Zuschneiden", icon: CropIcon },
  { id: "rotate", label: "Drehen", icon: RotateCw },
  { id: "adjust", label: "Anpassen", icon: SlidersHorizontal },
  { id: "export", label: "Größe & Export", icon: FileDown },
];

const RATIOS: { key: string; label: string; value: number | "orig" | null }[] = [
  { key: "free", label: "Frei", value: null },
  { key: "orig", label: "Original", value: "orig" },
  { key: "1:1", label: "1:1", value: 1 },
  { key: "4:5", label: "4:5", value: 4 / 5 },
  { key: "4:3", label: "4:3", value: 4 / 3 },
  { key: "16:9", label: "16:9", value: 16 / 9 },
  { key: "9:16", label: "9:16", value: 9 / 16 },
  { key: "3:2", label: "3:2", value: 3 / 2 },
];

const LOOKS: { key: string; label: string; a: Adjustments }[] = [
  { key: "none", label: "Original", a: NEUTRAL },
  { key: "bw", label: "Schwarz-Weiß", a: { ...NEUTRAL, grayscale: 1, contrast: 1.1 } },
  { key: "sepia", label: "Sepia", a: { ...NEUTRAL, sepia: 0.85 } },
  { key: "vintage", label: "Vintage", a: { ...NEUTRAL, sepia: 0.35, saturate: 0.8, contrast: 0.92, brightness: 1.05 } },
  { key: "vivid", label: "Kräftig", a: { ...NEUTRAL, saturate: 1.35, contrast: 1.1 } },
  { key: "invert", label: "Negativ", a: { ...NEUTRAL, invert: 1 } },
];

function shrinkInto(r: Rect, b: Rect): Rect {
  const s = Math.min(1, b.w / r.w, b.h / r.h);
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  return clampRect({ x: cx - (r.w * s) / 2, y: cy - (r.h * s) / 2, w: r.w * s, h: r.h * s }, b);
}

export default function PhotoEditor() {
  const { image, loading, error, setError, load, reset } = useSingleImage(
    ["jpeg", "png", "webp", "gif", "heic", "avif", "bmp"],
    "Bitte wählen Sie ein Bild im Format JPG, PNG, WebP, GIF oder HEIC.",
  );
  const [tab, setTab] = useState<Tab>("crop");
  const [t, setT] = useState<Transform>(IDENTITY);
  const [crop, setCrop] = useState<Rect>({ x: 0, y: 0, w: 1, h: 1 });
  const [ratioKey, setRatioKey] = useState("free");
  const [adj, setAdj] = useState<Adjustments>(NEUTRAL);
  const [look, setLook] = useState("none");
  const [outW, setOutW] = useState(0);
  const [lockSize, setLockSize] = useState(true);
  const [outH, setOutH] = useState(0);
  const [customSize, setCustomSize] = useState(false);
  const [format, setFormat] = useState<"keep" | OutputFormat>("keep");
  const [quality, setQuality] = useState(85);
  const [estimate, setEstimate] = useState<{ bytes: number; key: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const [seen, setSeen] = useState<typeof image>(null);
  if (image !== seen) {
    setSeen(image);
    if (image) {
      setT(IDENTITY);
      setCrop({ x: 0, y: 0, w: image.width, h: image.height });
      setRatioKey("free");
      setAdj(NEUTRAL);
      setLook("none");
      setCustomSize(false);
      setTab("crop");
      setEstimate(null);
    }
  }

  const dims = image ? orientedSize(image.width, image.height, t) : { W: 1, H: 1 };
  const bounds = safeRect(dims.W, dims.H, t.straighten);
  const ratio = useMemo(() => {
    const r = RATIOS.find((x) => x.key === ratioKey)?.value ?? null;
    return r === "orig" ? dims.W / dims.H : r;
  }, [ratioKey, dims.W, dims.H]);

  const cropW = Math.max(1, Math.round(crop.w));
  const cropH = Math.max(1, Math.round(crop.h));
  const finalW = customSize ? Math.max(1, outW) : cropW;
  const finalH = customSize ? Math.max(1, lockSize ? Math.round((outW * cropH) / cropW) : outH) : cropH;
  const outFormat: OutputFormat = format === "keep" ? sourceFormat(image?.type ?? "jpeg") : format;
  const settingsKey = JSON.stringify([t, crop, adj, finalW, finalH, outFormat, quality]);

  const render = async () => {
    if (!image) throw new Error("Kein Bild");
    const canvas = renderCrop(image.bitmap, image.width, image.height, t, crop, finalW, finalH);
    return encodePixels(readPixels(canvas), { format: outFormat, quality, pngMode: "lossless" }, isNeutral(adj) ? undefined : adj);
  };

  // Real file-size preview on the export tab (debounced).
  const estimateRun = useRef(0);
  useEffect(() => {
    if (!image || tab !== "export") return;
    const run = ++estimateRun.current;
    const timer = setTimeout(async () => {
      try {
        const data = await render();
        if (run === estimateRun.current) setEstimate({ bytes: data.length, key: settingsKey });
      } catch {
        /* ignore – shown on download */
      }
    }, 450);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- settingsKey captures all render inputs
  }, [image, tab, settingsKey]);

  const download = async () => {
    if (!image) return;
    setBusy(true);
    try {
      const data = await render();
      setEstimate({ bytes: data.length, key: settingsKey });
      saveBlob(new Blob([data as Uint8Array<ArrayBuffer>], { type: MIME[outFormat] }), outputName(image.file.name, outFormat, "-bearbeitet"));
      track("download", { kind: "single", format: outFormat });
    } catch (e) {
      track("error", { code: errorCode(e) });
      setError(e instanceof Error ? e.message : "Export fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  const chooseRatio = (key: string) => {
    setRatioKey(key);
    const r = RATIOS.find((x) => x.key === key)?.value ?? null;
    const value = r === "orig" ? dims.W / dims.H : r;
    if (value) setCrop(fitRatio(value, bounds, { x: crop.x + crop.w / 2, y: crop.y + crop.h / 2 }));
  };

  const rotate = (dir: 1 | -1) => {
    if (!image) return;
    const nt: Transform = { ...t, rotate90: ((((t.rotate90 + dir * 90) % 360) + 360) % 360) as Transform["rotate90"] };
    const d = orientedSize(image.width, image.height, nt);
    const b = safeRect(d.W, d.H, nt.straighten);
    setT(nt);
    setCrop(ratio && ratioKey !== "orig" ? fitRatio(ratio, b) : b);
  };

  const setAdjKey = (k: keyof Adjustments, v: number) => {
    setLook("custom");
    setAdj((a) => ({ ...a, [k]: v }));
  };

  if (!image) {
    return (
      <div id="editor">
        {loading ? (
          <div className="flex min-h-72 items-center justify-center text-sm text-zinc-700">
            <Loader2 aria-hidden className="mr-2 h-5 w-5 animate-spin text-lime-700" /> Bild wird geöffnet …
          </div>
        ) : (
          <Dropzone
            onFiles={(f) => load(f[0])}
            accept="image/*,.heic,.heif"
            multiple={false}
            title="Foto hier ablegen und kostenlos bearbeiten"
            formats="JPG, PNG, WebP, GIF oder HEIC – zuschneiden, drehen, Farben anpassen, verkleinern"
          />
        )}
        {error && (
          <div className="mt-3">
            <ErrorBanner onClose={() => setError(null)}>{error}</ErrorBanner>
          </div>
        )}
      </div>
    );
  }

  const stale = !estimate || estimate.key !== settingsKey;

  return (
    <div id="editor">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label="Bearbeitungsschritte" className="flex flex-1 gap-1 overflow-x-auto rounded-xl bg-zinc-100 p-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-sm font-medium transition-colors ${
                tab === id ? "bg-white text-zinc-950" : "text-zinc-700 hover:text-zinc-950"
              }`}
            >
              <Icon aria-hidden className={`h-4 w-4 ${tab === id ? "text-lime-700" : ""}`} />
              <span className={tab === id ? "" : "hidden sm:inline"}>{label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={btnIcon}
          aria-label="Alle Änderungen zurücksetzen"
          title="Zurücksetzen"
          onClick={() => {
            setT(IDENTITY);
            setCrop({ x: 0, y: 0, w: image.width, h: image.height });
            setRatioKey("free");
            setAdj(NEUTRAL);
            setLook("none");
            setCustomSize(false);
          }}
        >
          <Undo2 aria-hidden className="h-4 w-4" />
        </button>
        <button type="button" className={btnIcon} onClick={reset} aria-label="Anderes Bild wählen" title="Anderes Bild">
          <ImagePlus aria-hidden className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="rounded-xl bg-zinc-100 p-3 sm:p-5">
            <CropStage
              source={image.bitmap}
              width={image.width}
              height={image.height}
              transform={t}
              crop={crop}
              onCrop={setCrop}
              ratio={ratio}
              grid={tab === "crop"}
              cssFilter={isNeutral(adj) ? undefined : cssFilter(adj)}
            />
          </div>
          <p className="mt-2 text-center text-xs text-zinc-600">
            {image.file.name} · Original {image.originalWidth} × {image.originalHeight} px · {formatBytes(image.file.size)}
            {image.downscaled && " · vorab verkleinert (Browser-Limit)"}
          </p>
          {error && (
            <div className="mt-2">
              <ErrorBanner onClose={() => setError(null)}>{error}</ErrorBanner>
            </div>
          )}
        </div>

        <aside className="space-y-4 border-t border-zinc-200 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === "crop" && (
            <>
              <Segmented label="Seitenverhältnis" value={ratioKey} onChange={chooseRatio} columns={4} options={RATIOS.map((r) => ({ value: r.key, label: r.label }))} />
              <Slider
                label="Gerade ausrichten"
                value={t.straighten}
                min={-45}
                max={45}
                step={0.5}
                display={`${t.straighten.toLocaleString("de-DE")}°`}
                onChange={(deg) => {
                  setT({ ...t, straighten: deg });
                  setCrop((c) => shrinkInto(c, safeRect(dims.W, dims.H, deg)));
                }}
              />
              <p className="text-xs text-zinc-600">Ziehen Sie die Ecken des Rahmens. Pfeiltasten verschieben den Ausschnitt.</p>
            </>
          )}
          {tab === "rotate" && (
            <>
              <div>
                <p className="mb-1.5 text-sm font-medium text-zinc-800">Drehen</p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className={btnSecondary} onClick={() => rotate(-1)}>
                    <RotateCcw aria-hidden className="h-4 w-4" /> 90° links
                  </button>
                  <button type="button" className={btnSecondary} onClick={() => rotate(1)}>
                    <RotateCw aria-hidden className="h-4 w-4" /> 90° rechts
                  </button>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium text-zinc-800">Spiegeln</p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" aria-pressed={t.flipX} className={`${btnSecondary} ${t.flipX ? "border-lime-700 bg-lime-50 text-lime-900" : ""}`} onClick={() => setT({ ...t, flipX: !t.flipX })}>
                    <FlipHorizontal2 aria-hidden className="h-4 w-4" /> Horizontal
                  </button>
                  <button type="button" aria-pressed={t.flipY} className={`${btnSecondary} ${t.flipY ? "border-lime-700 bg-lime-50 text-lime-900" : ""}`} onClick={() => setT({ ...t, flipY: !t.flipY })}>
                    <FlipVertical2 aria-hidden className="h-4 w-4" /> Vertikal
                  </button>
                </div>
              </div>
            </>
          )}
          {tab === "adjust" && (
            <>
              <div>
                <p className="mb-1.5 text-sm font-medium text-zinc-800">Looks</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {LOOKS.map((l) => (
                    <button
                      key={l.key}
                      type="button"
                      aria-pressed={look === l.key}
                      onClick={() => {
                        setLook(l.key);
                        setAdj(l.a);
                      }}
                      className={`min-h-11 rounded-xl border px-2 text-xs font-medium ${look === l.key ? "border-lime-700 bg-lime-50 text-lime-900" : "border-zinc-200 text-zinc-800 hover:bg-zinc-50"}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <Slider label="Helligkeit" value={Math.round(adj.brightness * 100)} min={30} max={170} onChange={(v) => setAdjKey("brightness", v / 100)} display={`${Math.round(adj.brightness * 100)} %`} />
              <Slider label="Kontrast" value={Math.round(adj.contrast * 100)} min={30} max={170} onChange={(v) => setAdjKey("contrast", v / 100)} display={`${Math.round(adj.contrast * 100)} %`} />
              <Slider label="Sättigung" value={Math.round(adj.saturate * 100)} min={0} max={200} onChange={(v) => setAdjKey("saturate", v / 100)} display={`${Math.round(adj.saturate * 100)} %`} />
            </>
          )}
          {tab === "export" && (
            <>
              <Toggle
                label="Größe ändern"
                checked={customSize}
                onChange={(v) => {
                  setCustomSize(v);
                  if (v) {
                    setOutW(Math.min(cropW, 1920));
                    setOutH(Math.round((Math.min(cropW, 1920) * cropH) / cropW));
                  }
                }}
                description={`Ausschnitt: ${cropW} × ${cropH} px`}
              />
              {customSize && (
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <NumberField label="Breite" suffix="px" value={outW} onChange={setOutW} max={12000} />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLockSize(!lockSize);
                      setOutH(finalH);
                    }}
                    aria-pressed={lockSize}
                    aria-label={lockSize ? "Seitenverhältnis gesperrt" : "Seitenverhältnis frei"}
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${lockSize ? "border-lime-700 bg-lime-50 text-lime-800" : "border-zinc-300 text-zinc-600"}`}
                  >
                    {lockSize ? <Link2 aria-hidden className="h-4 w-4" /> : <Link2Off aria-hidden className="h-4 w-4" />}
                  </button>
                  <div className="flex-1">
                    {lockSize ? (
                      <div>
                        <p className="mb-1 text-xs font-medium text-zinc-700">Höhe</p>
                        <p className="flex h-11 items-center rounded-xl border border-dashed border-zinc-300 px-3 font-mono text-sm text-zinc-700">{finalH}</p>
                      </div>
                    ) : (
                      <NumberField label="Höhe" suffix="px" value={outH} onChange={setOutH} max={12000} />
                    )}
                  </div>
                </div>
              )}
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
              {outFormat !== "png" && <Slider label="Qualität" value={quality} min={10} max={100} onChange={setQuality} hints={["kleinere Datei", "höhere Qualität"]} />}
            </>
          )}

          <div className="space-y-2 border-t border-zinc-100 pt-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-zinc-700">
                {finalW} × {finalH} px · {outFormat === "jpeg" ? "JPG" : outFormat.toUpperCase()}
              </span>
              <span className="font-mono font-semibold text-zinc-950">
                {tab !== "export" ? "" : stale ? <Loader2 aria-label="Dateigröße wird berechnet" className="inline h-4 w-4 animate-spin text-lime-700" /> : formatBytes(estimate!.bytes)}
              </span>
            </div>
            {tab === "export" && !stale && estimate && savingPercent(image.file.size, estimate.bytes) > 0 && (
              <p className="text-right text-xs font-semibold text-lime-800">−{savingPercent(image.file.size, estimate.bytes)} % gegenüber dem Original</p>
            )}
            <button type="button" className={`${btnPrimary} w-full`} onClick={download} disabled={busy}>
              {busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Download aria-hidden className="h-4 w-4" />}
              Bild herunterladen
            </button>
            {tab !== "export" && (
              <button type="button" className={`${btnSecondary} w-full`} onClick={() => setTab("export")}>
                Größe &amp; Format wählen
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

