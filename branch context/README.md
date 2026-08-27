# Branch context — the experiments/hypotheses/life-design detour

This folder is a full record of everything done on this branch, from the
moment the site expanded into a "hypothesis/experiment" content system
through the decision to scrap that entire direction and revert `master` to
before it started. It exists so nothing is lost even though the work isn't
being kept live — read this before ever resurrecting any of it.

**Why this branch was archived, in Naman's own words** (2026-08-27): *"we are
scrapping everything that we were doing so far and it's not worth the time as
per our own core principles. It's not a power law thing that we are doing
right now."* — i.e. per Core principle 5 ("Play with the power laws... do not
distract yourself with anything that doesn't contribute to the 20") this
whole direction was judged not to be where the leverage is, however much work
went into it.

## Files in this folder

- **`timeline.md`** — chronological narrative of everything that happened,
  in order, with enough detail to reconstruct the reasoning at each step.
- **`decisions-and-rationale.md`** — the key standalone decisions made along
  the way (design choices, the schema-removal pivot, the life-design pivot),
  each with its reasoning, independent of when it happened.
- **`file-inventory.md`** — a concrete list of what was added, changed, and
  deleted, with paths, so a future reader can find any specific piece of work
  without re-reading the whole timeline.
- **`life-design-canvas.html`** — a full offline copy of the published
  Claude Design canvas exploring what `/life-design` could look like (4
  artboards: a committed "belief-first notebook log" direction for the index
  + a detail page, plus 2 alternate directions with their own tradeoffs).
  Open it directly in a browser — it's fully self-contained.

## The one-paragraph version

The original ask was a UI/UX audit of positivesumexperiments-lp. That turned
up a real hydration bug and comprehension gaps (confirmed by three
independent cold-read tests: strangers couldn't parse "Core"/"Awareness" nav
labels or the hypothesis/experiment vocabulary at all). Fixing those led into
redesigning the hypothesis detail page and the `/experiments` index through
several mockup iterations, which led into questioning whether "hypothesis"
was even the right frame, which led into a decision to retire the whole
hypothesis/experiment concept in favor of a new `/life-design` section, which
led into a much bigger architectural pivot (removing the site's shared data
schema entirely — "I don't like schemas, they tie us down"). At that point,
stepping back, the whole direction was judged to be a detour from what
actually matters for this venture, and the decision was made to preserve all
of it here and revert `master` to the last commit before any of it started
(`79e7a31`, "Core: add value 7 — Sincerity over Seriousness").
