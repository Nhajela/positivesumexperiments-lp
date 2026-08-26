# Handover — UI/UX audit of positivesumexperiments-lp

Session context for whoever (whichever session) picks this back up. Delete
this file once the work below is folded into a normal commit history / PR
description — it's a working note, not project docs.

## Branch state

Working branch: `claude/ui-ux-polish-audit-9s90pg`, already pushed to
`origin`. Latest commit: `abcf508` — "Fix mobile nav overflow and MDX
hydration bug; label the experiments index". No PR opened yet (user hasn't
asked for one).

## The actual ask

User's original request (paraphrased): audit the *entire* site's look and
feel, desktop and mobile — "tons of tiny UI/UX changes... gaps... things
that are not apparent to a new onlooker." Specific starting complaints:
- The placeholder notification banner on top of `/experiments` needed to go.
- Nothing on `/experiments` or the hypothesis page was self-explanatory —
  no labeling distinguishing "this is the hypothesis" vs "these are the
  experiments testing it," etc.

**Important clarification from the user, later in the session:** they are
*not* asking for a WCAG/accessibility audit. Direct quote: "WCAG is not the
biggest thing I'm concerned about, I'm concerned about normal UI UX for
people who can see lol." So the next pass should be a normal
hierarchy/spacing/alignment/consistency/affordance critique — industry
design-review standards, not compliance auditing.

## What's already done (committed, on the branch above)

Found by running the site locally (see "How to look at the site" below)
and screenshotting every page at desktop (1280×900) and mobile (390×844).

1. **Mobile nav overflow (real bug)** — the header nav (`Core / Awareness /
   Experiments / Blog`) overflowed past the right edge on any viewport
   narrower than ~420px, cutting off "Blog" and forcing horizontal scroll,
   on *every page*. Fixed in `src/app/layout.tsx` by making the nav wrap.

2. **MDX hydration bug (real bug)** — `src/app/awareness/page.mdx` and
   `content/hypotheses/doing-well-decides-well.mdx` each wrote a raw `<p>`
   tag directly in MDX content. MDX routes a literal `<p>` through the same
   style-override as its auto-generated paragraphs (see
   `src/mdx-components.tsx`), *and* separately re-parses a component's JSX
   text children as markdown whenever they're not all on one line — either
   way you get a `<p>` nested inside a `<p>`/`<a>`: invalid HTML plus a
   client hydration mismatch. This was visibly showing up as React's "3
   Issues" dev-tools badge on those two pages. Fixed by adding
   `src/components/mdx-labels.tsx` (`CrossLink`, `SectionLabel`) — both take
   their text as **string props, not JSX children**, so the markdown parser
   never touches them. This is the load-bearing lesson for touching MDX
   content further: **never pass literal text as JSX children to a
   component from inside a `.mdx` file** if the text could ever land on its
   own line; use a prop instead.

3. **Pluralization bug** — `/experiments` header read "1 across 1
   hypotheses" for singular counts. Fixed to match the home page's existing
   singular/plural handling (`src/app/experiments/page.tsx`).

