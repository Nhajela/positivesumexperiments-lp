// Where each kind of record lives, in one place. Pages, the sitemap, the API
// and the feed all build links from here, so moving a section is one edit.
//
// Note the blog: its records are the `posts` collection but its public route
// is /blog, which is the only place the two names differ.

export const paths = {
  core: () => "/core",
  experiments: () => "/experiments",
  experiment: (slug: string) => `/experiments/${slug}`,
  hypothesis: (slug: string) => `/hypotheses/${slug}`,
  tag: (slug: string) => `/tags/${slug}`,
  blog: () => "/blog",
  post: (slug: string) => `/blog/${slug}`,
} as const;

/** API endpoints, kept next to the page paths they mirror. */
export const apiPaths = {
  index: () => "/api",
  graph: () => "/api/graph",
  graphXml: () => "/api/graph.xml",
  experiments: () => "/api/experiments",
  experimentsXml: () => "/api/experiments.xml",
  experiment: (slug: string) => `/api/experiments/${slug}`,
  hypotheses: () => "/api/hypotheses",
  hypothesesXml: () => "/api/hypotheses.xml",
  hypothesis: (slug: string) => `/api/hypotheses/${slug}`,
  posts: () => "/api/posts",
  postsXml: () => "/api/posts.xml",
  post: (slug: string) => `/api/posts/${slug}`,
  tags: () => "/api/tags",
  feed: () => "/feed.xml",
} as const;
