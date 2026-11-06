import type { MetadataRoute } from "next";
import { LIVE_TOOLS } from "@/lib/tools";
import { absoluteUrl } from "@/lib/site";

/** Only indexable, published (200) URLs – checklist #8. */
export default function sitemap(): MetadataRoute.Sitemap {
  const launch = new Date("2026-11-06");
  return [
    { url: absoluteUrl("/"), lastModified: launch, changeFrequency: "weekly", priority: 1 },
    ...LIVE_TOOLS.map((t) => ({
      url: absoluteUrl(t.path),
      lastModified: t.liveSince ? new Date(t.liveSince) : launch,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/ueber-uns/"), lastModified: launch, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/impressum/"), lastModified: launch, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/datenschutz/"), lastModified: launch, changeFrequency: "yearly", priority: 0.2 },
  ];
}
