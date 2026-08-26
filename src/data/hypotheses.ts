import type { CorePrincipleId } from "./core";
import type { Hypothesis } from "./schema";
import type { TagId } from "./tags";

/**
 * Narrows the generic record so tag and core ids are checked by the compiler
 * rather than only at build time by `assertContentIntegrity`. `related` points
 * at ids in this same array, so it stays a plain string and is checked there.
 */
type HypothesisRecord = Omit<Hypothesis, "tags" | "core" | "related"> & {
  tags: readonly TagId[];
  core: readonly CorePrincipleId[];
  related?: readonly string[];
};

// Hypotheses are the parent objects — an experiment always hangs off one, and
// the tags set here classify everything beneath. `core` is the non-negotiable
// bit: a hypothesis names which principle of /core it descends from, and its
// body at content/hypotheses/<slug>.mdx argues why.
//
// All prose in `title` and `statement` is Naman's, verbatim
// (writing/2026-08-25-experiments-and-blog-brief.txt), with one exception:
// `doing-well-decides-well`'s title is a short display label Naman asked for
// directly, not a quote — replace it whenever he'd rather write his own.
// Anything not yet written by him is marked [Placeholder — ...] so it can't
// be mistaken for his voice. See docs/ai-policy.md.
export const hypotheses = [
  {
    id: "doing-well-decides-well",
    slug: "doing-well-decides-well",
    title: "Doing well, deciding well",
    statement: "When I'm doing well, I will make better decisions.",
    tags: ["personal", "self"],
    core: ["power-laws"],
    createdAt: "2026-08-25",
  },
] as const satisfies readonly HypothesisRecord[];

export type HypothesisId = (typeof hypotheses)[number]["id"];
