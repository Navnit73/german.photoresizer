# CLAUDE.md — DACH Photo-Utility Website Master Reference

> **⚠️ MANDATORY: Read this file AND `docs/seo/tracker.md` before creating or editing ANY page.**
> This file is the single source of truth for all development rules, SEO requirements, and project conventions.

---

## 1. Project Overview

- **Project:** German-language photo-utility website targeting DACH (Germany, Austria, Switzerland)
- **Stack:** Next.js 16.4.5, React 19.3, Tailwind CSS 4, TypeScript
- **Language:** All UI copy in German (formal "Sie"), explanations/comments in English
- **Domain:** Utility tools site — free, browser-based image editing tools (compress, resize, convert, etc.)
- **Source data:** 6 Google Keyword Planner CSV exports (Oct 2025 – Sep 2026), 3,534 unique keywords

---

## 2. File Structure References

Read these files before creating pages:

| File | Purpose |
|---|---|
| `docs/seo/tracker.md` | **PAGE TRACKER** — check status before building any page |
| `docs/seo/homepage-strategy.md` | Complete homepage SEO blueprint |
| `docs/seo/page-plans.md` | All 69 landing page SEO specs (title, meta, H1, H2–H4, outline, FAQs) |
| `docs/seo/internal-linking.md` | Internal linking plan (hub ↔ spoke, contextual) |
| `docs/seo/cannibalization.md` | Pages at risk of keyword overlap + mitigation |
| `docs/seo/keyword-clusters.md` | 71 keyword clusters with volume & competition |
| `docs/seo/publishing-calendar.md` | Day-by-day publishing schedule |
| `docs/seo/checklist.md` | 46-item SEO & legal checklist |
| `docs/seo/dach-localization.md` | DACH-specific rules (legal, spelling, formatting) |

---

## 3. MANDATORY Rules for Creating Pages

### 3.1 Before Creating ANY Page

1. **Read `docs/seo/tracker.md`** — confirm the page is not already created
2. **Read that page's entry in `docs/seo/page-plans.md`** — get exact title, meta, H1, H2–H4, content outline, FAQs, tool spec
3. **Read `docs/seo/internal-linking.md`** — find all outgoing links from this page
4. **Read `docs/seo/cannibalization.md`** — check if the page has cannibalization risks and note the differentiation strategy

### 3.2 SEO On-Page Requirements (Every Page)

1. **URL slug:** Exactly as specified in `page-plans.md` — no changes allowed
2. **SEO title:** Use the exact German title from the plan. Must be ≤ 60 characters
3. **Meta description:** Use the exact German meta from the plan. Must be ≤ 160 characters
4. **H1:** Exactly ONE H1 per page, matching the plan
5. **H2–H4 hierarchy:** Follow the exact structure from the plan — no skipping levels
6. **Primary keyword placement:**
   - In URL slug ✓
   - In title (front-loaded) ✓
   - In H1 ✓
   - In first 100 words of body ✓
   - In at least one H2 ✓
   - In alt text of tool screenshot ✓
   - In meta description ✓
   - Target frequency: ~5–9× per 1,000–1,300 words, naturally distributed
7. **Secondary keywords:** Each 1–2× in H2/H3, FAQ, or body text
8. **Keyword variants:** Alternate between Bild/Foto, online/kostenlos, ohne Anmeldung — no stuffing
9. **Spelling:** Follow Duden rules; no keyword stuffing

### 3.3 Page Layout Rules (Tool Pages)

Every tool page follows this exact layout order:

```
1. Above the Fold
   - H1 + Tool Widget (upload area) immediately visible — NO scrolling required
   - One sentence value proposition with primary keyword

2. Step-by-Step Guide (H2: "So geht's")
   - 3 steps with icons
   - Mention drag & drop, batch processing, ZIP download

3. Technical Explanation (H2)
   - How the tool works technically
   - Format-specific details

4. Use Cases / Best Settings (H2)
   - Grouped by use case (website, email, print, etc.)

5. FAQ Section (H2: "Häufige Fragen")
   - Use exact FAQs from page-plans.md
   - Implement as FAQ schema (FAQPage)

6. Related Tools Section (H2: "Weitere passende Foto-Tools")
   - Internal links from internal-linking.md
   - 3–5 related tools with anchor text
```

### 3.4 Page Layout Rules (Guide Pages)

```
1. H1 + Introduction (100 words with primary keyword)
2. Step-by-step sections (H2 per method/program)
3. Comparison table or tips
4. FAQ section
5. Related tools + online alternative CTA
```

### 3.5 Page Layout Rules (Commercial/Hub Pages)

```
1. H1 + Introduction
2. Feature comparison (H2 per option)
3. Recommendation
4. FAQ section
5. CTA to relevant tools
```

