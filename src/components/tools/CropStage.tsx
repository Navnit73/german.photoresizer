"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { dragRect, drawTransformed, orientedSize, safeRect, type Handle, type Rect, type Transform } from "@/lib/image/transform";

const HANDLES: Handle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const POS: Record<string, string> = {
  nw: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
  n: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize",
  ne: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize",
  e: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
  se: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
  s: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-ns-resize",
  sw: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
  w: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
};

export default function CropStage({
  source,
  width,
  height,
  transform,
  crop,
  onCrop,
  ratio,
  grid = true,
  cssFilter,
  maxHeight = 520,
  label = "Zuschnittrahmen",
}: {
  source: CanvasImageSource;
  width: number;
  height: number;
  transform: Transform;
  crop: Rect;
  onCrop: (r: Rect) => void;
  ratio: number | null;
  grid?: boolean;
  /** CSS filter for live colour preview (export applies identical math). */
  cssFilter?: string;
  maxHeight?: number;
  label?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [avail, setAvail] = useState(0);
  const [active, setActive] = useState(false);
  const drag = useRef<{ handle: Handle; x: number; y: number; start: Rect } | null>(null);

  const { W, H } = orientedSize(width, height, transform);
  const vh = typeof window !== "undefined" ? Math.min(maxHeight, Math.round(window.innerHeight * 0.62)) : maxHeight;
  const k = avail > 0 ? Math.min(avail / W, vh / H) : 0;
  const bounds = safeRect(W, H, transform.straighten);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAvail(e.contentRect.width));
    ro.observe(el);
    setAvail(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || k <= 0) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.max(1, Math.round(W * k * dpr));
    c.height = Math.max(1, Math.round(H * k * dpr));
    const ctx = c.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, c.width, c.height);
    drawTransformed(ctx, source, width, height, transform, k * dpr);
  }, [source, width, height, transform, k, W, H]);

  const onDown = (e: React.PointerEvent<HTMLElement>) => {
    const handle = (e.currentTarget.dataset.handle ?? "move") as Handle;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { handle, x: e.clientX, y: e.clientY, start: crop };
    setActive(true);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || k <= 0) return;
    onCrop(dragRect(d.start, d.handle, (e.clientX - d.x) / k, (e.clientY - d.y) / k, ratio, bounds));
  };
  const onUp = () => {
    drag.current = null;
    setActive(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const d = delta[e.key];
    if (!d) return;
    e.preventDefault();
    onCrop(dragRect(crop, "move", d[0], d[1], ratio, bounds));
  };

  return (
    <div ref={wrapRef} className="flex w-full justify-center">
      {k > 0 && (
        <div className="relative touch-none select-none" style={{ width: W * k, height: H * k }} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <canvas ref={canvasRef} className="bg-transparency-grid block h-full w-full" style={{ filter: cssFilter }} />
            <div
              className="pointer-events-none absolute"
              style={{ left: crop.x * k, top: crop.y * k, width: crop.w * k, height: crop.h * k, outline: "9999px solid rgba(9, 9, 11, 0.55)" }}
            />
          </div>
          <div
            role="group"
            tabIndex={0}
            aria-label={`${label}: ${Math.round(crop.w)} × ${Math.round(crop.h)} Pixel. Mit Pfeiltasten verschieben.`}
            onKeyDown={onKey}
            data-handle="move"
            onPointerDown={onDown}
            className="absolute cursor-move focus-visible:outline-3! focus-visible:outline-lime-500!"
            style={{
              left: crop.x * k,
              top: crop.y * k,
              width: crop.w * k,
              height: crop.h * k,
              outline: "1.5px solid #fff",
            }}
          >
            {grid && (
              <div className={`pointer-events-none absolute inset-0 transition-opacity ${active ? "opacity-100" : "opacity-60"}`}>
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/70" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white/70" />
                <div className="absolute inset-x-0 top-1/3 h-px bg-white/70" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-white/70" />
              </div>
            )}
            {HANDLES.map((h) => (
              <div
                key={h}
                data-handle={h}
                onPointerDown={onDown}
                className={`absolute flex h-11 w-11 items-center justify-center ${POS[h]}`}
                aria-hidden
              >
                <span className={`block border-2 border-white bg-lime-700 ${h.length === 2 ? "h-4 w-4 rounded-full" : "h-2.5 w-6 rounded-full " + (h === "e" || h === "w" ? "rotate-90" : "")}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
