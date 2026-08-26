import { getHypotheses, getHypothesisBySlug } from "@/lib/content/queries";
import { json, notFound, preflight } from "@/lib/content/responses";
import { envelope, serializeHypothesis } from "@/lib/content/serialize";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getHypotheses().map((h) => ({ slug: h.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const hypothesis = getHypothesisBySlug(slug);
  if (!hypothesis) return notFound("hypothesis");

  return json(envelope({ hypothesis: await serializeHypothesis(hypothesis) }));
}

export const OPTIONS = preflight;
