// Single source of truth for site identity. Metadata, sitemap, robots, feed,
// and JSON-LD all read from here so the domain or name changes in one place.

export const site = {
  name: "Positive Sum Experiments",
  // NEXT_PUBLIC_SITE_URL lets previews (e.g. Vercel branch deploys) override
  // the canonical host without touching code.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://positivesumexperiments.com",
  // Assembled from Naman's own lines (writing/2026-07-06-landing-and-core.txt).
  description:
    "For us to win, no one has to lose. Positive Sum Experiments is a venture by Naman Hajela running experiments with their fundamentals rooted in this philosophy.",
  locale: "en_IN",
  language: "en",
} as const;

// The person behind it — one record for metadata authors, JSON-LD, feeds.
export const author = {
  name: "Naman Hajela",
  url: "https://namanhajela.com",
  email: "hey@namanhajela.com",
  twitter: "@crazyxnaman",
  sameAs: ["https://namanhajela.com", "https://x.com/crazyxnaman"],
} as const;

/** Stable @ids so every page's JSON-LD points at the same three nodes. */
export const ids = {
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  person: `${site.url}/#naman`,
} as const;
