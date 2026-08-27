// Colocated with awareness/page.mdx — see src/app/core/seo.ts for why this
// lives in a sibling .ts file rather than inside the .mdx page itself.
import { paths } from "@/lib/content/paths";
import { toMetadata } from "@/lib/content/seo";
import type { OgCard } from "@/lib/og/card";

const description =
  "Pieces of awareness that complement the core — starting with the limited decision budget.";

export const ogCard: OgCard = {
  eyebrow: "Pieces of Awareness",
  title: "You have a limited decision budget at all points of time.",
  description,
};

export const metadata = toMetadata({
  title: "Pieces of Awareness",
  description,
  path: paths.awareness(),
  card: ogCard,
});
