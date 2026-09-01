# BluJ Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full BluJ website — 5 public pages, Sanity CMS dashboard, contact and job application forms — deployed to Netlify at zero cost.

**Architecture:** Next.js 15 App Router with SSG for public pages; Sanity v3 as content backend and employee dashboard embedded at `/studio`; API routes handle form submissions (contact via Resend, job applications via Sanity write API). All brand tokens live in `src/lib/theme.css` for one-file brand swapping.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Sanity v3, Resend, Zod, Vitest

**Spec:** `docs/superpowers/specs/2026-09-01-bluj-website-design.md`

## Global Constraints

- Node.js ≥ 20
- TypeScript strict mode
- All colors/fonts MUST come from CSS custom properties in `src/lib/theme.css` — never hardcoded in components
- All terminal commands are listed for the user to run manually — never auto-execute
- Git repo: https://github.com/marso16/bluj.git — push to `main` after every task
- v1 cost: $0

---

### Task 1: Project Scaffold & Git Setup

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `.env.local.example`

**Interfaces:**
- Produces: Running Next.js dev server, connected git repo

- [ ] **Step 1: Create the Next.js project**

Run in the PARENT directory (`c:\Users\marck\Downloads\projects\`):
```bash
npx create-next-app@latest bluj --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```
When prompted for Turbopack → No.

- [ ] **Step 2: Install additional dependencies**

```bash
cd bluj
npm install next-sanity @sanity/image-url sanity resend zod
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
export default defineConfig({ test: { environment: 'jsdom' } })
```

Add to `package.json` scripts section:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create `.env.local.example`**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
RESEND_API_KEY=
```

Copy to `.env.local` — fill values in Tasks 3 and 10.

- [ ] **Step 5: Initialize git and push**

```bash
git init
git remote add origin https://github.com/marso16/bluj.git
git add .
git commit -m "feat: scaffold Next.js 15 project"
git branch -M main
git push -u origin main
```

- [ ] **Step 6: Verify**

```bash
npm run dev
```
Open http://localhost:3000. Default Next.js page visible. Stop with Ctrl+C.

---

### Task 2: Design Tokens & Global Styles

**Files:**
- Create: `src/lib/theme.css`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.ts`

**Interfaces:**
- Produces: CSS custom properties globally available; Tailwind token classes; Google Fonts loaded via `next/font`

- [ ] **Step 1: Create `src/lib/theme.css`**

```css
/* BluJ Design Tokens — swap this file when brand assets arrive */
:root {
  --color-ink:     #0A0E1A;
  --color-surface: #161D35;
  --color-charge:  #1D6FFF;
  --color-glow:    #F59E0B;
  --color-clean:   #F0F4FF;
  --color-ghost:   #8892A4;

  --font-display: 'Big Shoulders Display', sans-serif;
  --font-body:    'DM Sans', sans-serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

- [ ] **Step 2: Replace `src/app/globals.css`**

```css
@import '../lib/theme.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  background-color: var(--color-ink);
  color: var(--color-clean);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Replace `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:     'var(--color-ink)',
        surface: 'var(--color-surface)',
        charge:  'var(--color-charge)',
        glow:    'var(--color-glow)',
        clean:   'var(--color-clean)',
        ghost:   'var(--color-ghost)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Big_Shoulders_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const bigShoulders = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BluJ | Your Local Gas Station',
  description: 'BluJ — local gas stations, convenience stores, and deli across NH and VT.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```
Background should be `#0A0E1A` (near-black). Stop with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: design token system — theme.css, Tailwind config, Google Fonts"
git push
```

---

### Task 3: Sanity Schemas & Studio Config

**Files:**
- Create: `src/sanity/schemaTypes/location.ts`
- Create: `src/sanity/schemaTypes/promotion.ts`
- Create: `src/sanity/schemaTypes/product.ts`
- Create: `src/sanity/schemaTypes/jobApplication.ts`
- Create: `src/sanity/schemaTypes/siteSettings.ts`
- Create: `src/sanity/schemaTypes/index.ts`
- Create: `src/sanity/structure.ts`
- Create: `sanity.config.ts`

**Interfaces:**
- Produces: All Sanity schemas; Studio structure sidebar; `schemaTypes` export consumed by `sanity.config.ts`

- [ ] **Step 1: Create Sanity project**

Go to https://sanity.io → sign in → New Project → name it "bluj" → dataset: "production". Copy the **Project ID**.

- [ ] **Step 2: Initialize Sanity env**

```bash
npx sanity@latest init --env .env.local
```
Select your existing project and dataset "production". This writes `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to `.env.local`.

- [ ] **Step 3: Create `src/sanity/schemaTypes/location.ts`**

```typescript
import { defineField, defineType } from 'sanity'

export const locationSchema = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Location Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'address', title: 'Address', type: 'string', validation: r => r.required() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'day', title: 'Day', type: 'string' },
          { name: 'open', title: 'Opens At (HH:MM 24h)', type: 'string' },
          { name: 'close', title: 'Closes At (HH:MM 24h)', type: 'string' },
          { name: 'closed', title: 'Closed all day', type: 'boolean' },
        ],
      }],
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Deli', value: 'Deli' },
          { title: "Dunkin'", value: "Dunkin'" },
          { title: 'Auto Repair', value: 'Auto Repair' },
          { title: 'Chicken on the Go', value: 'Chicken on the Go' },
          { title: 'ATM', value: 'ATM' },
          { title: 'Car Wash', value: 'Car Wash' },
        ],
      },
    }),
    defineField({ name: 'photos', title: 'Photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
  ],
})
```

- [ ] **Step 4: Create `src/sanity/schemaTypes/promotion.ts`**

```typescript
import { defineField, defineType } from 'sanity'

export const promotionSchema = defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'activeDateRange',
      title: 'Active Date Range',
      type: 'object',
      fields: [
        { name: 'start', title: 'Start', type: 'datetime' },
        { name: 'end', title: 'End', type: 'datetime' },
      ],
    }),
    defineField({
      name: 'locations',
      title: 'Locations (empty = all)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'location' }] }],
    }),
    defineField({ name: 'active', title: 'Active (manual override)', type: 'boolean', initialValue: true }),
  ],
})
```

- [ ] **Step 5: Create `src/sanity/schemaTypes/product.ts`**

```typescript
import { defineField, defineType } from 'sanity'

export const productSchema = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Fuel', value: 'fuel' },
          { title: 'Convenience', value: 'convenience' },
          { title: 'Deli', value: 'deli' },
          { title: 'Food', value: 'food' },
        ],
      },
      validation: r => r.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
  ],
})
```

- [ ] **Step 6: Create `src/sanity/schemaTypes/jobApplication.ts`**

```typescript
import { defineField, defineType } from 'sanity'

export const jobApplicationSchema = defineType({
  name: 'jobApplication',
  title: 'Job Application',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'preferredLocation', title: 'Preferred Location', type: 'reference', to: [{ type: 'location' }] }),
    defineField({ name: 'message', title: 'Message / Cover Note', type: 'text' }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: [{ title: 'New', value: 'new' }, { title: 'Reviewed', value: 'reviewed' }, { title: 'Contacted', value: 'contacted' }] },
      initialValue: 'new',
    }),
  ],
})
```

- [ ] **Step 7: Create `src/sanity/schemaTypes/siteSettings.ts`**

```typescript
import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string' }),
    defineField({ name: 'heroSubtext', title: 'Hero Subtext', type: 'text' }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'platform', title: 'Platform', type: 'string' }, { name: 'url', title: 'URL', type: 'url' }] }],
    }),
  ],
})
```

- [ ] **Step 8: Create `src/sanity/schemaTypes/index.ts`**

```typescript
import { locationSchema } from './location'
import { promotionSchema } from './promotion'
import { productSchema } from './product'
import { jobApplicationSchema } from './jobApplication'
import { siteSettingsSchema } from './siteSettings'

export const schemaTypes = [locationSchema, promotionSchema, productSchema, jobApplicationSchema, siteSettingsSchema]
```

- [ ] **Step 9: Create `src/sanity/structure.ts`**

```typescript
import type { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list().title('BluJ CMS').items([
    S.documentTypeListItem('location').title('Locations'),
    S.documentTypeListItem('promotion').title('Promotions'),
    S.documentTypeListItem('product').title('Products'),
    S.documentTypeListItem('jobApplication').title('Job Applications'),
    S.divider(),
    S.documentTypeListItem('siteSettings').title('Site Settings'),
  ])
```

- [ ] **Step 10: Create `sanity.config.ts`**

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  name: 'bluj',
  title: 'BluJ',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
})
```

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: Sanity schemas and Studio config"
git push
```

