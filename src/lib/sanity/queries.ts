import { sanityClient } from './client'
import type { Location, Promotion, Product, SiteSettings } from './types'

export async function getLocations(): Promise<Location[]> {
  return sanityClient.fetch(`
    *[_type == "location"] | order(name asc) {
      _id, name, address, phone, slug, hours, amenities, photos
    }
  `)
}

export async function getActivePromotion(): Promise<Promotion | null> {
  const now = new Date().toISOString()
  const promo: Promotion | null = await sanityClient.fetch(`
    *[_type == "promotion" && active == true && (
      !defined(activeDateRange) ||
      (activeDateRange.start <= $now && activeDateRange.end >= $now)
    )] | order(_createdAt desc)[0] {
      _id, title, description, image, active, activeDateRange
    }
  `, { now })
  return promo ?? null
}

export async function getProducts(): Promise<Product[]> {
  return sanityClient.fetch(`
    *[_type == "product"] | order(category asc, name asc) {
      _id, name, category, description, image, featured
    }
  `)
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const s = await sanityClient.fetch(`
    *[_type == "siteSettings"][0] {
      tagline, heroHeadline, heroSubtext, contactEmail, socialLinks
    }
  `)
  return s ?? {}
}
