import { ImageResponse } from "next/og";
import { getLocation } from "@/lib/sanity/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = await getLocation(slug);

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
        BluJ Station
      </p>
      <h1 style={{ color: "#F0F4FF", fontSize: 100, fontWeight: 900, lineHeight: 1, margin: 0, textTransform: "uppercase" }}>
        {loc?.name ?? "BluJ"}
      </h1>
      {loc?.address && (
        <p style={{ color: "#8892A4", fontSize: 20, margin: "20px 0 0" }}>
          {loc.address}
        </p>
      )}
      <div style={{ width: 80, height: 3, background: "#1D6FFF", marginTop: 40 }} />
    </div>,
    size,
  );
}
