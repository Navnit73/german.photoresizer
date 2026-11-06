"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, FileArchive, Loader2, RotateCcw, MapPin, Trash2, TriangleAlert, CheckCircle2 } from "lucide-react";
import { decodeImage, sniffType, TYPE_LABEL, type DecodedImage, type SniffedType } from "@/lib/image/decode";
import { readExif, hasGps } from "@/lib/image/exif";
import { formatBytes, formatDims, saveBlob, savingPercent, zipFiles } from "@/lib/image/files";
import { createCanvas, getCtx, canvasToBlob, yieldToMain } from "@/lib/image/canvas";
import { CompareSlider, Dropzone, ErrorBanner, btnPrimary, btnSecondary } from "./ui";
import { errorCode, track } from "@/lib/track";

export interface SourceInfo {
  file: File;
  name: string;
  type: SniffedType;
  /** Lazily decoded image (pixel budget applied). */
  decode: () => Promise<DecodedImage>;
  /** Original EXIF block (JPEG/HEIC) or null. */
  exif: () => Promise<Uint8Array | null>;
}

export interface ProcessResult {
  blob: Blob;
  width: number;
  height: number;
  /** File name incl. extension. */
  filename: string;
  note?: string;
}

interface Item {
  id: string;
  file: File;
  name: string;
  type: SniffedType;
  status: "pending" | "working" | "done" | "error";
  version: number;
  inputDims?: { w: number; h: number };
  previewUrl?: string;
  downscaled?: boolean;
  gps?: boolean;
  result?: ProcessResult & { url: string };
  error?: string;
}

let idCounter = 0;

