# Learnings — what each session taught us

Rule (Naman, 3 Sep 2026): after every session, backtrace from the result and
write down what would have made it better — with the concrete example and
enough context that a future session can act on it. Newest first. Keep
entries honest: what went wrong, what went right, what to do next time.
Opinions that harden into rules move to `docs/how-we-build.md`.

---

## 2026-09-03 — blog, SEO, pages-as-data, home page rebuild

**Result:** blog with first post (Abandon Adulting Club) and handmade cover;
OG cards, JSON-LD, RSS, `.md`/`.json` views for every page; home page rebuilt
around Naman's letter, a Core frame, and an experiments log; docs written;
28 commits pushed.

### What would have made it better

1. **Grep the archive before interpreting a phrase from it.** Naman said
   "the other branch had that md wrapper thingy". I built MDX-in-a-frame.
   He meant *pages exposing themselves as `.md`/`.json`* — his exact words
   were in the archive's commit message and `branch context/timeline.md`
   step 7 ("a wrapper which lets each page/route export its own .md .xml
   and .json"). One `git grep` on the archive branch would have saved a
   round trip. → When he references past work, search that branch's
   context docs for the phrase first.

2. **Read the archived branch's `decisions-and-rationale.md` before
   touching MDX.** It documented the exact hydration bug (JSX children on
   multiple lines re-parsed as markdown → `<p>` in `<p>`) that the archive
   had hit *twice*. I hit it a third time. → That file is a list of
   sharp edges; skim it at session start when working near MDX.

3. **Not everything in a brief is copy.** "Nothing more. no more
   structure." and "We're gonna make a simple blog setup on here…" were
   notes to the builder; I shipped both on `/blog`. Bracketed text I did
   catch (`<btw, make a meta og…>`); plain sentences about the page I
   didn't. → Anything that describes the page rather than speaks to the
   reader is a note. Ask when unsure; never default to shipping it.

4. **Use Write/Edit, not bash heredocs, for files with quotes.** A
   multi-file heredoc batch failed on an apostrophe and wrote *nothing*
   (no partial files, easy to miss). A later python-in-bash patch failed
   an assertion on escaping. Both cost a turn. → Bash for commands; the
   Edit/Write tools for content.

5. **Run Biome on changed files, not `src/`.** The repo has two CRLF files
   (`globals.css`, `page.tsx` at the time) that `biome check --write src`
   rewrites, showing up as spurious diffs. → Scope the lint to what you
   touched; revert line-ending-only changes with `git checkout --`.

6. **When a design "doesn't look appealing", change structure, not
   decoration.** Two decoration attempts on the Core card (the RingMark
   as illustration; a marigold highlighter on the quote) were rejected
   within a minute each. What worked: taking the box away, using the
   Core page's own vocabulary (marigold-ruled quote + list + button), then
   putting *that* back in the box with internal rules and indent. →
   Coherence with an existing page beats a new flourish. And if an
   illustration is wanted, it's his to draw.

7. **Ask for copy by slot.** "[one line: what an experiment is]"
   placeholders sat in three mockup versions; "I need three lines: 1… 2…
   3…" got a full letter back immediately. → When copy is the blocker,
   enumerate the slots and ask.

8. **Screenshots land in the repo cwd.** Playwright wrote `*.png` and
   `.playwright-mcp/` into the project; cleaned each time but easy to
   commit by accident. → Save to the scratchpad or delete before `git add`.

### What went right — keep doing

- **Dev server up, short notes, one commit each.** Naman iterated by
  watching localhost:3000 and sending 5–10 word notes; each became one
  edit + lint + commit + one-line reply. ~20 rounds in under an hour.
- **Mockups for direction, then the real page.** Three versions in an
  artifact → he picked "Ledger" → merged version as a 4th tab → "let's
  take this to the actual website". One mockup round was the right amount.
- **Assets: explain the size math instead of reaching for R2.** 127 KB
  cover, 159 KB OG, committed; `next/image` serves ~40 KB to phones. He'd
  asked about R2; the numbers settled it.
- **Verify over HTTP after every build**, not just `tsc`: it caught the
  `<p>`-in-`<p>` hydration error, the `[&>li]` residue in `.md` output, and
  confirmed every OG route returns a real PNG.
- **Log his text in `writing/` with what was changed.** Every spelling fix
  is recorded next to the original; he could audit and reverse any of it.

### Open threads for next time

- `docs/future-changes.md` lists the open slots (per-experiment live state,
  "what we know", `/ai` page, a "Now" page, a handmade Core illustration).
- Happy Mornings Club returns to the experiments log when he wants it.
- The homepage's seven Core headings are a hand-kept array in
  `src/app/page.tsx` — update it when a value is added to the Core.
