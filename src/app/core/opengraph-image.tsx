import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og/card";
import { site } from "@/lib/site";

export const alt = `Core — ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// The two-line summary of the whole core, as it opens the page.
export default function Image() {
  return ogImage({
    eyebrow: "Core",
    title: "It is a game, time is limited. Give back to all audaciously.",
    description:
      "The core of our awareness towards running any and all experiments within this venture.",
    meta: ["Author: Nmn"],
  });
}
