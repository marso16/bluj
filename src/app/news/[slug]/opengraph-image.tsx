import { ImageResponse } from "next/og";
import { getPost } from "@/lib/sanity/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

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
        BluJ News
      </p>
      <h1 style={{ color: "#F0F4FF", fontSize: 72, fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
        {post?.title ?? "BluJ"}
      </h1>
      {post?.excerpt && (
        <p style={{ color: "#8892A4", fontSize: 20, margin: "20px 0 0", lineHeight: 1.5 }}>
          {post.excerpt.length > 120 ? post.excerpt.slice(0, 120) + "…" : post.excerpt}
        </p>
      )}
      <div style={{ width: 80, height: 3, background: "#F59E0B", marginTop: 40 }} />
    </div>,
    size,
  );
}
