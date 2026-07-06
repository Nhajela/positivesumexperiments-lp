# Positive Sum Experiments LP — Housekeeping & Foundations

Date: 2026-07-06
Status: approved (Naman, in-session)

## What this site is

The public site for **Positive Sum Experiments** — Naman's umbrella brand
(37signals-style) for his own experiments and ventures. Distinct from KraftedX.
Domain: **https://positivesumexperiments.com**. Deploys to **Vercel**.

## Launch scope

Three static routes:

- `/` — home: the umbrella brand, an experiments section (Happy Mornings Club
  is the first live experiment).
- `/manifesto` — the guiding principles / axioms, kept short.
- `/what-we-know` — a single, ever-growing linear list of fundamentals.

This mirrors the structure that emerged in Naman's brain notes: guiding
principles page + "what we know" list (which absorbed the earlier
"thoughts map" idea as a flat, growing list).

## Content model

- `/manifesto` and `/what-we-know` are **MDX pages as routes**
  (`app/<route>/page.mdx`) via `@next/mdx`. Adding a "what we know" entry =
  appending markdown to one file. Home stays TSX (design-heavy).
- Pages compose shared **prose primitives** (`src/components/prose/`) —
  headline pair, lede, verbatim quote, callout, dialogue Q&A, steps — inspired
  by kx-tess's ethos and kx-content-lab's field guide. Those are inspiration
  for the *moves*, not the skin: Positive Sum Experiments gets its own type and
  palette (moodboard phase).
- **All real copy is Naman's.** This phase ships placeholder structure only;
  he writes the manifesto and list content himself.

## SEO / meta

- Root layout: `metadataBase` = site URL, title template
  (`%s — Positive Sum Experiments`), description, OpenGraph + Twitter card
  defaults; per-page overrides in each page's metadata export.
- `app/robots.ts`, `app/sitemap.ts` (three routes).
- `opengraph-image.tsx` via `ImageResponse` — scaffolded now, styled after the
  moodboard locks the visual system (same for favicon).
- JSON-LD (`Organization` + `WebSite`) on home.

## Housekeeping

- Package manager: **pnpm** (replace npm lockfile).
- Rewrite boilerplate README; remove create-next-app demo assets.
- Biome stays as linter/formatter.

## Explicitly deferred

- Visual design → separate HTML moodboards (outside the app), then site build.
- Analytics: none for now (revisit when there's traffic).
- OG image / favicon styling → post-moodboard.
- Real manifesto / what-we-know copy → Naman.

## Decisions locked after moodboards (2026-07-06)

- **Direction: 01b "The Declaration, annotated"** — printed proof + the
  author's pen. Bare, human, subtly imperfect (37signals / sive.rs /
  paulgraham.com energy), with color. Pen layer waits on Naman's real
  handwritten assets (docs/future-changes.md).
- **Type: Young Serif (display) + Instrument Sans (body) + Spline Sans Mono
  (labels)** — option 5 on moodboards/01b-fonts.html, chosen by Naman.
- **Palette: warm paper #F7F6F1, print ink #1A1917, pen cobalt #1D3FE8,
  quiet #8B8A83, rule #E2E1D9** + paper grain.
- The drawn + mark is the identity glyph (wordmark, links, bullets).
- **Mark: B1 "quarter-turn extra"** (moodboards/01b-system.html, B-revised
  row) — one heavy-ink loop with a quarter-turn overlap, drawn + inside.
  Interim until Naman's redrawn pen assets arrive; strokes thicken at small
  sizes. Naman's own logo-trial-1.svg parked (needs bolder strokes).
