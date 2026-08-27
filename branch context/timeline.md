# Timeline — everything that happened, in order

Starting point: continuing a prior session's UI/UX audit of
positivesumexperiments-lp, picking up from `HANDOVER.md` (since deleted —
its contents are folded in here).

## 1. Branch/PR cleanup

Discovered the branch `claude/ui-ux-polish-audit-9s90pg` referenced in the
handover had already been merged into `master` via PR #3 (`a396295`). Left
one stray unmerged commit (a note about the PR). Deleted that stray branch,
confirmed `master` was current, deleted the now-stale `HANDOVER.md`.

## 2. Live-site UI/UX audit

Chrome extension wasn't connected (wrong account); switched to the
Playwright MCP plugin instead. Screenshotted all 9 real pages
(`/`, `/core`, `/awareness`, `/experiments`, the one hypothesis, the one
experiment, `/blog`, the one blog post, `/tags/personal`, and 404) at
desktop (1280×900) and mobile (390×844).

**Confirmed bug**: `src/components/draft-note.tsx`'s `DraftNote` component
took `children` (JSX) instead of a string prop. MDX re-parses a component's
multi-line JSX children as markdown, wrapping them in their own `<p>` nested
inside `DraftNote`'s own `<p>` — invalid HTML, a hydration mismatch (React
error #418), confirmed live on `/blog/placeholder-first-post` and
`/tags/personal`. This was the same root-cause class the *previous* session
had already fixed for two other components (`CrossLink`/`SectionLabel`) but
had missed in `DraftNote`. **Fixed for real, immediately** — converted
`DraftNote` to a string `text` prop, updated both call sites.

**Other findings from manual review** (documented, some acted on same
session):
- Home page's three CTA buttons always break into an uneven 2-then-1 wrap at
  every screen size (the three labels total ~665px against 632px of usable
  content width at the site's 680px measure) — not a near-miss, a structural
  mismatch between the code comment's stated intent ("the row reads as three
  things") and the actual container width. **Fixed**: changed to a
  one-per-line vertical stack (matches how mobile already rendered anyway).
- Placeholder-marking was inconsistent: some placeholder paragraphs used the
  `DraftNote` "unmistakable" treatment the site's own `docs/ai-policy.md`
  requires, others (in `content/tags/personal.mdx` and
  `content/experiments/wake-at-630.mdx`'s "The log"/"What came out of it"
  sections) were plain undecorated text. **Fixed**: wrapped all of them in
  `DraftNote`.
- Mobile sticky-footer gap on short pages (a `flex-1` layout leaves a big
  empty gap above the footer on short content) — **flagged, not fixed**.
- The placeholder blog post's cross-reference links elsewhere on the site
  weren't visually flagged as placeholder (only the literal `[Placeholder —
  ...]` brackets in the title marked it) — **flagged, not fixed**.

## 3. Cold-read comprehension testing (this is the pivotal moment)

Dispatched **3 independent subagents with zero prior context** (one on the
`fable` model) to visit the live site cold, click around like a real
stranger, and report — in their own words — what they understood or didn't.
This method worked extremely well and is worth reusing on any future
comprehension question: genuinely blind agents surface exactly the gaps an
insider can't see anymore.

**All three independently, without prompting, flagged the same things:**
1. "Core" and "Awareness" as nav labels give zero preview of content before
   clicking — unguessable jargon to a stranger.
2. Dev-facing placeholder text (`status: "ongoing"`, file paths like
   `src/data/experiments.ts`) was leaking onto public pages as if it were
   content, on the experiment detail page's "The log" section.
3. (Noted by 2/3) The home page's word "venture" primes a stranger to expect
   a startup/product; the actual content (personal habit experiments) is a
   jarring gap from that framing.
4. All three separately praised the hypothesis↔experiment cross-linking
   mechanic (nested counts, "Descends from," "Testing →") as the clearest,
   best-explained part of the site once actually seen — the failure wasn't
   the concept, it was arriving at it cold with no on-ramp. (Naman later
   disagreed with this read — see `decisions-and-rationale.md`.)

**Fixed for real, on production:**
- Added a "How this site is organized" on-ramp section to the real home
  page (`src/app/page.tsx`) — one line + a small hand-drawn-style SVG icon
  per section (Core/Awareness/Experiments/Blog). Explainer text left as
  clearly-bracketed placeholder copy (`[Placeholder — one line, e.g. ...]`)
  since writing that voice is Naman's call, not AI's, per `docs/ai-policy.md`.
- Simplified the leaking placeholder text on the experiment page from
  `"Placeholder — Naman writes here as it runs. This experiment is
  planned; when it starts, set status: "ongoing" and startedAt in
  src/data/experiments.ts."` to a clean visitor-facing
  `"Not written yet — this fills in once the experiment starts."`
  (mechanics-for-future-Naman dropped entirely rather than hidden behind a
  toggle, per his explicit choice among two options presented).

