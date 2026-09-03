import { readFile } from "node:fs/promises";
import path from "node:path";
import { posts } from "@/app/blog/posts";
import { mdxToMarkdown } from "@/lib/mdx-to-md";
import { author, site } from "@/lib/site";

// Every post, as data: /blog/<slug>.md is the writing as plain markdown,
// /blog/<slug>.json is its post.ts plus where to find the rest. Both are
// prerendered at build from the same files the page is built from — the
// post's folder stays the only place a post lives.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.flatMap((p) => {
    const slug = p.path.split("/").pop() ?? "";
    return [{ file: `${slug}.md` }, { file: `${slug}.json` }];
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const dot = file.lastIndexOf(".");
  const slug = file.slice(0, dot);
  const ext = file.slice(dot + 1);
  const post = posts.find((p) => p.path === `/blog/${slug}`);
  if (!post) return new Response("Not found", { status: 404 });

  const url = `${site.url}${post.path}`;

  if (ext === "json") {
    return Response.json({
      title: post.title,
      eyebrow: post.eyebrow,
      heading: post.heading,
      description: post.description,
      date: post.date,
      tags: post.tags,
      author: { name: author.name, url: author.url },
      url,
      markdown: `${url}.md`,
      image: `${url}/opengraph-image.jpg`,
    });
  }

  const source = await readFile(
    path.join(process.cwd(), "src", "app", "blog", slug, "page.mdx"),
    "utf8",
  );
  const front = [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `description: ${JSON.stringify(post.description)}`,
    `date: ${post.date}`,
    `tags: [${post.tags.join(", ")}]`,
    `author: ${author.name}`,
    `url: ${url}`,
    "---",
    "",
    `# ${post.heading}`,
    "",
    "",
  ].join("\n");

  return new Response(front + mdxToMarkdown(source, { siteUrl: site.url }), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
