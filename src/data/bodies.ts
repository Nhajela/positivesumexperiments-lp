import type { BodyLoader, Collection } from "./schema";

// The one place a prose file gets connected to its record.
//
// Adding writing to anything is two steps: create
// `content/<collection>/<slug>.mdx`, then add a line here keyed by that slug.
// A record with no line here simply has no body yet — that is a normal state,
// not an error.
//
// These are lazy imports so a page only compiles the bodies it renders, and
// they are written out one by one (rather than globbed) so a missing or
// misspelled file is a compile error instead of a blank page. The API reads
// the same files from disk to serve their markdown source, keyed on the same
// collection + slug convention (src/lib/content/body.ts).
type BodyRegistry = Record<Collection, Partial<Record<string, BodyLoader>>>;

export const bodies: BodyRegistry = {
  hypotheses: {
    "doing-well-decides-well": () =>
      import("../../content/hypotheses/doing-well-decides-well.mdx"),
    "namanhajela-com": () =>
      import("../../content/hypotheses/namanhajela-com.mdx"),
  },
  experiments: {
    "wake-at-630": () => import("../../content/experiments/wake-at-630.mdx"),
    "build-namanhajela-com": () =>
      import("../../content/experiments/build-namanhajela-com.mdx"),
  },
  posts: {
    "placeholder-first-post": () =>
      import("../../content/posts/placeholder-first-post.mdx"),
  },
  tags: {
    personal: () => import("../../content/tags/personal.mdx"),
  },
};

/** Whether a record has prose attached. */
export function hasBody(collection: Collection, slug: string): boolean {
  return bodies[collection][slug] !== undefined;
}

/** The loader for a record's prose, or null when it has none yet. */
export function bodyLoader(
  collection: Collection,
  slug: string,
): BodyLoader | null {
  return bodies[collection][slug] ?? null;
}