---

### Task 4: Sanity Client, Types, GROQ Queries & Utils

**Files:**
- Create: `src/lib/sanity/client.ts`
- Create: `src/lib/sanity/types.ts`
- Create: `src/lib/sanity/queries.ts`
- Create: `src/lib/utils.ts`
- Create: `src/lib/utils.test.ts`

**Interfaces:**
- Produces:
  - `sanityClient` — configured read client
  - `urlFor(source)` — Sanity image URL builder
  - `getLocations(): Promise<Location[]>`
  - `getActivePromotion(): Promise<Promotion | null>`
  - `getProducts(): Promise<Product[]>`
  - `getSiteSettings(): Promise<SiteSettings>`
  - `isOpenNow(hours: HoursEntry[]): 'open' | 'closing-soon' | 'closed'`

- [ ] **Step 1: Create `src/lib/sanity/types.ts`**

```typescript
export interface HoursEntry {
  day: string
  open: string   // "HH:MM" 24h
  close: string  // "HH:MM" 24h
  closed: boolean
}

export interface Location {
  _id: string
  name: string
  address: string
  phone?: string
  slug: { current: string }
  hours: HoursEntry[]
  amenities: string[]
  photos?: { asset: { _ref: string } }[]
}

export interface Promotion {
  _id: string
  title: string
  description?: string
  image?: { asset: { _ref: string } }
  active: boolean
  activeDateRange?: { start: string; end: string }
}

export interface Product {
  _id: string
  name: string
  category: 'fuel' | 'convenience' | 'deli' | 'food'
  description?: string
  image?: { asset: { _ref: string } }
  featured: boolean
}

export interface SiteSettings {
  tagline?: string
  heroHeadline?: string
  heroSubtext?: string
  contactEmail?: string
  socialLinks?: { platform: string; url: string }[]
}
```

