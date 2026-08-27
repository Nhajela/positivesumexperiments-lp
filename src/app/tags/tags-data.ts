import type { MdxLoader } from "@/components/prose-body";

// The tags feature's own data — hardcoded here, next to the pages that render
// it. A tag used to be part of a shared vocabulary shared with hypotheses and
// experiments; those are parked for now (see CLAUDE.md), so this only lists
// the tags actually used by blog posts today.
export type TagEntry = {
  slug: string;
  label: string;
  /** True while the page is scaffolding rather than finished writing. */
  placeholder?: boolean;
  body?: MdxLoader;
};

export const tags: TagEntry[] = [
  {
    slug: "personal",
    label: "Personal",
    placeholder: true,
    body: () => import("../../../content/tags/personal.mdx"),
  },
];

export function tagBySlug(slug: string): TagEntry | null {
  return tags.find((t) => t.slug === slug) ?? null;
}
