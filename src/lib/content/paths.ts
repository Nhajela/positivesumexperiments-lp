// Where each HTML route lives, in one place. Plain string builders — no
// schema, no cross-file validation. Pages hardcode their own data; this is
// just so a URL doesn't get typo'd in five different files.

export const paths = {
  core: () => "/core",
  awareness: () => "/awareness",
  experiments: () => "/experiments",
  hypotheses: () => "/hypotheses",
  blog: () => "/blog",
  post: (slug: string) => `/blog/${slug}`,
  tag: (slug: string) => `/tags/${slug}`,
} as const;
