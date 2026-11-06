/**
 * Single source of truth for all 69 planned tool/guide pages.
 *
 * RULE (see CLAUDE.md §3.8): a page is only linked anywhere on the site
 * (homepage directory, header, footer, related tools, in-text links, sitemap)
 * when its entry has `live: true`. Set `live: true` in the same change that
 * creates the page – links then appear everywhere automatically.
 */

export type GroupId =
  | "allgemein"
  | "verkleinern"
  | "groesse"
  | "formate"
  | "hintergrund"
  | "zuschneiden"
  | "qualitaet"
  | "kreativ";

export interface ToolGroup {
  id: GroupId;
  /** Label used in breadcrumbs and the directory filter. */
  label: string;
  /** H3 heading on the homepage directory (homepage-strategy.md). */
  homeHeading: string;
}

export const GROUPS: ToolGroup[] = [
  { id: "verkleinern", label: "Verkleinern & Komprimieren", homeHeading: "Bilder verkleinern und komprimieren" },
  { id: "hintergrund", label: "Hintergrund & Freistellen", homeHeading: "Hintergrund entfernen und freistellen" },
  { id: "formate", label: "Formate umwandeln", homeHeading: "Bildformate umwandeln" },
  { id: "zuschneiden", label: "Zuschneiden & Transformieren", homeHeading: "Zuschneiden, drehen und spiegeln" },
  { id: "groesse", label: "Größe & Auflösung", homeHeading: "Bildgröße und Auflösung ändern" },
  { id: "qualitaet", label: "Qualität & Retusche", homeHeading: "Bildqualität verbessern" },
  { id: "kreativ", label: "Kreativ & Effekte", homeHeading: "Kreative Effekte" },
  { id: "allgemein", label: "Bildbearbeitung allgemein", homeHeading: "Bildbearbeitung allgemein" },
];

export type PageType = "Tool" | "Guide" | "Tool+Guide" | "Guide+Tool" | "Commercial" | "Tool (Hub)";

export interface ToolEntry {
  id: string;
  path: string;
  /** Exact anchor text from internal-linking.md. */
  name: string;
  /** One-sentence benefit for tiles (German, no unverifiable claims). */
  desc: string;
  group: GroupId;
  type: PageType;
  live: boolean;
  /** ISO date the page went live (for sitemap lastModified). */
  liveSince?: string;
}

