import { bodyLoader } from "@/data/bodies";
import type { Collection } from "@/data/schema";

// Renders a record's writing from content/<collection>/<slug>.mdx, if it has
// any. A record with no body is normal — a hypothesis can exist before it has
// been written up — so this quietly renders nothing rather than erroring.
//
// The import is lazy, so a page compiles only the body it shows. Styling comes
// from src/mdx-components.tsx, the same as any MDX page on the site.
export async function ProseBody({
  collection,
  slug,
}: {
  collection: Collection;
  slug: string;
}) {
  const load = bodyLoader(collection, slug);
  if (!load) return null;

  const { default: Body } = await load();
  return <Body />;
}
