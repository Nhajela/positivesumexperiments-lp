import { notFound } from "next/navigation";
import { getHypotheses, getHypothesisBySlug } from "@/lib/content/queries";
import { seoForHypothesis } from "@/lib/content/seo";
import { OG_CONTENT_TYPE, OG_SIZE, ogImageResponse } from "@/lib/og/render";
import { site } from "@/lib/site";

export const alt = `A hypothesis on ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getHypotheses().map((h) => ({ slug: h.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hypothesis = getHypothesisBySlug(slug);
  if (!hypothesis) notFound();

  return ogImageResponse(seoForHypothesis(hypothesis).card);
}
