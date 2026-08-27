# Key decisions and their rationale

Standalone reference — each of these is a decision point worth understanding
on its own, independent of when it happened in the timeline.

## The MDX hydration bug pattern (a real, reusable lesson)

**The rule**: never pass literal text as JSX children to a component from
inside a `.mdx` file if that text could ever land on its own line. MDX
routes a literal `<p>` written in content through the same override as its
auto-generated paragraphs, AND separately re-parses a component's JSX text
children as markdown whenever they're not all on one line. Either way you
get a `<p>` nested inside whatever the component itself renders — invalid
HTML, plus a client hydration mismatch. Fix: give the component a **string
prop**, not `children`. This bit the codebase twice (`CrossLink`/
`SectionLabel` in a prior session, `DraftNote` in this one) — anything
similar added in future should default to a string-prop API from the start.

## Cold-read testing with zero-context subagents

Dispatching independent subagents with **no prior context**, told only to
visit a live site like a curious stranger and report what they understood or
didn't, produced extremely high-signal, convergent findings (all three
agents independently flagged the same nav-label opacity and the same leaked
dev-text, without being prompted toward either). This is a strong pattern
worth reusing whenever the actual question is "does this make sense to
someone who doesn't already know what I know" — an insider (human or an
agent primed with context) structurally cannot answer that question as
well as a genuinely blind one can.

## Disagreement worth recording: was the hypothesis/experiment cross-linking actually good?

The three cold-read agents all separately praised the hypothesis↔experiment
relationship (nested counts, cross-links) as the clearest part of the site
once seen. Naman explicitly disagreed with this in a later message: *"i
think the hypothesis page, experiments page, how experiments and hypothesis
relate to each other, all of it can be explained much better. chunked much
better."* His read: the confusion wasn't only "arriving cold with no
on-ramp" (the agents' read) — the actual page structure itself needed real
work (chunking, progressive disclosure, tables), which is what drove the
whole subsequent mockup-iteration effort. Worth remembering: agent consensus
isn't the same as the actual stakeholder's judgment, and both are useful
data — they were pointing at overlapping but not identical problems.

## The falsifiability question

Naman asked directly for critique: *"does the hypothesis really sound like a
hypothesis. does the description justify?"* Honest answer given at the time,
worth preserving since it's part of why the concept got questioned overall:

- **"When I'm doing well, I will make better decisions."** is circular as
  written — "doing well" isn't defined narrowly enough to be falsifiable. If
  "doing well" just means "the state that produces good decisions," the
  claim is true by definition, not something an experiment could disprove.
  The supporting rationale prose (sleep, food, conflict, movement) *does*
  define it concretely — the headline statement alone doesn't carry that
  specificity.
- **"Taking care of myself is the single most compounding decision I can
  focus on everyday."** (the description Naman then supplied) argues *why
  this matters* (priority, leverage) rather than *why the causal claim is
  true* (why doing-well → better-decisions). It's a companion belief, not a
  justification/mechanism.

Naman's response to hearing this: *"oh then, let's keep our design here as it
is, I'll give another hypothesis and experiment for here... and let's put
this entire thing into life design, as a separate page and section."* — i.e.
rather than trying to fix the framing, the framing itself (hypothesis /
experiment as scientific-sounding vocabulary) got retired in favor of
"life design," a name that doesn't claim falsifiability it can't back up.

## Why `/life-design` and not `namanhajela.com`

Directly asked and answered mid-session: positivesumexperiments.com's own
existing, already-live copy states its mission as *"The goal of this whole
exercise is to frankly make public whatever I try and do, whatever my
intents are with anything related to work and beyond work as well."* A
personal log of self-experiments is a direct expression of that mission, not
a tangent from it — recommended keeping it on this site (not in nav, direct-
link-only), while noting the final call depends on what `namanhajela.com` is
actually for, which wasn't visible in this session.

## Why the shared schema got removed (and why it's now archived instead of kept)

Naman's stated reasoning: *"i don't like schemas, they tie us down."* And
separately, as a general project rule (now in `CLAUDE.md`): *"don't be
afraid to hardcode stuff, no need for structures... we can build pages that
do justice to their purpose and whatever they are out to communicate."* The
schema removal itself was completed and verified working (see
`file-inventory.md` and `timeline.md` step 7) — it is **not** being reverted
because it was broken; it's being archived along with everything else
because the *content direction* it was built to serve (hypothesis/
experiments/life-design) was the thing ultimately judged not worth
continuing. If a future session wants the "no shared schema, hardcode
per-route" architecture without the content pivot that motivated it, that's
a separate decision to make deliberately, not something to assume from this
archive.

## Placeholder-copy conventions, in the order they evolved

1. Early convention (kept from before this session): bracketed
   `[Placeholder — ...]` text, sometimes wrapped in `DraftNote` (a red
   left-border, mono, "unmistakable" treatment) — used site-wide for
   genuinely-unfinished content, per `docs/ai-policy.md`'s requirement that
   nothing AI-arranged can be mistaken for Naman's own voice.
2. Mid-session, for design mockups: a louder "DRAFT · EDIT ME" chip +
   dashed border on any AI-drafted explanatory copy in a mockup — useful for
   a comparison artifact, but Naman later called it out directly: *"you're
   not developing this well enough... write the copy... make it the final
   thing... i'll edit whatever required."* — i.e. for a "build the real
   thing" ask, don't hand back scaffolding.
3. Final convention (his explicit instruction, applies going forward): *"use
   my text, add placeholders of 'write something about x here' etc but in
   style, like lorem ipsum, not in separate boxes."* — placeholder copy
   should sit inline, in the same font/size/color as real body text, reading
   naturally the way lorem ipsum stands in for real copy — never a
   dashed-border box with a flag in the corner. Still meant to be honestly
   identifiable as not-final, just quieter about it.

## Small, still-open observations (never acted on, worth another look if any of this content returns)

- Mobile sticky-footer gap on short pages (a `flex-1` full-viewport layout
  leaves a large dead vertical gap above the footer on short content).
- The placeholder blog post's cross-reference links elsewhere on the site
  (e.g. "Written about this") aren't visually flagged as placeholder, only
  the literal brackets in the title text mark it.
- The "+"-glyph doing double duty as both a link-affordance marker and a
  plain unordered-list bullet was investigated and found to be a
  **deliberate, sitewide, pre-existing design signature** (confirmed via a
  code comment in `src/mdx-components.tsx`), not a bug — noted here only so
  it isn't re-flagged as a fresh finding later.
