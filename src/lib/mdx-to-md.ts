// Turns one of this site's page.mdx files into plain markdown for the
// `.md` view of a route. The MDX here is markdown plus a little inline JSX
// for one page's own design; readers of the .md want the writing, not the
// design, so: drop the import/export header and JSX comments, turn <li>
// into list items, and strip every remaining tag. Good enough for a person
// or a program reading the page as text — not a general MDX compiler.

export function mdxToMarkdown(
  source: string,
  {
    siteUrl,
    dropFirstDiv = false,
  }: { siteUrl: string; dropFirstDiv?: boolean },
): string {
  let s = source.replace(/\r\n/g, "\n");

  // a page's own title block (a <div> of h1 + author) — the .md gets its
  // title from front matter instead
  if (dropFirstDiv) s = s.replace(/<div[\s\S]*?<\/div>\n/, "");

  // ESM header and MDX comments
  s = s.replace(/^import .*$/gm, "");
  s = s.replace(/^export default function[\s\S]*?^\}\n/gm, "");
  s = s.replace(/^export const \w+ = [\s\S]*?;\n/gm, "");
  s = s.replace(/^export \{[^}]*\}.*$/gm, "");
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  // list items → markdown bullets; lists themselves vanish with the tags
  s = s.replace(/^\s*<li[^>]*>([\s\S]*?)<\/li>\s*$/gm, (_, inner) => {
    return `- ${String(inner).replace(/\s+/g, " ").trim()}`;
  });

  // any remaining tag: keep the text, lose the markup. Attribute values are
  // matched as quoted strings, because Tailwind selectors like [&>li] put
  // a ">" inside className.
  s = s.replace(/<\/?[A-Za-z][^"'>]*(?:(?:"[^"]*"|'[^']*')[^"'>]*)*\/?>/g, "");

  // JSX expression whitespace like {" "}
  s = s.replace(/\{" "\}/g, " ");

  // decode the few entities the MDX files use
  s = s
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rarr;/g, "→");

  // links and images that point into the site become absolute
  s = s.replace(/\]\(\//g, `](${siteUrl}/`);

  // tidy: no trailing spaces, at most one blank line in a row
  s = s
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return `${s}\n`;
}
