import { preflight, xml } from "@/lib/content/responses";
import { serializePostsDocument } from "@/lib/content/serialize";
import { postsXml } from "@/lib/content/xml";

export const dynamic = "force-static";

export async function GET() {
  const document = await serializePostsDocument();
  return xml(postsXml(document.posts));
}

export const OPTIONS = preflight;