export const TOOLS: ToolEntry[] = [
  // Verkleinern & Komprimieren
  { id: "P1", group: "verkleinern", type: "Tool", path: "/bild-verkleinern/", name: "Bild verkleinern", desc: "Pixelmaße oder Dateigröße reduzieren – auch mehrere Fotos auf einmal.", live: true, liveSince: "2026-11-06" },
  { id: "P2", group: "verkleinern", type: "Tool", path: "/bilder-komprimieren/", name: "Bilder komprimieren", desc: "Dateigröße senken, Pixelmaße bleiben gleich – JPG, PNG und WebP.", live: true, liveSince: "2026-11-06" },
  { id: "P3", group: "verkleinern", type: "Tool", path: "/jpg-komprimieren/", name: "JPG komprimieren", desc: "JPEG-Optimierung mit Qualitätsstufe, progressivem JPG und EXIF-Option.", live: true, liveSince: "2026-11-06" },
  { id: "P4", group: "verkleinern", type: "Tool", path: "/png-komprimieren/", name: "PNG komprimieren", desc: "PNG verlustfrei oder per Farbreduzierung verkleinern – Transparenz bleibt.", live: true, liveSince: "2026-11-06" },
  { id: "P5", group: "verkleinern", type: "Tool", path: "/gif-komprimieren/", name: "GIF komprimieren", desc: "Animierte GIFs mit weniger Farben, Frames oder Pixeln verkleinern.", live: true, liveSince: "2026-11-06" },
  { id: "P6", group: "verkleinern", type: "Tool", path: "/webp-komprimieren/", name: "WebP komprimieren", desc: "WebP-Bilder für schnellere Ladezeiten optimieren.", live: false },
  { id: "P7", group: "verkleinern", type: "Tool", path: "/tiff-komprimieren/", name: "TIFF komprimieren", desc: "Große TIFF- und BMP-Dateien verkleinern.", live: false },
  { id: "P8", group: "verkleinern", type: "Tool", path: "/bild-mb-verkleinern/", name: "Bild auf 1 MB verkleinern", desc: "Feste Größenlimits wie 1 MB, 2 MB oder 5 MB einhalten.", live: false },
  { id: "P9", group: "verkleinern", type: "Tool", path: "/bild-kb-verkleinern/", name: "Bild auf KB verkleinern", desc: "Kleine Zielgrößen wie 100, 200 oder 500 KB erreichen.", live: false },
  { id: "P10", group: "verkleinern", type: "Tool+Guide", path: "/bild-verkleinern-ohne-qualitaetsverlust/", name: "Bild ohne Qualitätsverlust verkleinern", desc: "Hochwertiges Resampling und verlustfreie Optionen.", live: false },
  { id: "P11", group: "verkleinern", type: "Tool", path: "/mehrere-bilder-verkleinern/", name: "Mehrere Bilder gleichzeitig verkleinern", desc: "Stapelverarbeitung mit ZIP-Download.", live: false },
  { id: "P12", group: "verkleinern", type: "Tool", path: "/bilder-fuer-email-verkleinern/", name: "Bilder für E-Mail verkleinern", desc: "Fotos passend für E-Mail-Anhänge verkleinern.", live: false },
  { id: "P13", group: "verkleinern", type: "Tool", path: "/whatsapp-bild-verkleinern/", name: "Bild für WhatsApp verkleinern", desc: "Profilbild und Chat-Fotos passend machen.", live: false },
  { id: "P14", group: "verkleinern", type: "Tool", path: "/instagram-bildgroesse-anpassen/", name: "Bildgröße für Instagram anpassen", desc: "Formate für Beiträge, Storys und Profilbild.", live: false },
  { id: "P15", group: "verkleinern", type: "Tool", path: "/facebook-bild-verkleinern/", name: "Bild für Facebook verkleinern", desc: "Profil-, Titel- und Beitragsbilder anpassen.", live: false },
  { id: "P16", group: "verkleinern", type: "Tool+Guide", path: "/iphone-fotos-verkleinern/", name: "iPhone-Fotos verkleinern", desc: "iPhone-Fotos direkt im Browser verkleinern.", live: false },
  { id: "P17", group: "verkleinern", type: "Tool+Guide", path: "/android-fotos-komprimieren/", name: "Fotos auf Android komprimieren", desc: "Handyfotos ohne App-Installation optimieren.", live: false },
  { id: "P18", group: "verkleinern", type: "Guide", path: "/bilder-verkleinern-mac/", name: "Bilder am Mac verkleinern", desc: "Anleitung für die macOS-Vorschau und Online-Alternative.", live: false },
  { id: "P19", group: "verkleinern", type: "Guide", path: "/bilder-verkleinern-windows/", name: "Bilder unter Windows verkleinern", desc: "Anleitung für Windows 10/11 und Paint.", live: false },
  { id: "P20", group: "verkleinern", type: "Guide", path: "/bilder-in-powerpoint-komprimieren/", name: "Bilder in PowerPoint komprimieren", desc: "Präsentationen durch Bildkomprimierung verkleinern.", live: false },

  // Größe & Auflösung
  { id: "P21", group: "groesse", type: "Tool", path: "/bildgroesse-aendern/", name: "Bildgröße ändern", desc: "Breite und Höhe in Pixel oder Prozent exakt anpassen.", live: true, liveSince: "2026-11-06" },
  { id: "P22", group: "groesse", type: "Tool", path: "/bildaufloesung-aendern/", name: "Bildauflösung ändern", desc: "DPI-Wert für Druck und Bildschirm anpassen.", live: false },
  { id: "P23", group: "groesse", type: "Tool", path: "/bildgroesse-in-cm-aendern/", name: "Bildgröße in cm ändern", desc: "Druckmaße in Zentimetern und DIN-Formaten.", live: false },
  { id: "P24", group: "groesse", type: "Tool", path: "/bild-vergroessern/", name: "Bild vergrößern", desc: "Kleine Bilder hochskalieren.", live: false },
  { id: "P25", group: "groesse", type: "Tool", path: "/seitenverhaeltnis-aendern/", name: "Seitenverhältnis ändern", desc: "1:1, 4:3 oder 16:9 – zuschneiden oder auffüllen.", live: false },
  { id: "P26", group: "groesse", type: "Guide", path: "/bildgroesse-aendern-photoshop-gimp/", name: "Bildgröße in Photoshop ändern", desc: "Anleitung für Photoshop und GIMP.", live: false },

  // Formate umwandeln
  { id: "P27", group: "formate", type: "Tool", path: "/heic-in-jpg/", name: "HEIC in JPG umwandeln", desc: "iPhone-Fotos lokal im Browser ins JPG-Format konvertieren.", live: true, liveSince: "2026-11-06" },
  { id: "P28", group: "formate", type: "Guide", path: "/heic-in-jpg-windows/", name: "HEIC unter Windows in JPG umwandeln", desc: "HEIC unter Windows 10/11 öffnen und umwandeln.", live: false },
  { id: "P29", group: "formate", type: "Guide", path: "/heic-in-jpg-mac/", name: "HEIC am Mac in JPG umwandeln", desc: "Umwandlung mit Vorschau und Finder.", live: false },
  { id: "P30", group: "formate", type: "Guide+Tool", path: "/iphone-fotos-in-jpg-umwandeln/", name: "iPhone-Fotos in JPG umwandeln", desc: "iPhone auf JPG umstellen und Fotos konvertieren.", live: false },
  { id: "P31", group: "formate", type: "Tool", path: "/png-in-jpg/", name: "PNG in JPG umwandeln", desc: "PNG-Grafiken in kompakte JPGs umwandeln.", live: false },
  { id: "P32", group: "formate", type: "Tool", path: "/jpg-in-png/", name: "JPG in PNG umwandeln", desc: "JPG-Bilder als PNG speichern.", live: false },
  { id: "P33", group: "formate", type: "Tool", path: "/webp-in-jpg/", name: "WebP in JPG umwandeln", desc: "WebP-Bilder ins universelle JPG umwandeln.", live: false },
  { id: "P34", group: "formate", type: "Tool", path: "/webp-in-png/", name: "WebP in PNG umwandeln", desc: "WebP zu PNG mit Transparenz.", live: false },
  { id: "P35", group: "formate", type: "Tool", path: "/jpg-in-webp/", name: "JPG in WebP umwandeln", desc: "Website-Bilder ins WebP-Format bringen.", live: false },
  { id: "P36", group: "formate", type: "Tool", path: "/png-in-webp/", name: "PNG in WebP umwandeln", desc: "Transparente PNGs als kleinere WebP speichern.", live: false },
  { id: "P37", group: "formate", type: "Tool", path: "/bilder-in-jpg-umwandeln/", name: "Bilder in JPG umwandeln", desc: "Gängige Bildformate als JPG exportieren.", live: false },
  { id: "P38", group: "formate", type: "Tool", path: "/bild-in-png-umwandeln/", name: "Bild in PNG umwandeln", desc: "Gängige Bildformate als PNG speichern.", live: false },
  { id: "P39", group: "formate", type: "Tool (Hub)", path: "/bildformat-aendern/", name: "Bildformat ändern", desc: "Bildkonverter für alle gängigen Formatpaare.", live: false },

  // Hintergrund & Freistellen
  { id: "P40", group: "hintergrund", type: "Tool", path: "/hintergrund-entfernen/", name: "Hintergrund entfernen", desc: "Hintergrund automatisch per KI entfernen – transparentes PNG.", live: true, liveSince: "2026-11-06" },
  { id: "P41", group: "hintergrund", type: "Tool", path: "/bild-freistellen/", name: "Bild freistellen", desc: "Objekte mit Lasso, Pinsel und KI-Vorauswahl präzise ausschneiden.", live: true, liveSince: "2026-11-06" },
  { id: "P42", group: "hintergrund", type: "Tool", path: "/hintergrund-transparent-machen/", name: "Hintergrund transparent machen", desc: "Farbflächen transparent machen – für Logos und Signaturen.", live: false },
  { id: "P43", group: "hintergrund", type: "Tool", path: "/bild-transparenter-machen/", name: "Bild transparenter machen", desc: "Deckkraft eines Bildes stufenlos regeln.", live: false },
  { id: "P44", group: "hintergrund", type: "Tool", path: "/hintergrund-weiss-machen/", name: "Hintergrund weiß machen", desc: "Reinweißer Hintergrund für Produktfotos.", live: false },
  { id: "P45", group: "hintergrund", type: "Tool", path: "/hintergrund-aendern/", name: "Bildhintergrund ändern", desc: "Hintergrund durch Farbe oder eigenes Motiv ersetzen.", live: false },
  { id: "P46", group: "hintergrund", type: "Tool", path: "/weissen-hintergrund-entfernen/", name: "Weißen Hintergrund entfernen", desc: "Weiße Flächen um Logos und Scans entfernen.", live: false },
  { id: "P47", group: "hintergrund", type: "Tool", path: "/schwarzen-hintergrund-entfernen/", name: "Schwarzen Hintergrund entfernen", desc: "Schwarze Hintergründe bei Lichteffekten entfernen.", live: false },
  { id: "P48", group: "hintergrund", type: "Tool", path: "/personen-ausschneiden/", name: "Personen ausschneiden", desc: "Personen erkennen und freistellen.", live: false },
  { id: "P49", group: "hintergrund", type: "Tool", path: "/personen-entfernen/", name: "Personen aus Foto entfernen", desc: "Störende Personen aus Fotos entfernen.", live: false },
  { id: "P50", group: "hintergrund", type: "Tool", path: "/bild-in-bild-einfuegen/", name: "Bild in Bild einfügen", desc: "Zwei Fotos übereinanderlegen und kombinieren.", live: false },

  // Zuschneiden & Transformieren
  { id: "P51", group: "zuschneiden", type: "Tool", path: "/bild-zuschneiden/", name: "Bild zuschneiden", desc: "Ausschnitt frei oder per Vorlage wählen, gerade ausrichten, Ränder trimmen.", live: true, liveSince: "2026-11-06" },
  { id: "P52", group: "zuschneiden", type: "Tool", path: "/bild-rund-ausschneiden/", name: "Bild rund ausschneiden", desc: "Kreisförmiger Zuschnitt für Profilbilder.", live: false },
  { id: "P53", group: "zuschneiden", type: "Tool", path: "/bild-auf-bestimmte-groesse-zuschneiden/", name: "Bild auf bestimmte Größe zuschneiden", desc: "Fester Rahmen in Pixel oder Zentimetern.", live: false },
  { id: "P54", group: "zuschneiden", type: "Tool", path: "/bild-spiegeln/", name: "Bild spiegeln", desc: "Bilder horizontal oder vertikal spiegeln.", live: false },
  { id: "P55", group: "zuschneiden", type: "Tool", path: "/bild-drehen/", name: "Bild drehen", desc: "Bilder drehen und Horizonte begradigen.", live: false },
  { id: "P56", group: "zuschneiden", type: "Guide", path: "/bild-zuschneiden-mac/", name: "Bild am Mac zuschneiden", desc: "Anleitung für die macOS-Vorschau.", live: false },
  { id: "P57", group: "zuschneiden", type: "Guide", path: "/bild-zuschneiden-programme/", name: "Bild zuschneiden in Photoshop, Word & Co.", desc: "Anleitung für Photoshop, GIMP, Paint und Word.", live: false },

  // Qualität & Retusche
  { id: "P58", group: "qualitaet", type: "Tool", path: "/bildqualitaet-verbessern/", name: "Bildqualität verbessern", desc: "Rauschen mindern und Details verbessern.", live: false },
  { id: "P59", group: "qualitaet", type: "Tool", path: "/bild-schaerfen/", name: "Bild schärfen", desc: "Unscharfe Fotos nachschärfen.", live: false },
  { id: "P60", group: "qualitaet", type: "Tool", path: "/bilder-entpixeln/", name: "Bilder entpixeln", desc: "Pixelige Kanten und Blockartefakte glätten.", live: false },
  { id: "P61", group: "qualitaet", type: "Tool", path: "/fotos-retuschieren/", name: "Fotos retuschieren", desc: "Flecken und Unreinheiten entfernen.", live: false },
  { id: "P62", group: "qualitaet", type: "Tool", path: "/alte-fotos-restaurieren/", name: "Alte Fotos restaurieren", desc: "Kratzer und verblasste Farben ausbessern.", live: false },

  // Kreativ & Effekte
  { id: "P63", group: "kreativ", type: "Tool", path: "/foto-in-zeichnung-umwandeln/", name: "Foto in Zeichnung umwandeln", desc: "Fotos als Skizze oder Zeichnung darstellen.", live: false },
  { id: "P64", group: "kreativ", type: "Tool", path: "/foto-in-comic-umwandeln/", name: "Foto in Comic umwandeln", desc: "Comic- und Cartoon-Effekte für Fotos.", live: false },
  { id: "P65", group: "kreativ", type: "Tool", path: "/fotofilter-effekte/", name: "Fotofilter und Effekte", desc: "Vintage, Schwarz-Weiß, Vignette und mehr.", live: false },
  { id: "P66", group: "kreativ", type: "Tool", path: "/lustige-fotos-bearbeiten/", name: "Lustige Fotos bearbeiten", desc: "Sticker, Sprechblasen und Texte hinzufügen.", live: false },
  { id: "P67", group: "kreativ", type: "Tool", path: "/bild-schwarz-weiss/", name: "Bild schwarz-weiß machen", desc: "Fotos in Graustufen umwandeln.", live: false },

  // Bildbearbeitung allgemein
  { id: "P68", group: "allgemein", type: "Commercial", path: "/bildbearbeitungsprogramm-kostenlos/", name: "Kostenloses Bildbearbeitungsprogramm", desc: "Vergleich kostenloser Bildbearbeitungsprogramme.", live: false },
  { id: "P69", group: "allgemein", type: "Commercial", path: "/bildbearbeitung-app-kostenlos/", name: "Kostenlose Bildbearbeitungs-App", desc: "Die Web-App auf den Startbildschirm legen.", live: false },
];

const BY_ID = new Map(TOOLS.map((t) => [t.id, t]));
const BY_PATH = new Map(TOOLS.map((t) => [t.path, t]));

export function getTool(id: string): ToolEntry {
  const tool = BY_ID.get(id);
  if (!tool) throw new Error(`Unknown tool id: ${id}`);
  return tool;
}

export function getToolByPath(path: string): ToolEntry | undefined {
  return BY_PATH.get(path);
}

export function getGroup(id: GroupId): ToolGroup {
  return GROUPS.find((g) => g.id === id)!;
}

export const LIVE_TOOLS = TOOLS.filter((t) => t.live);

/** Live tools of a group, in registry order. */
export function liveToolsInGroup(id: GroupId): ToolEntry[] {
  return LIVE_TOOLS.filter((t) => t.group === id);
}

/** Live tools from an id list, preserving order; unpublished ids are dropped. */
export function liveTools(ids: string[]): ToolEntry[] {
  return ids.map((id) => BY_ID.get(id)).filter((t): t is ToolEntry => !!t && t.live);
}

/** Homepage section anchor for a group, e.g. "/#verkleinern". */
export function groupAnchor(id: GroupId): string {
  return `/#gruppe-${id}`;
}