export default function BatchTool({
  accept,
  acceptTypes,
  rejectMessage,
  maxFiles = 50,
  dropTitle,
  dropFormats,
  settings,
  settingsKey,
  process,
  checker = false,
  compare = true,
  previewAlt,
  gpsWarning = false,
}: {
  accept: string;
  acceptTypes: SniffedType[];
  /** Shown when a file of another type is dropped. */
  rejectMessage: React.ReactNode;
  maxFiles?: number;
  dropTitle: string;
  dropFormats: string;
  /** Settings UI (rendered in the side panel). */
  settings: React.ReactNode;
  /** Serialised settings – any change re-processes all files. */
  settingsKey: string;
  process: (src: SourceInfo, isStale: () => boolean) => Promise<ProcessResult>;
  /** Checkerboard behind previews (PNG/transparency). */
  checker?: boolean;
  /** Before/after slider (off when output aspect may differ). */
  compare?: boolean;
  previewAlt: string;
  /** Warn when the selected file contains GPS data that will be kept. */
  gpsWarning?: boolean;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState<React.ReactNode | null>(null);
  const [zipping, setZipping] = useState(false);

  const itemsRef = useRef<Item[]>([]);
  const decodedRef = useRef(new Map<string, Promise<DecodedImage>>());
  const exifRef = useRef(new Map<string, Promise<Uint8Array | null>>());
  const processRef = useRef(process);
  const versionRef = useRef(0);
  const runningRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    processRef.current = process;
  }, [process]);

  const commit = useCallback((updater: (prev: Item[]) => Item[]) => {
    setItems((prev) => {
      const next = updater(prev);
      itemsRef.current = next;
      return next;
    });
  }, []);

  const patch = useCallback(
    (id: string, p: Partial<Item>) => commit((prev) => prev.map((it) => (it.id === id ? { ...it, ...p } : it))),
    [commit],
  );

  const sourceFor = useCallback((it: Item): SourceInfo => {
    return {
      file: it.file,
      name: it.name,
      type: it.type,
      decode: () => {
        let p = decodedRef.current.get(it.id);
        if (!p) {
          p = decodeImage(it.file);
          decodedRef.current.set(it.id, p);
          p.catch(() => decodedRef.current.delete(it.id));
        }
        return p;
      },
      exif: () => {
        let p = exifRef.current.get(it.id);
        if (!p) {
          p = readExif(it.file, it.type).catch(() => null);
          exifRef.current.set(it.id, p);
        }
        return p;
      },
    };
  }, []);

  const run = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    try {
      for (;;) {
        const version = versionRef.current;
        const next = itemsRef.current.find((it) => it.version !== version && it.status !== "error");
        if (!next) break;
        patch(next.id, { status: "working" });
        await yieldToMain();
        const src = sourceFor(next);
        try {
          // Preview of the original + metadata (once per file)
          if (!next.inputDims) {
            const dec = await src.decode();
            let previewUrl: string;
            if (["jpeg", "png", "webp", "gif"].includes(next.type) && !dec.downscaled) {
              previewUrl = URL.createObjectURL(next.file);
            } else {
              const c = createCanvas(dec.width, dec.height);
              getCtx(c).drawImage(dec.bitmap, 0, 0);
              previewUrl = URL.createObjectURL(await canvasToBlob(c, "image/jpeg", 0.9));
            }
            const exif = await src.exif();
            patch(next.id, {
              inputDims: { w: dec.originalWidth, h: dec.originalHeight },
              previewUrl,
              downscaled: dec.downscaled,
              gps: exif ? hasGps(exif) : false,
            });
          }
          const result = await processRef.current(src, () => versionRef.current !== version);
          if (versionRef.current !== version || !itemsRef.current.some((i) => i.id === next.id)) continue;
          const old = itemsRef.current.find((i) => i.id === next.id)?.result?.url;
          if (old) URL.revokeObjectURL(old);
          patch(next.id, { status: "done", version, result: { ...result, url: URL.createObjectURL(result.blob) }, error: undefined });
        } catch (err) {
          if (versionRef.current !== version) continue;
          const msg = err instanceof Error && err.message !== "cancelled" ? err.message : "Die Datei konnte nicht verarbeitet werden.";
          track("error", { code: errorCode(err) });
          patch(next.id, { status: "error", version, error: msg });
        }
      }
    } finally {
      runningRef.current = false;
    }
  }, [patch, sourceFor]);

  // Re-process everything when settings change (debounced for sliders).
  const firstKey = useRef(true);
  useEffect(() => {
    if (firstKey.current) {
      firstKey.current = false;
      return;
    }
    versionRef.current++;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      commit((prev) => prev.map((it) => (it.status === "error" && it.inputDims ? { ...it, status: "pending" } : it)));
      void run();
    }, 350);
  }, [settingsKey, run, commit]);

  useEffect(
    () => () => {
      itemsRef.current.forEach((it) => {
        if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
        if (it.result) URL.revokeObjectURL(it.result.url);
      });
      decodedRef.current.forEach((p) => p.then((d) => d.bitmap.close()).catch(() => {}));
    },
    [],
  );

  const addFiles = useCallback(
    async (files: File[]) => {
      setNotice(null);
      const room = maxFiles - itemsRef.current.length;
      if (room <= 0) {
        setNotice(`Maximal ${maxFiles} Dateien pro Durchgang. Entfernen Sie zuerst einige Dateien.`);
        return;
      }
      const accepted: Item[] = [];
      let rejected = 0;
      for (const file of files.slice(0, room)) {
        const type = await sniffType(file);
        if (!acceptTypes.includes(type)) {
          rejected++;
          continue;
        }
        accepted.push({ id: `f${++idCounter}`, file, name: file.name, type, status: "pending", version: -1 });
      }
      if (rejected > 0) setNotice(rejectMessage);
      else if (files.length > room) setNotice(`Es wurden nur die ersten ${room} Dateien übernommen (maximal ${maxFiles}).`);
      if (accepted.length === 0) return;
      track("upload", { count: accepted.length });
      commit((prev) => [...prev, ...accepted]);
      setSelected((s) => s ?? accepted[0].id);
      void run();
    },
    [acceptTypes, commit, maxFiles, rejectMessage, run],
  );

  const remove = (id: string) => {
    const it = itemsRef.current.find((i) => i.id === id);
    if (it?.previewUrl) URL.revokeObjectURL(it.previewUrl);
    if (it?.result) URL.revokeObjectURL(it.result.url);
    decodedRef.current.get(id)?.then((d) => d.bitmap.close()).catch(() => {});
    decodedRef.current.delete(id);
    exifRef.current.delete(id);
    commit((prev) => prev.filter((i) => i.id !== id));
    setSelected((s) => (s === id ? (itemsRef.current[0]?.id ?? null) : s));
  };

  const reset = () => {
    itemsRef.current.forEach((i) => remove(i.id));
    setSelected(null);
    setNotice(null);
  };

  const done = items.filter((i) => i.status === "done" && i.result);
  const busy = items.some((i) => i.status === "pending" || i.status === "working");
  const totals = useMemo(() => {
    const before = done.reduce((s, i) => s + i.file.size, 0);
    const after = done.reduce((s, i) => s + (i.result?.blob.size ?? 0), 0);
    return { before, after };
  }, [done]);

  const current = items.find((i) => i.id === selected) ?? items[0];

  const downloadOne = (r: ProcessResult) => {
    saveBlob(r.blob, r.filename);
    track("download", { kind: "single", format: r.blob.type.replace("image/", "") });
  };

  const downloadZip = async () => {
    setZipping(true);
    try {
      const blob = await zipFiles(done.map((i) => ({ name: i.result!.filename, blob: i.result!.blob })));
      saveBlob(blob, "fotofixer-bilder.zip");
      track("download", { kind: "zip", count: done.length });
    } finally {
      setZipping(false);
    }
  };

  if (items.length === 0) {
    return (
      <div>
        <Dropzone onFiles={addFiles} accept={accept} title={dropTitle} formats={dropFormats} />
        {notice && (
          <div className="mt-3">
            <ErrorBanner onClose={() => setNotice(null)}>{notice}</ErrorBanner>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Preview + list */}
        <div className="min-w-0 space-y-3">
          {current && (
            <div className="rounded-xl bg-zinc-100 p-2">
              {current.previewUrl ? (
                <CompareSlider
                  before={current.previewUrl}
                  after={compare ? (current.result?.url ?? null) : (current.result?.url ?? current.previewUrl)}
                  checker={checker}
                  alt={previewAlt}
                  labels={["Original", "Ergebnis"]}
                />
              ) : (
                <div className="flex h-56 items-center justify-center text-sm text-zinc-600">
                  <Loader2 aria-hidden className="mr-2 h-4 w-4 animate-spin" /> Bild wird geladen …
                </div>
              )}
              {gpsWarning && current.gps && (
                <p className="mt-2 flex items-start gap-1.5 px-1 text-xs text-zinc-700">
                  <MapPin aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                  Dieses Foto enthält GPS-Standortdaten. Sie bleiben mit Ihren aktuellen Einstellungen in der Datei erhalten.
                </p>
              )}
              {current.downscaled && (
                <p className="mt-2 flex items-start gap-1.5 px-1 text-xs text-zinc-700">
                  <TriangleAlert aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                  Dieses Foto ist größer, als Ihr Browser verarbeiten kann, und wurde vorab proportional verkleinert.
                </p>
              )}
            </div>
          )}

          <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200" aria-label="Ausgewählte Dateien">
            {items.map((it) => {
              const isSel = it.id === current?.id;
              const saving = it.result ? savingPercent(it.file.size, it.result.blob.size) : 0;
              return (
                <li key={it.id} className={`flex items-center gap-3 px-3 py-2 ${isSel ? "bg-lime-50/60" : "bg-white"}`}>
                  <button
                    type="button"
                    onClick={() => setSelected(it.id)}
                    className="flex min-h-12 min-w-0 flex-1 items-center gap-3 text-left"
                    aria-pressed={isSel}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-transparency-grid">
                      {it.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- local blob thumbnail
                        <img src={it.result?.url ?? it.previewUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Loader2 aria-hidden className="h-4 w-4 animate-spin text-zinc-500" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-zinc-900">{it.name}</span>
                      <span className="block text-xs text-zinc-600">
                        {TYPE_LABEL[it.type]} · {formatBytes(it.file.size)}
                        {it.result && (
                          <>
                            {" → "}
                            <span className="font-semibold text-zinc-900">{formatBytes(it.result.blob.size)}</span>
                            {" · "}
                            {formatDims(it.result.width, it.result.height)}
                          </>
                        )}
                      </span>
                      {it.error && <span className="block text-xs text-red-700">{it.error}</span>}
                      {it.result?.note && <span className="block text-xs text-amber-700">{it.result.note}</span>}
                    </span>
                  </button>
                  {it.status === "working" || it.status === "pending" ? (
                    <Loader2 aria-label="Wird verarbeitet" className="h-4 w-4 shrink-0 animate-spin text-lime-700" />
                  ) : it.result ? (
                    <span
                      className={`hidden shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold sm:inline ${
                        saving > 0 ? "bg-lime-100 text-lime-900" : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {saving > 0 ? `−${saving} %` : saving === 0 ? "±0 %" : `+${-saving} %`}
                    </span>
                  ) : null}
                  {it.result && (
                    <button
                      type="button"
                      onClick={() => downloadOne(it.result!)}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lime-800 hover:bg-lime-50"
                      aria-label={`${it.result.filename} herunterladen`}
                    >
                      <Download aria-hidden className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(it.id)}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label={`${it.name} entfernen`}
                  >
                    <Trash2 aria-hidden className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
          {items.length < maxFiles && <Dropzone compact onFiles={addFiles} accept={accept} title="Weitere Bilder hinzufügen" formats={dropFormats} />}
          {notice && <ErrorBanner onClose={() => setNotice(null)}>{notice}</ErrorBanner>}
        </div>

        {/* Settings + download */}
        <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          {settings}
          <div className="space-y-3 border-t border-zinc-200 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-700">
                {done.length} von {items.length} fertig
              </span>
              {busy ? (
                <span className="inline-flex items-center gap-1.5 text-zinc-700">
                  <Loader2 aria-hidden className="h-4 w-4 animate-spin text-lime-700" /> Verarbeitung …
                </span>
              ) : done.length > 0 ? (
                <span className="inline-flex items-center gap-1 font-semibold text-lime-800">
                  <CheckCircle2 aria-hidden className="h-4 w-4" />
                  {totals.after < totals.before ? `−${savingPercent(totals.before, totals.after)} %` : "Fertig"}
                </span>
              ) : null}
            </div>
            {done.length > 0 && (
              <p className="text-xs text-zinc-600">
                {formatBytes(totals.before)} → <span className="font-semibold text-zinc-900">{formatBytes(totals.after)}</span>
              </p>
            )}
            {done.length > 1 ? (
              <button type="button" className={`${btnPrimary} w-full`} onClick={downloadZip} disabled={busy || zipping}>
                {zipping ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <FileArchive aria-hidden className="h-4 w-4" />}
                Alle als ZIP herunterladen
              </button>
            ) : (
              <button
                type="button"
                className={`${btnPrimary} w-full`}
                disabled={!current?.result || busy}
                onClick={() => current?.result && downloadOne(current.result!)}
              >
                <Download aria-hidden className="h-4 w-4" />
                Herunterladen
              </button>
            )}
            <div className="flex gap-2">
              <button type="button" className={`${btnSecondary} flex-1`} onClick={reset}>
                <RotateCcw aria-hidden className="h-4 w-4" /> Neu starten
              </button>
              {done.length > 1 && current?.result && (
                <button type="button" className={`${btnSecondary} flex-1`} onClick={() => downloadOne(current.result!)}>
                  <Download aria-hidden className="h-4 w-4" /> Nur Auswahl
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
