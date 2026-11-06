/**
 * Cookieless tool-usage events (checklist #44): upload, download, error.
 * - First-party only: POST /api/event via sendBeacon – no cookies, no storage,
 *   no identifiers, no file names or image data.
 * - Respects Do Not Track and Global Privacy Control.
 * See Datenschutzerklärung §5.
 */

export type TrackEvent = "upload" | "download" | "error";

export interface TrackProps {
  /** Number of files involved. */
  count?: number;
  /** Output format, e.g. "jpeg". */
  format?: string;
  /** "single" | "zip" | "clipboard" */
  kind?: string;
  /** Short machine-readable reason for errors (never user data). */
  code?: string;
}

function optedOut(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1";
}

export function track(event: TrackEvent, props: TrackProps = {}) {
  try {
    if (typeof window === "undefined" || optedOut()) return;
    const body = JSON.stringify({ e: event, p: location.pathname, ...props });
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/event", blob)) {
      void fetch("/api/event", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true, credentials: "omit" });
    }
  } catch {
    /* statistics must never break a tool */
  }
}

/** Maps an error to a coarse, non-personal code. */
export function errorCode(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/HEIC/i.test(msg)) return "heic_decode";
  if (/TIFF/i.test(msg)) return "tiff_unsupported";
  if (/unterstützt|kein unterstütztes/i.test(msg)) return "unsupported";
  if (/zu groß/i.test(msg)) return "too_large";
  if (/Modell|fetch|network/i.test(msg)) return "model_load";
  return "processing";
}
