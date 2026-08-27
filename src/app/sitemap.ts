import type { MetadataRoute } from "next";
import { paths } from "@/lib/content/paths";
import { site } from "@/lib/site";
import { publishedPosts } from "./blog/posts";
import { tags } from "./tags/tags-data";

// Written pages are listed by hand — there are a handful and they change
// rarely. /experiments and /hypotheses are parked (see CLAUDE.md): the index
// route stays listed since it's still reachable, but there is nothing under
// it to enumerate right now.
const staticRoutes = [
  "/",
  paths.core(),
  paths.awareness(),
  paths.experiments(),
  paths.blog(),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (route: string) => `${site.url}${route === "/" ? "" : route}`;

  return [
    ...staticRoutes.map((route) => ({
      url: url(route),
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.8,
    })),
    ...publishedPosts().map((post) => ({
      url: url(paths.post(post.slug)),
      lastModified: post.updatedAt ?? post.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...tags.map((tag) => ({
      url: url(paths.tag(tag.slug)),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
