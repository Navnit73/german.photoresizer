/** Download, ZIP and formatting helpers (German number formatting). */

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb.toLocaleString("de-DE", { maximumFractionDigits: kb < 10 ? 1 : 0 })} KB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toLocaleString("de-DE", { maximumFractionDigits: mb < 10 ? 2 : 1 })} MB`;
}

export function formatDims(w: number, h: number): string {
  return `${w} × ${h} px`;
}

/** "-38 %" style saving; negative values mean the file got larger. */
export function savingPercent(before: number, after: number): number {
  if (before <= 0) return 0;
  return Math.round(((before - after) / before) * 100);
}

export function baseName(name: string): string {
  return name.replace(/\.[^/.]+$/, "") || "bild";
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Builds a ZIP (stored, no re-compression – images are already compressed). */
export async function zipFiles(files: { name: string; blob: Blob }[]): Promise<Blob> {
  const { zipSync } = await import("fflate");
  const used = new Set<string>();
  const entries: Record<string, [Uint8Array, { level: 0 }]> = {};
  for (const f of files) {
    let name = f.name;
    let n = 2;
    while (used.has(name.toLowerCase())) {
      name = f.name.replace(/(\.[^.]+)?$/, (ext) => `-${n}${ext}`);
      n++;
    }
    used.add(name.toLowerCase());
    entries[name] = [new Uint8Array(await f.blob.arrayBuffer()), { level: 0 }];
  }
  const zipped = zipSync(entries);
  return new Blob([zipped as Uint8Array<ArrayBuffer>], { type: "application/zip" });
}
