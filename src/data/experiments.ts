import type { HypothesisId } from "./hypotheses";
import type { Experiment } from "./schema";
import type { TagId } from "./tags";

/** Compiler-checked references into the hypothesis and tag vocabularies. */
type ExperimentRecord = Omit<Experiment, "hypothesis" | "tags"> & {
  hypothesis: HypothesisId;
  tags?: readonly TagId[];
};

// An experiment is one test of one hypothesis, with a status and, where it was
// decided up front, a length. It inherits its hypothesis's tags; `tags` here is
// only for what it adds on top.
//
// Statuses: planned, ongoing, paused, concluded, abandoned (src/data/schema.ts).
// Move an experiment along by editing `status` and filling in `startedAt` /
// `endedAt` — nothing else needs touching, the roll-ups and the API follow.
export const experiments = [
  {
    id: "wake-at-630",
    slug: "wake-at-630",
    title: "Wake up at 6:30 a.m. for 15 days",
    hypothesis: "doing-well-decides-well",
    status: "planned",
    plannedDurationDays: 15,
    createdAt: "2026-08-25",
  },
] as const satisfies readonly ExperimentRecord[];

export type ExperimentId = (typeof experiments)[number]["id"];
