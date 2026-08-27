# File inventory — exact diff from `master` (pre-revert) as of the archive commit

Generated from `git status --short` at the time this branch was archived.
Grouped by what the change was for, not just M/A/D.

## New: standalone design mockups (never wired into the app)

`mockups/` (entire folder, untracked until this commit):
- `hyp-alt-a-progressive.html` — **the approved hypothesis-page direction**,
  final iterated state (fade-clip reveal, experiments table, Tags eyebrow,
  Descends-from hidden, See-also fixed to the specific awareness piece).
- `hyp-alt-b-table.html`, `hyp-alt-c-narrative.html` — the other two
  original alternates, restructured to match the same long-title/
  description/see-more/everything-else content order but not otherwise
  pursued further.
- `experiments-index-table.html` — the rejected dense-table `/experiments`
  redesign.
- `experiments-index-staged.html` — the two-act (hypotheses-first) redesign,
  iterated to a high-fidelity illustrated version.
- `experiments-index-firstprinciples.html` — the ledger-with-margin-glosses
  redesign, mid-iteration with Naman's real copy replacing AI drafts when
  the pivot happened.
- `onramp-mockup.html`, `placeholder-text-before-after.html` — early
  standalone explorations for the home-page on-ramp and the placeholder-
  text wording, both later ported into real code directly.

`branch context/life-design-canvas.html` — offline copy of the published
Claude Design canvas (4 artboards: committed index+detail direction, 2
alternates). See `README.md`.

## Real production changes (shipped, verified working)

**Home page** (`src/app/page.tsx`):
- New "How this site is organized" on-ramp section (icons + one-line
  explainer per Core/Awareness/Experiments/Blog).
- Three CTA buttons changed from a wrap-prone flex row to a one-per-line
  stack (fixes an always-uneven 2-then-1 wrap).

**Hypothesis detail page** (`src/app/hypotheses/[slug]/page.tsx` — later
gutted to a parked 404-everything stub in step 7 of the timeline, but its
*pre-parking* rewrite is the reference for what to rebuild if this content
ever comes back):
- Header restructured: long title (belief statement) as H1, short display
  title as a kicker above it.
- New `src/components/reveal-more.tsx` — fade-clip + tap-anywhere-to-expand
  description reveal (not scroll-gated).
- "Tags" eyebrow label added above the tag pills.
- "Descends from" (Core cross-reference) section commented out.
- "Experiments testing it" changed from a link+badge list to a real table
  (Experiment / Status / Length / Brief).
- `pledge` field added to the `Experiment` schema/data so the table's Brief
  column shows real per-experiment text.

**Awareness cross-linking**:
- `src/app/awareness/[slug]/page.tsx` (new) — stopgap redirect route,
  `/awareness/<slug>` → `/awareness#<slug>`, so a specific piece can be
  linked to before pieces have real pages of their own.
- `src/app/awareness/page.mdx` — added `id="limited-decision-budget"` to
  that heading.
- `content/hypotheses/doing-well-decides-well.mdx` — its "See also" link
  changed from generic `/awareness` to the specific
  `/awareness/limited-decision-budget`.

**Content edits (Naman's own real words, applied everywhere they appear —
data, MDX content, and every mockup)**:
- Pledge text cleaned up: *"I will wake up every day at 6:30 a.m. for the
  next 15 days or so."* (was *"Hey I will wake up every day at 6:30 a.m. for
  the next whatever 15 days or so."*) — in
  `content/experiments/wake-at-630.mdx`, `src/data/experiments.ts`, and the
  three mockup files that quoted it.
- Removed the "The pledge, in Naman's words" citation caption wherever it
  appeared in mockups (his instruction: not needed).
- New `description` field on the hypothesis:
  *"Taking care of myself is the single most compounding decision I can
  focus on everyday."*
- `content/experiments/wake-at-630.mdx`'s "The log"/"What came out of it"
  placeholders simplified from a version that leaked file paths/status code
  to visitor-appropriate text.
