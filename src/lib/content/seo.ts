// Generic SEO/metadata helpers — string clamping, a `PageSeo` shape, and the
// `toMetadata` builder that turns one into Next's `Metadata`. Deliberately
// content-agnostic: no page's data lives in here, and nothing here imports
// from anywhere content-shaped. Each page builds its own `PageSeo`/`OgCard`
// inline, using these as plain utilities.

import type { Metadata } from "next";
import type { OgCard } from "@/lib/og/card";
import { site } from "@/lib/site";

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

/**
 * Search engines show roughly 160 characters, so stop on a word before that.
 * OG cards get a tighter limit — CARD_CHARS is two lines in the card's
 * description slot, and a third line would push the footer off the plate.
 */
export const DESCRIPTION_CHARS = 160;
export const CARD_CHARS = 128;

export function clamp(text: string, max: number = DESCRIPTION_CHARS): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Joins the parts that exist, dropping the empty ones. */
export function join(
  parts: (string | false | null | undefined)[],
  sep = " · ",
): string {
  return parts.filter((part): part is string => Boolean(part)).join(sep);
}

export const plural = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`;

/** Said in the description as well as drawn on the card. */
export const PLACEHOLDER_NOTE = "Placeholder — not written yet.";

/**
 * A meta description: one line of prose, then the facts about it.
 *
 * Only the lead is ever trimmed. Clamping the whole string would let the cut
 * land inside the tail — leaving "· Planned…" or a half-eaten placeholder
 * note — and those few structural words are the part worth keeping when space
 * runs out. So the tail is measured first and the lead gets what is left.
 */
export function describe(
  lead: string,
  facts: (string | false | null | undefined)[] = [],
  placeholder = false,
): string {
  const tail = join([...facts, placeholder && PLACEHOLDER_NOTE]);
  const room = DESCRIPTION_CHARS - (tail ? tail.length + 3 : 0);
  return join([clamp(lead, Math.max(room, 60)), tail]);
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
