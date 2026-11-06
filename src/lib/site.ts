/**
 * Site-wide constants.
 * Official production domain and brand for FotoFixer.
 */
export const SITE_URL = "https://www.fotofixer.de";
export const SITE_NAME = "FotoFixer";
export const SITE_TAGLINE = "Kostenlose Foto-Tools im Browser";
export const SITE_LOCALE = "de_DE";
export const MAX_TITLE_LENGTH = 60;

/** Absolute URL for a path like "/bild-verkleinern/". */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
