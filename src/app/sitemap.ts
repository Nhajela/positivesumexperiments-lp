import type { MetadataRoute } from "next";
import { paths } from "@/lib/content/paths";
import {
  getExperiments,
  getHypotheses,
  getPosts,
  getTags,
} from "@/lib/content/queries";
import { site } from "@/lib/site";

// Written pages are listed by hand — there are a handful and they change
// rarely. Everything under /experiments, /hypotheses, /tags and /blog comes
// from the content records, so adding an experiment adds its URL here with no
// extra step.
const staticRoutes = [
  "/",
  "/core",
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
    ...getHypotheses().map((h) => ({
      url: url(h.url),
      lastModified: h.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Live experiments change under you; concluded ones stop moving.
    ...getExperiments().map((e) => ({
      url: url(e.url),
      lastModified: e.endedAt ?? e.startedAt ?? e.createdAt,
      changeFrequency:
        e.status === "ongoing" ? ("weekly" as const) : ("monthly" as const),
      priority: 0.7,
    })),
    ...getPosts().map((post) => ({
      url: url(post.url),
      lastModified: post.updatedAt ?? post.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...getTags().map((tag) => ({
      url: url(tag.url),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