- `wake-at-630` experiment marked genuinely live:
  `status: "ongoing"`, `startedAt: "2026-08-27"` (was `"planned"`).

**Bug fix**: `src/components/draft-note.tsx` — `DraftNote` changed from a
`children` prop to a `text` string prop (fixes a real hydration mismatch);
`content/tags/personal.mdx` and `content/experiments/wake-at-630.mdx`
updated to the new API and to consistently wrap previously-undecorated
placeholder paragraphs.

**Repo rule** (`CLAUDE.md`): added the "don't be afraid to hardcode" project
rule. Also saved as a memory file outside this repo
(`~/.claude/projects/.../memory/hardcode-over-structure.md`) — not part of
this branch's diff, mentioned here for completeness.

## Parked (intentionally left non-functional pending a rebuild)

- `src/app/experiments/page.tsx` — renders `null`.
- `src/app/experiments/[slug]/page.tsx`, `src/app/hypotheses/[slug]/page.tsx`
  — `generateStaticParams()` returns `[]`; every slug 404s
  (`dynamicParams = false`). Their opengraph-image siblings were gutted to
  match (dead imports from the deleted schema layer would otherwise fail
  the build).

## Deleted: the entire shared content-schema layer

- `src/data/schema.ts`, `core.ts`, `hypotheses.ts`, `experiments.ts`,
  `posts.ts`, `tags.ts`, `bodies.ts`
- `src/lib/content/queries.ts`, `serialize.ts`, `xml.ts`, `responses.ts`,
  `body.ts`
- The entire `src/app/api/**` tree (graph, graph.xml, experiments,
  experiments.xml, experiments/[slug], hypotheses, hypotheses.xml,
  hypotheses/[slug], posts, posts.xml, posts/[slug], tags)

## New: per-page inline data + the replacement JSON/XML pattern

- `src/app/blog/posts.ts` — the blog's own post array, read directly by its
  page, `[slug]/page.tsx`, both opengraph-images, `blog.json`, `blog.xml`,
  `feed.xml`, and `sitemap.ts`.
- `src/app/tags/tags-data.ts` — same pattern for tags (now just `personal`
  — the other three tags had no surviving referrer once hypotheses were
  parked).
- `src/app/core/seo.ts`, `src/app/awareness/seo.ts` — sibling files holding
  each `.mdx` page's `metadata`/`ogCard` export (TypeScript's ambient
  `*.mdx` module type doesn't expose named exports declared inside the MDX
  file itself to importers, so these had to live alongside it instead).
- `src/lib/xml-escape.ts` — a small generic XML-escaping helper, used by
  the two hand-rolled XML routes.
- Route shape landed on: `src/app/blog.json/route.ts` (→ `/blog.json`),
  `src/app/blog.xml/route.ts` (→ `/blog.xml`), `src/app/blog/[slug]/data/
  route.ts` (→ `/blog/<slug>/data`), `src/app/tags/[slug]/data/route.ts`
  (→ `/tags/<slug>/data`). `/feed.xml` kept its existing path, rebuilt to
  read `blog/posts.ts` directly.
- `src/lib/content/paths.ts`, `seo.ts` — trimmed to plain string builders
  and generic SEO helpers (`PageSeo`/`toMetadata`/`clamp`/`join`/`plural`/
  `describe`), no schema dependency.
- `src/components/prose-body.tsx` — `ProseBody` now takes a loader function
  directly instead of a `(collection, slug)` lookup.
- `src/components/status-badge.tsx`, `tag-pill.tsx` — their types are now
  plain literal/inline types defined in-file, not imported from the deleted
  schema.

**Verification at archive time**: `npx tsc --noEmit` clean, `npm run build`
clean, every surviving route spot-checked at 200 (home, core, awareness,
blog, blog post, tags/personal, feed.xml, blog.json), parked routes
confirmed 404, no console errors, visual spot-check via Playwright matched
pre-rewrite screenshots.

## Also present, unrelated to this work

- `"hypothesis on engaging in projects.txt"` — a pre-existing untracked note
  file of Naman's own, not touched or read as part of this work.
