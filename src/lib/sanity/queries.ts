import { sanityClient } from "./client";
import type { Location, Promotion, Product, JobPosting, Post, SiteSettings } from "./types";

export async function getLocations(): Promise<Location[]> {
  return sanityClient.fetch(`
    *[_type == "location"] | order(name asc) {
      _id, name, address, phone, slug, hours, amenities, photos, fuelPrices, lat, lng
    }
  `);
}

export async function getActivePromotion(): Promise<Promotion | null> {
  const now = new Date().toISOString();
  const promo: Promotion | null = await sanityClient.fetch(
    `
    *[_type == "promotion" && active == true && (
      !defined(activeDateRange) ||
      (activeDateRange.start <= $now && activeDateRange.end >= $now)
    )] | order(_createdAt desc)[0] {
      _id, title, description, image, active, activeDateRange
    }
  `,
    { now },
  );
  return promo ?? null;
}

export async function getProducts(): Promise<Product[]> {
  return sanityClient.fetch(`
    *[_type == "product"] | order(category asc, name asc) {
      _id, name, category, description, image, featured
    }
  `);
}

export async function getPosts(): Promise<Post[]> {
  return sanityClient.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, publishedAt, excerpt, image
    }
  `);
}

export async function getPost(slug: string): Promise<Post | null> {
  const post: Post | null = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, publishedAt, excerpt, body, image
    }`,
    { slug }
  );
  return post ?? null;
}

export async function getJobPostings(): Promise<JobPosting[]> {
  return sanityClient.fetch(`
    *[_type == "jobPosting" && active == true] | order(title asc) {
      _id, title, location, type, description, active
    }
  `);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const s = await sanityClient.fetch(`
    *[_type == "siteSettings"][0] {
      tagline, heroHeadline, heroSubtext, contactEmail, socialLinks
    }
  `);
  return s ?? {};
}
