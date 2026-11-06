# Page Creation Tracker — DACH Photo-Utility Website

> **🚨 MANDATORY AGENT INSTRUCTION (FOR CLAUDE / ANTIGRAVITY):**
> 1. **BEFORE CREATING A PAGE:**
>    - Check this tracker to verify the page status is `⬜ Not Started`.
>    - Consult `docs/seo/page-plans.md` for exact metadata, H1–H4, outline, FAQs, and specs.
>    - Consult `docs/seo/internal-linking.md` for the exact required internal links.
>    - Consult `docs/seo/cannibalization.md` to maintain proper keyword differentiation.
>    - Mark the page status here to `🟡 In Progress`.
> 2. **AFTER CREATING A PAGE:**
>    - Change status here to `✅ Done` and record the current date.
>    - When internal links to/from other live pages are backfilled, mark the Links column as `🔗 Done`.
>    - Append a line to the `## Update Log` at the bottom of this file.
>    - Set `live: true` for the page in `src/lib/tools.ts` (CLAUDE.md §3.8). Pages that are not live must never be linked or listed anywhere.

---

## Status Legend

| Status | Meaning |
|---|---|
| ⬜ Not Started | Page has not been created yet |
| 🟡 In Progress | Page is being worked on |
| ✅ Done | Page is created and verified |
| 🔗 Links Added | Internal links backfilled to/from this page |

---

## Homepage

| Page | URL | Primary KW | Status | Date | Notes |
|---|---|---|---|---|---|
| HOME | `/` | bilder kostenlos bearbeiten | ✅ Done | 2026-11-06 | Hub page: canvas editor (crop/rotate/adjust/export), tool search + directory of **live** tools only, WebSite/Organization/ItemList/FAQ schema. Rebuilt after audit 2026-11-06. |

---

## Legal Pages (Pre-Launch Required)

| Page | URL | Status | Date | Notes |
|---|---|---|---|---|
| Impressum | `/impressum/` | ✅ Done | 2026-11-06 | DE § 5 DDG, AT § 5 ECG / § 25 MedienG, CH UWG compliant |
| Datenschutz | `/datenschutz/` | ✅ Done | 2026-11-06 | GDPR + revDSG compliant (client-side in-browser processing) |
| Cookie-Einstellungen | — | ⬜ Not needed yet | — | No cookies/tracking set. Re-evaluate before adding any analytics (TDDDG/TKG). |

---

## Batch 1 — P1 Priority (Pages 1–5)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 1 | P3 | `/jpg-komprimieren/` | compress JPG | jpg komprimieren | Tool | ✅ Done | 2026-11-06 | 🔗 Done |
| 2 | P2 | `/bilder-komprimieren/` | compress images | bilder komprimieren | Tool | ✅ Done | 2026-11-06 | 🔗 Done |
| 3 | P1 | `/bild-verkleinern/` | resize image | bild verkleinern | Tool | ✅ Done | 2026-11-06 | 🔗 Done |
| 4 | P40 | `/hintergrund-entfernen/` | remove background | hintergrund entfernen | Tool | ✅ Done | 2026-11-06 | 🔗 Done |
| 5 | P27 | `/heic-in-jpg/` | HEIC to JPG | heic in jpg umwandeln | Tool | ✅ Done | 2026-11-06 | 🔗 Done |

---

## Batch 2 — P1 Priority (Pages 6–10)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 6 | P51 | `/bild-zuschneiden/` | crop image | bild zuschneiden | Tool | ✅ Done | 2026-11-06 | 🔗 Done |
| 7 | P21 | `/bildgroesse-aendern/` | change image size | bildgröße ändern | Tool | ✅ Done | 2026-11-06 | 🔗 Done |
| 8 | P4 | `/png-komprimieren/` | compress PNG | png komprimieren | Tool | ✅ Done | 2026-11-06 | 🔗 Done |
| 9 | P5 | `/gif-komprimieren/` | compress GIF | gif komprimieren | Tool | ✅ Done | 2026-11-06 | 🔗 Done |
| 10 | P41 | `/bild-freistellen/` | cut out subject | bild freistellen online | Tool | ✅ Done | 2026-11-06 | 🔗 Done |

