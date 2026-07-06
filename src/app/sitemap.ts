import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Static route list — update when a route is added. Small enough that keeping
// it by hand beats introducing route discovery machinery.
const routes = ["/", "/manifesto", "/what-we-know"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${site.url}${route === "/" ? "" : route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
