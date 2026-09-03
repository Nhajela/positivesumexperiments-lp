import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og/card";
import { site } from "@/lib/site";

export const alt = `Blog — ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Naman's one line about the blog (writing/2026-09-03-blog-and-abandon-adulting-club.txt).
export default function Image() {
  return ogImage({
    eyebrow: "Blog",
    title: "Findings, understandings and more.",
    description:
      "We're gonna make a simple blog setup on here where we'll keep writing findings, understandings and more.",
  });
}
