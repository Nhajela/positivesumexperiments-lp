import { seoForCore } from "@/lib/content/seo";
import { OG_CONTENT_TYPE, OG_SIZE, ogImageResponse } from "@/lib/og/render";
import { site } from "@/lib/site";

export const alt = `Core — ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImageResponse(seoForCore().card);
}
