import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BluJ",
    short_name: "BluJ",
    description: "Local gas stations, convenience stores, and deli in NH and VT.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E1A",
    theme_color: "#F59E0B",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
