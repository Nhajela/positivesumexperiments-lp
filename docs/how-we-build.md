# How we build this site — opinions, and why

Developer-facing. The operating rules for anyone (human or AI) working in
this repo, and the reasoning behind them so they can be argued with rather
than cargo-culted. Companion to `docs/ai-policy.md` (who writes what).

## 1. Hardcode. Don't build structure you don't need.

This is a small, personal, expressive site — not a product that has to
scale. A page is written to do justice to what it's communicating, by hand,
and each page can look different from every other. We don't push content
through a generic data-driven template.

Concretely:

- A blog post is its own folder under `src/app/blog/<slug>/` with its own
  `page.mdx`. Its design lives in that file as inline JSX. No post template.
- Metadata is a tiny `post.ts` beside the post — title, description, date,
  tags — and the "database" is `src/app/blog/posts.ts`, an array you edit
  by hand. Index, feed, sitemap and JSON-LD all read that one array.
- No shared content schema, no validation layer, no queries module, no
  API tree. We built all of that once (see the
  `archive/hypothesis-experiments-lifedesign` branch) and removed it:
  *"i don't like schemas, they tie us down."* The structure cost more to
  maintain than the three pages it served.
- The seven Core headings on the home page are a plain array in
  `src/app/page.tsx`. When Naman adds a value, someone updates the array.
  That is fine. Two places, both obvious, beats a parser.

The test: would the abstraction pay for itself with the content we
actually have, or the content we imagine? Build for the former.

## 2. Keep the door open for structure later.

Hardcoding now doesn't mean we can never index. Every post ships with its
facts in `post.ts` and appears in `posts.ts`, so a `blog/2026` page or a
tag page later is a `.filter()` over that array — no migration. `tags`
exist on every post today precisely so that filter has something to work
with, even though no page uses them yet.

Every page also exists as data: `/blog/<slug>.md`, `/blog/<slug>.json`,
`/core.md` — built at build time from the same files as the pages
(`src/lib/mdx-to-md.ts`). Anyone, including another of Naman's sites or
an agent, can read the site without scraping HTML.

## 3. Everything is static.

Every route prerenders at build (`○ (Static)` in `next build` output):
pages, OG images, the feed, the sitemap, the `.md`/`.json` views. No
per-request server rendering, no function time, nothing to scale. If a
feature would need runtime rendering, that's a signal to reconsider the
feature.

## 4. Assets live in the repo, sized for display.

Images are committed next to the page that uses them. Git is only hurt by
large binaries that *change*; a cover written once at 100–200 KB is
nothing. Rules:

- Downsize to the display size first. The content column is 680px, so a
  full-width image is ~1360px wide at 2×. JPEG quality ~80–85. Paper-grain
  textures don't compress well; accept it.
- `next/image` from a static import handles responsive renditions and
  format conversion; a plain `<img>` (via `ZoomImage`) is fine for
  hand-drawn diagrams that need no pipeline.
- OG images: generate from the shared card (`src/lib/og/card.tsx`) unless
  Naman has made a real one, in which case commit a static
  `opengraph-image.jpg` + `opengraph-image.alt.txt` beside the page.
- R2 (`nmn-public-experiments` → public-media.namanhajela.com, or
  `nmn-lab-media` → media.positivesumexperiments.com) is for video-sized
  files or assets shared across sites. Not for blog covers.

## 5. The design system is small on purpose.

Tokens live in `src/app/globals.css` and nowhere else: paper/ink/quiet/rule
and four pens (cobalt annotates, red corrects, green validates, marigold
highlights), a six-step spacing scale, a short type scale, four faces.
Pages compose these; they don't add colours. The hand-drawn signatures —
the wobbly-radius frame, the drawn `+`, the tilted button, the pen note in
Akriti — are the identity. Reuse them; don't invent a fifth kind of box.

Every colour is a pen with one job. If a new element wants a new colour,
ask which pen would have drawn it.

## 6. Naman writes; AI arranges.

`docs/ai-policy.md` is the rule. In practice: quote him verbatim, log
every text he sends in `writing/` with the date, fix obvious spellings
and say so, and never fill a gap with drafted prose. When a line of his is
needed and missing, leave an in-style placeholder — same face and size as
body text, quieter, in square brackets — never a boxed "DRAFT" flag.

## 7. Small, atomic commits, as you go.

One logical change per commit, committed when it's verified, without
asking. Author is Nhajela; co-author line names the model with no email.
History should read as a changelog.

## 8. Known sharp edges

- **MDX and JSX children.** Text inside a JSX element in a `.mdx` file is
  re-parsed as markdown if it isn't on the same line as its tag, which
  produces `<p>` inside `<p>` (or inside `<li>`) and a React hydration
  error. Keep JSX text on one line, or give components string props.
- **Tailwind arbitrary selectors in `.md` output.** `[&>li]` puts a `>`
  inside `className`; the MDX→markdown stripper matches quoted attribute
  values for exactly this reason. If a new pattern leaks, fix the
  stripper, don't change the page.
- **Line endings.** The repo is mixed CRLF/LF and Biome complains about
  two untouched files. Run Biome on the files you changed, not `src/`.
