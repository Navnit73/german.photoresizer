"use client";

import { errorCode, track } from "@/lib/track";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Brush,
  Clipboard,
  Download,
  Eraser,
  Eye,
  ImagePlus,
  Lasso,
  Loader2,
  Pentagon,
  Sparkles,
  Undo2,
  Wand2,
  Hand,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
import { useSingleImage, type LoadedImage } from "./useSingleImage";
import { Dropzone, ErrorBanner, Panel, Segmented, Slider, Toggle, btnIcon, btnPrimary, btnSecondary } from "./ui";
import { MODELS, segment, type SegmentModel } from "@/lib/image/segment";
import { blurMask, isMaskEmpty, maskBounds, maskFromCanvasAlpha, maskToImageData } from "@/lib/image/mask";
import { canvasToBlob } from "@/lib/image/canvas";
import { encodePixels } from "@/lib/image/encode";
import { baseName, formatBytes, saveBlob } from "@/lib/image/files";

type Variant = "auto" | "manual";
type Tool = "brush" | "lasso" | "polygon" | "pan";
type Bg = "transparent" | "white" | "color" | "blur" | "image";
type Format = "png" | "webp" | "jpeg";
type Pt = { x: number; y: number };

const WORK_MAX = 1600;
const UNDO_MAX = 12;

