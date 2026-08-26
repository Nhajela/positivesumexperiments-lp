// The read layer over src/data. Records store ids; everything here hands back
// records with those ids already followed, plus the roll-ups the pages and the
// API need. Nothing below reaches for the filesystem, so it is safe to import
// from any component.

import { hasBody } from "@/data/bodies";
import { corePrinciples } from "@/data/core";
import { experiments as experimentRecords } from "@/data/experiments";
import { hypotheses as hypothesisRecords } from "@/data/hypotheses";
import { posts as postRecords } from "@/data/posts";
import {
  type CorePrinciple,
  EXPERIMENT_STATUSES,
  type Experiment,
  type ExperimentStatus,
  type Hypothesis,
  LIVE_STATUSES,
  type Post,
  type Tag,
  type TagGroup,
} from "@/data/schema";
import { tagGroups, tags } from "@/data/tags";
import { paths } from "./paths";

// The records are declared `as const` so their ids narrow to literal unions
// and cross-references are checked by the compiler. Read through these widened
// views instead: on the literal types an absent optional field (`startedAt` on
// an experiment that has not begun) is not merely undefined, it does not exist.
const hypotheses: readonly Hypothesis[] = hypothesisRecords;
const experiments: readonly Experiment[] = experimentRecords;
const posts: readonly Post[] = postRecords;

// ------------------------------------------------------------------- shapes

export type ResolvedTag = Omit<Tag, "group"> & {
  group: TagGroup;
  url: string;
  hasBody: boolean;
};

export type ResolvedCorePrinciple = CorePrinciple & { url: string };

/** A hypothesis as it appears in someone else's listing. */
export type HypothesisSummary = Hypothesis & { url: string; hasBody: boolean };

/** An experiment as it appears in someone else's listing. */
export type ExperimentSummary = Experiment & { url: string; hasBody: boolean };

export type ResolvedHypothesis = Omit<
  Hypothesis,
  "tags" | "core" | "related"
> & {
  url: string;
  hasBody: boolean;
  tags: ResolvedTag[];
  core: ResolvedCorePrinciple[];
  related: HypothesisSummary[];
  experiments: ExperimentSummary[];
};

export type ResolvedExperiment = Omit<Experiment, "tags" | "hypothesis"> & {
  url: string;
  hasBody: boolean;
  /** The parent, followed. Its id is still available as `hypothesis.id`. */
  hypothesis: HypothesisSummary;
  /** Inherited from the hypothesis plus anything the experiment adds. */
  tags: ResolvedTag[];
  /** Only what this experiment added on top of its hypothesis. */
  ownTags: ResolvedTag[];
};

export type ResolvedPost = Omit<Post, "tags" | "hypotheses" | "experiments"> & {
  url: string;
  tags: ResolvedTag[];
  hypotheses: HypothesisSummary[];
  experiments: ExperimentSummary[];
};

// ------------------------------------------------------------------ indexes

const tagGroupById = new Map<string, TagGroup>(tagGroups.map((g) => [g.id, g]));
const tagById = new Map<string, Tag>(tags.map((t) => [t.id, t]));
const coreById = new Map<string, CorePrinciple>(
  corePrinciples.map((p) => [p.id, p]),
);
const hypothesisById = new Map<string, Hypothesis>(
  hypotheses.map((h) => [h.id, h]),
);
const experimentById = new Map<string, Experiment>(
  experiments.map((e) => [e.id, e]),
);

// --------------------------------------------------------------- validation

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Fails the build on a reference that points at nothing, a duplicate id, or a
 * status that contradicts its dates. Called once at module load below, so any
 * page, feed or API route that touches content pays for the check exactly once
 * and a typo can never reach a deploy as a silently missing link.
 */
