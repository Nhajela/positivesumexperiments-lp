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
| `/blog` | `src/app/blog/page.tsx` | The blog index — a hardcoded list |
| `/blog/<slug>` | `src/app/blog/<slug>/page.mdx` | One post, one bespoke page |
| `/blog/<slug>.md`, `.json`, `/core.md` | `src/app/blog/[file]/route.ts`, `src/app/core.md/route.ts` | The same pages, as data |

Site identity (name, canonical URL, description) lives in `src/lib/site.ts` —
metadata, sitemap, robots, and JSON-LD all read from it.

## Editing the Core

`src/app/core/page.mdx` is plain MDX — edit it directly. All reader-facing
prose is Naman's, written by hand (sources logged in `writing/`); see
`docs/ai-policy.md`.

## Adding a blog post

Each post is its own folder under `src/app/blog/<slug>/`, deliberately
hardcoded so every post can have its own design:

- `page.mdx` — the writing, in markdown. It exports `postMetadata(post)`
  and a default layout returning `<PostFrame post={post}>`
  (`src/components/post-frame.tsx` — head, JSON-LD, foot). Markdown gets
  the site's element mapping (`src/mdx-components.tsx`); anything bespoke
  to that post is inline JSX right there in the file.
- `post.ts` — title, description, date (shared by the page, its OG card,
  the index and the feed)
- `opengraph-image.tsx` — a few lines on top of `src/lib/og/card.tsx`; or,
  when Naman has made one, a static `opengraph-image.jpg` (1200×630) plus
  `opengraph-image.alt.txt` in its place
- `cover.jpg` — optional handmade cover, statically imported in `page.mdx`
  and handed to `<PostFrame cover>` (`next/image` resizes and converts it)

Every post also exists as data, built from those same files: `/blog/<slug>.md`
(the writing as plain markdown, with front matter) and `/blog/<slug>.json`
(its `post.ts`). Both come from `src/app/blog/[file]/route.ts`; the Core has
`/core.md` the same way. `tags` in `post.ts` are unused by any page — they
are there so a tag or by-month index later is a filter over `posts.ts`.

Every file about a post lives in that one folder — the tree grows one
folder per post and nothing else has to know. Images are committed to the
repo on purpose: compress to the display size first (the column is 680px,
so ~1360px wide at 2×, JPEG quality ~80, ~100–200 KB), and keep them out of
git only if they are video-sized or shared across sites (that's what the
R2 bucket is for). If the folder count ever gets unwieldy, group by year
(`src/app/blog/2026/<slug>/`) — the URLs are hardcoded, so nothing breaks.

Then list it in `src/app/blog/posts.ts` — the index, the RSS feed, the
sitemap and the blog JSON-LD all read that one list.

## SEO

- Per-page `metadata` exports (title template + canonical set per page)
- `src/app/robots.ts`, `src/app/sitemap.ts` (add new routes to the list there)
- `opengraph-image.tsx` next to every route, all rendered through
  `src/lib/og/card.tsx` (fonts vendored in `assets/fonts/` for Satori)
- JSON-LD: Organization + WebSite + Person on the home page, Blog on the index,
  BlogPosting + BreadcrumbList on each post — all keyed on the @ids in `src/lib/site.ts`
- `src/app/feed.xml/route.ts` — RSS for the blog
