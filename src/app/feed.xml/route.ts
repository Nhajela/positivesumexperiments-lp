import { site } from "@/lib/site";
import { escapeXml } from "@/lib/xml-escape";
import { publishedPosts } from "../blog/posts";

// RSS for the blog — the same posts as /blog, shaped for readers rather than
// for programs.
export const dynamic = "force-static";

export async function GET() {
  const posts = publishedPosts();
  const feedUrl = `${site.url}/feed.xml`;
  const latest = posts[0]?.publishedAt;

  const items = posts
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`;
      const categories = (post.tags ?? [])
        .map((t) => `<category>${escapeXml(t.label)}</category>`)
        .join("");
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
        post.summary
          ? `<description><![CDATA[${post.summary.replaceAll("]]>", "]]]]><![CDATA[>")}]]></description>`
          : "",
        categories,
        "</item>",
      ].join("");
    })
    .join("\n");

  const document = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — blog`)}</title>
    <link>${escapeXml(`${site.url}/blog`)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    ${latest ? `<lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>` : ""}
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>
`;

  return new Response(document, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
