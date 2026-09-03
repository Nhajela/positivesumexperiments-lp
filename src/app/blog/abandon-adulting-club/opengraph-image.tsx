import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og/card";
import { site } from "@/lib/site";
import { post } from "./post";

export const alt = `${post.title} — ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: "Blog · Experiment 1",
    title: "Abandon Adulting Club",
    description: post.description,
    meta: [post.dateLabel, "Author: Nmn"],
  });
}
