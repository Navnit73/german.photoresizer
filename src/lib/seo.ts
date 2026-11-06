import type { Metadata } from "next";
import { MAX_TITLE_LENGTH, SITE_LOCALE, SITE_NAME, SITE_URL, absoluteUrl } from "./site";
import { getGroup, groupAnchor, type ToolEntry } from "./tools";

export interface FaqItem {
  q: string;
  a: string;
}

/** Appends the brand only if the full title still fits in 60 characters. */
export function withBrand(title: string): string {
  const branded = `${title} | ${SITE_NAME}`;
  return branded.length <= MAX_TITLE_LENGTH ? branded : title;
}

interface MetaInput {
  /** Exact SEO title from page-plans.md (without brand). */
  title: string;
  /** Exact meta description from page-plans.md. */
  description: string;
  /** Path with trailing slash, e.g. "/bild-verkleinern/". */
  path: string;
  noindex?: boolean;
}

export function buildMetadata({ title, description, path, noindex }: MetaInput): Metadata {
  const fullTitle = withBrand(title);
  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: path,
      languages: { de: path, "x-default": path },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME} – Bilder kostenlos bearbeiten im Browser` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD builders                                                     */
/* ------------------------------------------------------------------ */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/icon.svg"),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: "de",
    publisher: { "@id": ORG_ID },
  };
}

export function webApplicationSchema(name: string, path: string, description: string) {
  return {
    "@type": "WebApplication",
    "@id": `${absoluteUrl(path)}#app`,
    name,
    url: absoluteUrl(path),
    description,
    inLanguage: "de",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (browser-based)",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@id": ORG_ID },
  };
}

export function faqSchema(items: FaqItem[], path: string) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function toolCrumbs(tool: ToolEntry): Crumb[] {
  return [
    { name: "Startseite", path: "/" },
    { name: getGroup(tool.group).label, path: groupAnchor(tool.group) },
    { name: tool.name, path: tool.path },
  ];
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function itemListSchema(tools: ToolEntry[]) {
  return {
    "@type": "ItemList",
    name: "Foto-Tools",
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: absoluteUrl(t.path),
    })),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