---

## Batch 3 (Pages 11–15)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 11 | P33 | `/webp-in-jpg/` | WebP to JPG | webp in jpg umwandeln | Tool | ⬜ Not Started | — | ⬜ |
| 12 | P52 | `/bild-rund-ausschneiden/` | circle crop | bild rund ausschneiden | Tool | ⬜ Not Started | — | ⬜ |
| 13 | P31 | `/png-in-jpg/` | PNG to JPG | png in jpg umwandeln | Tool | ⬜ Not Started | — | ⬜ |
| 14 | P32 | `/jpg-in-png/` | JPG to PNG | jpg in png umwandeln | Tool | ⬜ Not Started | — | ⬜ |
| 15 | P37 | `/bilder-in-jpg-umwandeln/` | images to JPG | bilder in jpg umwandeln | Tool | ⬜ Not Started | — | ⬜ |

---

## Batch 4 (Pages 16–20)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 16 | P39 | `/bildformat-aendern/` | format converter hub | bildformat ändern | Tool (Hub) | ⬜ Not Started | — | ⬜ |
| 17 | P42 | `/hintergrund-transparent-machen/` | transparent background | bild hintergrund transparent machen | Tool | ⬜ Not Started | — | ⬜ |
| 18 | P43 | `/bild-transparenter-machen/` | change opacity | bild transparenter machen | Tool | ⬜ Not Started | — | ⬜ |
| 19 | P59 | `/bild-schaerfen/` | sharpen image | bild schärfen online | Tool | ⬜ Not Started | — | ⬜ |
| 20 | P58 | `/bildqualitaet-verbessern/` | improve quality | bildqualität verbessern | Tool | ⬜ Not Started | — | ⬜ |

---

## Batch 5 (Pages 21–25)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 21 | P54 | `/bild-spiegeln/` | mirror/flip | bild spiegeln online | Tool | ⬜ Not Started | — | ⬜ |
| 22 | P69 | `/bildbearbeitung-app-kostenlos/` | free editing app | bildbearbeitungs app kostenlos | Commercial | ⬜ Not Started | — | ⬜ |
| 23 | P12 | `/bilder-fuer-email-verkleinern/` | resize for email | bilder für e mail verkleinern | Tool | ⬜ Not Started | — | ⬜ |
| 24 | P68 | `/bildbearbeitungsprogramm-kostenlos/` | free editing software | bildbearbeitungsprogramm kostenlos | Commercial | ⬜ Not Started | — | ⬜ |
| 25 | P63 | `/foto-in-zeichnung-umwandeln/` | photo to drawing | fotos in zeichnung umwandeln | Tool | ⬜ Not Started | — | ⬜ |

---

## Batch 6 (Pages 26–30)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 26 | P64 | `/foto-in-comic-umwandeln/` | photo to comic | foto umwandeln in comic | Tool | ⬜ Not Started | — | ⬜ |
| 27 | P8 | `/bild-mb-verkleinern/` | reduce to MB | mb verkleinern | Tool | ⬜ Not Started | — | ⬜ |
| 28 | P66 | `/lustige-fotos-bearbeiten/` | funny photo edits | lustige fotos bearbeiten kostenlos | Tool | ⬜ Not Started | — | ⬜ |
| 29 | P7 | `/tiff-komprimieren/` | compress TIFF | tiff komprimieren | Tool | ⬜ Not Started | — | ⬜ |
| 30 | P22 | `/bildaufloesung-aendern/` | change DPI | bildauflösung ändern | Tool | ⬜ Not Started | — | ⬜ |

---

## Batch 7 (Pages 31–35)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 31 | P55 | `/bild-drehen/` | rotate image | bild drehen online | Tool | ⬜ Not Started | — | ⬜ |
| 32 | P57 | `/bild-zuschneiden-programme/` | crop in programs | bild zuschneiden photoshop | Guide | ⬜ Not Started | — | ⬜ |
| 33 | P17 | `/android-fotos-komprimieren/` | compress Android | foto komprimieren android | Tool+Guide | ⬜ Not Started | — | ⬜ |
| 34 | P18 | `/bilder-verkleinern-mac/` | resize on Mac | bild verkleinern mac | Guide | ⬜ Not Started | — | ⬜ |
| 35 | P19 | `/bilder-verkleinern-windows/` | resize on Windows | bild verkleinern windows | Guide | ⬜ Not Started | — | ⬜ |

