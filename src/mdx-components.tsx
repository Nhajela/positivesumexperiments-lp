import type { MDXComponents } from "mdx/types";
import { ZoomImage } from "@/components/zoom-image";

// Element mapping for MDX pages — the written pages inherit the design
// system without any per-page styling. Tokens from globals.css @theme.
const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="font-display text-display-xl max-w-[16ch] mt-s5 mb-s4 text-ink"
      {...props}
    />
  ),
  // Rhythm rule: space above a heading ≈ 2.5-3× the space below it, so the
  // heading binds to its own section without the section gap ballooning.
  h2: (props) => (
    <h2
      className="font-display text-display-l mt-s4 mb-s3 text-ink"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-sans text-[17px] font-semibold mt-s4 mb-s2"
      {...props}
    />
  ),
  p: (props) => (
    <p className="text-body-m max-w-[62ch] mb-s3 text-ink/85" {...props} />
  ),
  // + bullets on unordered lists only; ordered lists keep their numbers
  // (pen-cobalt markers) so sequences stay sequences.
  // [p+&] pulls a list up under its lead-in line ("In practice," / "Some
  // examples:") — the list belongs to that sentence, not to a new thought.
  ul: (props) => (
    <ul
      className="mb-s3 space-y-s1 [p+&]:-mt-s2 [&>li]:relative [&>li]:pl-s3 [&>li]:before:content-['+'] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:font-bold [&>li]:before:text-pen"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-s3 list-decimal pl-s3 space-y-s1 [p+&]:-mt-s2 marker:font-mono marker:text-[14px] marker:text-pen"
      {...props}
    />
  ),
  li: (props) => (
    <li className="max-w-[60ch] text-body-m text-ink/85" {...props} />
  ),
  img: (props) => <ZoomImage src={props.src} alt={props.alt} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-[3px] border-marigold pl-s3 my-s4 text-quiet [&_p]:text-[15px]"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-pen border-b border-pen/35 hover:border-pen pb-px no-underline"
      {...props}
    />
  ),
  hr: () => <hr className="border-rule my-s5" />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  code: (props) => (
    <code
      className="font-mono text-[0.88em] bg-[#efede5] px-1.5 py-0.5 rounded-[3px]"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
