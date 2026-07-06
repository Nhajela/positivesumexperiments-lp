// Single source of truth for site identity. Metadata, sitemap, robots, and
// JSON-LD all read from here so the domain or name changes in one place.

export const site = {
  name: "Positive Sum Experiments",
  // NEXT_PUBLIC_SITE_URL lets previews (e.g. Vercel branch deploys) override
  // the canonical host without touching code.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://positivesumexperiments.com",
  // Placeholder description — Naman tunes the final wording.
  description:
    "An umbrella for experiments and ventures built on one rule: only play positive-sum games.",
} as const;
