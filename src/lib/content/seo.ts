// One generator for everything a page says about itself.
//
// A page's title, its meta description, its canonical URL, its Open Graph and
// Twitter tags, and the text drawn on its OG image all come from a single
// `PageSeo` built here. That is the point: the card a link shows in Slack and
// the description Google prints can't drift apart, because they are the same
// strings.
//
// On the prose in here (docs/ai-policy.md): descriptions reuse Naman's own
// writing where a record has it — a hypothesis's statement, a post's summary —
// and everything this file composes on top is factual and structural (counts,
// statuses, dates, labels). Nothing here is written in his voice.

import type { Metadata } from "next";
import { statusLabel } from "@/components/status-badge";
import { corePrinciples } from "@/data/core";
import type { OgCard } from "@/lib/og/card";
import { OG_STATUS_COLOR } from "@/lib/og/card";
import { site } from "@/lib/site";
import { formatDate } from "./format";
import { paths } from "./paths";
import type {
  ResolvedExperiment,
  ResolvedHypothesis,
  ResolvedPost,
  ResolvedTag,
} from "./queries";
import { getCounts, getPosts, getTagRollup } from "./queries";

/** What every page hands to `toMetadata` and to its opengraph-image route. */
export type PageSeo = {
  /** Page title, without the site suffix — the layout template adds that. */
  title: string;
  description: string;
  path: string;
  card: OgCard;
  /** Skips the layout's "%s — Positive Sum Experiments" suffix. Home only. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
};

// ------------------------------------------------------------------ helpers

/**
 * Search engines show roughly 160 characters, so stop on a word before that.
 * OG cards get a tighter limit — CARD_CHARS is two lines in the card's
 * description slot, and a third line would push the footer off the plate.
 */
export const DESCRIPTION_CHARS = 160;
export const CARD_CHARS = 128;

function clamp(text: string, max = DESCRIPTION_CHARS): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Joins the parts that exist, dropping the empty ones. */
function join(
  parts: (string | false | null | undefined)[],
  sep = " · ",
): string {
  return parts.filter((part): part is string => Boolean(part)).join(sep);
}

const plural = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`;

/** Said in the description as well as drawn on the card. */
const PLACEHOLDER_NOTE = "Placeholder — not written yet.";

/**
 * A meta description: one line of prose, then the facts about it.
 *
 * Only the lead is ever trimmed. Clamping the whole string would let the cut
 * land inside the tail — leaving "· Planned…" or a half-eaten placeholder
 * note — and those few structural words are the part worth keeping when space
 * runs out. So the tail is measured first and the lead gets what is left.
 */
function describe(
  lead: string,
  facts: (string | false | null | undefined)[] = [],
  placeholder = false,
): string {
  const tail = join([...facts, placeholder && PLACEHOLDER_NOTE]);
  const room = DESCRIPTION_CHARS - (tail ? tail.length + 3 : 0);
  return join([clamp(lead, Math.max(room, 60)), tail]);
}

// ---------------------------------------------------------------- documents

/**
 * site.description opens with the assertion that is also the home card's
 * title. The card shows what follows it, so the two don't say the same
 * sentence twice.
 */
const HOME_SUBTITLE = site.description.split(". ").slice(1).join(". ");

export function seoForHome(): PageSeo {
  const counts = getCounts();
  return {
    title: site.name,
    description: clamp(site.description),
    path: "/",
    absoluteTitle: true,
    card: {
      title: "For us to win, no one has to lose.",
      description: clamp(HOME_SUBTITLE, CARD_CHARS),
      meta: [
        plural(counts.experiments, "experiment"),
        plural(counts.hypotheses, "hypothesis", "hypotheses"),
      ],
    },
  };
}

export function seoForCore(): PageSeo {
  const description =
    "The core of our awareness towards running any and all experiments within this venture.";
  return {
    title: "Core",
    description,
    path: paths.core(),
    card: {
      eyebrow: "The Core",
      title: "It is a game, time is limited. Give back to all audaciously.",
      description: clamp(description, CARD_CHARS),
      meta: [plural(corePrinciples.length, "principle")],
    },
  };
}

export function seoForExperimentsIndex(): PageSeo {
  const counts = getCounts();
  const tally = join(
    [
      plural(counts.experiments, "experiment"),
      `across ${plural(counts.hypotheses, "hypothesis", "hypotheses")}`,
    ],
    " ",
  );
  const description = `Every experiment, filed under the hypothesis it tests. ${tally}, ${counts.live} still open.`;

  return {
    title: "Experiments",
    description: clamp(description),
    path: paths.experiments(),
    card: {
      eyebrow: "Experiments",
      title: "Every experiment, under the hypothesis it tests.",
      description: tally,
      meta: [`${counts.live} open`],
    },
  };
}

export function seoForBlogIndex(): PageSeo {
  const posts = getPosts();
  const description = `Writing from Positive Sum Experiments — ${plural(posts.length, "post")}.`;

  return {
    title: "Blog",
    description,
    path: paths.blog(),
    card: {
      eyebrow: "Blog",
      title: "Writing from Positive Sum Experiments",
      meta: [plural(posts.length, "post")],
      placeholder: posts.length > 0 && posts.every((post) => post.placeholder),
    },
  };
}

// ------------------------------------------------------------------ records

export function seoForHypothesis(h: ResolvedHypothesis): PageSeo {
  const tally = join([
    plural(h.experiments.length, "experiment"),
    h.core[0] && `Core ${h.core[0].number}`,
  ]);

  return {
    title: h.title,
    description: describe(h.statement, [tally], h.placeholder),
    path: h.url,
    keywords: h.tags.map((tag) => tag.label),
    card: {
      eyebrow: join(["Hypothesis", ...h.tags.map((tag) => tag.label)]),
      title: h.title,
      description: clamp(h.statement, CARD_CHARS),
      meta: [tally || "no experiments yet"],
      placeholder: h.placeholder,
    },
  };
}

export function seoForExperiment(e: ResolvedExperiment): PageSeo {
  const status = statusLabel(e.status);
  const ran =
    e.startedAt && e.endedAt
      ? `${formatDate(e.startedAt)} – ${formatDate(e.endedAt)}`
      : null;
  // The description already says "Planned", so its length reads "15 days";
  // the card's footer stands alone and says "15 days planned".
  const lengthInProse =
    ran ?? (e.plannedDurationDays ? `${e.plannedDurationDays} days` : null);
  const lengthOnCard =
    ran ??
    (e.plannedDurationDays ? `${e.plannedDurationDays} days planned` : null);

  return {
    title: e.title,
    description: describe(
      `Testing: ${e.hypothesis.statement}`,
      [status, lengthInProse],
      e.placeholder,
    ),
    path: e.url,
    keywords: e.tags.map((tag) => tag.label),
    card: {
      eyebrow: join(["Experiment", ...e.tags.map((tag) => tag.label)]),
      title: e.title,
      description: clamp(`Testing: ${e.hypothesis.statement}`, CARD_CHARS),
      status: { label: status, color: OG_STATUS_COLOR[e.status] },
      meta: [lengthOnCard].filter((part): part is string => part !== null),
      placeholder: e.placeholder,
    },
  };
}

export function seoForTag(tag: ResolvedTag): PageSeo {
  const rollup = getTagRollup(tag.id);
  const tally = join([
    plural(rollup.hypotheses.length, "hypothesis", "hypotheses"),
    plural(rollup.experiments.length, "experiment"),
    rollup.posts.length > 0 ? plural(rollup.posts.length, "post") : null,
  ]);

  return {
    title: tag.label,
    description: describe(
      `Everything filed under ${tag.label} — ${tally}`,
      [],
      tag.placeholder,
    ),
    path: tag.url,
    keywords: [tag.label, tag.group.label],
    card: {
      eyebrow: `Tag · ${tag.group.label}`,
      title: tag.label,
      description: `Everything filed under ${tag.label}.`,
      meta: [tally],
      placeholder: tag.placeholder,
    },
  };
}

export function seoForPost(post: ResolvedPost): PageSeo {
  const summary = post.summary ?? null;

  return {
    title: post.title,
    description: describe(
      summary ?? "A post from Positive Sum Experiments.",
      [],
      post.placeholder,
    ),
    path: post.url,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    keywords: post.tags.map((tag) => tag.label),
    card: {
      eyebrow: join(["Blog", ...post.tags.map((tag) => tag.label)]),
      title: post.title,
      description: summary ? clamp(summary, CARD_CHARS) : undefined,
      meta: [formatDate(post.publishedAt)],
      placeholder: post.placeholder,
    },
  };
}

// ----------------------------------------------------------------- metadata

/**
 * The Next `Metadata` for a page. Open Graph images are not listed here — the
 * colocated `opengraph-image.tsx` files are picked up automatically, and they
 * render from the same `PageSeo.card`.
 */
export function toMetadata(seo: PageSeo): Metadata {
  // The root layout appends " — Positive Sum Experiments" to every title; the
  // home page already is that, so it opts out rather than saying it twice.
  const title = seo.absoluteTitle ? { absolute: seo.title } : seo.title;

  return {
    title,
    description: seo.description,
    alternates: { canonical: seo.path },
    keywords: seo.keywords,
    openGraph: {
      type: seo.type ?? "website",
      siteName: site.name,
      url: seo.path,
      title,
      description: seo.description,
      ...(seo.type === "article"
        ? {
            publishedTime: seo.publishedTime,
            modifiedTime: seo.modifiedTime,
            tags: seo.keywords,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seo.description,
    },
  };
}
