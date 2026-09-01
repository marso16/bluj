---
name: new-page
description: >
  Add a new page to the BluJ Next.js 15 website. Use this skill whenever
  the user says "add a page", "create a page", "new page", or names a route
  that doesn't exist yet. It enforces BluJ conventions: App Router, TypeScript,
  Tailwind design tokens, Sanity data fetching, server component by default.
---

# BluJ New Page

## Project conventions

- **Framework:** Next.js 15 App Router — pages live at `src/app/<route>/page.tsx`
- **Styling:** Tailwind utility classes using design tokens from `src/lib/theme.css`
  - `bg-ink`, `bg-surface` — backgrounds
  - `text-clean`, `text-ghost` — text
  - `text-charge` (blue), `text-glow` (amber) — accents
  - `font-display` (Big Shoulders Display), `font-body` (DM Sans)
- **Data:** server components fetch from Sanity via helpers in `src/lib/sanity/queries.ts`
- **Types:** shared interfaces in `src/lib/sanity/types.ts`
- **Client components:** only when interactivity is required; split into a wrapper server page + client component to allow metadata export

## Steps to add a page

1. **Determine the route** — e.g. `/about` → `src/app/about/page.tsx`

2. **Does the page need new Sanity data?**
   - If yes: add a schema type in `src/sanity/schemaTypes/`, export it from `src/sanity/schemaTypes/index.ts`, add a GROQ query + TypeScript type in `src/lib/sanity/queries.ts` and `src/lib/sanity/types.ts`
   - If no: reuse existing queries

3. **Write the page file** — server component template:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '<Page Title> | BluJ',
  description: '<SEO description>',
}

export default async function <PageName>Page() {
  // fetch from Sanity if needed
  // const data = await getSomething()

  return (
    <main className="min-h-screen bg-ink text-clean font-body">
      {/* page content */}
    </main>
  )
}
```

4. **Add to navigation** — update the nav links in `src/components/layout/Header.tsx`

5. **Test** — tell the user to run `npm run dev` and visit the route

## Interactive pages (forms)

If the page has a form, split it:

- `src/app/<route>/page.tsx` — server component, exports metadata, renders `<RouteForm />`
- `src/components/<route>/<RouteForm>.tsx` — `'use client'` component with form state

## API routes

If the page needs a new API endpoint:

- `src/app/api/<name>/route.ts` — Next.js route handler
- Validate input with Zod before any action
- Contact/email → Resend (`resend.emails.send(...)`)
- Write to Sanity → use `SANITY_API_TOKEN` write client

## Checklist before shipping

- [ ] Page file at correct App Router path
- [ ] `export const metadata` declared (server components only)
- [ ] Design tokens used (no raw hex colors)
- [ ] Mobile-responsive (Tailwind responsive prefixes)
- [ ] Nav updated if the page should appear in the header
- [ ] Sanity schema updated if new content type needed
