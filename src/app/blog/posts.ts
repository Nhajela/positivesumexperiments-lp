import type { MdxLoader } from "@/components/prose-body";

// The blog's own data — hardcoded right here, next to the pages that render
// it. No shared `Post` schema, no cross-file id validation: a post is just
// this shape, and the routes under src/app/blog/** read this one array.
//
// A post's writing lives at content/posts/<slug>.mdx; `body` loads it lazily
// so a page only compiles the bodies it actually shows.
export type BlogPost = {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  updatedAt?: string;
  summary?: string;
  tags?: { slug: string; label: string }[];
  /** Drafts stay out of the index, the feed, and the JSON/XML routes. */
  draft?: boolean;
  /** True while the page is scaffolding rather than finished writing. */
  placeholder?: boolean;
  body?: MdxLoader;
};

export const posts: BlogPost[] = [
  {
    slug: "placeholder-first-post",
    title: "[Placeholder — Naman's first post]",
    publishedAt: "2026-08-25",
    summary:
      "[Placeholder — this entry exists so the blog has a shape to look at. Naman replaces it with the first real post; delete this record and its file at content/posts/placeholder-first-post.mdx.]",
    tags: [{ slug: "personal", label: "Personal" }],
    placeholder: true,
    body: () => import("../../../content/posts/placeholder-first-post.mdx"),
  },
];

/** Published posts, newest first. Drafts never leave the repo. */
export function publishedPosts(): BlogPost[] {
  return posts
    .filter((p) => !p.draft)
    .slice()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function postBySlug(slug: string): BlogPost | null {
  return posts.find((p) => p.slug === slug && !p.draft) ?? null;
}
