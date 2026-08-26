import { preflight, xml } from "@/lib/content/responses";
import { serializeHypothesesDocument } from "@/lib/content/serialize";
import { hypothesesXml } from "@/lib/content/xml";

export const dynamic = "force-static";

export async function GET() {
  const document = await serializeHypothesesDocument();
  return xml(hypothesesXml(document.hypotheses));
}

export const OPTIONS = preflight;
