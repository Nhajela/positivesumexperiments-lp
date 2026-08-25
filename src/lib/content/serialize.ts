// The published shape of the data — what another site gets when it asks.
//
// Both the JSON and the XML endpoints are built from these objects, so the two
// formats can never describe different things. Treat the field names here as a
// contract: renaming one is a breaking change for anyone consuming the feed,
// which is what API_VERSION is for.

import { site } from "@/lib/site";
import { readBodySource } from "./body";
import type {
  ResolvedExperiment,
  ResolvedHypothesis,
  ResolvedPost,
  ResolvedTag,
} from "./queries";
import {
  getCoreRollup,
  getCounts,
  getExperiments,
  getHypotheses,
  getPosts,
  getTagsByGroup,
} from "./queries";

/** Bumped when a field changes meaning or disappears. */
export const API_VERSION = 1;

const absolute = (path: string) => `${site.url}${path}`;

// ------------------------------------------------------------------ shapes

export type JsonTag = {
  id: string;
  slug: string;
  label: string;
  group: { id: string; label: string };
  url: string;
};

export type JsonRef = {
  id: string;
  slug: string;
  title: string;
  url: string;
};

export type JsonBody = { format: "mdx"; source: string } | null;

export type JsonExperiment = {
  id: string;
  slug: string;
  title: string;
  status: string;
  url: string;
  hypothesis: JsonRef;
  tags: JsonTag[];
  dates: {
    created: string;
    started: string | null;
    ended: string | null;
    plannedDurationDays: number | null;
  };
  body: JsonBody;
};

export type JsonHypothesis = {
  id: string;
  slug: string;
  title: string;
  statement: string;
  url: string;
  tags: JsonTag[];
  core: { id: string; number: number; title: string; url: string }[];
  related: JsonRef[];
  experiments: (JsonRef & { status: string })[];
  dates: { created: string };
  body: JsonBody;
};

export type JsonPost = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  url: string;
  tags: JsonTag[];
  hypotheses: JsonRef[];
  experiments: JsonRef[];
  dates: { published: string; updated: string | null };
  body: JsonBody;
};

/** Wrapper every endpoint returns, so consumers can branch on one shape. */
export type JsonEnvelope<T> = {
  version: number;
  generatedAt: string;
  source: { name: string; url: string };
  license: string;
} & T;

// ------------------------------------------------------------- serializers

export function serializeTag(tag: ResolvedTag): JsonTag {
  return {
    id: tag.id,
    slug: tag.slug,
    label: tag.label,
    group: { id: tag.group.id, label: tag.group.label },
    url: absolute(tag.url),
  };
}

async function body(
  collection: "hypotheses" | "experiments" | "posts",
  slug: string,
): Promise<JsonBody> {
  const source = await readBodySource(collection, slug);
  return source ? { format: "mdx", source } : null;
}

export async function serializeExperiment(
  e: ResolvedExperiment,
): Promise<JsonExperiment> {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    status: e.status,
    url: absolute(e.url),
    hypothesis: {
      id: e.hypothesis.id,
      slug: e.hypothesis.slug,
      title: e.hypothesis.title,
      url: absolute(e.hypothesis.url),
    },
    tags: e.tags.map(serializeTag),
    dates: {
      created: e.createdAt,
      started: e.startedAt ?? null,
      ended: e.endedAt ?? null,
      plannedDurationDays: e.plannedDurationDays ?? null,
    },
    body: await body("experiments", e.slug),
  };
}

export async function serializeHypothesis(
  h: ResolvedHypothesis,
): Promise<JsonHypothesis> {
  return {
    id: h.id,
    slug: h.slug,
    title: h.title,
    statement: h.statement,
    url: absolute(h.url),
    tags: h.tags.map(serializeTag),
    core: h.core.map((p) => ({
      id: p.id,
      number: p.number,
      title: p.title,
      url: absolute(p.url),
    })),
    related: h.related.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      url: absolute(r.url),
    })),
    experiments: h.experiments.map((e) => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      url: absolute(e.url),
      status: e.status,
    })),
    dates: { created: h.createdAt },
    body: await body("hypotheses", h.slug),
  };
}

export async function serializePost(p: ResolvedPost): Promise<JsonPost> {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary ?? null,
    url: absolute(p.url),
    tags: p.tags.map(serializeTag),
    hypotheses: p.hypotheses.map((h) => ({
      id: h.id,
      slug: h.slug,
      title: h.title,
      url: absolute(h.url),
    })),
    experiments: p.experiments.map((e) => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      url: absolute(e.url),
    })),
    dates: { published: p.publishedAt, updated: p.updatedAt ?? null },
    body: await body("posts", p.slug),
  };
}

// --------------------------------------------------------------- documents

export function envelope<T extends object>(payload: T): JsonEnvelope<T> {
  return {
    version: API_VERSION,
    generatedAt: new Date().toISOString(),
    source: { name: site.name, url: site.url },
    license:
      "Free to quote and link with attribution to Positive Sum Experiments.",
    ...payload,
  };
}

export async function serializeExperimentsDocument() {
  const items = await Promise.all(getExperiments().map(serializeExperiment));
  return envelope({
    collection: "experiments" as const,
    count: items.length,
    experiments: items,
  });
}

export async function serializeHypothesesDocument() {
  const items = await Promise.all(getHypotheses().map(serializeHypothesis));
  return envelope({
    collection: "hypotheses" as const,
    count: items.length,
    hypotheses: items,
  });
}

export async function serializePostsDocument() {
  const items = await Promise.all(getPosts().map(serializePost));
  return envelope({
    collection: "posts" as const,
    count: items.length,
    posts: items,
  });
}

export function serializeTagsDocument() {
  return envelope({
    collection: "tags" as const,
    groups: getTagsByGroup().map(({ group, tags }) => ({
      id: group.id,
      label: group.label,
      tags: tags.map(serializeTag),
    })),
  });
}

/**
 * Everything, in one request: the core, the tags, the hypotheses and their
 * experiments, and the posts. This is the endpoint to point another site at.
 */
export async function serializeGraphDocument() {
  const [hypotheses, experiments, postItems] = await Promise.all([
    Promise.all(getHypotheses().map(serializeHypothesis)),
    Promise.all(getExperiments().map(serializeExperiment)),
    Promise.all(getPosts().map(serializePost)),
  ]);

  return envelope({
    counts: getCounts(),
    core: getCoreRollup().map(({ principle, hypotheses: descended }) => ({
      id: principle.id,
      number: principle.number,
      title: principle.title,
      url: absolute(principle.url),
      hypotheses: descended.map((h) => h.id),
    })),
    tagGroups: getTagsByGroup().map(({ group, tags }) => ({
      id: group.id,
      label: group.label,
      tags: tags.map(serializeTag),
    })),
    hypotheses,
    experiments,
    posts: postItems,
  });
}
