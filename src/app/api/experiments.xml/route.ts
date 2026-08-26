import { preflight, xml } from "@/lib/content/responses";
import { serializeExperimentsDocument } from "@/lib/content/serialize";
import { experimentsXml } from "@/lib/content/xml";

export const dynamic = "force-static";

export async function GET() {
  const document = await serializeExperimentsDocument();
  return xml(experimentsXml(document.experiments));
}

export const OPTIONS = preflight;
