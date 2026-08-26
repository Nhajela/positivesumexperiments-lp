import { notFound } from "next/navigation";
import { getExperimentBySlug, getExperiments } from "@/lib/content/queries";
import { seoForExperiment } from "@/lib/content/seo";
import { OG_CONTENT_TYPE, OG_SIZE, ogImageResponse } from "@/lib/og/render";
import { site } from "@/lib/site";

export const alt = `An experiment on ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getExperiments().map((e) => ({ slug: e.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experiment = getExperimentBySlug(slug);
  if (!experiment) notFound();

  return ogImageResponse(seoForExperiment(experiment).card);
}