---

## Batch 8 (Pages 36–40)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 36 | P30 | `/iphone-fotos-in-jpg-umwandeln/` | iPhone to JPG | iphone foto in jpg umwandeln | Guide+Tool | ⬜ Not Started | — | ⬜ |
| 37 | P20 | `/bilder-in-powerpoint-komprimieren/` | compress in PPT | bilder in powerpoint komprimieren | Guide | ⬜ Not Started | — | ⬜ |
| 38 | P16 | `/iphone-fotos-verkleinern/` | resize iPhone photos | iphone bilder verkleinern | Tool+Guide | ⬜ Not Started | — | ⬜ |
| 39 | P10 | `/bild-verkleinern-ohne-qualitaetsverlust/` | resize no quality loss | bild verkleinern ohne qualitätsverlust | Tool+Guide | ⬜ Not Started | — | ⬜ |
| 40 | P6 | `/webp-komprimieren/` | compress WebP | webp komprimieren | Tool | ⬜ Not Started | — | ⬜ |

---

## Batch 9 (Pages 41–45)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 41 | P34 | `/webp-in-png/` | WebP to PNG | webp in png umwandeln | Tool | ⬜ Not Started | — | ⬜ |
| 42 | P56 | `/bild-zuschneiden-mac/` | crop on Mac | bild zuschneiden mac | Guide | ⬜ Not Started | — | ⬜ |
| 43 | P26 | `/bildgroesse-aendern-photoshop-gimp/` | resize in PS/GIMP | photoshop bildgröße ändern | Guide | ⬜ Not Started | — | ⬜ |
| 44 | P36 | `/png-in-webp/` | PNG to WebP | png in webp umwandeln | Tool | ⬜ Not Started | — | ⬜ |
| 45 | P35 | `/jpg-in-webp/` | JPG to WebP | jpg in webp umwandeln | Tool | ⬜ Not Started | — | ⬜ |

---

## Batch 10 (Pages 46–50)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 46 | P23 | `/bildgroesse-in-cm-aendern/` | resize in cm | bildgröße ändern cm | Tool | ⬜ Not Started | — | ⬜ |
| 47 | P46 | `/weissen-hintergrund-entfernen/` | remove white bg | weißen hintergrund entfernen | Tool | ⬜ Not Started | — | ⬜ |
| 48 | P11 | `/mehrere-bilder-verkleinern/` | batch resize | mehrere bilder auf einmal verkleinern | Tool | ⬜ Not Started | — | ⬜ |
| 49 | P25 | `/seitenverhaeltnis-aendern/` | change aspect ratio | bild seitenverhältnis ändern | Tool | ⬜ Not Started | — | ⬜ |
| 50 | P50 | `/bild-in-bild-einfuegen/` | image overlay | bild in bild einfügen online kostenlos | Tool | ⬜ Not Started | — | ⬜ |

---

## Batch 11 (Pages 51–55)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 51 | P65 | `/fotofilter-effekte/` | photo filters | filter für fotos kostenlos | Tool | ⬜ Not Started | — | ⬜ |
| 52 | P29 | `/heic-in-jpg-mac/` | HEIC to JPG Mac | heic in jpg umwandeln mac | Guide | ⬜ Not Started | — | ⬜ |
| 53 | P47 | `/schwarzen-hintergrund-entfernen/` | remove black bg | schwarzer hintergrund entfernen | Tool | ⬜ Not Started | — | ⬜ |
| 54 | P61 | `/fotos-retuschieren/` | retouch photos | fotos retuschieren kostenlos | Tool | ⬜ Not Started | — | ⬜ |
| 55 | P28 | `/heic-in-jpg-windows/` | HEIC to JPG Windows | heic in jpg umwandeln windows | Guide | ⬜ Not Started | — | ⬜ |

---

