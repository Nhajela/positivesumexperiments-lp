import { site } from "@/lib/site";
import { postBySlug, publishedPosts } from "../../posts";

// The blog post page's own data, as JSON — colocated with the page it
// mirrors rather than routed through a shared API layer.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) {
    return Response.json(
      { error: "not_found", message: "No such post." },
      { status: 404 },
    );
  }

  return Response.json({
    slug: post.slug,
    title: post.title,
    url: `${site.url}/blog/${post.slug}`,
    summary: post.summary ?? null,
    tags: post.tags ?? [],
    dates: { published: post.publishedAt, updated: post.updatedAt ?? null },
    placeholder: post.placeholder === true,
  });
}
