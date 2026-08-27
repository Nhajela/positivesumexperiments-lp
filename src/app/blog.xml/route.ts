import { site } from "@/lib/site";
import { escapeXml } from "@/lib/xml-escape";
import { publishedPosts } from "../blog/posts";

// The blog index's own data, as XML. Same posts as /blog and /blog.json.
export const dynamic = "force-static";

function text(name: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<${name}>${escapeXml(value)}</${name}>`;
}

export async function GET() {
  const posts = publishedPosts();

  const items = posts
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`;
      const tags = (post.tags ?? [])
        .map((t) => `<tag>${escapeXml(t.label)}</tag>`)
        .join("");
      return [
        `<post slug="${escapeXml(post.slug)}" href="${escapeXml(url)}" published="${post.publishedAt}" updated="${post.updatedAt ?? ""}" placeholder="${post.placeholder ? "true" : "false"}">`,
        text("title", post.title),
        text("summary", post.summary),
        tags ? `<tags>${tags}</tags>` : "",
        "</post>",
      ].join("\n  ");
    })
    .join("\n");

  const document = `<?xml version="1.0" encoding="UTF-8"?>\n<posts xmlns="${site.url}/ns/1" generated="${new Date().toISOString()}" source="${site.url}" count="${posts.length}">\n  ${items}\n</posts>\n`;

  return new Response(document, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
