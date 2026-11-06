import { ImageResponse } from "next/og";

export const alt = "FotoWerkzeuge – Bilder kostenlos bearbeiten im Browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #ffffff 0%, #f7fee7 100%)",
          color: "#09090b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "#4d7c0f", display: "flex" }} />
          <div style={{ fontSize: 40, fontWeight: 700, display: "flex" }}>
            Foto<span style={{ color: "#4d7c0f" }}>Werkzeuge</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Bilder kostenlos bearbeiten</div>
          <div style={{ fontSize: 34, color: "#3f3f46" }}>Verkleinern · Komprimieren · Zuschneiden · Freistellen</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#3f6212", fontWeight: 600 }}>Verarbeitung lokal im Browser – ohne Anmeldung</div>
      </div>
    ),
    size,
  );
}
