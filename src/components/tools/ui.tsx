"use client";

import { useCallback, useId, useRef, useState } from "react";
import { AlertCircle, ImagePlus, Link2, Link2Off, ShieldCheck, X } from "lucide-react";

/* ------------------------------- Dropzone ------------------------------- */

export function Dropzone({
  onFiles,
  accept,
  multiple = true,
  title,
  formats,
  compact = false,
}: {
  onFiles: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  title: string;
  /** e.g. "JPG und JPEG · bis zu 50 Dateien" */
  formats: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const depth = useRef(0);
  const id = useId();

  const handle = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFiles(multiple ? Array.from(list) : [list[0]]);
    },
    [multiple, onFiles],
  );

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        depth.current++;
        setDrag(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setDrag(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        depth.current = 0;
        setDrag(false);
        handle(e.dataTransfer.files);
      }}
      className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-colors ${
        compact ? "px-4 py-6" : "px-5 py-10 sm:py-14"
      } ${drag ? "border-solid border-lime-700 bg-lime-100" : "border-lime-700 bg-lime-50 hover:bg-lime-100"}`}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = "";
        }}
      />
      {!compact && (
        <span className="mb-3 text-lime-700">
          <ImagePlus aria-hidden className="h-8 w-8" />
        </span>
      )}
      <p className={`${compact ? "text-sm" : "text-lg"} font-semibold text-zinc-950`}>{title}</p>
      <p className="mt-1 text-sm text-zinc-600">{formats}</p>
      <label
        htmlFor={id}
        className={`mt-4 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-xl bg-lime-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-lime-800 focus-within:outline-2 ${
          compact ? "min-h-11 px-4" : ""
        }`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
      >
        <ImagePlus aria-hidden className="h-4 w-4" />
        {multiple ? "Dateien auswählen" : "Datei auswählen"}
      </label>
      {!compact && (
        <p className="mt-4 hidden text-xs text-zinc-600 sm:block">oder Dateien hierher ziehen</p>
      )}
      {!compact && (
        <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700">
          <ShieldCheck aria-hidden className="h-3.5 w-3.5 text-lime-700" />
          Verarbeitung lokal im Browser – kein Upload
        </p>
      )}
    </div>
  );
}

/* -------------------------------- Inputs -------------------------------- */

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  hints,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: string;
  hints?: [string, string];
}) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-zinc-800">
          {label}
        </label>
        <span className="font-mono text-sm font-semibold text-lime-800">{display ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--fill" as string]: `${fill}%` }}
      />
      {hints && (
        <div className="-mt-1 flex justify-between text-xs text-zinc-600">
          <span>{hints[0]}</span>
          <span>{hints[1]}</span>
        </div>
      )}
    </div>
  );
}

export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  columns,
}: {
  label: string;
  options: { value: T; label: string; sub?: string; disabled?: boolean }[];
  value: T;
  onChange: (v: T) => void;
  columns?: number;
}) {
  const id = useId();
  return (
    <div role="radiogroup" aria-labelledby={id}>
      <p id={id} className="mb-1.5 text-sm font-medium text-zinc-800">
        {label}
      </p>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={o.disabled}
              onClick={() => onChange(o.value)}
              className={`flex min-h-11 flex-col items-center justify-center rounded-xl border px-2 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                active ? "border-lime-700 bg-lime-50 text-lime-900" : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <span className="leading-tight">{o.label}</span>
              {o.sub && <span className="mt-0.5 text-[11px] font-normal leading-tight text-zinc-600">{o.sub}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-zinc-800">
          {label}
        </label>
        {description && <div className="mt-0.5 text-xs leading-snug text-zinc-600">{description}</div>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center rounded-lg transition-colors ${checked ? "bg-lime-700" : "bg-zinc-300"}`}
      >
        <span className={`inline-block h-5 w-5 rounded-md bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min = 1,
  max = 20000,
  suffix,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  step?: number;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-zinc-700">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-zinc-300 bg-white focus-within:border-lime-700">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={draft ?? String(value)}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = Number(e.target.value.replace(",", "."));
            if (Number.isFinite(n) && n >= min && n <= max) onChange(n);
          }}
          onBlur={() => setDraft(null)}
          className="h-11 w-full min-w-0 rounded-xl bg-transparent px-3 font-mono text-sm text-zinc-900 outline-none"
        />
        {suffix && <span className="pr-3 text-xs text-zinc-600">{suffix}</span>}
      </div>
    </div>
  );
}

