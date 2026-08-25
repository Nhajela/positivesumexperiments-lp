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
// (writing/2026-08-25-experiments-and-blog-brief.txt). Anything not yet
// written by him is marked [Placeholder — ...] so it can't be mistaken for
// his voice. See docs/ai-policy.md.
export const hypotheses = [
  {
    id: "doing-well-decides-well",
    slug: "doing-well-decides-well",
    title:
      "When I am doing well in my life then I will be able to make better decisions",
    statement:
      "When I have mental clarity, when I have a peaceful mind, I'll be able to make much better decisions.",
    tags: ["personal", "self"],
    core: ["power-laws"],
    related: ["namanhajela-com"],
    createdAt: "2026-08-25",
  },
  {
    id: "namanhajela-com",
    slug: "namanhajela-com",
    title: "Building namanhajela.com",
    statement:
      '[Placeholder — Naman writes this. From the brief: "building my namanhajela.com website helps me do xyz."]',
    tags: ["work", "building"],
    core: [],
    related: ["doing-well-decides-well"],
    createdAt: "2026-08-25",
  },
] as const satisfies readonly HypothesisRecord[];

export type HypothesisId = (typeof hypotheses)[number]["id"];