export function assertContentIntegrity(): void {
  const problems: string[] = [];

  const unique = (label: string, values: readonly string[]) => {
    const seen = new Set<string>();
    for (const value of values) {
      if (seen.has(value)) problems.push(`${label}: duplicate "${value}"`);
      seen.add(value);
    }
  };

  const date = (label: string, value: string | undefined) => {
    if (value !== undefined && !ISO_DATE.test(value)) {
      problems.push(`${label}: "${value}" is not a YYYY-MM-DD date`);
    }
  };

  const refs = (
    label: string,
    ids: readonly string[] | undefined,
    known: Map<string, unknown>,
    kind: string,
  ) => {
    for (const id of ids ?? []) {
      if (!known.has(id)) problems.push(`${label}: unknown ${kind} "${id}"`);
    }
  };

  unique(
    "tag groups",
    tagGroups.map((g) => g.id),
  );
  unique(
    "tag ids",
    tags.map((t) => t.id),
  );
  unique(
    "tag slugs",
    tags.map((t) => t.slug),
  );
  unique(
    "core principles",
    corePrinciples.map((p) => p.id),
  );
  unique(
    "hypothesis ids",
    hypotheses.map((h) => h.id),
  );
  unique(
    "hypothesis slugs",
    hypotheses.map((h) => h.slug),
  );
  unique(
    "experiment ids",
    experiments.map((e) => e.id),
  );
  unique(
    "experiment slugs",
    experiments.map((e) => e.slug),
  );
  unique(
    "post ids",
    posts.map((p) => p.id),
  );
  unique(
    "post slugs",
    posts.map((p) => p.slug),
  );

  for (const tag of tags) {
    if (!tagGroupById.has(tag.group)) {
      problems.push(`tag "${tag.id}": unknown group "${tag.group}"`);
    }
  }

  for (const h of hypotheses) {
    const label = `hypothesis "${h.id}"`;
    unique(`${label} tags`, h.tags);
    refs(label, h.tags, tagById, "tag");
    refs(label, h.core, coreById, "core principle");
    refs(label, h.related, hypothesisById, "hypothesis");
    date(`${label} createdAt`, h.createdAt);
    if (h.related?.includes(h.id)) problems.push(`${label}: relates to itself`);
  }

  for (const e of experiments) {
    const label = `experiment "${e.id}"`;
    refs(label, [e.hypothesis], hypothesisById, "hypothesis");
    unique(`${label} tags`, e.tags ?? []);
    refs(label, e.tags, tagById, "tag");
    date(`${label} createdAt`, e.createdAt);
    date(`${label} startedAt`, e.startedAt);
    date(`${label} endedAt`, e.endedAt);
    if (e.status !== "planned" && !e.startedAt) {
      problems.push(`${label}: status "${e.status}" needs a startedAt`);
    }
    if (e.endedAt && (e.status === "planned" || e.status === "ongoing")) {
      problems.push(`${label}: status "${e.status}" cannot have an endedAt`);
    }
    if (e.startedAt && e.endedAt && e.endedAt < e.startedAt) {
      problems.push(`${label}: endedAt is before startedAt`);
    }
  }

  for (const p of posts) {
    const label = `post "${p.id}"`;
    unique(`${label} tags`, p.tags ?? []);
    refs(label, p.tags, tagById, "tag");
    refs(label, p.hypotheses, hypothesisById, "hypothesis");
    refs(label, p.experiments, experimentById, "experiment");
    date(`${label} publishedAt`, p.publishedAt);
    date(`${label} updatedAt`, p.updatedAt);
    if (!hasBody("posts", p.slug)) {
      problems.push(`${label}: a post needs a body registered in bodies.ts`);
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Content is inconsistent (src/data):\n  - ${problems.join("\n  - ")}`,
    );
  }
}

assertContentIntegrity();

// ------------------------------------------------------------- resolvers

function resolveTag(id: string): ResolvedTag {
  const tag = tagById.get(id);
  if (!tag) throw new Error(`Unknown tag "${id}"`);
  const group = tagGroupById.get(tag.group);
  if (!group) throw new Error(`Unknown tag group "${tag.group}"`);
  return {
    ...tag,
    group,
    url: paths.tag(tag.slug),
    hasBody: hasBody("tags", tag.slug),
  };
}

function resolveCore(id: string): ResolvedCorePrinciple {
  const principle = coreById.get(id);
  if (!principle) throw new Error(`Unknown core principle "${id}"`);
  return { ...principle, url: paths.core() };
}

function summariseHypothesis(h: Hypothesis): HypothesisSummary {
  return {
    ...h,
    url: paths.hypothesis(h.slug),
    hasBody: hasBody("hypotheses", h.slug),
  };
}

function summariseExperiment(e: Experiment): ExperimentSummary {
  return {
    ...e,
    url: paths.experiment(e.slug),
    hasBody: hasBody("experiments", e.slug),
  };
}

// --------------------------------------------------------------- ordering

/** Live work first, in the order it demands attention; finished work after. */
const STATUS_ORDER: Record<ExperimentStatus, number> = {
  ongoing: 0,
  paused: 1,
  planned: 2,
  concluded: 3,
  abandoned: 4,
};

function byStatusThenNewest(a: Experiment, b: Experiment): number {
  const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  if (byStatus !== 0) return byStatus;
  return (b.startedAt ?? b.createdAt).localeCompare(a.startedAt ?? a.createdAt);
}

// ------------------------------------------------------------------ tags

export function getTagGroups(): TagGroup[] {
  return [...tagGroups];
}

export function getTags(): ResolvedTag[] {
  return tags.map((t) => resolveTag(t.id));
}

/** Tags arranged under their group, for a legend or a filter row. */
export function getTagsByGroup(): { group: TagGroup; tags: ResolvedTag[] }[] {
  return tagGroups.map((group) => ({
    group,
    tags: tags.filter((t) => t.group === group.id).map((t) => resolveTag(t.id)),
  }));
}

export function getTagBySlug(slug: string): ResolvedTag | null {
  const tag = tags.find((t) => t.slug === slug);
  return tag ? resolveTag(tag.id) : null;
}

// ------------------------------------------------------------ hypotheses

export function getHypotheses(): ResolvedHypothesis[] {
  return hypotheses
    .map((h) => resolveHypothesis(h))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getHypothesisBySlug(slug: string): ResolvedHypothesis | null {
  const h = hypotheses.find((x) => x.slug === slug);
  return h ? resolveHypothesis(h) : null;
}

function resolveHypothesis(h: Hypothesis): ResolvedHypothesis {
  return {
    ...h,
    url: paths.hypothesis(h.slug),
    hasBody: hasBody("hypotheses", h.slug),
    tags: h.tags.map(resolveTag),
    core: h.core.map(resolveCore),
    related: (h.related ?? []).flatMap((id) => {
      const related = hypothesisById.get(id);
      return related ? [summariseHypothesis(related)] : [];
    }),
    experiments: experiments
      .filter((e) => e.hypothesis === h.id)
      .sort(byStatusThenNewest)
      .map(summariseExperiment),
  };
}

// ------------------------------------------------------------ experiments

export function getExperiments(): ResolvedExperiment[] {
  return [...experiments].sort(byStatusThenNewest).map(resolveExperiment);
}

export function getExperimentBySlug(slug: string): ResolvedExperiment | null {
  const e = experiments.find((x) => x.slug === slug);
  return e ? resolveExperiment(e) : null;
}

function resolveExperiment(e: Experiment): ResolvedExperiment {
  const parent = hypothesisById.get(e.hypothesis);
  if (!parent) throw new Error(`Unknown hypothesis "${e.hypothesis}"`);
  const ownTagIds = (e.tags ?? []).filter((id) => !parent.tags.includes(id));
  return {
    ...e,
    url: paths.experiment(e.slug),
    hasBody: hasBody("experiments", e.slug),
    hypothesis: summariseHypothesis(parent),
    tags: [...parent.tags, ...ownTagIds].map(resolveTag),
    ownTags: ownTagIds.map(resolveTag),
  };
}

/**
 * Experiments grouped under the hypothesis that owns them — the shape the
 * /experiments page reads top to bottom.
 */
export function getExperimentsByHypothesis(): ResolvedHypothesis[] {
  return getHypotheses();
}

// ------------------------------------------------------------------ posts

/** Published posts, newest first. Drafts never leave the repo. */
export function getPosts(): ResolvedPost[] {
  return posts
    .filter((p) => !p.draft)
    .map(resolvePost)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostBySlug(slug: string): ResolvedPost | null {
  const p = posts.find((x) => x.slug === slug && !x.draft);
  return p ? resolvePost(p) : null;
}

function resolvePost(p: Post): ResolvedPost {
  return {
    ...p,
    url: paths.post(p.slug),
    tags: (p.tags ?? []).map(resolveTag),
    hypotheses: (p.hypotheses ?? []).flatMap((id) => {
      const h = hypothesisById.get(id);
      return h ? [summariseHypothesis(h)] : [];
    }),
    experiments: (p.experiments ?? []).flatMap((id) => {
      const e = experimentById.get(id);
      return e ? [summariseExperiment(e)] : [];
    }),
  };
}

/** Posts that named this experiment or its hypothesis. */
export function getPostsAbout(options: {
  experimentId?: string;
  hypothesisId?: string;
}): ResolvedPost[] {
  return getPosts().filter(
    (p) =>
      (options.experimentId !== undefined &&
        p.experiments.some((e) => e.id === options.experimentId)) ||
      (options.hypothesisId !== undefined &&
        p.hypotheses.some((h) => h.id === options.hypothesisId)),
  );
}

// -------------------------------------------------------------- roll-ups

/** How many experiments sit at each status, including the empty ones. */
export function getStatusCounts(): {
  status: ExperimentStatus;
  count: number;
}[] {
  return EXPERIMENT_STATUSES.map((status) => ({
    status,
    count: experiments.filter((e) => e.status === status).length,
  }));
}

/** Experiments that have not finished — what is actually running right now. */
export function getLiveExperiments(): ResolvedExperiment[] {
  return getExperiments().filter((e) => LIVE_STATUSES.includes(e.status));
}

/** Everything filed under one tag, following the inheritance from hypotheses. */
export function getTagRollup(tagId: string): {
  tag: ResolvedTag;
  hypotheses: ResolvedHypothesis[];
  experiments: ResolvedExperiment[];
  posts: ResolvedPost[];
} {
  const tag = resolveTag(tagId);
  return {
    tag,
    hypotheses: getHypotheses().filter((h) =>
      h.tags.some((t) => t.id === tagId),
    ),
    experiments: getExperiments().filter((e) =>
      e.tags.some((t) => t.id === tagId),
    ),
    posts: getPosts().filter((p) => p.tags.some((t) => t.id === tagId)),
  };
}

/** The core, with what each principle has produced hanging off it. */
export function getCoreRollup(): {
  principle: ResolvedCorePrinciple;
  hypotheses: HypothesisSummary[];
  experimentCount: number;
}[] {
  return corePrinciples.map((principle) => {
    const descended = hypotheses.filter((h) =>
      (h.core as readonly string[]).includes(principle.id),
    );
    return {
      principle: resolveCore(principle.id),
      hypotheses: descended.map(summariseHypothesis),
      experimentCount: experiments.filter((e) =>
        descended.some((h) => h.id === e.hypothesis),
      ).length,
    };
  });
}

/** Counts for a header line, without loading the whole graph. */
export function getCounts(): {
  hypotheses: number;
  experiments: number;
  live: number;
  posts: number;
  tags: number;
} {
  return {
    hypotheses: hypotheses.length,
    experiments: experiments.length,
    live: experiments.filter((e) => LIVE_STATUSES.includes(e.status)).length,
    posts: posts.filter((p) => !p.draft).length,
    tags: tags.length,
  };
}