- [ ] **Step 2: Create `src/lib/sanity/client.ts`**

```typescript
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(sanityClient)
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

- [ ] **Step 3: Create `src/lib/sanity/queries.ts`**

```typescript
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
```

- [ ] **Step 4: Create `src/lib/utils.ts`**

```typescript
import type { HoursEntry } from './sanity/types'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function isOpenNow(hours: HoursEntry[]): 'open' | 'closing-soon' | 'closed' {
  const now = new Date()
  const entry = hours.find(h => h.day === DAYS[now.getDay()])
  if (!entry || entry.closed) return 'closed'

  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  const current = now.getHours() * 60 + now.getMinutes()
  const open = toMinutes(entry.open)
  const close = toMinutes(entry.close)

  if (current < open || current >= close) return 'closed'
  if (close - current <= 60) return 'closing-soon'
  return 'open'
}
```

- [ ] **Step 5: Create `src/lib/utils.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isOpenNow } from './utils'

const HOURS = [
  { day: 'Monday', open: '06:00', close: '22:00', closed: false },
  { day: 'Sunday', open: '00:00', close: '00:00', closed: true },
]

function mockDate(dayIndex: number, hour: number, minute: number) {
  // 2024-01-01 is a Monday (dayIndex 0 = Monday offset from that date)
  const d = new Date(2024, 0, 1 + dayIndex)
  d.setHours(hour, minute, 0, 0)
  vi.setSystemTime(d)
}

beforeEach(() => vi.useFakeTimers())

describe('isOpenNow', () => {
  it('returns open during business hours', () => {
    mockDate(0, 10, 0)
    expect(isOpenNow(HOURS)).toBe('open')
  })

  it('returns closing-soon within 60 minutes of close', () => {
    mockDate(0, 21, 30)
    expect(isOpenNow(HOURS)).toBe('closing-soon')
  })

  it('returns closed before opening', () => {
    mockDate(0, 5, 0)
    expect(isOpenNow(HOURS)).toBe('closed')
  })

  it('returns closed after closing', () => {
    mockDate(0, 23, 0)
    expect(isOpenNow(HOURS)).toBe('closed')
  })

  it('returns closed on a closed day', () => {
    mockDate(6, 12, 0) // Sunday
    expect(isOpenNow(HOURS)).toBe('closed')
  })
})
```

- [ ] **Step 6: Run tests**

```bash
npm test
```
Expected: 5 passing.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Sanity client, GROQ queries, types, isOpenNow util with tests"
git push
```

---

### Task 5: Header & Footer

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `<Header />`, `<Footer />` used in root layout

