# Design System & UI/UX Guidelines — German Photo-Utility

> **Strict Color & Theme Policy:**
> - **Theme:** **Permanent Pure White / Light Theme only**. No dark mode.
> - **Colors:** Exclusively **White** (`#ffffff`), **Lime 700** (`#4d7c0f`), **Grey (Zinc/Neutral scale)**, and **Black** for crisp text. No other accent hues (blue, purple, orange, etc.) are permitted.

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
- **Surfaces / Cards:**
  - Card Surface: **Pure White** (`#ffffff`) with subtle border `zinc-200` (`#e4e4e7`).
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
- Border: `border border-lime-700 shadow-sm`
- Radius: `rounded-lg` (or `rounded-full` for hero primary action)
- Padding: `px-5 py-2.5` or `px-6 py-3.5` (large)

### 3.2 Secondary / Neutral Buttons
- Background: `bg-white`
- Border: `border border-zinc-300`
- Text: `text-zinc-800 hover:text-zinc-950`
- Hover: `hover:bg-zinc-100`

### 3.3 Inputs & Selects
- Border: `border-zinc-300`
- Focus: `focus:ring-2 focus:ring-lime-700 focus:border-lime-700 focus:outline-none`
- Background: `bg-white`
- Text: `text-zinc-900`

### 3.4 Feature Cards & Tool Tiles
- Clean white card `bg-white`
- Border `border border-zinc-200`
- Subtle hover state: `hover:border-lime-700/60 hover:shadow-md transition-all`
- Icon container: `bg-zinc-100 text-lime-700 p-2.5 rounded-lg`

### 3.5 Editor & Tool Widgets (plain Canvas, no Fabric.js)
- Widget card: `rounded-3xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm`; stage left, settings panel right (`lg:grid-cols-[minmax(0,1fr)_340px]`), stacked on mobile.
- Stage: `rounded-2xl border border-zinc-200 bg-zinc-100`; transparent images on `.bg-transparency-grid`.
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
