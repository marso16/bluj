export interface HoursEntry {
  day: string;
  open: string; // "HH:MM" 24h
  close: string; // "HH:MM" 24h
  closed: boolean;
}

export interface FuelPrice {
  grade: string;
  price: number;
}

export interface Location {
  _id: string;
  name: string;
  address: string;
  phone?: string;
  slug: { current: string };
  hours: HoursEntry[];
  amenities: string[];
  photos?: { asset: { _ref: string } }[];
  fuelPrices?: FuelPrice[];
  lat?: number;
  lng?: number;
}

export interface Promotion {
  _id: string;
  title: string;
  description?: string;
  image?: { asset: { _ref: string } };
  active: boolean;
  activeDateRange?: { start: string; end: string };
}

export interface Product {
  _id: string;
  name: string;
  category: "fuel" | "convenience" | "deli" | "food";
  description?: string;
  image?: { asset: { _ref: string } };
  featured: boolean;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  excerpt?: string;
  body?: string;
  image?: { asset: { _ref: string } };
}

export interface JobPosting {
  _id: string;
  title: string;
  location?: string;
  type: "full-time" | "part-time" | "seasonal";
  description?: string;
  active: boolean;
}

export interface SiteSettings {
  tagline?: string;
  heroHeadline?: string;
  heroSubtext?: string;
  contactEmail?: string;
  socialLinks?: { platform: string; url: string }[];
}
