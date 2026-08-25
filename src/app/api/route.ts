import { apiPaths } from "@/lib/content/paths";
import { getCounts } from "@/lib/content/queries";
import { json } from "@/lib/content/responses";
import { API_VERSION } from "@/lib/content/serialize";
import { site } from "@/lib/site";

// The discovery document: start here, follow the links. Every endpoint is
// prerendered at build and sent with `Access-Control-Allow-Origin: *`, so any
// site can read this straight from the browser.
export const dynamic = "force-static";

const absolute = (path: string) => `${site.url}${path}`;

export function GET() {
  return json({
    name: site.name,
    version: API_VERSION,
    description:
      "Hypotheses, the experiments testing them, and the writing about both.",
    documentation: `${site.url}/experiments`,
    counts: getCounts(),
    model: {
      hypothesis:
        "The parent object. Carries the claim, the tags, and which principles of /core it descends from.",
      experiment:
        "One test of one hypothesis. Has a status: planned, ongoing, paused, concluded, abandoned. Inherits its hypothesis's tags.",
      tag: "Flat vocabulary, arranged in groups (scope: personal/work, and so on). Set on the hypothesis.",
      post: "Writing, optionally pointing back at hypotheses and experiments.",
      body: "Long-form markdown (MDX source), inline on each record as `body.source`, or null.",
      placeholder:
        "True while a record's page is scaffolding rather than finished writing. Treat its text as provisional — it will be rewritten.",
    },
    endpoints: {
      graph: {
        json: absolute(apiPaths.graph()),
        xml: absolute(apiPaths.graphXml()),
        description: "Everything in one document.",
      },
      experiments: {
        json: absolute(apiPaths.experiments()),
        xml: absolute(apiPaths.experimentsXml()),
        item: `${absolute(apiPaths.experiments())}/{slug}`,
      },
      hypotheses: {
        json: absolute(apiPaths.hypotheses()),
        xml: absolute(apiPaths.hypothesesXml()),
        item: `${absolute(apiPaths.hypotheses())}/{slug}`,
      },
      posts: {
        json: absolute(apiPaths.posts()),
        xml: absolute(apiPaths.postsXml()),
        item: `${absolute(apiPaths.posts())}/{slug}`,
        rss: absolute(apiPaths.feed()),
      },
      tags: { json: absolute(apiPaths.tags()) },
    },
  });
}
