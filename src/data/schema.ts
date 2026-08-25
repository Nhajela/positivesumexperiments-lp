// The shape of everything published here. Deliberately primitive: flat
// records, string ids, no inheritance. Hypothesis is the parent — one
// hypothesis holds many experiments — and tags hang off the hypothesis so a
// whole line of enquiry gets classified once.
//
// Long-form writing is not in here. Every record can have a sibling MDX file
// at `content/<collection>/<slug>.mdx`, registered in `src/data/bodies.ts`
// (see content/README.md). That keeps this file a structure Naman can scan
// and keeps the writing somewhere he can just write.

import type { MDXProps } from "mdx/types";
import type { JSX } from "react";

/** A prose file, loaded lazily so a page only pulls in the bodies it renders. */
export type BodyLoader = () => Promise<{
  default: (props: MDXProps) => JSX.Element;
}>;

/** Directory under `content/` — also the collection name in the API. */
export type Collection = "hypotheses" | "experiments" | "posts" | "tags";

/**
 * Marks a record whose page is scaffolding rather than finished writing.
 *
 * Every page carrying this says "This is a placeholder." at the top, and the
 * flag rides along in the API so a consumer isn't misled either. Naman clears
 * it when he has written the page — one edit here, nothing else to hunt down.
 * Required by docs/ai-policy.md: nothing AI-arranged may read as his voice.
 */

// ---------------------------------------------------------------- statuses

export const EXPERIMENT_STATUSES = [
  "planned",
  "ongoing",
  "paused",
  "concluded",
  "abandoned",
] as const;

export type ExperimentStatus = (typeof EXPERIMENT_STATUSES)[number];

/** Statuses an experiment can still move out of — i.e. it isn't finished. */
export const LIVE_STATUSES: readonly ExperimentStatus[] = [
  "planned",
  "ongoing",
  "paused",
];

// -------------------------------------------------------------------- tags

/**
 * Tags come in groups so a set of opposing values stays legible as a set —
 * the first group is scope (personal vs work). Adding a dimension is adding
 * one entry to `tagGroups`, not a new field on every record.
 */
export type TagGroup = {
  id: string;
  label: string;
};

export type Tag = {
  id: string;
  /** Slug for /tags/<slug>. Separate from `id` so ids can stay stable. */
  slug: string;
  label: string;
  group: string;
  placeholder?: boolean;
};

// ------------------------------------------------------------ core linkage

/**
 * A principle from /core. Hypotheses point back at these: the rule is that
 * every hypothesis names the part of the core it descends from, and its prose
 * body justifies why.
 */
export type CorePrinciple = {
  id: string;
  /** Its number on the /core page. */
  number: number;
  /** The heading, verbatim from src/app/core/page.mdx. */
  title: string;
};

// -------------------------------------------------------------- hypothesis

export type Hypothesis = {
  id: string;
  slug: string;
  title: string;
  /** The claim being made, in Naman's words. */
  statement: string;
  /** Classifies this hypothesis and, by inheritance, its experiments. */
  tags: readonly string[];
  /** Core principle ids this descends from. */
  core: readonly string[];
  /** Sibling hypothesis ids worth reading alongside this one. */
  related?: readonly string[];
  /** ISO date, YYYY-MM-DD. */
  createdAt: string;
  placeholder?: boolean;
};

// -------------------------------------------------------------- experiment

export type Experiment = {
  id: string;
  slug: string;
  title: string;
  /** Parent hypothesis id. Every experiment has exactly one. */
  hypothesis: string;
  status: ExperimentStatus;
  /** Extra tags on top of the ones inherited from the hypothesis. */
  tags?: readonly string[];
  /** ISO dates, YYYY-MM-DD. */
  startedAt?: string;
  endedAt?: string;
  /** How long it was meant to run, when that was decided up front. */
  plannedDurationDays?: number;
  createdAt: string;
  placeholder?: boolean;
};

// -------------------------------------------------------------------- post

export type Post = {
  id: string;
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  updatedAt?: string;
  summary?: string;
  tags?: readonly string[];
  /** Cross-links into the experiment graph. */
  hypotheses?: readonly string[];
  experiments?: readonly string[];
  /** Drafts stay out of the index, the feed, and the API. */
  draft?: boolean;
  placeholder?: boolean;
};
