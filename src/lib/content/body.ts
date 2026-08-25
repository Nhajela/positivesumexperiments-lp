// Reading prose as text rather than as a component, for the machine-readable
// endpoints. Pages render the same files through `bodies.ts` instead.
//
// This touches the filesystem, so it must only be imported by server code —
// the API routes that use it are `force-static` and therefore run at build,
// where `content/` is right there in the repo.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { hasBody } from "@/data/bodies";
import type { Collection } from "@/data/schema";

const CONTENT_ROOT = path.join(process.cwd(), "content");

/** Editorial notes to the writer — stripped so consumers get clean markdown. */
const MDX_COMMENT = /\{\s*\/\*[\s\S]*?\*\/\s*\}/g;
/** Component imports at the head of a file: machinery, not writing. */
const LEADING_IMPORTS = /^(?:import\s[^\n]*\n|\s*\n)*/;

/**
 * The markdown source of a record's body, or null when it has none.
 *
 * Returned as authored (MDX: markdown plus the occasional component), minus
 * MDX comments. Consumers that only understand plain markdown can render it as
 * such and will lose nothing but the rare inline component.
 */
export async function readBodySource(
  collection: Collection,
  slug: string,
): Promise<string | null> {
  if (!hasBody(collection, slug)) return null;

  const file = path.join(CONTENT_ROOT, collection, `${slug}.mdx`);
  const source = await readFile(file, "utf8");
  return source.replace(MDX_COMMENT, "").replace(LEADING_IMPORTS, "").trim();
}
