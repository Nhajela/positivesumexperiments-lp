import { readFile } from "node:fs/promises";
import path from "node:path";
import { mdxToMarkdown } from "@/lib/mdx-to-md";
import { site } from "@/lib/site";

// The Core as plain markdown, from the same page.mdx the page is built from.
export const dynamic = "force-static";

export async function GET() {
  const source = await readFile(
    path.join(process.cwd(), "src", "app", "core", "page.mdx"),
    "utf8",
  );
  const front = [
    "---",
    'title: "Core"',
    "author: Nmn",
    `url: ${site.url}/core`,
    "---",
    "",
    "# Core",
    "",
    "",
  ].join("\n");

  return new Response(
    front + mdxToMarkdown(source, { siteUrl: site.url, dropFirstDiv: true }),
    { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
  );
}
