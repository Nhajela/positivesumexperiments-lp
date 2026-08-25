import type { ReactNode } from "react";
import { bodyLoader } from "@/data/bodies";
import type { Collection } from "@/data/schema";
import { EmptyNote } from "./empty-note";

// Renders a record's writing from content/<collection>/<slug>.mdx, if it has
// any. A record with no body is normal — a hypothesis can exist before it has
// been written up — so this falls back to a line saying so rather than leaving
// a hole in the page. Pass `fallback` to say something more specific, or
// `fallback={null}` to render nothing at all.
//
// The import is lazy, so a page compiles only the body it shows. Styling comes
// from src/mdx-components.tsx, the same as any MDX page on the site.
export async function ProseBody({
  collection,
  slug,
  fallback,
}: {
  collection: Collection;
  slug: string;
  fallback?: ReactNode;
}) {
  const load = bodyLoader(collection, slug);

  if (!load) {
    if (fallback !== undefined) return fallback;
    return <EmptyNote>Not written up yet.</EmptyNote>;
  }

  const { default: Body } = await load();
  return <Body />;
}
