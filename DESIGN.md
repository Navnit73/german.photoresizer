# Design System & UI/UX Guidelines — German Photo-Utility

> **Strict Color & Theme Policy:**
> - **Theme:** **Permanent Pure White / Light Theme only**. No dark mode.
> - **Colors:** Exclusively **White** (`#ffffff`), **Lime 700** (`#4d7c0f`), **Grey (Zinc/Neutral scale)**, and **Black** for crisp text. No other accent hues (blue, purple, orange, etc.) are permitted.
>
> **Flat UI Policy (mandatory):**
> - **No shadows at all** — no box/drop/text shadows and no focus "rings" (they render as box-shadow). Use borders and outlines instead. All shadow theme tokens are disabled in `globals.css`.
> - **No gradients** — solid fills only. (Only exception: the functional transparency checkerboard.)
> - **Max radius 10 px** — `rounded-xl` is the largest allowed token (capped at 10 px in `globals.css`); no pill shapes on elements taller than 20 px.
> - **Not card-heavy** — do not wrap content in bordered/rounded boxes, and never nest boxes. Structure content with whitespace, hairline rules (`border-t border-zinc-200`), a lime accent rule (`border-t-2 border-lime-700`) or a left accent bar (`border-l-2 border-lime-700`). Lists of links are rows divided by `border-b`, not tiles.

---

## 1. Color Palette & Semantic Tokens

### 1.1 Brand / Accent Colors (Lime)
- **Primary / Brand Accent:** `lime-700` (`#4d7c0f`) — used for primary CTAs, active states, key focus rings, badges, brand accents.
- **Primary Hover:** `lime-800` (`#3f6212`) — hover state for primary buttons.
- **Primary Active / Border:** `lime-600` (`#65a30d`) — active borders, subtle borders, selection outlines.
- **Subtle Tint / Surface:** `lime-50` (`#f7fee7`) — highlight pills, success badges, active tabs.
- **Contrast Text on Lime:** Pure White (`#ffffff`) with `font-semibold` or `font-bold` for accessibility (contrast ratio $\ge 4.5:1$).

### 1.2 Monochrome & Neutrals (White / Grey / Black)
- **Backgrounds:**
  - Page Background: **Pure White** (`#ffffff`).
  - Section Contrast Background: Light Warm Grey (`#f4f4f5` / `zinc-100`, `#fafafa` / `zinc-50`).
- **Surfaces:**
  - Content sits directly on the page background; separate with `zinc-200` hairline rules, not boxes.
- **Text Hierarchy:**
  - Primary Headlines: `zinc-950` (`#09090b`) / Black (`#000000`).
  - Body Text: `zinc-700` (`#3f3f46`) / `zinc-800` (`#27272a`).
  - Secondary & Descriptions: `zinc-600` (`#52525b`).
  - Muted / Placeholders / Borders: `zinc-400` (`#a1a1aa`) / `zinc-300` (`#d4d4d8`).

---

## 2. Typography

- **Headlines:** Geist Sans / Inter / system font with tight letter-spacing (`tracking-tight`), crisp weight (`font-bold` for H1/H2, `font-semibold` for H3/H4).
- **Body Text:** Geist Sans / system-ui, high readability, standard leading (`leading-relaxed` for paragraphs, `leading-snug` for tool widgets).
- **Mono / Numbers:** Geist Mono / monospace for byte sizes (`1.024 KB`), pixel dimensions (`1920 × 1080 px`), and file extensions (`.jpg`, `.png`).

---

## 3. Component Design Patterns

### 3.1 Primary Buttons
- Background: `bg-lime-700`
- Hover: `hover:bg-lime-800`
- Text: `text-white font-medium`
- Border: none (solid fill)
- Radius: `rounded-lg`
- Padding: `px-5 py-2.5` or `px-6 py-3.5` (large)

### 3.2 Secondary / Neutral Buttons
- Background: `bg-white`
- Border: `border border-zinc-300`
- Text: `text-zinc-800 hover:text-zinc-950`
- Hover: `hover:bg-zinc-100`

### 3.3 Inputs & Selects
- Border: `border-zinc-300`
- Focus: `focus:border-lime-700` plus the global 2 px lime `:focus-visible` outline (no rings)
- Background: `bg-white`
- Text: `text-zinc-900`

### 3.4 Feature Lists & Tool Links
- No cards. Feature/step columns: `border-t border-zinc-200 pt-5` (highlighted: `border-t-2 border-lime-700`).
- Tool link lists: rows `border-b border-zinc-200 py-4` inside a `border-t` container; hover changes text colour to `lime-800`.
- Icons stand alone in `text-lime-700` — no icon background chips.

### 3.5 Editor & Tool Widgets (plain Canvas, no Fabric.js)
- No outer widget frame: stage left, settings right (`lg:grid-cols-[minmax(0,1fr)_340px]`), stacked on mobile. Settings sections (`Panel`) are separated by `border-t border-zinc-200 pt-4`.
- Stage: `rounded-xl bg-zinc-100` (no border); transparent images on `.bg-transparency-grid`.
- Controls from `src/components/tools/ui.tsx`: `Dropzone`, `Slider` (`.range`, 24 px thumb), `Segmented`, `Toggle`, `NumberField`, `CompareSlider`, `btnPrimary`/`btnSecondary`/`btnIcon` (≥ 44 px).
- Preview must equal export: colour adjustments use CSS-filter formulas in preview and identical pixel math on export (`src/lib/image/filters.ts`).
- Heavy code (WASM codecs, HEIC decoder, AI models) is loaded lazily on first use only.
- Client-side only (`'use client'`).

---

## 4. UI/UX Principles for DACH Utility Tools

1. **Immediate Value Above the Fold:**
   - The user must see the upload dropzone and H1 within the viewport without scrolling.
   - 1-click drag & drop or file selection from device media library.
2. **Speed & Privacy First:**
   - Prominent trust badges: *"100% lokal im Browser"*, *"Kein Upload auf Server"*, *"Keine Anmeldung erforderlich"*, *"Kein Wasserzeichen"*.
3. **Responsive Mobile Utility:**
   - Full touch capability on iOS Safari and Android Chrome.
   - Large touch targets ($\ge 44 \times 44$ px).
   - Readable text never lighter than `zinc-500` on white (`zinc-600`+ for body copy).
4. **Accessible Semantics:**
   - Clear focus states, ARIA roles for accordion FAQs and tab switchers, proper contrasting colors.
