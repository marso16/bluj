import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#0A0E1A",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "8px solid #F59E0B",
      }}
    >
      <span
        style={{
          color: "#F0F4FF",
          fontSize: 340,
          fontWeight: 900,
          fontFamily: "sans-serif",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
        }}
      >
        B
      </span>
    </div>,
    size,
  );
}
