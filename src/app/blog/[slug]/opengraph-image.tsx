import { notFound } from "next/navigation";
import { formatDate } from "@/lib/content/format";
import { OG_CONTENT_TYPE, OG_SIZE, ogImageResponse } from "@/lib/og/render";
import { site } from "@/lib/site";
import { postBySlug, publishedPosts } from "../posts";

export const alt = `A post on ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  return ogImageResponse({
    eyebrow: ["Blog", ...(post.tags ?? []).map((t) => t.label)].join(" · "),
    title: post.title,
    description: post.summary,
    meta: [formatDate(post.publishedAt)],
    placeholder: post.placeholder,
  });
}
