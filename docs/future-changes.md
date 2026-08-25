# Future changes — not for MVP

Deferred deliberately. The MVP ships bare (see moodboard 01c); these layer on
top later, mostly waiting on handmade assets from Naman.

## The pen layer (from moodboard 01b — parked)

Naman will send handwritten and handmade assets. When they arrive:

- [ ] Real handwritten margin notes (scanned or traced to SVG) replacing any
      font-based handwriting — no Caveat in production
- [ ] Hand-drawn `+` marks, circles, arrows, underlines from Naman's actual pen
      (scan → SVG), used as the site's annotation vocabulary
- [ ] Struck-through-and-corrected lines in the manifesto showing real edits
- [ ] Candid polaroid-style photos with handwritten captions (namanhajela.com
      uses real photos over polish — same move here)
- [ ] Possibly a font made from Naman's handwriting for longer notes
- [ ] Paper grain / texture pass if the bare version ever feels too flat

## Identity & meta

- [ ] Real OG image designed from the final identity (currently a plain
      wordmark placeholder in `src/app/opengraph-image.tsx`)
- [ ] Favicon from the final mark

## Content & structure

- [ ] Reinstate the "what we know" page (ever-growing list) when there are
      entries to publish
- [ ] Reinstate the public /ai page (sive.rs/ai-shaped) once Naman writes it —
      the operating policy stays live in docs/ai-policy.md meanwhile
- [ ] Experiments section on home (removed at launch; /experiments now exists,
      so this is a matter of surfacing the live ones on the front page)
- [x] Per-experiment pages with live state — `/experiments/<slug>`, status and
      dates from `src/data/experiments.ts`
- [x] RSS feed — `/feed.xml`, plus JSON and XML at `/api` (see README)
- [ ] Day counter on a running experiment (day X of 15) — the dates are in the
      record already, it just isn't rendered
- [ ] Heading anchors/permalinks across MDX (rehype-slug + rehype-autolink),
      which would also let a hypothesis deep-link the exact core principle it
      descends from instead of linking /core whole
- [ ] Filtering /experiments by tag or status without a page load (deliberately
      static for now — the tag pages carry the roll-ups instead)
- [ ] "Now" section or page (what's currently running) — `getLiveExperiments()`
      in `src/lib/content/queries.ts` already returns exactly this

## Ops

- [ ] Revisit analytics (decided: none for launch)
- [ ] Prose kit components if MDX pages outgrow plain markdown
