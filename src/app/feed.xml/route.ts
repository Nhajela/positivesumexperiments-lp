import { posts } from "@/app/blog/posts";
import { author, site } from "@/lib/site";

// RSS 2.0 for the blog, built from the same hardcoded post list as the
// index. Static at build time; a new post shows up here by being listed in
// src/app/blog/posts.ts.
export const dynamic = "force-static";

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Feed readers want RFC 822 dates; every post is dated to the day.
function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

export function GET() {
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${site.url}${p.path}</link>
      <guid isPermaLink="true">${site.url}${p.path}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <dc:creator>${esc(author.name)}</dc:creator>
      <description>${esc(p.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(site.name)}</title>
    <link>${site.url}/blog</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${esc(site.description)}</description>
    <language>${site.language}</language>
    <lastBuildDate>${rfc822(posts[0]?.date ?? "2026-09-03")}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
