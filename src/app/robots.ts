import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/** JS/CSS/WASM stay crawlable (checklist #9); blob: result URLs are never linked. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
