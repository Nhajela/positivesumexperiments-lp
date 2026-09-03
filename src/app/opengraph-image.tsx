import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og/card";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// The home assertion and the letter's first line, Naman's
// (writing/2026-09-03-home-letter.txt).
export default function Image() {
  return ogImage({
    title: "For us to win, no one has to lose.",
    description:
      "Positive Sum Experiments is a venture by Naman Hajela, running experiments with fundamentals rooted in this positive sum philosophy.",
  });
}
