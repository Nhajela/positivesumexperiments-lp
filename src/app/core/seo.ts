// Colocated with core/page.mdx so both the page and its opengraph-image can
// read the same title/description/card without TS losing track of named
// exports from a .mdx module (the ambient "*.mdx" type only sees the default
// export).
import { paths } from "@/lib/content/paths";
import { CARD_CHARS, clamp, toMetadata } from "@/lib/content/seo";
import type { OgCard } from "@/lib/og/card";

const description =
  "The core of our awareness towards running any and all experiments within this venture.";

export const ogCard: OgCard = {
  eyebrow: "The Core",
  title: "It is a game, time is limited. Give back to all audaciously.",
  description: clamp(description, CARD_CHARS),
  meta: ["7 principles"],
};

export const metadata = toMetadata({
  title: "Core",
  description,
  path: paths.core(),
  card: ogCard,
});
