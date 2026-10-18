import { ImageResponse } from "next/og";

export const alt = "Craft";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f3ee", gap: 36 }}>
        <div style={{ width: 180, height: 180, borderRadius: 54, background: "#17161a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 84, height: 84, borderRadius: 84, border: "20px solid #fffdfa", borderRightColor: "transparent", display: "flex" }} />
        </div>
        <div style={{ fontSize: 150, fontWeight: 800, color: "#17161a", letterSpacing: -6, display: "flex" }}>
          Craft<span style={{ color: "#d23b1e" }}>.</span>
        </div>
      </div>
    ),
    size,
  );
}
