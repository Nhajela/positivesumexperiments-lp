import { json } from "@/lib/content/responses";
import { serializeGraphDocument } from "@/lib/content/serialize";

// Everything in one request — the endpoint to point another site at.
export const dynamic = "force-static";

export async function GET() {
  return json(await serializeGraphDocument());
}
