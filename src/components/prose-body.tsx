import type { MDXProps } from "mdx/types";
import type { JSX, ReactNode } from "react";
import { EmptyNote } from "./empty-note";

/** A prose file, loaded lazily so a page only pulls in the bodies it renders. */
export type MdxLoader = () => Promise<{
  default: (props: MDXProps) => JSX.Element;
}>;

// Renders a record's writing from its own colocated .mdx file, if it has any.
// A record with no body is normal — a post can exist before it has been
// written up — so this falls back to a line saying so rather than leaving a
// hole in the page. Pass `fallback` to say something more specific, or
// `fallback={null}` to render nothing at all.
//
// The caller hands over the loader directly (no collection/slug lookup
// through a shared registry) — each page owns which file backs which record.
export async function ProseBody({
  load,
  fallback,
}: {
  load?: MdxLoader | null;
  fallback?: ReactNode;
}) {
  if (!load) {
    if (fallback !== undefined) return fallback;
    return <EmptyNote>Not written up yet.</EmptyNote>;
  }

  const { default: Body } = await load();
  return <Body />;
}
