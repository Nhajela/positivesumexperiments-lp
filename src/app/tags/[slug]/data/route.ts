import { site } from "@/lib/site";
import { publishedPosts } from "../../../blog/posts";
import { tagBySlug, tags } from "../../tags-data";

// The tag page's own data, as JSON.
export const dynamicParams = false;

export function generateStaticParams() {
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const tag = tagBySlug(slug);
  if (!tag) {
    return Response.json(
      { error: "not_found", message: "No such tag." },
      { status: 404 },
    );
  }

  const posts = publishedPosts()
    .filter((post) => (post.tags ?? []).some((t) => t.slug === tag.slug))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      url: `${site.url}/blog/${post.slug}`,
      publishedAt: post.publishedAt,
    }));

  return Response.json({
    slug: tag.slug,
    label: tag.label,
    placeholder: tag.placeholder === true,
    posts,
  });
}
