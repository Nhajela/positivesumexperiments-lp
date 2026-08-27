import { site } from "@/lib/site";
import { publishedPosts } from "../blog/posts";

// The blog index's own data, as JSON. Same posts the /blog page renders,
// defined right there in src/app/blog/posts.ts.
export const dynamic = "force-static";

export async function GET() {
  const posts = publishedPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    url: `${site.url}/blog/${post.slug}`,
    summary: post.summary ?? null,
    tags: post.tags ?? [],
    dates: { published: post.publishedAt, updated: post.updatedAt ?? null },
    placeholder: post.placeholder === true,
  }));

  return Response.json({
    generatedAt: new Date().toISOString(),
    source: { name: site.name, url: site.url },
    count: posts.length,
    posts,
  });
}
