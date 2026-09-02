import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#0A0E1A",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "80px",
      }}
    >
      <p style={{ color: "#8892A4", fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 16px" }}>
        New Hampshire &amp; Vermont
      </p>
      <h1 style={{ color: "#F0F4FF", fontSize: 160, fontWeight: 900, lineHeight: 1, margin: 0, textTransform: "uppercase" }}>
        BluJ
      </h1>
      <p style={{ color: "#8892A4", fontSize: 20, margin: "20px 0 0" }}>
        Local gas stations, convenience stores, and deli.
      </p>
      <div style={{ width: 80, height: 3, background: "#F59E0B", marginTop: 40 }} />
    </div>,
    size,
  );
}
