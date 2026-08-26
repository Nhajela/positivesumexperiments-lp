import { getExperimentBySlug, getExperiments } from "@/lib/content/queries";
import { json, notFound, preflight } from "@/lib/content/responses";
import { envelope, serializeExperiment } from "@/lib/content/serialize";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getExperiments().map((e) => ({ slug: e.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const experiment = getExperimentBySlug(slug);
  if (!experiment) return notFound("experiment");

  return json(envelope({ experiment: await serializeExperiment(experiment) }));
}

export const OPTIONS = preflight;