function el(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function drawCover(ctx: CanvasRenderingContext2D, src: CanvasImageSource, sw: number, sh: number, w: number, h: number) {
  const s = Math.max(w / sw, h / sh);
  const dw = sw * s;
  const dh = sh * s;
  ctx.drawImage(src, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

function blurredCopy(src: CanvasImageSource, w: number, h: number): HTMLCanvasElement {
  const small1 = el(Math.max(1, Math.round(w / 8)), Math.max(1, Math.round(h / 8)));
  small1.getContext("2d")!.drawImage(src, 0, 0, small1.width, small1.height);
  const small2 = el(Math.max(1, Math.round(w / 24)), Math.max(1, Math.round(h / 24)));
  small2.getContext("2d")!.drawImage(small1, 0, 0, small2.width, small2.height);
  const out = el(w, h);
  const ctx = out.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(small2, 0, 0, w, h);
  return out;
}

export default function CutoutEditor({ variant }: { variant: Variant }) {
  const { image, loading, error, setError, load, reset } = useSingleImage(
    ["jpeg", "png", "webp"],
    "Bitte wählen Sie ein Bild im Format JPG, PNG oder WebP.",
  );

  const [phase, setPhase] = useState<"pick" | "segmenting" | "edit">(variant === "auto" ? "pick" : "edit");
  const [aiProgress, setAiProgress] = useState<number | null>(null);
  const [aiStage, setAiStage] = useState<"download" | "analyse">("download");
  const [tool, setTool] = useState<Tool>(variant === "auto" ? "brush" : "lasso");
  const [add, setAdd] = useState(variant === "manual");
  const [brushSize, setBrushSize] = useState(40);
  const [hardness, setHardness] = useState(60);
  const [feather, setFeather] = useState(variant === "auto" ? 1 : 2);
  const [preview, setPreview] = useState<"cutout" | "mask">(variant === "auto" ? "cutout" : "mask");
  const [bg, setBg] = useState<Bg>("transparent");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [format, setFormat] = useState<Format>("png");
  const [trim, setTrim] = useState(variant === "manual");
  const [undoCount, setUndoCount] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [poly, setPoly] = useState<Pt[]>([]);
  const [hover, setHover] = useState<Pt | null>(null);
  const [lassoPts, setLassoPts] = useState<Pt[]>([]);
  const [exporting, setExporting] = useState(false);
  const [lastSize, setLastSize] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [maskEmpty, setMaskEmpty] = useState(true);
  const [avail, setAvail] = useState(0);
  const [hasBgImage, setHasBgImage] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Pt>({ x: 0, y: 0 });
  const [spaceDown, setSpaceDown] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);
  const bgImage = useRef<ImageBitmap | null>(null);
  const stroke = useRef<{ last: Pt; moved: boolean } | null>(null);
  const raf = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Pt>());
  const gesture = useRef<{ type: "pinch"; d0: number; mid0: Pt; z0: number; pan0: Pt } | { type: "pan"; start: Pt; pan0: Pt } | null>(null);
  const blockStroke = useRef(false);

  /* ------------------------------ setup ------------------------------ */

  /** Working canvases at ≤ 1600 px (mutated imperatively, never React state). */
  const work = useMemo(() => {
    if (!image) return null;
    const s = Math.min(1, WORK_MAX / Math.max(image.width, image.height));
    const w = Math.max(1, Math.round(image.width * s));
    const h = Math.max(1, Math.round(image.height * s));
    const img = el(w, h);
    const ictx = img.getContext("2d")!;
    ictx.imageSmoothingQuality = "high";
    ictx.drawImage(image.bitmap, 0, 0, w, h);
    return {
      w,
      h,
      img,
      mask: el(w, h),
      eff: el(w, h),
      scratch: el(w, h),
      blurBg: null as HTMLCanvasElement | null,
      undo: [] as Uint8ClampedArray[],
    };
  }, [image]);

  const [seen, setSeen] = useState<LoadedImage | null>(null);
  if (image !== seen) {
    setSeen(image);
    setPhase(variant === "auto" ? "pick" : "edit");
    setPoly([]);
    setLastSize(null);
    setAiProgress(null);
    setUndoCount(0);
    setMaskEmpty(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  useLayoutEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const ro = new ResizeObserver(([e]) => setAvail(e.contentRect.width));
    ro.observe(node);
    setAvail(node.clientWidth);
    return () => ro.disconnect();
  }, [image, phase]);

  const vh = typeof window !== "undefined" ? Math.min(560, Math.round(window.innerHeight * 0.62)) : 560;
  const k = work && avail > 0 ? Math.min(avail / work.w, vh / work.h) : 0;
  /** Display scale (CSS px per work px) including zoom. */
  const kz = k * zoom;
  const MAX_ZOOM = 8;

  const clampPan = useCallback(
    (p: Pt, z: number): Pt => {
      if (!work) return p;
      const vw = work.w * k;
      const vhh = work.h * k;
      return { x: Math.min(0, Math.max(vw - vw * z, p.x)), y: Math.min(0, Math.max(vhh - vhh * z, p.y)) };
    },
    [work, k],
  );

  /** Zoom keeping the viewport point (vx, vy) fixed. */
  const zoomAt = useCallback(
    (next: number, vx?: number, vy?: number) => {
      if (!work) return;
      const z = Math.min(MAX_ZOOM, Math.max(1, next));
      const cx = vx ?? (work.w * k) / 2;
      const cy = vy ?? (work.h * k) / 2;
      setPan((p) => {
        const ix = (cx - p.x) / (k * zoom);
        const iy = (cy - p.y) / (k * zoom);
        return clampPan({ x: cx - ix * k * z, y: cy - iy * k * z }, z);
      });
      setZoom(z);
    },
    [work, k, zoom, clampPan],
  );

  const viewportPoint = (e: { clientX: number; clientY: number }): Pt => {
    const r = viewportRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  /* ----------------------------- rendering ---------------------------- */

  const refreshEffective = useCallback(() => {
    if (!work) return;
    const m = work.mask;
    const e = work.eff;
    const ectx = e.getContext("2d")!;
    ectx.clearRect(0, 0, e.width, e.height);
    if (feather <= 0) {
      ectx.drawImage(m, 0, 0);
    } else {
      const alpha = maskFromCanvasAlpha(m.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, m.width, m.height).data);
      ectx.putImageData(maskToImageData(blurMask(alpha, m.width, m.height, feather), m.width, m.height), 0, 0);
    }
  }, [feather, work]);

  const render = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const d = displayRef.current;
      if (!d || !work || kz <= 0) return;
      const wi = work.img;
      const em = work.eff;
      const sc = work.scratch;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const scale = Math.min(kz * dpr, 2);
      const dw = Math.max(1, Math.round(wi.width * scale));
      const dh = Math.max(1, Math.round(wi.height * scale));
      if (d.width !== dw || d.height !== dh) {
        d.width = dw;
        d.height = dh;
      }
      const ctx = d.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, dw, dh);
      if (showOriginal || phase !== "edit") {
        ctx.drawImage(wi, 0, 0, dw, dh);
        return;
      }
      const sctx = sc.getContext("2d")!;
      sctx.globalCompositeOperation = "source-over";
      sctx.clearRect(0, 0, sc.width, sc.height);
      if (preview === "mask") {
        ctx.drawImage(wi, 0, 0, dw, dh);
        sctx.fillStyle = "rgba(9,9,11,0.62)";
        sctx.fillRect(0, 0, sc.width, sc.height);
        sctx.globalCompositeOperation = "destination-out";
        sctx.drawImage(em, 0, 0);
        sctx.globalCompositeOperation = "source-over";
        ctx.drawImage(sc, 0, 0, dw, dh);
        return;
      }
      if (bg === "white" || bg === "color") {
        ctx.fillStyle = bg === "white" ? "#ffffff" : bgColor;
        ctx.fillRect(0, 0, dw, dh);
      } else if (bg === "blur") {
        work.blurBg ??= blurredCopy(wi, wi.width, wi.height);
        ctx.drawImage(work.blurBg, 0, 0, dw, dh);
      } else if (bg === "image" && hasBgImage && bgImage.current) {
        drawCover(ctx, bgImage.current, bgImage.current.width, bgImage.current.height, dw, dh);
      }
      sctx.drawImage(wi, 0, 0);
      sctx.globalCompositeOperation = "destination-in";
      sctx.drawImage(em, 0, 0);
      sctx.globalCompositeOperation = "source-over";
      ctx.drawImage(sc, 0, 0, dw, dh);
    });
  }, [kz, showOriginal, phase, preview, bg, bgColor, work, hasBgImage]);

  useEffect(() => {
    refreshEffective();
    render();
  }, [refreshEffective, render, work]);

  /* ------------------------------- edits ------------------------------ */

  const snapshot = () => {
    if (!work) return;
    const m = work.mask;
    const alpha = maskFromCanvasAlpha(m.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, m.width, m.height).data);
    work.undo.push(alpha);
    if (work.undo.length > UNDO_MAX) work.undo.shift();
    setUndoCount(work.undo.length);
  };

  const afterEdit = () => {
    const m = work?.mask;
    if (m) setMaskEmpty(isMaskEmpty(maskFromCanvasAlpha(m.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, m.width, m.height).data)));
    refreshEffective();
    render();
  };

  const undo = () => {
    if (!work) return;
    const m = work.mask;
    const prev = work.undo.pop();
    if (!prev) return;
    m.getContext("2d")!.putImageData(maskToImageData(prev, m.width, m.height), 0, 0);
    setUndoCount(work.undo.length);
    afterEdit();
  };

  const stamp = (p: Pt, adding: boolean) => {
    const m = work?.mask;
    if (!m) return;
    const ctx = m.getContext("2d")!;
    const r = brushSize / 2;
    ctx.globalCompositeOperation = adding ? "source-over" : "destination-out";
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    const hard = Math.min(0.99, hardness / 100);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(hard, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  };

  const fillPolygon = (pts: Pt[], adding: boolean) => {
    const m = work?.mask;
    if (!m || pts.length < 3) return;
    snapshot();
    const ctx = m.getContext("2d")!;
    ctx.globalCompositeOperation = adding ? "source-over" : "destination-out";
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (const p of pts.slice(1)) ctx.lineTo(p.x, p.y);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    afterEdit();
  };

  const toWork = (e: React.PointerEvent | React.MouseEvent): Pt => {
    const r = displayRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * (work?.w ?? 1), y: ((e.clientY - r.top) / r.height) * (work?.h ?? 1) };
  };

  const brushAdds = add;

  const startPan = (e: React.PointerEvent) => {
    gesture.current = { type: "pan", start: viewportPoint(e), pan0: pan };
  };

  const onDown = (e: React.PointerEvent) => {
    if (phase !== "edit") return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, viewportPoint(e));
    if (pointers.current.size === 2) {
      // Second finger: switch to pinch-zoom, discard the stroke just started.
      if (stroke.current && tool === "brush") undo();
      stroke.current = null;
      setLassoPts([]);
      blockStroke.current = true;
      const [a, b] = [...pointers.current.values()];
      gesture.current = { type: "pinch", d0: Math.hypot(a.x - b.x, a.y - b.y), mid0: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, z0: zoom, pan0: pan };
      return;
    }
    if (pointers.current.size > 2 || blockStroke.current) return;
    if (tool === "pan" || spaceDown || e.button === 1) {
      startPan(e);
      return;
    }
    if (e.button > 0) return;
    const p = toWork(e);
    if (tool === "brush") {
      snapshot();
      stamp(p, brushAdds);
      stroke.current = { last: p, moved: false };
      refreshEffectiveFast();
    } else if (tool === "lasso") {
      setLassoPts([p]);
      stroke.current = { last: p, moved: false };
    } else {
      // polygon: close when clicking near the first point
      if (poly.length >= 3 && Math.hypot(p.x - poly[0].x, p.y - poly[0].y) * kz < 14) {
        fillPolygon(poly, add);
        setPoly([]);
      } else {
        setPoly((pts) => [...pts, p]);
      }
    }
  };

  // While painting, show the raw mask (cheap) – feather is applied on release.
  const refreshEffectiveFast = () => {
    if (!work) return;
    const m = work.mask;
    const em = work.eff;
    const ctx = em.getContext("2d")!;
    ctx.clearRect(0, 0, em.width, em.height);
    ctx.drawImage(m, 0, 0);
    render();
  };

  const onMove = (e: React.PointerEvent) => {
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, viewportPoint(e));
    const g = gesture.current;
    if (g?.type === "pinch" && pointers.current.size >= 2 && work) {
      const [a, b] = [...pointers.current.values()];
      const z = Math.min(MAX_ZOOM, Math.max(1, (g.z0 * Math.hypot(a.x - b.x, a.y - b.y)) / Math.max(1, g.d0)));
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const ix = (g.mid0.x - g.pan0.x) / (k * g.z0);
      const iy = (g.mid0.y - g.pan0.y) / (k * g.z0);
      setZoom(z);
      setPan(clampPan({ x: mid.x - ix * k * z, y: mid.y - iy * k * z }, z));
      return;
    }
    if (g?.type === "pan") {
      const v = viewportPoint(e);
      setPan(clampPan({ x: g.pan0.x + v.x - g.start.x, y: g.pan0.y + v.y - g.start.y }, zoom));
      return;
    }
    const p = toWork(e);
    setHover(p);
    const s = stroke.current;
    if (!s) return;
    if (tool === "brush") {
      const dist = Math.hypot(p.x - s.last.x, p.y - s.last.y);
      const step = Math.max(1, brushSize * 0.15);
      for (let t = step; t <= dist; t += step) {
        stamp({ x: s.last.x + ((p.x - s.last.x) * t) / dist, y: s.last.y + ((p.y - s.last.y) * t) / dist }, brushAdds);
      }
      if (dist >= step) s.last = p;
      s.moved = true;
      refreshEffectiveFast();
    } else if (tool === "lasso") {
      if (Math.hypot(p.x - s.last.x, p.y - s.last.y) * kz > 3) {
        s.last = p;
        setLassoPts((pts) => [...pts, p]);
      }
    }
  };

  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) blockStroke.current = false;
    if (gesture.current) {
      if (pointers.current.size < 2) gesture.current = null;
      return;
    }
    const s = stroke.current;
    stroke.current = null;
    if (!s) return;
    if (tool === "brush") afterEdit();
    else if (tool === "lasso") {
      fillPolygon(lassoPts, add);
      setLassoPts([]);
    }
  };

  useEffect(() => {
    const typing = (t: EventTarget | null) => t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setSpaceDown(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (phase === "edit" && !typing(e.target)) {
        if (e.code === "Space" && !e.repeat && document.activeElement === document.body) {
          e.preventDefault();
          setSpaceDown(true);
        }
        if ((e.key === "+" || e.key === "=") && !e.metaKey && !e.ctrlKey) zoomAt(zoom * 1.25);
        if (e.key === "-" && !e.metaKey && !e.ctrlKey) zoomAt(zoom / 1.25);
        if (e.key === "0" && !e.metaKey && !e.ctrlKey) zoomAt(1);
      }
      if (e.key === "Escape") setPoly([]);
      if (e.key === "Enter" && poly.length >= 3) {
        fillPolygon(poly, add);
        setPoly([]);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  });

  // Ctrl/⌘ + wheel (and trackpad pinch) zooms; plain wheel pans while zoomed.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || phase !== "edit") return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const r = el.getBoundingClientRect();
        zoomAt(zoom * Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top);
      } else if (zoom > 1) {
        e.preventDefault();
        setPan((p) => clampPan({ x: p.x - e.deltaX, y: p.y - e.deltaY }, zoom));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [phase, zoom, zoomAt, clampPan, work, k]);

  /* -------------------------------- AI -------------------------------- */

  const runAi = async (model: SegmentModel) => {
    if (!work) return;
    const wi = work.img;
    const m = work.mask;
    setError(null);
    setPhase("segmenting");
    setAiStage("download");
    setAiProgress(null);
    try {
      const alpha = await segment(wi, model, (p) => {
        setAiProgress(p.ratio);
        if (p.ratio !== null && p.ratio >= 0.999) setAiStage("analyse");
      });
      setAiStage("analyse");
      if (variant === "manual") snapshot();
      m.getContext("2d")!.putImageData(maskToImageData(alpha, m.width, m.height), 0, 0);
      setPhase("edit");
      if (variant === "auto") {
        setPreview("cutout");
        setTool("brush");
        setAdd(false);
      }
      afterEdit();
    } catch (e) {
      console.error(e);
      track("error", { code: "model_load" });
      setError(
        e instanceof Error && /fetch|network|load/i.test(e.message)
          ? "Das KI-Modell konnte nicht geladen werden. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
          : "Die KI-Verarbeitung ist in diesem Browser fehlgeschlagen. Bitte versuchen Sie es mit einem aktuellen Chrome, Edge, Firefox oder Safari erneut.",
      );
      setPhase(variant === "auto" ? "pick" : "edit");
    } finally {
      setAiProgress(null);
    }
  };

  /* ------------------------------ export ------------------------------ */

  const buildOutput = async (): Promise<HTMLCanvasElement | null> => {
    if (!image || !work) return null;
    refreshEffective();
    const W = image.width;
    const H = image.height;
    const fullMask = el(W, H);
    const fm = fullMask.getContext("2d")!;
    fm.imageSmoothingQuality = "high";
    fm.drawImage(work.eff, 0, 0, W, H);
    const cut = el(W, H);
    const cctx = cut.getContext("2d")!;
    cctx.drawImage(image.bitmap, 0, 0);
    cctx.globalCompositeOperation = "destination-in";
    cctx.drawImage(fullMask, 0, 0);
    cctx.globalCompositeOperation = "source-over";

    let region = { x: 0, y: 0, w: W, h: H };
    if (trim) {
      const m = work.mask;
      const b = maskBounds(maskFromCanvasAlpha(m.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, m.width, m.height).data), m.width, m.height);
      if (b) {
        const s = W / m.width;
        const pad = Math.round(feather * s * 2);
        const x = Math.max(0, Math.floor(b.x * s) - pad);
        const y = Math.max(0, Math.floor(b.y * s) - pad);
        region = { x, y, w: Math.min(W - x, Math.ceil(b.w * s) + 2 * pad), h: Math.min(H - y, Math.ceil(b.h * s) + 2 * pad) };
      }
    }
    const out = el(region.w, region.h);
    const octx = out.getContext("2d")!;
    octx.imageSmoothingQuality = "high";
    if (bg === "white" || bg === "color") {
      octx.fillStyle = bg === "white" ? "#ffffff" : bgColor;
      octx.fillRect(0, 0, region.w, region.h);
    } else if (bg === "blur") {
      octx.drawImage(blurredCopy(image.bitmap, W, H), region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);
    } else if (bg === "image" && hasBgImage && bgImage.current) {
      drawCover(octx, bgImage.current, bgImage.current.width, bgImage.current.height, region.w, region.h);
    }
    octx.drawImage(cut, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);
    return out;
  };

  const transparentOut = bg === "transparent" || (bg === "image" && !hasBgImage);
  const effFormat: Format = transparentOut && format === "jpeg" ? "png" : format;

  const download = async () => {
    if (!image) return;
    setExporting(true);
    try {
      const out = await buildOutput();
      if (!out) return;
      let blob: Blob;
      if (effFormat === "png") blob = await canvasToBlob(out, "image/png");
      else {
        const data = await encodePixels(out.getContext("2d")!.getImageData(0, 0, out.width, out.height), { format: effFormat, quality: 90 });
        blob = new Blob([data as Uint8Array<ArrayBuffer>], { type: effFormat === "webp" ? "image/webp" : "image/jpeg" });
      }
      setLastSize(blob.size);
      const suffix = variant === "auto" ? "-ohne-hintergrund" : "-freigestellt";
      saveBlob(blob, `${baseName(image.file.name)}${suffix}.${effFormat === "jpeg" ? "jpg" : effFormat}`);
      track("download", { kind: "single", format: effFormat });
    } catch (e) {
      track("error", { code: errorCode(e) });
      setError(e instanceof Error ? e.message : "Export fehlgeschlagen.");
    } finally {
      setExporting(false);
    }
  };

  const canClipboard = typeof window !== "undefined" && "ClipboardItem" in window && !!navigator.clipboard?.write;
  const copy = async () => {
    try {
      const item = new ClipboardItem({
        "image/png": buildOutput().then((out) => {
          if (!out) throw new Error("Kein Bild");
          return canvasToBlob(out, "image/png");
        }),
      });
      await navigator.clipboard.write([item]);
      track("download", { kind: "clipboard", format: "png" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Kopieren in die Zwischenablage wird von diesem Browser nicht unterstützt. Bitte nutzen Sie den Download.");
    }
  };

  const pickBgImage = async (f: File) => {
    try {
      bgImage.current?.close();
      bgImage.current = await createImageBitmap(f);
      setHasBgImage(true);
      setBg("image");
      render();
    } catch {
      setError("Das Hintergrundbild konnte nicht geöffnet werden.");
    }
  };

  /* -------------------------------- UI -------------------------------- */

  if (!image) {
    return (
      <div>
        {loading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-zinc-700">
            <Loader2 aria-hidden className="mr-2 h-5 w-5 animate-spin text-lime-700" /> Bild wird geöffnet …
          </div>
        ) : (
          <Dropzone
            onFiles={(f) => load(f[0])}
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            multiple={false}
            title={variant === "auto" ? "Foto hier ablegen – Hintergrund wird entfernt" : "Bild zum Freistellen hier ablegen"}
            formats="JPG, PNG oder WebP"
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

  const modelPicker = (
    <div className="grid gap-2 sm:grid-cols-2">
      {(Object.keys(MODELS) as SegmentModel[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => runAi(m)}
          className="flex min-h-20 flex-col items-start rounded-xl border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-lime-700 hover:bg-lime-50/50"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
            <Sparkles aria-hidden className="h-4 w-4 text-lime-700" /> {MODELS[m].label}
          </span>
          <span className="mt-1 text-xs text-zinc-600">
            {MODELS[m].hint} · einmaliger Download {MODELS[m].size}
          </span>
        </button>
      ))}
    </div>
  );

  const panning = tool === "pan" || spaceDown;
  const cursorStyle =
    tool === "brush" && !panning && hover && kz > 0 && phase === "edit" ? { left: hover.x * kz, top: hover.y * kz, width: brushSize * kz, height: brushSize * kz } : null;

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-3">
          {phase === "edit" && (
            <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Werkzeuge">
              {variant === "manual" && (
                <>
                  <button type="button" onClick={() => setTool("lasso")} aria-pressed={tool === "lasso"} className={`${btnSecondary} ${tool === "lasso" ? "border-lime-700 bg-lime-50 text-lime-900" : ""}`}>
                    <Lasso aria-hidden className="h-4 w-4" /> Lasso
                  </button>
                  <button type="button" onClick={() => setTool("polygon")} aria-pressed={tool === "polygon"} className={`${btnSecondary} ${tool === "polygon" ? "border-lime-700 bg-lime-50 text-lime-900" : ""}`}>
                    <Pentagon aria-hidden className="h-4 w-4" /> Polygon
                  </button>
                </>
              )}
              <button type="button" onClick={() => setTool("brush")} aria-pressed={tool === "brush"} className={`${btnSecondary} ${tool === "brush" ? "border-lime-700 bg-lime-50 text-lime-900" : ""}`}>
                <Brush aria-hidden className="h-4 w-4" /> Pinsel
              </button>
              <button
                type="button"
                onClick={() => setTool("pan")}
                aria-pressed={tool === "pan"}
                className={`${btnIcon} ${tool === "pan" ? "border-lime-700 bg-lime-50 text-lime-900" : ""}`}
                aria-label="Ansicht verschieben (Hand, auch Leertaste gedrückt halten)"
                title="Verschieben (Leertaste)"
              >
                <Hand aria-hidden className="h-4 w-4" />
              </button>
              <div className="flex overflow-hidden rounded-xl border border-zinc-300" role="radiogroup" aria-label="Modus">
                <button type="button" role="radio" aria-checked={add} onClick={() => setAdd(true)} className={`min-h-11 px-3 text-sm font-medium ${add ? "bg-lime-700 text-white" : "bg-white text-zinc-700 hover:bg-zinc-50"}`}>
                  {variant === "auto" ? "Wiederherstellen" : "Hinzufügen"}
                </button>
                <button type="button" role="radio" aria-checked={!add} onClick={() => setAdd(false)} className={`min-h-11 px-3 text-sm font-medium ${!add ? "bg-lime-700 text-white" : "bg-white text-zinc-700 hover:bg-zinc-50"}`}>
                  {variant === "auto" ? (
                    <span className="inline-flex items-center gap-1">
                      <Eraser aria-hidden className="h-4 w-4" /> Radierer
                    </span>
                  ) : (
                    "Entfernen"
                  )}
                </button>
              </div>
              <div className="ml-auto flex gap-2">
                <button type="button" className={btnIcon} onClick={undo} disabled={undoCount === 0} aria-label="Rückgängig" title="Rückgängig">
                  <Undo2 aria-hidden className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={btnIcon}
                  aria-label="Original anzeigen (gedrückt halten)"
                  title="Original anzeigen (gedrückt halten)"
                  onPointerDown={() => setShowOriginal(true)}
                  onPointerUp={() => setShowOriginal(false)}
                  onPointerLeave={() => setShowOriginal(false)}
                >
                  <Eye aria-hidden className="h-4 w-4" />
                </button>
                <button type="button" className={btnIcon} onClick={reset} aria-label="Anderes Bild wählen" title="Anderes Bild">
                  <ImagePlus aria-hidden className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className={`rounded-xl p-3 sm:p-5 ${preview === "cutout" && phase === "edit" && bg === "transparent" ? "bg-zinc-100" : "bg-zinc-100"}`}>
            <div ref={wrapRef} className="flex w-full justify-center">
              {work && k > 0 && (
                <div ref={viewportRef} className="relative overflow-hidden" style={{ width: work.w * k, height: work.h * k }}>
                  <div
                    className="absolute left-0 top-0 origin-top-left"
                    style={{ width: work.w * kz, height: work.h * kz, transform: `translate(${pan.x}px, ${pan.y}px)` }}
                  >
                  <canvas
                    ref={displayRef}
                    className={`block h-full w-full touch-none ${preview === "cutout" ? "bg-transparency-grid" : ""} ${
                      phase === "edit" ? (panning ? "cursor-grab active:cursor-grabbing" : tool === "brush" ? "cursor-none" : "cursor-crosshair") : ""
                    }`}
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                    onPointerLeave={() => setHover(null)}
                    onDoubleClick={() => {
                      if (tool === "polygon" && poly.length >= 3) {
                        fillPolygon(poly, add);
                        setPoly([]);
                      }
                    }}
                    aria-label={variant === "auto" ? "Bild ohne Hintergrund – Vorschau" : "Bild freistellen – Arbeitsfläche"}
                    role="img"
                  />
                  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${work.w} ${work.h}`} preserveAspectRatio="none" aria-hidden>
                    {lassoPts.length > 1 && (
                      <polyline points={lassoPts.map((p) => `${p.x},${p.y}`).join(" ")} fill="rgba(101,163,13,0.15)" stroke="#a3e635" strokeWidth={2 / kz} strokeDasharray={`${6 / kz} ${4 / kz}`} />
                    )}
                    {poly.length > 0 && (
                      <>
                        <polyline
                          points={[...poly, ...(hover ? [hover] : [])].map((p) => `${p.x},${p.y}`).join(" ")}
                          fill="rgba(101,163,13,0.15)"
                          stroke="#a3e635"
                          strokeWidth={2 / kz}
                        />
                        {poly.map((p, i) => (
                          <circle key={i} cx={p.x} cy={p.y} r={(i === 0 ? 7 : 4) / kz} fill={i === 0 ? "#4d7c0f" : "#fff"} stroke="#4d7c0f" strokeWidth={1.5 / kz} />
                        ))}
                      </>
                    )}
                  </svg>
                  {cursorStyle && (
                    <div
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white outline outline-1 outline-black/50"
                      style={cursorStyle}
                      aria-hidden
                    />
                  )}
                  </div>
                  {phase === "edit" && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-xl border border-zinc-200 bg-white/95 p-1 shadow-sm">
                      <button type="button" onClick={() => zoomAt(zoom / 1.5)} disabled={zoom <= 1} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-40" aria-label="Verkleinern (−)" title="Verkleinern (−)">
                        <ZoomOut aria-hidden className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-mono text-xs font-semibold text-zinc-800" aria-live="polite">
                        {Math.round(zoom * 100)} %
                      </span>
                      <button type="button" onClick={() => zoomAt(zoom * 1.5)} disabled={zoom >= MAX_ZOOM} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-40" aria-label="Vergrößern (+)" title="Vergrößern (+)">
                        <ZoomIn aria-hidden className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => zoomAt(1)} disabled={zoom === 1} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-40" aria-label="Ganzes Bild anzeigen (0)" title="Einpassen (0)">
                        <Maximize aria-hidden className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {phase !== "edit" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/75 p-4 backdrop-blur-sm">
                      {phase === "pick" ? (
                        <div className="w-full max-w-lg">
                          <p className="mb-3 text-center text-sm font-semibold text-zinc-900">Was ist auf dem Foto?</p>
                          {modelPicker}
                          <p className="mt-3 text-center text-xs text-zinc-600">Das Modell wird einmalig geladen und im Browser gespeichert. Ihr Foto verlässt Ihr Gerät nicht.</p>
                        </div>
                      ) : (
                        <div className="w-full max-w-xs text-center" role="status" aria-live="polite">
                          <Loader2 aria-hidden className="mx-auto h-8 w-8 animate-spin text-lime-700" />
                          <p className="mt-3 text-sm font-semibold text-zinc-900">{aiStage === "download" ? "KI-Modell wird geladen …" : "Motiv wird erkannt …"}</p>
                          {aiStage === "download" && aiProgress !== null && (
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
                              <div className="h-full bg-lime-700 transition-[width]" style={{ width: `${Math.round(aiProgress * 100)}%` }} />
                            </div>
                          )}
                          <p className="mt-2 text-xs text-zinc-600">Je nach Gerät dauert das einige Sekunden bis etwa eine Minute.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {phase === "edit" && variant === "manual" && maskEmpty && (
            <p className="text-center text-sm text-zinc-700">
              {tool === "polygon"
                ? "Klicken Sie Punkte um das Objekt. Zum Schließen auf den ersten Punkt klicken, doppelklicken oder Enter drücken."
                : "Umranden Sie das Objekt mit gedrückter Maustaste oder dem Finger – oder nutzen Sie rechts die KI-Vorauswahl."}
            </p>
          )}
          {image.downscaled && <p className="text-center text-xs text-amber-700">Das Foto war für diesen Browser zu groß und wurde vorab proportional verkleinert.</p>}
          {error && <ErrorBanner onClose={() => setError(null)}>{error}</ErrorBanner>}
        </div>

        <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          {variant === "manual" && phase === "edit" && (
            <Panel title="KI-Vorauswahl">
              <p className="text-xs leading-snug text-zinc-600">Erkennt das Hauptmotiv automatisch. Danach mit Lasso oder Pinsel anpassen.</p>
              {modelPicker}
            </Panel>
          )}
          {phase === "edit" && (
            <Panel title="Feinarbeit">
              {tool === "brush" && (
                <>
                  <Slider label="Pinselgröße" value={brushSize} min={4} max={200} onChange={setBrushSize} display={`${brushSize} px`} />
                  <Slider label="Pinselhärte" value={hardness} min={0} max={100} step={5} onChange={setHardness} display={`${hardness} %`} />
                </>
              )}
              <Slider label="Kantenweichheit" value={feather} min={0} max={20} onChange={setFeather} display={feather === 0 ? "hart" : `${feather} px`} />
              <Segmented
                label="Ansicht"
                value={preview}
                onChange={setPreview}
                options={[
                  { value: "cutout", label: "Ergebnis" },
                  { value: "mask", label: "Auswahl" },
                ]}
              />
            </Panel>
          )}
          {phase === "edit" && (
            <div className="space-y-3 border-t border-zinc-200 pt-4">
              <Segmented
                label="Hintergrund"
                value={bg === "image" && !hasBgImage ? "transparent" : bg}
                onChange={(v) => {
                  setBg(v);
                  if (v !== "transparent" && format === "png" && variant === "auto") setFormat("jpeg");
                }}
                columns={2}
                options={[
                  { value: "transparent", label: "Transparent" },
                  { value: "white", label: "Weiß" },
                  { value: "color", label: "Farbe" },
                  { value: "blur", label: "Unscharf" },
                ]}
              />
              {bg === "color" && (
                <label className="flex items-center gap-3 text-sm text-zinc-800">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-zinc-300 bg-white" />
                  Hintergrundfarbe wählen
                </label>
              )}
              <label className={`${btnSecondary} w-full cursor-pointer`}>
                <ImagePlus aria-hidden className="h-4 w-4" />
                {bg === "image" && hasBgImage ? "Anderes Hintergrundbild" : "Eigenes Hintergrundbild"}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && pickBgImage(e.target.files[0])} />
              </label>
              <Segmented
                label="Format"
                value={effFormat}
                onChange={setFormat}
                options={[
                  { value: "png", label: "PNG" },
                  { value: "webp", label: "WebP" },
                  { value: "jpeg", label: "JPG", disabled: transparentOut },
                ]}
              />
              {variant === "manual" && <Toggle label="Auf Motiv zuschneiden" checked={trim} onChange={setTrim} description="Entfernt leere Ränder um die Auswahl." />}
              <button type="button" className={`${btnPrimary} w-full`} onClick={download} disabled={exporting || maskEmpty}>
                {exporting ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Download aria-hidden className="h-4 w-4" />}
                {variant === "auto" ? "Bild ohne Hintergrund speichern" : "Freigestelltes Bild speichern"}
              </button>
              {canClipboard && (
                <button type="button" className={`${btnSecondary} w-full`} onClick={copy} disabled={maskEmpty}>
                  <Clipboard aria-hidden className="h-4 w-4" /> {copied ? "Kopiert!" : "In Zwischenablage kopieren"}
                </button>
              )}
              {lastSize !== null && <p className="text-center text-xs text-zinc-600">Gespeichert: {formatBytes(lastSize)} · volle Auflösung</p>}
              {variant === "auto" && (
                <button type="button" className={`${btnSecondary} w-full`} onClick={() => setPhase("pick")}>
                  <Wand2 aria-hidden className="h-4 w-4" /> KI erneut anwenden
                </button>
              )}
            </div>
          )}
          {phase !== "edit" && (
            <Panel title="So funktioniert es">
              <ol className="list-decimal space-y-1.5 pl-4 text-sm text-zinc-700">
                <li>Motivtyp wählen – das passende KI-Modell wird geladen.</li>
                <li>Die KI trennt Motiv und Hintergrund lokal in Ihrem Browser.</li>
                <li>Kanten mit dem Pinsel korrigieren und speichern.</li>
              </ol>
              <button type="button" className={`${btnSecondary} w-full`} onClick={reset}>
                <ImagePlus aria-hidden className="h-4 w-4" /> Anderes Bild wählen
              </button>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
}
