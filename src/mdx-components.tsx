import type { MDXComponents } from "mdx/types";

// Required by @next/mdx with the App Router. Global element overrides for MDX
// pages go here; the prose kit (headline, quote, dialogue, ...) will be mapped
// in once the visual system is locked after the moodboard phase.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
