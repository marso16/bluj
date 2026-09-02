import { getLocations, getPosts } from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

const BASE = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [locations, posts] = await Promise.all([getLocations(), getPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1, changeFrequency: "daily" },
    { url: `${BASE}/products`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/locations`, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/news`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE}/employment`, priority: 0.6, changeFrequency: "weekly" },
    { url: `${BASE}/contact`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/rewards`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/promotions`, priority: 0.7, changeFrequency: "weekly" },
  ];

  const locationRoutes: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${BASE}/locations/${l.slug.current}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/news/${p.slug.current}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...locationRoutes, ...postRoutes];
}
