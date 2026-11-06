/**
 * Site-wide constants. Brand and domain are still placeholders from the first
 * implementation (see docs/audit/2026-11-06-audit-and-plan.md, L3) – change
 * them here only.
 */
export const SITE_URL = "https://fotowerkzeuge.online";
export const SITE_NAME = "FotoWerkzeuge";
export const SITE_TAGLINE = "Kostenlose Foto-Tools im Browser";
export const SITE_LOCALE = "de_DE";
export const MAX_TITLE_LENGTH = 60;

/** Absolute URL for a path like "/bild-verkleinern/". */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
