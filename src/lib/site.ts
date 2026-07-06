// Single source of truth for site identity. Metadata, sitemap, robots, and
// JSON-LD all read from here so the domain or name changes in one place.

export const site = {
  name: "Positive Sum Experiments",
  // NEXT_PUBLIC_SITE_URL lets previews (e.g. Vercel branch deploys) override
  // the canonical host without touching code.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://positivesumexperiments.com",
  // Assembled from Naman's own lines (writing/2026-07-06-landing-and-core.txt).
  description:
    "For us to win, no one has to lose. Positive Sum Experiments is a venture by Naman Hajela running experiments with their fundamentals rooted in this philosophy.",
} as const;
