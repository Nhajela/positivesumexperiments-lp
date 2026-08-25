import type { Tag, TagGroup } from "./schema";

// Tags replace any category/subcategory tree: one flat vocabulary, grouped so
// a set of mutually-exclusive values reads as a set. Tags are set on the
// hypothesis and inherited by its experiments; an experiment may add its own.
//
// To add a dimension (say "horizon: short / long"), add a group here and the
// tags that belong to it. Nothing else needs to change.
export const tagGroups = [
  {
    id: "scope",
    label: "Scope",
  },
  {
    id: "arena",
    label: "Arena",
  },
] as const satisfies readonly TagGroup[];

export type TagGroupId = (typeof tagGroups)[number]["id"];

export const tags = [
  {
    id: "personal",
    slug: "personal",
    label: "Personal",
    group: "scope",
  },
  {
    id: "work",
    slug: "work",
    label: "Work",
    group: "scope",
  },
  {
    id: "self",
    slug: "self",
    label: "Self",
    group: "arena",
  },
  {
    id: "building",
    slug: "building",
    label: "Building",
    group: "arena",
  },
] as const satisfies readonly Tag[];

export type TagId = (typeof tags)[number]["id"];
