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

- [x] OG cards for every route (src/lib/og/card.tsx) — restyle with the real mark once it exists
- [ ] Favicon from the final mark

## Content & structure

- [ ] Reinstate the "what we know" page (ever-growing list) when there are
      entries to publish
- [ ] Reinstate the public /ai page (sive.rs/ai-shaped) once Naman writes it —
      the operating policy stays live in docs/ai-policy.md meanwhile
- [x] Experiments section on home — reads src/app/blog/posts.ts (3 Sep 2026);
      Happy Mornings Club returns when Naman wants it listed
- [x] Blog: /blog + one bespoke page.mdx per post in a PostFrame, .md/.json
      views, tags in post.ts for a future tag/month index (3 Sep 2026)
- [ ] Per-experiment live state (day X/30, alive/concluded) — the post page
      could carry it; nothing tracks it yet
- [ ] Anchors/permalinks for each "what we know" entry
- [x] RSS feed (src/app/feed.xml/route.ts)
- [ ] "Now" section or page (what's currently running)
- [ ] A handmade illustration for the Core frame on home, if Naman draws one
      (the slot is the space beside the quote; multiply-blend like the cover)

## Ops

- [ ] Revisit analytics (decided: none for launch)
- [ ] Prose kit components if MDX pages outgrow plain markdown
