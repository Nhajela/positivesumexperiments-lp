import { notFound } from "next/navigation";
import { plural } from "@/lib/content/seo";
import { OG_CONTENT_TYPE, OG_SIZE, ogImageResponse } from "@/lib/og/render";
import { site } from "@/lib/site";
import { publishedPosts } from "../../blog/posts";
import { tagBySlug, tags } from "../tags-data";

export const alt = `A tag on ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return tags.map((tag) => ({ slug: tag.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = tagBySlug(slug);
  if (!tag) notFound();

  const count = publishedPosts().filter((post) =>
    (post.tags ?? []).some((t) => t.slug === tag.slug),
  ).length;

  return ogImageResponse({
    eyebrow: "Tag",
    title: tag.label,
    description: `Everything filed under ${tag.label}.`,
    meta: [plural(count, "post")],
    placeholder: tag.placeholder,
  });
}
