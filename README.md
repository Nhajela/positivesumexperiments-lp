# Positive Sum Experiments — site

The public site for [Positive Sum Experiments](https://positivesumexperiments.com) —
Naman's umbrella for the experiments and ventures he builds.

## Stack

- [Next.js](https://nextjs.org) (App Router, static-first) + React
- Tailwind CSS 4
- MDX via `@next/mdx` for the written pages
- Biome for lint + format
- Deployed on Vercel

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint       # biome check
pnpm build      # production build
```

## Structure

| Route | Source | What it is |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | The venture, in one assertion |
| `/core` | `src/app/core/page.mdx` | The core — Naman's guiding principles |

Site identity (name, canonical URL, description) lives in `src/lib/site.ts` —
metadata, sitemap, robots, and JSON-LD all read from it.

## Editing the Core

`src/app/core/page.mdx` is plain MDX — edit it directly. All reader-facing
prose is Naman's, written by hand (sources logged in `writing/`); see
`docs/ai-policy.md`.

## SEO

- Per-page `metadata` exports (title template + canonical set per page)
- `src/app/robots.ts`, `src/app/sitemap.ts` (add new routes to the list there)
- `src/app/opengraph-image.tsx` — generated OG image
- JSON-LD (Organization + WebSite) on the home page