export function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 border-t border-zinc-200 pt-4">
      {title && <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</p>}
      {children}
    </div>
  );
}

export function ErrorBanner({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
      <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Hinweis schließen" className="-m-1 rounded p-1 hover:bg-red-100">
          <X aria-hidden className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export const btnPrimary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-lime-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-lime-800 disabled:cursor-not-allowed disabled:opacity-50";
export const btnSecondary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50";
export const btnIcon =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950 disabled:opacity-40";

/* ---------------------------- Compare slider ---------------------------- */

export function CompareSlider({
  before,
  after,
  checker = false,
  labels = ["Vorher", "Nachher"],
  alt,
}: {
  before: string;
  after: string | null;
  checker?: boolean;
  labels?: [string, string];
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={boxRef}
      className={`relative w-full select-none overflow-hidden rounded-xl ${checker ? "bg-transparency-grid" : "bg-zinc-100"}`}
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- blob URL preview */}
      <img src={after ?? before} alt={alt} className="block max-h-[min(60vh,520px)] w-full object-contain" draggable={false} />
      {after && (
        <>
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- blob URL preview */}
            <img src={before} alt="" aria-hidden className="block h-full w-full object-contain" draggable={false} />
          </div>
          <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
            <div className="h-full w-0.5 -translate-x-1/2 bg-lime-700" />
            <div className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-700">
              ⇆
            </div>
          </div>
          <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-zinc-950/75 px-2 py-0.5 text-xs font-medium text-white">{labels[0]}</span>
          <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-lime-800/90 px-2 py-0.5 text-xs font-medium text-white">{labels[1]}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Vorher-nachher-Vergleich verschieben"
            className="sr-only"
          />
        </>
      )}
    </div>
  );
}

/* ------------------------- Width / height with lock ------------------------- */

/**
 * Width/height inputs. With the ratio locked, the field edited last drives the
 * size and the other one is computed per image ("automatisch").
 */
export function DimensionFields({
  width,
  height,
  lock,
  lockBy,
  onWidth,
  onHeight,
  onLock,
  onLockBy,
  max = 20000,
}: {
  width: number;
  height: number;
  lock: boolean;
  lockBy: "width" | "height";
  onWidth: (v: number) => void;
  onHeight: (v: number) => void;
  onLock: (v: boolean) => void;
  onLockBy: (v: "width" | "height") => void;
  max?: number;
}) {
  const auto = (dim: "width" | "height", label: string) => (
    <div>
      <p className="mb-1 text-xs font-medium text-zinc-700">{label}</p>
      <button
        type="button"
        onClick={() => onLockBy(dim)}
        className="flex h-11 w-full items-center rounded-xl border border-dashed border-zinc-300 px-3 text-left text-xs text-zinc-600 hover:border-lime-700 hover:text-lime-800"
        title={`${label} eingeben`}
      >
        automatisch
      </button>
    </div>
  );
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        {lock && lockBy === "height" ? auto("width", "Breite") : <NumberField label="Breite" suffix="px" value={width} onChange={onWidth} max={max} />}
      </div>
      <button
        type="button"
        onClick={() => onLock(!lock)}
        aria-pressed={lock}
        aria-label={lock ? "Seitenverhältnis gesperrt" : "Seitenverhältnis frei"}
        title={lock ? "Seitenverhältnis gesperrt" : "Seitenverhältnis frei"}
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${lock ? "border-lime-700 bg-lime-50 text-lime-800" : "border-zinc-300 text-zinc-600"}`}
      >
        {lock ? <Link2 aria-hidden className="h-4 w-4" /> : <Link2Off aria-hidden className="h-4 w-4" />}
      </button>
      <div className="flex-1">
        {lock && lockBy === "width" ? auto("height", "Höhe") : <NumberField label="Höhe" suffix="px" value={height} onChange={onHeight} max={max} />}
      </div>
    </div>
  );
}
