# Audit & Fix Plan — 2026-11-06

Scope: everything implemented before Batch 1 (homepage, header/footer, Fabric.js editor, tool directory, FAQ, Impressum, Datenschutz) plus the build of Batch 1 + Batch 2 (10 tool pages).

Severity: 🔴 critical (ranking/legal/broken) · 🟡 high · ⚪ medium/low

---

## 1. Technical SEO

| # | Sev | Finding | Fix |
|---|---|---|---|
| T1 | 🔴 | Homepage, header, footer link to **69 tool URLs that do not exist** (404). Wastes crawl budget, broken internal links, bad UX. | Central tool registry `src/lib/tools.ts` with a `live` flag. Directory, header, footer, related-tools and in-text links render only live pages. `ToolLink` renders plain text for unpublished targets, so links appear automatically when a page goes live (automatic backfill). |
| T2 | 🔴 | No `trailingSlash` config: routes are served as `/impressum` while every link uses `/impressum/` → a redirect on every internal link, inconsistent canonicals (checklist #5). | `trailingSlash: true` in `next.config.ts`. |
| T3 | 🔴 | No `sitemap.xml`, no `robots.txt` (checklist #8, #9). | `app/sitemap.ts` (home + legal + live tools only), `app/robots.ts`. |
| T4 | 🟡 | Home title is 70 chars (limit 60). Impressum/Datenschutz titles get the brand **twice** via the layout template (`Impressum \| FotoWerkzeuge.online \| FotoWerkzeuge`). | `buildMetadata()` helper: exact plan title, brand appended only when it still fits in 60 chars; `title.absolute` everywhere. |
| T5 | 🟡 | No canonical on legal pages; Open Graph only on home; no OG image; no Twitter card. | Self-referencing canonical, OG + Twitter on every page, generated `opengraph-image`. |
| T6 | 🟡 | No `hreflang` (de + x-default) (checklist #7). | `alternates.languages` on every page. |
| T7 | 🟡 | FAQ answers rendered only when open (`{isOpen && …}`) → closed answers missing from SSR HTML (checklist #4). | Server-rendered `<details>` FAQ; all answers in HTML. |
| T8 | 🟡 | FAQPage JSON-LD text **differs** from visible answers (Google guideline violation); FAQ content maintained twice. | One FAQ array drives both the visible FAQ and the schema. |
| T9 | 🟡 | Homepage schema missing Organization, ItemList, BreadcrumbList on subpages. | `src/lib/seo.ts` JSON-LD builders: WebSite, Organization, WebApplication, FAQPage, BreadcrumbList, ItemList. |
| T10 | ⚪ | No custom 404 with tool search (checklist #11). No web manifest. | `app/not-found.tsx` with live-tool links; `app/manifest.ts`. |
| T11 | ⚪ | `keywords` meta tag (ignored by Google, leaks strategy). | Removed. |
| T12 | ⚪ | Fabric.js (~300 kB) loaded for a single-image preview; hurts INP/LCP (checklist #2). | Editor rebuilt on plain `<canvas>`; codecs (MozJPEG, OxiPNG, WebP, GIF, HEIC, AI) load lazily only when a tool needs them. |

## 2. On-page SEO & content

| # | Sev | Finding | Fix |
|---|---|---|---|
| S1 | 🔴 | Heading hierarchy broken: tool tiles are `h4` directly under `h2` (no `h3`); footer uses `h4`/`h3` before any page `h2`; Datenschutz `h4` before first `h2`; editor upload area has an `h3` above all `h2`s. | Directory grouped as H2 → H3 group → H4 tile (homepage-strategy.md). Footer/editor/legal use non-heading elements where no hierarchy is intended. |
| S2 | 🔴 | Invented / false claims: "Die führende deutschsprachige Suite", "WebAssembly-Technologie" (none was used), "69 Foto-Tools verfügbar" (0 existed), batch/ZIP promised but not implemented, HEIC/TIFF listed as supported in the editor but not decodable, "DSGVO-Konformität garantiert". | Claims rewritten to match what the code actually does. Counts are derived from the registry. |
| S3 | 🔴 | Internal keyword-volume badges ("50k Suchen") shown to visitors. | Removed. |
| S4 | 🟡 | Homepage H2 "Beliebte Foto-Tools & Alle Werkzeuge im Überblick" deviates from plan ("Beliebte Foto-Tools"); target-audience H3 "Bewerbungen & Behördenkontakte" deviates ("Schulen, Vereine und Behördenkontakte"). | Aligned with homepage-strategy.md. |
| S5 | 🟡 | Header anchor links (`#editor`, `#tools`, `#faq`) are in the global layout → broken on every subpage. | Header links point to `/#…` or to real pages. |

## 3. UI / UX / Accessibility

| # | Sev | Finding | Fix |
|---|---|---|---|
| U1 | 🔴 | No mobile navigation at all (nav hidden below `md`, no menu button). | Accessible mobile menu. |
| U2 | 🟡 | Touch targets below 48 px (category pills, editor presets, footer links) — CLAUDE.md §4.4. | Interactive controls ≥ 44–48 px. |
| U3 | 🟡 | `text-zinc-400` used for readable text (≈ 2.6:1 contrast, fails 4.5:1). | Minimum `zinc-500` on white for small text, `zinc-600` for body. |
| U4 | 🟡 | Sticky header covers anchor targets. | `scroll-margin-top` on sections. |
| U5 | 🟡 | Form fields without associated labels; drop zone not keyboard-operable; `alert()` for errors; tabs without ARIA roles. | Labelled inputs, keyboard drop zone, inline error messages, ARIA tabs. |

## 4. Photo editor (homepage) — functional bugs

| # | Sev | Finding | Fix |
|---|---|---|---|
| E1 | 🔴 | **Export distorts rotated images**: at 90°/270° the image is drawn into an un-swapped W×H canvas. | Rotation-aware export pipeline. |
| E2 | 🔴 | Preview ≠ export: Fabric brightness/contrast (additive) vs. CSS `ctx.filter` (multiplicative); `ctx.filter` is not supported in Safari/iOS → filters silently missing on iPhone exports. | Same pixel math for preview and export, no `ctx.filter`. |
| E3 | 🔴 | Canvas fixed at max 760 px → overflows phones. | Responsive stage measured with `ResizeObserver`. |
| E4 | 🟡 | "Geschätzte Dateigröße" and "% Ersparnis" are a fake heuristic. | Real encode → real byte count. |
| E5 | 🟡 | Presets unlock the aspect ratio and **stretch** photos (e.g. 1080 × 1920 on a landscape photo). | Presets use fit modes (crop / pad / stretch), default crop. |
| E6 | 🟡 | Scale slider labels (25 / 50 / 100 / 150) don't match its 10–150 range. | Correct labels. |
| E7 | 🟡 | HEIC/TIFF accepted by the file picker but fail silently. | HEIC decoded via libheif (lazy); unsupported formats get a clear message. |
| E8 | 🟡 | No guard for very large photos (iOS canvas limit ≈ 16,7 MP) → export fails on 48 MP iPhone photos. | Pixel-budget guard with downscale notice. |
| E9 | ⚪ | Whole file read as base64 data-URL (memory). No crop, no undo/reset, no before/after. | Object URLs/ImageBitmap; crop, reset and compare added. |

## 5. Legal (blocking — needs owner input, cannot be fixed in code)

| # | Sev | Finding | Action |
|---|---|---|---|
| L1 | 🔴 | Impressum still contains placeholders (`[Name des Betreibers / Firma]`, address). Launch blocker (§ 5 DDG). | **Owner must supply** name, address, e-mail, phone, register data. |
| L2 | 🟡 | Datenschutz did not mention third-party requests. The new AI tools download model files from Hugging Face and the ONNX runtime from jsDelivr (IP address transfer). | Section added; recommended: self-host models (`NEXT_PUBLIC_MODEL_HOST`). |
| L3 | ⚪ | Brand "FotoWerkzeuge" / domain `fotowerkzeuge.online` is a placeholder from the previous implementation — confirm before launch. Change in `src/lib/site.ts` only. | Owner decision. |

## 6. Build plan

1. **Foundation:** `site.ts`, `tools.ts` registry (+ `live` flag), `seo.ts` (metadata + JSON-LD), `ToolLink`, breadcrumbs, FAQ, tool-page shell, sitemap/robots/manifest/OG/404, `trailingSlash`.
2. **Image engine** (`src/lib/image/`): decode (incl. HEIC), high-quality resize, MozJPEG/OxiPNG/WebP/palette-PNG/GIF encoders, EXIF keep/strip, ZIP, AI segmentation.
3. **Shared widgets:** drop zone, batch queue, before/after compare slider, settings controls, crop stage, mask editor.
4. **Homepage:** rebuilt editor (crop, size, rotate, filters, export with real size), directory with live tools only, fixed headings and claims.
5. **Batch 1:** P3, P2, P1, P40, P27 · **Batch 2:** P51, P21, P4, P5, P41 — exact title/meta/H1/H2–H4/FAQ from page-plans.md.
6. **Verify:** build, lint, title/meta lengths, one H1 per page, headless-browser smoke test of each tool.
7. **Docs:** tracker, CLAUDE.md rule for the `live` flag, this audit.