## 4. Mockup-driven redesign of the hypothesis/experiment pages

Built comparison alternates as **standalone HTML files in `mockups/`**
(never touching production until a direction was approved) — this
mockup-first workflow (build → screenshot-verify via Playwright + a local
`python -m http.server` → get approval → THEN port to real code) is worth
reusing.

**Hypothesis detail page**, three alternates built by parallel `fable`
subagents, all using the real content verbatim and the site's real design
tokens:
- `hyp-alt-a-progressive.html` — progressive disclosure (cover minimal,
  reasoning behind a fold). **This is the one Naman approved** ("this
  works") and the one iterated on further.
- `hyp-alt-b-table.html` — a summary table before any prose.
- `hyp-alt-c-narrative.html` — paced narrative chunks, nothing hidden.

All three were later restructured, per Naman's explicit content-order
instruction, to a common shape: **long title (the belief statement) on top
→ full/majority description immediately visible → "See more" → everything
else (tags, relationships, cross-references) below.** ("Long title" = the
belief statement, e.g. "When I'm doing well, I will make better decisions.";
"short title" = the display label, e.g. "Doing well, deciding well" — reserved
for compact/already-linked contexts, never used as the main heading where
there's room.)

`hyp-alt-a-progressive.html` was iterated several more rounds:
- Hid the "Descends from · Core principle" cross-reference (commented out,
  not deleted).
- Replaced the native `<details>` "see more" with a custom fade-clipped
  reveal: text clips at ~320px, fades into the page background, a centered
  pill-shaped button (with a gentle looping nudge animation, respecting
  `prefers-reduced-motion`) invites expansion, and tapping anywhere in the
  clipped text also expands it — not just the button.
- Replaced the plain "Experiments testing it" link+badge with a real table
  (Experiment / Status / Length / Brief columns).
- Added an explicit "Tags" eyebrow label above the tag pills (previously
  unlabeled).
- Fixed "See also" to link to the *specific* awareness piece ("Limited
  Decision Budget") instead of the generic `/awareness` index.

**`/experiments` index**, several full redesign rounds:
- `experiments-index-table.html` — dense table-first version. **Rejected**
  by Naman as "too cluttered... needs illustrations... explained slowly."
- `experiments-index-staged.html` — two-act redesign (Act 1: hypotheses
  first; Act 2: experiments introduced after), with simple line-drawn
  icons and a hero section explaining what "Hypothesis"/"Experiment" mean.
  Iterated through several revisions (illustrations, staged pacing, then a
  full high-fidelity pass with a detailed 4-beat hand-drawn SVG illustration
  of belief→hypothesis→experiment→result).
- `experiments-index-firstprinciples.html` — a from-scratch redesign by a
  fable subagent explicitly told to depart from the staged-reveal approach:
  a numbered ledger with margin pen-note glosses defining "hypothesis"/
  "experiment" right where each word first appears, and the experiment
  nested directly under its hypothesis with a hand-drawn connector labeled
  "tested by." This is the version that was still being refined with
  Naman's own real copy (replacing all AI-drafted placeholder text) when
  the pivot away from hypothesis/experiments happened. See
  `decisions-and-rationale.md` for the specific copy Naman supplied and the
  placeholder-styling rule change (in-style/lorem-ipsum-like, never boxed
  "DRAFT" tags) that came out of this round.

## 5. Porting approved designs to real production code

- Home page on-ramp section (above) — real, shipped.
- `src/app/hypotheses/[slug]/page.tsx` rewritten to match the approved
  `hyp-alt-a-progressive.html` direction: long title as H1, short title as
  a kicker, a new `src/components/reveal-more.tsx` client component
  (fade-clip + tap-anywhere-to-expand, no scroll-gating), a "Tags" eyebrow,
  the "Descends from" section commented out, and the experiments list
  replaced with a real table.
- Added an optional `pledge` field to the `Experiment` schema so the
  table's "Brief" column could show real per-experiment data instead of a
  placeholder.
- `src/app/awareness/[slug]/page.tsx` — a stopgap redirect route
  (`/awareness/<slug>` → `/awareness#<slug>`) added so hypothesis pages
  could link to *specific* awareness pieces even though pieces don't have
  real pages of their own yet; `src/app/awareness/page.mdx`'s "Limited
  Decision Budget" heading got a matching `id`.
- The `wake-at-630` experiment was marked genuinely live:
  `status: "ongoing"`, `startedAt: "2026-08-27"`.
- Naman supplied a real pledge-text cleanup (removed "Hey" and "whatever":
  *"I will wake up every day at 6:30 a.m. for the next 15 days or so."*) and
  a real `description` field for the hypothesis: *"Taking care of myself is
  the single most compounding decision I can focus on everyday."* Both were
  applied everywhere the old text appeared (real data, real MDX content, and
  every mockup file).
- Asked directly for feedback on whether the hypothesis statement was really
  falsifiable and whether the new description justified it — see
  `decisions-and-rationale.md` for that exchange; it's part of why the
  concept got questioned at all.

## 6. The pivot: hypothesis/experiment → `/life-design`

Naman decided to retire the `/hypotheses` + `/experiments` concept entirely
in favor of a new, dedicated `/life-design` section — not in the top nav,
meant to hold a growing personal log ("wake up early, start day with
workout, eat protein first diet, etc." — his own words on what was coming).
`/hypotheses` and `/experiments` were **parked** (index pages render
nothing; every dynamic slug 404s via `generateStaticParams() { return [] }`)
rather than deleted outright, pending the rebuild.

## 7. The bigger pivot: removing the shared data schema

Naman then went further: *"let's remove all the schema and stuff, and the
xml and stuff, let's have the entire project have a wrapper which lets each
page/route export its own .md .xml and .json data when you change the route
like that... i don't like schemas, they tie us down."* Confirmed scope via a
direct question: **full removal, now** (not just for new pages).

This produced a new standing rule, written into `CLAUDE.md`: *"Don't be
afraid to hardcode. This is a small, personal, expressive site, not a
scalable product... Prefer a bespoke, hand-fitted page over forcing content
through a generic data-driven template/abstraction."* (Also saved as a
memory file, `hardcode-over-structure.md`, for future sessions.)

Two subagents (Sonnet) were dispatched in parallel:
1. Delete `src/data/{schema,core,hypotheses,experiments,posts,tags,bodies}.ts`,
   `src/lib/content/{queries,serialize,xml,responses,body}.ts`, and the
   entire `src/app/api/**` tree. Rebuild every surviving page (home, core,
   awareness, blog, tags, sitemap) to own its data inline, with a new
   per-route JSON/XML pattern (e.g. `src/app/blog.json/route.ts`,
   `src/app/blog/[slug]/data/route.ts`). **Completed and verified**: `tsc`
   and `next build` both clean, every surviving route spot-checked 200,
   parked routes correctly 404, no console errors, visually unchanged.
2. Build `/life-design` fresh (first-principles, meaningfully different
   from the old ledger, using real content + in-style placeholders). This
   attempt was **stopped mid-run** in favor of approach #8 below.

## 8. `/life-design`, attempt 2: the actual Design skill

Naman asked for the life-design exploration to be redone by a `fable`
subagent using Claude Code's real `/design` skill (the Claude Design
multi-artboard canvas, published as an Artifact) rather than another
Next.js-code attempt — with "complete context" about who he is and what the
project is. That agent:
- Loaded the `/design` skill itself, matched the real site's exact design
  tokens (colors, fonts, spacing scale, the "wobbly hand-drawn frame"
  signature) pulled straight from `src/app/globals.css`.
- Committed to one direction ("a belief-first notebook log" — index leads
  with the belief sentence itself, not section machinery/jargon, directly
  answering the cold-read failure from step 3) and built it hi-fi (index +
  one entry's detail page).
- Included 2 honestly-different low-fi alternates beside it (a single
  dated-stream journal view; a "wall of tilted frames" of belief-cards),
  each with a sticky note stating its tradeoff, per the skill's own
  guidance for when no one's present to pick a direction live.
- Used all of Naman's real supplied text verbatim, with quiet in-style
  placeholders (never boxed "DRAFT" tags) for anything not yet written.
- Published at: https://claude.ai/code/artifact/008be4f2-06a9-4cd7-9bfa-973192b73d10
  — a full offline copy is saved alongside this file as
  `life-design-canvas.html`.

## 9. The decision to scrap it and archive this branch

After reviewing the canvas, Naman decided the entire hypothesis/experiments/
life-design/schema-removal direction wasn't worth continuing — quoting his
own Core principle 5 ("Play with the power laws... do not distract yourself
with anything that doesn't contribute to the 20"), this wasn't judged to be
where the leverage is. Plan: preserve everything (this folder, this
commit), branch it off as `archive/hypothesis-experiments-lifedesign`, and
reset `master` back to the last commit before any of this started
(`79e7a31`, "Core: add value 7 — Sincerity over Seriousness").
