import type { ExperimentId } from "./experiments";
import type { HypothesisId } from "./hypotheses";
import type { Post } from "./schema";
import type { TagId } from "./tags";

/** Compiler-checked cross-links into the experiment graph. */
type PostRecord = Omit<Post, "tags" | "hypotheses" | "experiments"> & {
  tags?: readonly TagId[];
  hypotheses?: readonly HypothesisId[];
  experiments?: readonly ExperimentId[];
};

// The blog. A post is its writing, so every entry here has a body at
// content/posts/<slug>.mdx — the record is only the index card.
//
// Posts can point back into the graph (`hypotheses`, `experiments`), which is
// what makes an experiment page able to show what has been written about it.
// Set `draft: true` to keep one out of the index, the feed and the API.
export const posts = [
  {
    id: "placeholder-first-post",
    slug: "placeholder-first-post",
    title: "[Placeholder — Naman's first post]",
    publishedAt: "2026-08-25",
    summary:
      "[Placeholder — this entry exists so the blog has a shape to look at. Naman replaces it with the first real post; delete this record and its file at content/posts/placeholder-first-post.mdx.]",
    tags: ["personal"],
    hypotheses: ["doing-well-decides-well"],
    experiments: ["wake-at-630"],
  },
] as const satisfies readonly PostRecord[];

export type PostId = (typeof posts)[number]["id"];
