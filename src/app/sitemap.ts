import type { MetadataRoute } from "next";
import { posts } from "@/app/blog/posts";
import { site } from "@/lib/site";

// Static route list — update when a page is added. Small enough that keeping
// it by hand beats introducing route discovery machinery. Posts come from
// the blog's own list so each carries its date.
const pages = ["/", "/core", "/blog"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((route) => ({
      url: `${site.url}${route === "/" ? "" : route}`,
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.8,
    })),
    ...posts.map((p) => ({
      url: `${site.url}${p.path}`,
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