4. **Missing structural labels on `/experiments`** — the index listed each
   hypothesis's title/statement/experiments with no label saying which was
   which, unlike the hypothesis detail page and tag pages, which already
   use small mono-uppercase eyebrows ("Descends from", "Experiments testing
   it"). Added matching "Hypothesis" / "Experiments testing it" eyebrows,
   plus a "Status" label on the status-count legend line
   (`src/app/experiments/page.tsx`).

5. **Removed the placeholder banner** from the top of `/experiments`, per
   explicit request.

Verified clean with `npx tsc --noEmit`, `npx biome check .`, and
`npm run build` (all pass, no errors) before committing.

## What's NOT done yet — the actual next step

A proper visual/UX critique pass — hierarchy, spacing rhythm, alignment,
component consistency, affordance clarity, information density — across
every page, both viewports. This is what got interrupted.

I was in the middle of trying to use a "design" plugin the user installed
mid-session (`design:design-critique`, `design:accessibility-review`,
`design:design-system`, `design:ux-copy`, `design:design-handoff`, etc.) —
`ListPlugins` confirms it's enabled, but the Skill tool doesn't recognize
any of its skill names yet (`Unknown skill: design:accessibility-review`),
and `ListSkills`/the system-reminder skill listing don't show them either.
This looks like a session-scoped load issue — newly enabled plugin skills
apparently need a fresh session to actually load. **That's why we're
restarting the session**: to pick up `design:design-critique` (the relevant
one, not accessibility-review — see the user's clarification above) and
run the audit properly with it, instead of me hand-rolling the critique.

If the plugin skills *still* don't show up in the fresh session, fall back
to a manual critique pass using ordinary design-review heuristics (visual
hierarchy, proximity/grouping, alignment, consistency, contrast/legibility,
affordance) directly against screenshots — same substance, just not
packaged as the formal skill.

## Loose observations already noticed, not yet acted on

Not verified/prioritized — just things that caught my eye while looking at
screenshots, worth the new session checking for real rather than trusting
this list blindly:

- Whether the newly-added "Hypothesis" / "Experiments testing it" eyebrow
  labels on `/experiments` actually read well next to the existing
  page-level "Status" legend line, spacing-wise, now that there are three
  small-label lines stacked in that area.
- Placeholder content (e.g. the post literally titled
  `[Placeholder — Naman's first post]`) renders as a normal-looking link,
  same styling as real content — only distinguished by the brackets in the
  text itself. Might be worth a visual treatment (not a content change —
  `docs/ai-policy.md` governs the prose itself, but component styling for
  *known-placeholder* records is fair game).
- The `MachineReadable` footer line ("Same page, as data: +JSON +XML
  +everything") appears on every content page — low priority, but worth a
  fresh look at whether it's pulling focus it shouldn't on mobile where
  vertical space is tighter.
- General spacing rhythm between sections — the design system's own spacing
  scale comment says "nothing sits between steps" (`src/app/globals.css`,
  s1–s6) — worth checking every page actually honors that scale
  consistently rather than ad hoc margins creeping in.

None of these are confirmed findings — re-check with fresh eyes/screenshots
rather than assuming they still apply exactly as described.

## How to look at the site

The sandbox's egress proxy blocks direct requests to
`positivesumexperiments.com` (403 from the policy gateway — confirmed, not
worth retrying). Instead, run it locally:

```
npm install   # if node_modules isn't already present
npm run dev   # next dev, serves http://localhost:3000
```

Screenshot with Playwright's pre-installed Chromium (do **not** run
`playwright install` — it's already at `/opt/pw-browsers/chromium`,
`PLAYWRIGHT_BROWSERS_PATH` is already set):

```js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
// newPage({ viewport: {width:1280,height:900} }) for desktop,
// {width:390,height:844} for mobile. goto http://localhost:3000/<path>,
// waitUntil: 'networkidle', screenshot({ fullPage: true }).
```

Pages worth covering: `/`, `/core`, `/awareness`, `/experiments`,
`/hypotheses/doing-well-decides-well`, `/experiments/wake-at-630`, `/blog`,
`/blog/placeholder-first-post`, `/tags/personal` (or any tag slug), and the
404 page (any nonexistent path).

**Important:** if you run `npm install`, it creates `package-lock.json` at
the repo root — **do not commit that**. The project deliberately dropped
npm's lockfile for `pnpm-lock.yaml` (see commit `4f099da`, "Switch to pnpm
(drop npm lockfile)"). Delete `package-lock.json` before any commit if it
got created.

## Constraints to keep in mind

- `docs/ai-policy.md`: Naman writes all reader-facing prose by hand — AI
  organizes, arranges, and builds. Never write or reword prose in his voice
  (the manifesto, hypothesis statements, home page copy, etc.). Structural
  UI labels (section eyebrows, empty-states, dev-facing text) are fine —
  that's the category everything fixed so far falls into.
- Commit author is always `Nhajela`; Claude may be credited as co-author
  but never with an email/noreply address in the commit trailer (see
  `CLAUDE.md` at repo root for the exact line to use).
- Design system tokens live in `src/app/globals.css` (`@theme` block) —
  warm paper (`--color-paper`) + ink, four "pens" (cobalt/red/green/
  marigold each with one job), spacing scale `s1`–`s6`, type scale with
  hard measure limits (16ch/62ch). Any new UI should draw from these
  tokens, not introduce new ad hoc values.