## Batch 12 (Pages 56–60)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 56 | P38 | `/bild-in-png-umwandeln/` | convert to PNG | bild in png umwandeln | Tool | ⬜ Not Started | — | ⬜ |
| 57 | P44 | `/hintergrund-weiss-machen/` | white background | bild hintergrund weiß machen | Tool | ⬜ Not Started | — | ⬜ |
| 58 | P14 | `/instagram-bildgroesse-anpassen/` | Instagram size | bildgröße für instagram anpassen | Tool | ⬜ Not Started | — | ⬜ |
| 59 | P24 | `/bild-vergroessern/` | enlarge image | bild größer machen | Tool | ⬜ Not Started | — | ⬜ |
| 60 | P45 | `/hintergrund-aendern/` | change background | bild hintergrund ändern kostenlos | Tool | ⬜ Not Started | — | ⬜ |

---

## Batch 13 (Pages 61–65)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 61 | P60 | `/bilder-entpixeln/` | depixelate | bilder entpixeln kostenlos | Tool | ⬜ Not Started | — | ⬜ |
| 62 | P13 | `/whatsapp-bild-verkleinern/` | WhatsApp resize | whatsapp bild verkleinern | Tool | ⬜ Not Started | — | ⬜ |
| 63 | P62 | `/alte-fotos-restaurieren/` | restore old photos | alte fotos verbessern kostenlos | Tool | ⬜ Not Started | — | ⬜ |
| 64 | P48 | `/personen-ausschneiden/` | cut out people | foto personen ausschneiden | Tool | ⬜ Not Started | — | ⬜ |
| 65 | P53 | `/bild-auf-bestimmte-groesse-zuschneiden/` | exact size crop | bild auf bestimmte größe zuschneiden | Tool | ⬜ Not Started | — | ⬜ |

---

## Batch 14 (Pages 66–69)

| # | Page ID | URL | Slug (EN) | Primary KW | Type | Status | Date | Links |
|---|---|---|---|---|---|---|---|---|
| 66 | P9 | `/bild-kb-verkleinern/` | reduce to KB | bild kb verkleinern | Tool | ⬜ Not Started | — | ⬜ |
| 67 | P15 | `/facebook-bild-verkleinern/` | Facebook resize | bild für facebook verkleinern | Tool | ⬜ Not Started | — | ⬜ |
| 68 | P49 | `/personen-entfernen/` | remove people | personen im hintergrund entfernen | Tool | ⬜ Not Started | — | ⬜ |
| 69 | P67 | `/bild-schwarz-weiss/` | black & white | jpg schwarz weiß umwandeln online | Tool | ⬜ Not Started | — | ⬜ |

---

## Summary

| Status | Count |
|---|---|
| ⬜ Not Started | 59 landing pages |
| 🟡 In Progress | 0 |
| ✅ Done | 13 (Homepage, Impressum, Datenschutz, Batch 1, Batch 2) |
| **Total** | **73** |

---

## Update Log

| Date | Action | Pages |
|---|---|---|
| 2026-11-06 | Tracker created | — |
| 2026-11-06 | Created Launch Day Pages (HOME, Impressum, Datenschutz) with Fabric.js editor component & DESIGN.md | `/`, `/impressum/`, `/datenschutz/` |
| 2026-11-06 | Full audit (docs/audit/2026-11-06-audit-and-plan.md); rebuilt homepage, header/footer, editor (Fabric.js removed); added sitemap, robots, manifest, OG image, 404; `live` flag registry in `src/lib/tools.ts` | all |
| 2026-11-06 | Batch 1 live: P3, P2, P1, P40, P27 | `/jpg-komprimieren/`, `/bilder-komprimieren/`, `/bild-verkleinern/`, `/hintergrund-entfernen/`, `/heic-in-jpg/` |
| 2026-11-06 | Batch 2 live: P51, P21, P4, P5, P41 | `/bild-zuschneiden/`, `/bildgroesse-aendern/`, `/png-komprimieren/`, `/gif-komprimieren/`, `/bild-freistellen/` |
| 2026-11-06 | Web Worker processing, self-hosted AI models (no third-party requests), zoom in cut-out editor, cookieless usage events (/api/event), new page `/ueber-uns/` | `/ueber-uns/` + all tools |
