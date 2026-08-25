import { getPostBySlug, getPosts } from "@/lib/content/queries";
import { json, notFound } from "@/lib/content/responses";
import { envelope, serializePost } from "@/lib/content/serialize";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound("post");

  return json(envelope({ post: await serializePost(post) }));
}
