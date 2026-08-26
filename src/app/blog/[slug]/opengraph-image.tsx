import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/content/queries";
import { seoForPost } from "@/lib/content/seo";
import { OG_CONTENT_TYPE, OG_SIZE, ogImageResponse } from "@/lib/og/render";
import { site } from "@/lib/site";

export const alt = `A post on ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return ogImageResponse(seoForPost(post).card);
}
