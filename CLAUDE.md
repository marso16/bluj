# BluJ Website — Claude Conventions

## Project overview

Modern website for **BluJ**, a multi-location gas station/convenience store in NH and VT (replacing penguinfuels.com). Design theme: "The Midnight Fill-Up" — dark atmospheric, gas-station-at-night aesthetic.

**Repo:** https://github.com/marso16/bluj.git  
**Plan:** `docs/superpowers/plans/2026-09-01-bluj-website.md`  
**Spec:** `docs/superpowers/specs/2026-09-01-bluj-website-design.md`

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript, `src/` dir |
| CMS | Sanity v3 + Studio at `/studio` |
| Styling | Tailwind CSS + CSS custom properties |
| Hosting | Netlify (free tier) |
| Email | Resend (`onboarding@resend.dev` until domain bought) |
| Validation | Zod on all API routes |
| Tests | Vitest + jsdom |

## Design tokens (swappable in `src/lib/theme.css`)

```
--color-ink:     #0A0E1A   page background
--color-surface: #161D35   cards, sections
--color-charge:  #1D6FFF   primary accent (BluJ blue)
--color-glow:    #F59E0B   secondary accent (amber)
--color-clean:   #F0F4FF   primary text
--color-ghost:   #8892A4   secondary/label text
--font-display: 'Big Shoulders Display'
--font-body:    'DM Sans'
```

Tailwind aliases: `bg-ink`, `bg-surface`, `text-charge`, `text-glow`, `text-clean`, `text-ghost`, `font-display`, `font-body`.

## File layout (key paths)

```
src/
  app/                    Next.js App Router pages
    api/apply/route.ts    Job application → Sanity
    api/contact/route.ts  Contact form → Resend
    studio/[[...tool]]/   Sanity Studio
  components/
    layout/               Header, Footer
    home/                 OpenIndicator, hero sections
  lib/
    theme.css             Design tokens (swap here for rebrand)
    sanity/
      client.ts           Sanity read client
      queries.ts          GROQ queries (getLocations, etc.)
      types.ts            TypeScript interfaces
    utils.ts              isOpenNow() and helpers
  sanity/
    schemaTypes/          Sanity schema definitions
sanity.config.ts          Sanity Studio config
```

## Rules for all contributors

1. **Terminal commands** — never auto-execute. List every command in a code block; the user runs them manually. Git commits and pushes are the exception — Claude handles these directly.
2. **Tokens only** — use design token classes (`text-charge`, `bg-ink`), never raw hex values in JSX.
3. **Server components by default** — only add `'use client'` when interactivity is required. Never put `export const metadata` in a client component.
4. **Zod on boundaries** — validate all API route inputs with Zod before any action.
5. **No new dependencies** — check if an existing package already covers the need before adding anything.
6. **Commit often** — one commit per logical unit; commit message format: `feat|fix|chore: short description`.

## Environment variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=           # write token (job applications)
RESEND_API_KEY=
```

## Pages

| Page | Route | Status |
|---|---|---|
| Home | `/` | planned |
| Products | `/products` | planned |
| Locations | `/locations` | planned |
| Employment | `/employment` | planned |
| Contact | `/contact` | planned |
| Studio | `/studio` | planned |

## Adding a new page

Use the `/new-page` skill (`.claude/skills/new-page/SKILL.md`).

## GitHub MCP

The `.mcp.json` in this repo enables the GitHub MCP server for PR/issue management. It reads `GITHUB_PERSONAL_ACCESS_TOKEN` from your environment. To activate:

1. Generate a token at https://github.com/settings/tokens (scopes: `repo`, `read:org`)
2. Add to your shell profile: `export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...`
3. Restart Claude Code — the `github` MCP server will appear in `/mcp`
