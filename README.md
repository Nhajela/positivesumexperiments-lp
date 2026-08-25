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
| `/experiments` | `src/app/experiments/` | Every experiment, under the hypothesis it tests |
| `/experiments/<slug>` | ↳ `[slug]/page.tsx` | One experiment |
| `/hypotheses/<slug>` | `src/app/hypotheses/` | One hypothesis and everything under it |
| `/tags/<slug>` | `src/app/tags/` | Everything filed under one tag |
| `/blog`, `/blog/<slug>` | `src/app/blog/` | Writing |

Site identity (name, canonical URL, description) lives in `src/lib/site.ts` —
metadata, sitemap, robots, and JSON-LD all read from it.

## The content system

Everything under `/experiments` and `/blog` is generated from records, split
deliberately in two:

- **`src/data/`** — the structure. Ids, tags, status, dates, what links to
  what. Typed and `as const`, so a reference to a tag or a hypothesis that
  doesn't exist is a compile error.
- **`content/`** — the writing. One markdown file per record, in a directory
  Naman can open and write in without touching code. See
  [`content/README.md`](content/README.md).

The model is small on purpose:

**Hypothesis** is the parent — the claim, the tags, and which principle of
`/core` it descends from. One hypothesis holds many **experiments**, each with
a `status` (`planned` → `ongoing` → `paused` → `concluded`, plus `abandoned`).
**Tags** replace any category tree: one flat vocabulary arranged in groups
(scope: personal/work), set on the hypothesis and inherited by its experiments.
Anything — hypothesis, experiment, tag, post — can carry a markdown body.

`src/lib/content/queries.ts` is the read layer: it follows the ids and provides
the roll-ups (by hypothesis, by tag, by status, by core principle). It also
runs `assertContentIntegrity()` at import, so a dangling reference, a duplicate
slug or a status that contradicts its dates **fails the build** rather than
shipping as a broken link.

Empty is a normal state throughout — a hypothesis exists before anything tests
it, an experiment before it is written up — so every list and body says so
plainly rather than collapsing into a hole in the page.

### Placeholders

A record with `placeholder: true` gets **"This is a placeholder."** printed
above its title, and the flag rides along in the API so a site consuming the
feed isn't misled either. Everything currently published carries it. Clearing
one is a single edit in `src/data/`.

Adding an experiment is four steps, all in
[`content/README.md`](content/README.md). The pages, roll-ups, sitemap, feeds
and API all follow from the record.

## The public API

The same content, for anyone who wants to query it. Every endpoint is
prerendered at build and sent with `Access-Control-Allow-Origin: *`, so another
site can fetch it straight from the browser.

| Endpoint | What |
| --- | --- |
| `/api` | Discovery — the model, the counts, links to everything below |
| `/api/graph`, `/api/graph.xml` | Everything in one document |
| `/api/experiments`, `/api/experiments.xml`, `/api/experiments/<slug>` | Experiments |
| `/api/hypotheses`, `/api/hypotheses.xml`, `/api/hypotheses/<slug>` | Hypotheses |
| `/api/posts`, `/api/posts.xml`, `/api/posts/<slug>` | Blog posts |
| `/api/tags` | The tag vocabulary, by group |
| `/feed.xml` | RSS for the blog |

Each record carries its markdown body inline as `body.source` and a
`placeholder` boolean saying whether that text is finished writing. JSON and
XML are built from the same serialized objects
(`src/lib/content/serialize.ts`), so the two formats can't drift apart.
`version` in every response is the contract — bump `API_VERSION` when a field
changes meaning.

## Editing prose

`src/app/core/page.mdx` and everything in `content/` is plain MDX — edit it
directly. All reader-facing prose is Naman's, written by hand (sources logged
in `writing/`). Anything not yet written by him is flagged `placeholder: true`
on its record and marked with `<DraftNote>` or `[Placeholder — ...]` in the
prose, so it can't ship unnoticed; see `docs/ai-policy.md`.

## SEO

- Per-page `metadata` exports (title template + canonical set per page)
- `src/app/robots.ts`, `src/app/sitemap.ts` — written pages are listed by hand
  there; content routes come from the records automatically
- `src/app/opengraph-image.tsx` — generated OG image
- JSON-LD (Organization + WebSite) on the home page
