import { OG_CONTENT_TYPE, OG_SIZE, ogImageResponse } from "@/lib/og/render";
import { site } from "@/lib/site";

// Parked along with /experiments — see CLAUDE.md.
export const alt = `Experiments — ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImageResponse({
    eyebrow: "Experiments",
    title: "Every experiment, under the hypothesis it tests.",
  });
}
