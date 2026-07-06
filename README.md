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
| `/` | `src/app/page.tsx` | The umbrella brand + experiments |
| `/manifesto` | `src/app/manifesto/page.mdx` | Guiding principles |
| `/what-we-know` | `src/app/what-we-know/page.mdx` | Ever-growing list of fundamentals |

Site identity (name, canonical URL, description) lives in `src/lib/site.ts` —
metadata, sitemap, robots, and JSON-LD all read from it.

## Adding a "What we know" entry

Append a `## heading` + body section to `src/app/what-we-know/page.mdx`.
That's the whole workflow — the page is plain MDX.

## SEO

- Per-page `metadata` exports (title template + canonical set per page)
- `src/app/robots.ts`, `src/app/sitemap.ts` (add new routes to the list there)
- `src/app/opengraph-image.tsx` — generated OG image
- JSON-LD (Organization + WebSite) on the home page
