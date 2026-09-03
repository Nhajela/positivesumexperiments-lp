import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og/card";
import { site } from "@/lib/site";

export const alt = `Blog — ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: "Blog",
    title: "For us to win, no one has to lose.",
    description:
      "Positive Sum Experiments is a venture by Naman Hajela, running experiments with fundamentals rooted in this positive sum philosophy.",
  });
}
