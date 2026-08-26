import { json, preflight } from "@/lib/content/responses";
import { serializeHypothesesDocument } from "@/lib/content/serialize";

export const dynamic = "force-static";

export async function GET() {
  return json(await serializeHypothesesDocument());
}

export const OPTIONS = preflight;
