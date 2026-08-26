import { notFound } from "next/navigation";
import { getTagBySlug, getTags } from "@/lib/content/queries";
import { seoForTag } from "@/lib/content/seo";
import { OG_CONTENT_TYPE, OG_SIZE, ogImageResponse } from "@/lib/og/render";
import { site } from "@/lib/site";

export const alt = `A tag on ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getTags().map((tag) => ({ slug: tag.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) notFound();

  return ogImageResponse(seoForTag(tag).card);
}