### 3.6 Content Quality Rules

- **Word count:** Follow the target from `page-plans.md` (usually 1,000–1,300 for tools, 1,300–1,700 for guides)
- **No invented claims** — no "best tool", "fastest", etc. without evidence
- **Address:** Use consistent "Sie" (formal) throughout — NEVER mix with "du"
- **DSGVO/privacy:** Mention browser-based processing where applicable; state that files are not uploaded to servers (or clearly disclose when they are)
- **Decimal format:** Use comma for decimal (1,5 MB), period for thousands (1.000 KB)
- **Units:** Metric first (cm, mm); DIN paper sizes

### 3.7 After Creating a Page

1. **Update `docs/seo/tracker.md`** — mark the page as "Done" with the date
2. **Add internal links** to already-live pages per `docs/seo/internal-linking.md`
3. **Verify:** Title length ≤ 60 chars, meta length ≤ 160 chars, exactly one H1

---

## 4. Technical Implementation Rules

### 4.1 Next.js Conventions

- **App Router** — all pages in `src/app/`
- Each tool page: `src/app/(tool-slug)/page.tsx`
- Shared layout: `src/app/layout.tsx`
- Use `metadata` export for SEO (title, description, openGraph)
- Use `generateMetadata` for dynamic pages if needed

### 4.2 Schema Markup

Every tool page must include structured data (JSON-LD):

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "[Tool name in German]",
  "applicationCategory": "MultimediaApplication",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
  "operatingSystem": "Any (browser-based)",
  "browserRequirements": "Requires JavaScript"
}
```

Plus `FAQPage` schema for FAQs and `BreadcrumbList` for navigation.

### 4.3 HTML Semantics

- `<h1>` — exactly one per page
- `<h2>`, `<h3>`, `<h4>` — proper hierarchy, never skip levels
- `<main>` — wrap primary content
- `<nav>` — for navigation
- `<section>` — for content sections with headings
- `<article>` — for FAQ items within FAQPage schema
- Alt text on all images — include primary keyword where natural

### 4.4 Performance & Accessibility

- Lazy-load below-the-fold images
- Use `next/image` with proper width/height
- Mobile-first responsive design
- Touch targets ≥ 48px
- Color contrast ≥ 4.5:1
- `lang="de"` on `<html>` element
- Proper `hreflang` tags when adding AT/CH variants

---

## 5. Theme Groups (8 Cluster Groups)

All 69 pages + homepage belong to these 8 theme groups:

| # | Group (DE) | Group (EN) | # Pages |
|---|---|---|---|
| 1 | Bildbearbeitung allgemein | General editing | 3 (HOME + P68 + P69) |
| 2 | Verkleinern & Komprimieren | Reduce & compress | 20 |
| 3 | Größe & Auflösung | Size & resolution | 7 |
| 4 | Formate umwandeln | Format conversion | 14 |
| 5 | Hintergrund & Freistellen | Background & cut-out | 11 |
| 6 | Zuschneiden & Transformieren | Crop & transform | 7 |
| 7 | Qualität & Retusche | Quality & retouch | 5 |
| 8 | Kreativ & Effekte | Creative & effects | 5 |

---

## 6. Legal Requirements (Pre-Launch Critical)

These are **blocking** items — the site MUST NOT launch without them:

- [ ] **Impressum** — DE § 5 DDG; AT § 5 ECG & § 25 MedienG; CH UWG Art. 3(1)(s)
- [ ] **Datenschutzerklärung** — GDPR + Swiss revDSG; state processing location + deletion periods
- [ ] **Cookie consent** — TDDDG (DE), TKG 2021 (AT); analytics only after consent or cookieless
- [ ] **Google Search Console** — domain property + Bing Webmaster Tools

---

## 7. Deployment & Monitoring

- Day 1: Homepage + legal pages (Impressum, Datenschutz) + sitemap + GSC setup
- Day 8+: Landing pages in batches of 5, every 4 days
- Check indexing 7 days after each batch publish
- Monthly cannibalization check: GSC queries with > 1 ranking URL
- Track tool usage events (upload, download, error)

---

## 8. Quick Reference: File Locations

```
src/app/
├── layout.tsx              ← Root layout (lang="de", fonts, nav, footer)
├── page.tsx                ← Homepage
├── (tool-slug)/
│   └── page.tsx            ← Each tool/guide/commercial page
├── impressum/
│   └── page.tsx
├── datenschutz/
│   └── page.tsx
└── globals.css

docs/seo/
├── tracker.md              ← ⭐ PAGE STATUS TRACKER
├── homepage-strategy.md
├── page-plans.md
├── internal-linking.md
├── cannibalization.md
├── keyword-clusters.md
├── publishing-calendar.md
├── checklist.md
└── dach-localization.md
```

