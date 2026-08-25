import { xml } from "@/lib/content/responses";
import { serializeGraphDocument } from "@/lib/content/serialize";
import { graphXml } from "@/lib/content/xml";

// The XML twin of /api/graph, built from the same serialized objects so the
// two formats can never describe different things.
export const dynamic = "force-static";

export async function GET() {
  const document = await serializeGraphDocument();
  return xml(
    graphXml({
      hypotheses: document.hypotheses,
      experiments: document.experiments,
      posts: document.posts,
      tagGroups: document.tagGroups,
      core: document.core,
    }),
  );
}
