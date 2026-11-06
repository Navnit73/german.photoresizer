import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} – Foto-Tools im Browser`,
    short_name: SITE_NAME,
    description: "Bilder kostenlos bearbeiten: verkleinern, komprimieren, zuschneiden, freistellen – direkt im Browser.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4d7c0f",
    lang: "de",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
