import { apiPaths } from "@/lib/content/paths";
import { xml } from "@/lib/content/responses";
import { serializePostsDocument } from "@/lib/content/serialize";
import { rssFeed } from "@/lib/content/xml";
import { site } from "@/lib/site";

// RSS for the blog — the same posts as /api/posts, shaped for readers rather
// than for programs. /api/posts.xml is the one to parse.
export const dynamic = "force-static";

export async function GET() {
  const document = await serializePostsDocument();
  return xml(
    rssFeed(document.posts, `${site.url}${apiPaths.feed()}`),
    "application/rss+xml",
  );
}
