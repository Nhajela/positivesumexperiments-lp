import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og/render";
import { site } from "@/lib/site";

// Parked along with /hypotheses — see CLAUDE.md.
export const alt = `A hypothesis on ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return [];
}

export default function Image() {
  notFound();
}