- [ ] **Step 1: Create `src/components/layout/Header.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Locations', href: '/locations' },
  { label: 'Employment', href: '/employment' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink/90 backdrop-blur-sm border-b border-surface">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-display text-2xl font-black text-clean tracking-tight">
          BluJ
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="text-ghost hover:text-clean text-sm font-medium transition-colors duration-200">
              {item.label}
            </Link>
          ))}
          <Link href="/locations"
            className="bg-charge text-clean text-sm font-semibold px-4 py-2 rounded-md hover:bg-charge/80 transition-colors duration-200">
            Find a Location
          </Link>
        </nav>

        <button className="md:hidden text-ghost hover:text-clean" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-surface border-t border-ink px-6 py-4 flex flex-col gap-4">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="text-ghost hover:text-clean text-sm font-medium transition-colors"
              onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Create `src/components/layout/Footer.tsx`**

```tsx
import Link from 'next/link'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Locations', href: '/locations' },
  { label: 'Employment', href: '/employment' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-ink/50 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <span className="font-display text-3xl font-black text-clean">BluJ</span>
          <p className="text-ghost text-sm mt-3 leading-relaxed">
            Your local gas station, convenience store, and deli across New Hampshire and Vermont.
          </p>
        </div>

        <div>
          <p className="text-ghost text-xs uppercase tracking-widest mb-4">Navigation</p>
          <nav className="flex flex-col gap-2">
            {NAV.map(item => (
              <Link key={item.href} href={item.href} className="text-ghost hover:text-clean text-sm transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-ghost text-xs uppercase tracking-widest mb-4">Get In Touch</p>
          <Link href="/contact" className="text-charge hover:text-charge/80 text-sm transition-colors">
            Send us a message
          </Link>
        </div>
      </div>

      <div className="border-t border-ink/50 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <p className="text-ghost text-xs">© {new Date().getFullYear()} BluJ. All rights reserved.</p>
        <p className="text-ghost text-xs">NH &amp; VT</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Update `src/app/layout.tsx` to add Header and Footer**

Replace the `<body>` content:
```tsx
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// (keep all existing imports and font setup)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${dmSans.variable}`}>
      <body>
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```
Check: fixed dark header, footer at bottom, mobile hamburger toggles menu.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Header and Footer layout components"
git push
```

---

### Task 6: Home Page

**Files:**
- Create: `src/components/home/OpenIndicator.tsx`
- Create: `src/components/home/Hero.tsx`
- Create: `src/components/home/LocationsStrip.tsx`
- Create: `src/components/home/FeaturedPromotion.tsx`
- Create: `src/components/home/ProductsGrid.tsx`
- Create: `src/components/home/EmploymentTeaser.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `getLocations`, `getActivePromotion`, `getProducts`, `getSiteSettings`, `isOpenNow`, `urlFor`
- Produces: Full home page assembled from section components

- [ ] **Step 1: Create `src/components/home/OpenIndicator.tsx`**

```tsx
'use client'

import { useMemo } from 'react'
import { isOpenNow } from '@/lib/utils'
import type { HoursEntry } from '@/lib/sanity/types'

export default function OpenIndicator({ hours }: { hours: HoursEntry[] }) {
  const status = useMemo(() => isOpenNow(hours), [hours])

  const config = {
    open:          { label: 'Open Now',     color: 'bg-emerald-500', pulse: true },
    'closing-soon':{ label: 'Closing Soon', color: 'bg-glow',        pulse: false },
    closed:        { label: 'Closed',       color: 'bg-ghost',       pulse: false },
  }[status]

  return (
    <span className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`} />
      </span>
      <span className="text-xs text-ghost">{config.label}</span>
    </span>
  )
}
```

- [ ] **Step 2: Create `src/components/home/Hero.tsx`**

```tsx
import Link from 'next/link'
import type { SiteSettings } from '@/lib/sanity/types'

export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-end pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-surface to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(29,111,255,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto w-full">
        <p className="text-ghost text-xs uppercase tracking-[0.3em] mb-6">New Hampshire &amp; Vermont</p>

        <h1
          className="font-display font-black text-clean leading-none tracking-tight"
          style={{ fontSize: 'clamp(5rem, 18vw, 18rem)' }}
        >
          BluJ
        </h1>

        <p className="text-clean/70 text-lg md:text-xl mt-6 max-w-xl leading-relaxed">
          {settings.heroSubtext || 'Your local gas station, convenience store, and deli — open when you need us.'}
        </p>

        <div className="flex flex-wrap gap-4 mt-10">
          <Link href="/locations"
            className="bg-charge text-clean font-semibold px-8 py-4 rounded-md hover:bg-charge/80 transition-colors duration-200">
            Find a Location
          </Link>
          <Link href="/products"
            className="border border-ghost/30 text-ghost hover:text-clean hover:border-ghost/60 font-semibold px-8 py-4 rounded-md transition-colors duration-200">
            What We Offer
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `src/components/home/LocationsStrip.tsx`**

```tsx
import Link from 'next/link'
import OpenIndicator from './OpenIndicator'
import type { Location } from '@/lib/sanity/types'

export default function LocationsStrip({ locations }: { locations: Location[] }) {
  return (
    <section className="py-20 px-6 border-t border-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-ghost text-xs uppercase tracking-widest mb-2">Find Us</p>
            <h2 className="font-display font-black text-clean text-5xl md:text-6xl">Locations</h2>
          </div>
          <Link href="/locations" className="text-charge text-sm font-medium hover:text-charge/70 transition-colors hidden md:block">
            View all →
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {locations.map(loc => (
            <div key={loc._id}
              className="snap-start flex-shrink-0 w-72 bg-surface rounded-lg p-6 border border-ink/50 hover:border-charge/30 transition-colors duration-200">
              <OpenIndicator hours={loc.hours ?? []} />
              <h3 className="text-clean font-semibold mt-3 text-lg leading-tight">{loc.name}</h3>
              <p className="text-ghost text-sm mt-1 leading-relaxed">{loc.address}</p>
              {loc.phone && (
                <a href={`tel:${loc.phone}`} className="text-charge text-sm mt-3 block hover:text-charge/70 transition-colors">
                  {loc.phone}
                </a>
              )}
              {loc.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {loc.amenities.map(a => (
                    <span key={a} className="text-ghost text-xs bg-ink px-2 py-0.5 rounded-sm">{a}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `src/components/home/FeaturedPromotion.tsx`**

```tsx
import { urlFor } from '@/lib/sanity/client'
import type { Promotion } from '@/lib/sanity/types'

export default function FeaturedPromotion({ promotion }: { promotion: Promotion | null }) {
  if (!promotion) return null

  return (
    <section className="py-2 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-lg overflow-hidden min-h-64 flex items-end p-10"
          style={{
            backgroundImage: promotion.image ? `url(${urlFor(promotion.image).width(1400).url()})` : undefined,
            backgroundColor: 'var(--color-surface)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
          <div className="relative">
            <p className="text-glow text-xs uppercase tracking-widest mb-2">Current Offer</p>
            <h2 className="font-display font-black text-clean text-4xl md:text-6xl leading-none">{promotion.title}</h2>
            {promotion.description && <p className="text-clean/70 mt-3 max-w-lg">{promotion.description}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create `src/components/home/ProductsGrid.tsx`**

```tsx
import { urlFor } from '@/lib/sanity/client'
import Link from 'next/link'
import type { Product } from '@/lib/sanity/types'

const LABEL: Record<string, string> = { fuel: 'Fuel', convenience: 'Convenience', deli: 'Deli', food: 'Food' }

export default function ProductsGrid({ products }: { products: Product[] }) {
  const featured = products.filter(p => p.featured).slice(0, 4)
  if (featured.length === 0) return null

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-ghost text-xs uppercase tracking-widest mb-2">What We Offer</p>
            <h2 className="font-display font-black text-clean text-5xl md:text-6xl">Products</h2>
          </div>
          <Link href="/products" className="text-charge text-sm font-medium hover:text-charge/70 transition-colors hidden md:block">
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.map((p, i) => (
            <div key={p._id}
              className={`bg-surface rounded-lg overflow-hidden border border-ink/50 ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              {p.image && (
                <div className={`bg-ink/50 ${i === 0 ? 'h-56 md:h-72' : 'h-32'}`}>
                  <img src={urlFor(p.image).width(600).url()} alt={p.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <span className="text-ghost text-xs uppercase tracking-wider">{LABEL[p.category] ?? p.category}</span>
                <h3 className="text-clean font-semibold mt-1">{p.name}</h3>
                {i === 0 && p.description && <p className="text-ghost text-sm mt-2 leading-relaxed">{p.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `src/components/home/EmploymentTeaser.tsx`**

```tsx
import Link from 'next/link'

export default function EmploymentTeaser() {
  return (
    <section className="py-12 px-6 border-t border-surface">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-ghost text-sm">Interested in joining the BluJ team?</p>
        <Link href="/employment" className="text-charge font-semibold text-sm hover:text-charge/70 transition-colors">
          View open positions →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Replace `src/app/page.tsx`**

```tsx
import { getLocations, getActivePromotion, getProducts, getSiteSettings } from '@/lib/sanity/queries'
import Hero from '@/components/home/Hero'
import LocationsStrip from '@/components/home/LocationsStrip'
import FeaturedPromotion from '@/components/home/FeaturedPromotion'
import ProductsGrid from '@/components/home/ProductsGrid'
import EmploymentTeaser from '@/components/home/EmploymentTeaser'

export const revalidate = 60

export default async function HomePage() {
  const [locations, promotion, products, settings] = await Promise.all([
    getLocations(),
    getActivePromotion(),
    getProducts(),
    getSiteSettings(),
  ])

  return (
    <>
      <Hero settings={settings} />
      <LocationsStrip locations={locations} />
      <FeaturedPromotion promotion={promotion} />
      <ProductsGrid products={products} />
      <EmploymentTeaser />
    </>
  )
}
```

- [ ] **Step 8: Verify**

```bash
npm run dev
```
Open http://localhost:3000. Check: massive "BluJ" hero, locations strip (empty until Sanity data added), no console errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: home page — Hero, LocationsStrip, OpenIndicator, FeaturedPromotion, ProductsGrid, EmploymentTeaser"
git push
```

---

### Task 7: Locations Page

**Files:**
- Create: `src/app/locations/page.tsx`

**Interfaces:**
- Consumes: `getLocations()`, `Location`, `isOpenNow`, `OpenIndicator`

- [ ] **Step 1: Create `src/app/locations/page.tsx`**

```tsx
import { getLocations } from '@/lib/sanity/queries'
import OpenIndicator from '@/components/home/OpenIndicator'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Locations | BluJ' }
export const revalidate = 60

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default async function LocationsPage() {
  const locations = await getLocations()

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <p className="text-ghost text-xs uppercase tracking-widest mb-3">Where To Find Us</p>
      <h1 className="font-display font-black text-clean text-6xl md:text-8xl mb-16">Locations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map(loc => (
          <div key={loc._id} className="bg-surface rounded-lg p-8 border border-ink/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-clean font-display font-black text-3xl">{loc.name}</h2>
                <p className="text-ghost mt-1">{loc.address}</p>
                {loc.phone && (
                  <a href={`tel:${loc.phone}`} className="text-charge text-sm mt-1 block hover:text-charge/70 transition-colors">
                    {loc.phone}
                  </a>
                )}
              </div>
              <div className="flex-shrink-0 mt-1">
                <OpenIndicator hours={loc.hours ?? []} />
              </div>
            </div>

            {loc.amenities?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-5">
                {loc.amenities.map(a => (
                  <span key={a} className="text-ghost text-xs bg-ink px-2.5 py-1 rounded-sm">{a}</span>
                ))}
              </div>
            )}

            {loc.hours?.length > 0 && (
              <div className="mt-6">
                <p className="text-ghost text-xs uppercase tracking-widest mb-3">Hours</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {DAYS.map(day => {
                    const entry = loc.hours.find(h => h.day === day)
                    return (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-ghost">{day.slice(0, 3)}</span>
                        <span className="text-clean">
                          {entry?.closed ? 'Closed' : entry ? `${entry.open} – ${entry.close}` : '—'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```
Open http://localhost:3000/locations.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: locations page with hours and open indicator"
git push
```

---

### Task 8: Products Page

**Files:**
- Create: `src/app/products/page.tsx`

**Interfaces:**
- Consumes: `getProducts()`, `urlFor`, `Product`

- [ ] **Step 1: Create `src/app/products/page.tsx`**

```tsx
import { getProducts } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import type { Metadata } from 'next'
import type { Product } from '@/lib/sanity/types'

export const metadata: Metadata = { title: 'Products | BluJ' }
export const revalidate = 60

const CATEGORIES: { key: Product['category']; label: string }[] = [
  { key: 'fuel', label: 'Fuel' },
  { key: 'deli', label: 'Deli' },
  { key: 'food', label: 'Food' },
  { key: 'convenience', label: 'Convenience' },
]

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <p className="text-ghost text-xs uppercase tracking-widest mb-3">At Every Location</p>
      <h1 className="font-display font-black text-clean text-6xl md:text-8xl mb-16">Products</h1>

      <div className="space-y-20">
        {CATEGORIES.map(cat => {
          const items = products.filter(p => p.category === cat.key)
          if (items.length === 0) return null

          return (
            <div key={cat.key}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-surface" />
                <h2 className="font-display font-black text-glow text-2xl uppercase tracking-wider">{cat.label}</h2>
                <div className="h-px flex-1 bg-surface" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map(p => (
                  <div key={p._id} className="bg-surface rounded-lg overflow-hidden border border-ink/50">
                    {p.image && (
                      <div className="h-40 bg-ink/50">
                        <img src={urlFor(p.image).width(400).url()} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-clean font-semibold">{p.name}</h3>
                      {p.description && <p className="text-ghost text-sm mt-1 leading-relaxed">{p.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```
Open http://localhost:3000/products.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: products page by category"
git push
```

---

### Task 9: Employment Page & /api/apply Route

**Files:**
- Create: `src/app/employment/page.tsx` (server wrapper)
- Create: `src/components/employment/EmploymentForm.tsx` (client form)
- Create: `src/app/api/apply/route.ts`

**Interfaces:**
- Produces: `POST /api/apply` writes `jobApplication` to Sanity; `<EmploymentPage />` with controlled form

- [ ] **Step 1: Create Sanity write token**

Sanity dashboard → your project → API → Tokens → Add API Token → name "bluj-write" → Permissions: Editor → Create → Copy token → add to `.env.local`:
```
SANITY_API_TOKEN=<paste-here>
```

- [ ] **Step 2: Create `src/app/api/apply/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { z } from 'zod'

const schema = z.object({
  name:              z.string().min(2).max(100),
  email:             z.string().email(),
  phone:             z.string().optional(),
  preferredLocation: z.string().optional(),
  message:           z.string().max(2000).optional(),
})

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_API_TOKEN,
  useCdn:    false,
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { name, email, phone, preferredLocation, message } = parsed.data
  await writeClient.create({
    _type: 'jobApplication',
    name,
    email,
    phone: phone ?? '',
    ...(preferredLocation ? { preferredLocation: { _type: 'reference', _ref: preferredLocation } } : {}),
    message: message ?? '',
    submittedAt: new Date().toISOString(),
    status: 'new',
  })

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Create `src/components/employment/EmploymentForm.tsx`**

```tsx
'use client'

import { useState } from 'react'

type FormState = { name: string; email: string; phone: string; message: string }
type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputClass = 'w-full bg-ink border border-surface rounded-md px-4 py-3 text-clean placeholder-ghost focus:outline-none focus:border-charge transition-colors'

export default function EmploymentForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const update = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return <p className="text-clean text-lg">Application sent — we'll be in touch soon.</p>
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="text-ghost text-xs uppercase tracking-widest block mb-2">Full Name *</label>
        <input required className={inputClass} placeholder="Jane Smith" value={form.name} onChange={update('name')} />
      </div>
      <div>
        <label className="text-ghost text-xs uppercase tracking-widest block mb-2">Email *</label>
        <input required type="email" className={inputClass} placeholder="jane@example.com" value={form.email} onChange={update('email')} />
      </div>
      <div>
        <label className="text-ghost text-xs uppercase tracking-widest block mb-2">Phone</label>
        <input type="tel" className={inputClass} placeholder="(603) 555-0100" value={form.phone} onChange={update('phone')} />
      </div>
      <div>
        <label className="text-ghost text-xs uppercase tracking-widest block mb-2">Tell Us About Yourself</label>
        <textarea rows={5} className={inputClass} placeholder="Any relevant experience?" value={form.message} onChange={update('message')} />
      </div>
      {status === 'error' && <p className="text-red-400 text-sm">Something went wrong — please try again.</p>}
      <button type="submit" disabled={status === 'sending'}
        className="w-full bg-charge text-clean font-semibold py-4 rounded-md hover:bg-charge/80 transition-colors disabled:opacity-50">
        {status === 'sending' ? 'Sending…' : 'Submit Application'}
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Create `src/app/employment/page.tsx`**

```tsx
import type { Metadata } from 'next'
import EmploymentForm from '@/components/employment/EmploymentForm'

export const metadata: Metadata = { title: 'Employment | BluJ' }

export default function EmploymentPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-ghost text-xs uppercase tracking-widest mb-3">Join The Team</p>
      <h1 className="font-display font-black text-clean text-6xl md:text-7xl mb-4">Work With Us</h1>
      <p className="text-ghost mb-12 leading-relaxed">
        BluJ is always looking for motivated people across New Hampshire and Vermont. Fill out the form and we'll be in touch.
      </p>
      <EmploymentForm />
    </div>
  )
}
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```
Open http://localhost:3000/employment. Submit form. Check Sanity Studio → Job Applications for the new entry.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: employment page and /api/apply route writing to Sanity"
git push
```

---

### Task 10: Contact Page & /api/contact Route

**Files:**
- Create: `src/components/contact/ContactForm.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/api/contact/route.ts`

**Interfaces:**
- Produces: `POST /api/contact` sends email via Resend

- [ ] **Step 1: Get Resend API key**

Go to https://resend.com → sign up (free: 3k emails/month) → API Keys → Create Key → add to `.env.local`:
```
RESEND_API_KEY=re_...
```

**Important:** In Resend, you must verify a sending domain before emails reach real inboxes. For v1 testing, Resend allows sending to the account's own email without domain verification.

- [ ] **Step 2: Create `src/app/api/contact/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const schema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  message: z.string().min(10).max(3000),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { name, email, message } = parsed.data

  // Update 'to' and 'from' once client domain is verified in Resend dashboard
  const { error } = await resend.emails.send({
    from:    'BluJ <onboarding@resend.dev>',
    to:      ['marcelino.keyrouz16@gmail.com'],
    replyTo: email,
    subject: `Contact form — ${name}`,
    text:    `From: ${name} <${email}>\n\n${message}`,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Create `src/components/contact/ContactForm.tsx`**

```tsx
'use client'

import { useState } from 'react'

type FormState = { name: string; email: string; message: string }
type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputClass = 'w-full bg-ink border border-surface rounded-md px-4 py-3 text-clean placeholder-ghost focus:outline-none focus:border-charge transition-colors'

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const update = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return <p className="text-clean text-lg">Message sent — we'll get back to you shortly.</p>
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="text-ghost text-xs uppercase tracking-widest block mb-2">Name *</label>
        <input required className={inputClass} placeholder="Your name" value={form.name} onChange={update('name')} />
      </div>
      <div>
        <label className="text-ghost text-xs uppercase tracking-widest block mb-2">Email *</label>
        <input required type="email" className={inputClass} placeholder="you@example.com" value={form.email} onChange={update('email')} />
      </div>
      <div>
        <label className="text-ghost text-xs uppercase tracking-widest block mb-2">Message *</label>
        <textarea required rows={6} className={inputClass} placeholder="What's on your mind?" value={form.message} onChange={update('message')} />
      </div>
      {status === 'error' && <p className="text-red-400 text-sm">Something went wrong — please try again.</p>}
      <button type="submit" disabled={status === 'sending'}
        className="w-full bg-charge text-clean font-semibold py-4 rounded-md hover:bg-charge/80 transition-colors disabled:opacity-50">
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Create `src/app/contact/page.tsx`**

```tsx
import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = { title: 'Contact | BluJ' }

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-ghost text-xs uppercase tracking-widest mb-3">Get In Touch</p>
      <h1 className="font-display font-black text-clean text-6xl md:text-7xl mb-4">Contact</h1>
      <p className="text-ghost mb-12 leading-relaxed">Questions, feedback, or anything else — we're listening.</p>
      <ContactForm />
    </div>
  )
}
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```
Open http://localhost:3000/contact. Submit form. Check your email inbox.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: contact page and /api/contact route via Resend"
git push
```

---

### Task 11: Sanity Studio Embedded at /studio

**Files:**
- Create: `src/app/studio/[[...tool]]/page.tsx`
- Modify: `next.config.ts`

**Interfaces:**
- Produces: Sanity Studio UI at `/studio`

- [ ] **Step 1: Create `src/app/studio/[[...tool]]/page.tsx`**

```tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

- [ ] **Step 2: Update `next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
}

export default config
```

- [ ] **Step 3: Verify Studio**

```bash
npm run dev
```
Open http://localhost:3000/studio. Log in with your Sanity account. Add a test Location document with full hours, then refresh http://localhost:3000 to see the location card appear in the strip.

- [ ] **Step 4: Add seed content**

In Studio, create:
- At least 1 Location with name, address, phone, hours for all 7 days, and amenities
- 1 Site Settings document with heroSubtext
- 2–3 Products (mark at least 1 as featured)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: embedded Sanity Studio at /studio"
git push
```

---

### Task 12: Netlify Deployment

**Files:**
- Create: `netlify.toml`

**Interfaces:**
- Produces: Live site on Netlify, CI/CD on git push to main

- [ ] **Step 1: Install Netlify Next.js plugin**

```bash
npm install -D @netlify/plugin-nextjs
```

- [ ] **Step 2: Create `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

- [ ] **Step 3: Create Netlify site**

Go to https://netlify.com → Add new site → Import from Git → connect GitHub → select `marso16/bluj` → Deploy site.

- [ ] **Step 4: Add environment variables in Netlify dashboard**

Site → Environment variables → Add all four:
```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
RESEND_API_KEY
```

- [ ] **Step 5: Add Netlify domain to Sanity CORS**

Sanity dashboard → your project → API → CORS origins → Add:
```
https://<your-site>.netlify.app
```

- [ ] **Step 6: Deploy**

```bash
git add -A
git commit -m "feat: Netlify deployment config"
git push
```
Netlify auto-builds. Watch build log in Netlify dashboard (~2 min).

- [ ] **Step 7: Verify live site**

Open `https://<your-site>.netlify.app`. Verify: all 5 pages load, Studio accessible at `/studio`, both forms submit correctly.

---

## Cost Summary

| Service | v1 | Production |
|---|---|---|
| Netlify | $0 | $0–19/mo |
| Sanity | $0 (3 editors, 100k req/mo) | $15/mo if needed |
| Resend | $0 (3k emails/mo) | $20/mo if needed |
| **Total** | **$0** | **$0–54/mo** |
