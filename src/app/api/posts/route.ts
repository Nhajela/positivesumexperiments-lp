import { json } from "@/lib/content/responses";
import { serializePostsDocument } from "@/lib/content/serialize";

export const dynamic = "force-static";

export async function GET() {
  return json(await serializePostsDocument());
}
