# BluJ Website — Design Spec
**Date:** 2026-09-01  
**Status:** Approved  
**Author:** Marck / Claude

---

## 1. Project Overview

A modern website for **BluJ**, a multi-location gas station and convenience store business in New Hampshire and Vermont (formerly operating as Penguin Fuels). The site replaces `penguinfuels.com` with a design-forward, brand-distinguishing presence and a built-in employee CMS dashboard.

**Single job of this site:** Get someone within 30 seconds to either (a) find their nearest BluJ and its hours, or (b) understand what makes BluJ worth stopping at.

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript) | SSG/ISR, API routes, industry standard |
| CMS / Dashboard | Sanity v3 + Sanity Studio | Best employee UX, free tier covers v1 |
| Styling | Tailwind CSS + CSS custom properties | Utility-first + design token system |
| Hosting | Netlify (free tier, commercial OK) | Free, CI/CD on git push |
| Email | Resend (free tier: 3k emails/mo) | Contact form delivery |
| Language | TypeScript end-to-end | No separate backend |

**v1 cost: $0**  
**Production target: ~$20–35/month** (Netlify Pro or Vercel Pro + Sanity Growth when needed)

---

## 3. Pages

| Page | Route | Content Source |
|---|---|---|
| Home | `/` | Sanity |
| Products | `/products` | Sanity |
| Locations | `/locations` | Sanity |
| Employment Application | `/employment` | Static form → Sanity |
| Contact | `/contact` | Static form → API route (Resend) |

---

## 4. Sanity Content Schema

### `location`
- `name` (string)
- `address` (string)
- `coordinates` (lat/lng — for map embed)
- `phone` (string)
- `hours` (array of `{ day: string, open: string, close: string, closed: boolean }`)
- `amenities` (array of strings — e.g. "Deli", "Dunkin'", "Auto Repair", "Chicken on the Go")
- `photos` (array of images)
- `slug` (for individual location pages in the future)

### `promotion`
- `title` (string)
- `description` (text)
- `image` (image)
- `activeDateRange` (`{ start: datetime, end: datetime }`)
- `locations` (references to `location` — empty = all locations)
- `active` (boolean — manual override)

### `product`
- `name` (string)
- `category` (enum: `fuel` | `convenience` | `deli` | `food`)
- `description` (text)
- `image` (image)
- `featured` (boolean)

### `jobApplication`
- `name` (string)
- `email` (string)
- `phone` (string)
- `preferredLocation` (reference to `location`)
- `message` (text)
- `submittedAt` (datetime — auto)
- `status` (enum: `new` | `reviewed` | `contacted`)

### `siteSettings` (singleton)
- `tagline` (string)
- `heroHeadline` (string)
- `heroSubtext` (text)
- `socialLinks` (array of `{ platform, url }`)
- `contactEmail` (string)

---

## 5. Design Direction — "The Midnight Fill-Up"

### Concept
Gas stations are one of the few businesses fully alive at 2am. The glowing canopy over wet asphalt, warm amber from the store window, the electric blue of the price sign — that atmosphere is authentic to the business and completely unexplored by competitors. We build the website inside that moment.

### Design Token System
All brand tokens live in `src/lib/theme.css` (CSS custom properties). Swap this one file when the real brand assets arrive.

```css
:root {
  --color-ink:     #0A0E1A; /* page bg — wet asphalt */
  --color-surface: #161D35; /* cards, sections */
  --color-charge:  #1D6FFF; /* primary accent — BluJ blue */
  --color-glow:    #F59E0B; /* secondary accent — canopy amber */
  --color-clean:   #F0F4FF; /* primary text */
  --color-ghost:   #8892A4; /* secondary text, labels */

  --font-display: 'Big Shoulders Display', sans-serif;
  --font-body:    'DM Sans', sans-serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

### Typography
- **Display:** Big Shoulders Display (900 weight) — tall, condensed, gas-station-signage energy
- **Body:** DM Sans — humanist, readable, modern contrast

### Page Layout Sequence (Home)
NOT the standard hero → features → testimonials → CTA template.

```
[HERO]
  Full-bleed dark section. 
  Massive "BluJ" in Big Shoulders Display.
  Tagline underneath. "Find a Location" CTA.
  Atmospheric: dark, blue-tinted.

[LOCATIONS STRIP]
  Horizontal scroll of location cards.
  Each card: name, address, live open/closed indicator.
  No carousel library — native scroll-snap.

[FEATURED PROMOTION]
  Full-width editorial block.
  Bold type on image — no card, no border.
  Only shown when an active promotion exists in Sanity.

[PRODUCTS]
  Asymmetric grid — NOT an even 3-column layout.
  Categories: Fuel / Deli / Convenience.
  Featured products pulled from Sanity.

[EMPLOYMENT TEASER]
  Single-line CTA strip — minimal, not a section.

[FOOTER]
  Locations list, nav links, contact, social.
```

### Signature Element
**Live open/closed indicator on every location card:**
- Green pulse = open now
- Amber = closing within the hour  
- Dim = closed

Calculated client-side from hours stored in Sanity. No API call needed, no library. This is the first thing a customer actually needs, and zero other gas station sites do it.

### Aesthetic Risk
Dark theme when every competitor is white and red. Justified: (1) authentic to the 24/7 gas station experience, (2) dark reads as premium/modern, (3) BluJ blue and amber pop on dark where they'd compete on white.

---

## 6. API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | Receives contact form, sends via Resend |
| `/api/apply` | POST | Receives job application, writes to Sanity |

Both validate input server-side before any action.

---

## 7. Employee Dashboard (Sanity Studio)

Embedded at `/studio` — employees open this URL in a browser, no install required.

**What employees can manage:**
- Location hours, address, phone, amenities, photos
- Promotions (create, activate, schedule, link to locations)
- Products (add, edit, categorize, feature)
- Job applications (read-only inbox, status tracking)
- Site settings (tagline, hero text)

---

## 8. Deployment

### Dev workflow
```
git push main → Netlify builds → site live in ~2 minutes
```
Sanity content changes trigger ISR revalidation — no rebuild needed.

### Environment variables needed
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=           # write token for job application submissions
RESEND_API_KEY=
```

---

## 9. Future (not in v1)
- Individual location pages (`/locations/[slug]`)
- Live fuel price API integration
- Loyalty program
- Online deli ordering
- Fuel price display on home page

---

## 10. Success Criteria for v1
- All 5 pages built and responsive (mobile → desktop)
- Sanity Studio functional for all content types
- Contact form and job application form working
- Live open/closed indicators on location cards
- All brand tokens in one swappable file
- Deployed to Netlify, zero cost
