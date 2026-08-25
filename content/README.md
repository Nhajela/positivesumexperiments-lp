# content/ — the writing

This is the half of the system you write in. Nothing here is code: every file
is markdown, and every file belongs to one record over in `src/data/`.

```
content/
  hypotheses/<slug>.mdx   the case for a hypothesis, and its link back to /core
  experiments/<slug>.mdx  the protocol, the log, what came out of it
  posts/<slug>.mdx        blog posts (published at /blog/<slug>)
  tags/<slug>.mdx         what a tag means and why things are filed under it
```

The split is deliberate. Structure — ids, tags, status, dates, what links to
what — lives in `src/data/` where it can be checked. Prose lives here, where
it can just be written.

## Adding an experiment

1. **Pick or write its hypothesis.** Every experiment hangs off exactly one.
   If it needs a new one, add a record to `src/data/hypotheses.ts` — including
   `core`, which names the principle on `/core` it descends from.
2. **Add the experiment** to `src/data/experiments.ts`: `id`, `slug`, `title`,
   its `hypothesis` id, and a `status`.
3. **Write it** at `content/experiments/<slug>.mdx`.
4. **Register the file** in `src/data/bodies.ts` under `experiments`, keyed by
   the slug. Skip this step and the page renders without a body — no error.

The page, the listing, the tag roll-ups, the sitemap, `/api/experiments` and
the XML all follow from those four steps. Nothing else to update.

## Statuses

`planned` → `ongoing` → `paused` → `concluded`, and `abandoned` for the ones
that stop being worth it. Moving an experiment along is editing `status` and
filling in `startedAt` / `endedAt`. The build refuses statuses that contradict
their dates — an `ongoing` experiment with no `startedAt`, say — so the site
can't quietly show a lie.

## Writing in these files

Plain markdown. Headings start at `##`, since the page has already printed the
title. Site components are available by import if you want them:

```mdx
import { HandNote } from "@/components/hand-note";

The bigger point is <HandNote note="the planning is the experiment">planning
to wake up</HandNote> at 6:30.
```

Two things get stripped before a file is served over the API, so they are safe
to use freely: `import` lines at the top, and `{/* MDX comments */}`. Notes to
yourself go in the latter.

## Placeholders

Anything not yet written by Naman is marked with `<DraftNote>` or
`[Placeholder — ...]` so it can't be mistaken for his voice, and so it is
obvious what still needs writing. See `docs/ai-policy.md`.

## Where it shows up

| You write | It renders at | It serialises to |
| --- | --- | --- |
| `hypotheses/<slug>.mdx` | `/hypotheses/<slug>` | `/api/hypotheses/<slug>` |
| `experiments/<slug>.mdx` | `/experiments/<slug>` | `/api/experiments/<slug>` |
| `posts/<slug>.mdx` | `/blog/<slug>` | `/api/posts/<slug>` |
| `tags/<slug>.mdx` | `/tags/<slug>` | `/api/tags` |

Everything at once: `/api/graph` and `/api/graph.xml`.
