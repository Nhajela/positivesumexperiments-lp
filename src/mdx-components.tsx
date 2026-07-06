import type { MDXComponents } from "mdx/types";

// Element mapping for MDX pages — the written pages inherit the design
// system without any per-page styling. Tokens from globals.css @theme.
const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="font-display text-display-xl max-w-[16ch] mt-s5 mb-s4 text-ink"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="font-display text-display-m mt-s5 mb-s2 text-ink"
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
  ul: (props) => <ul className="mb-s3 space-y-s1" {...props} />,
  ol: (props) => (
    <ol className="mb-s3 list-decimal pl-s3 space-y-s1" {...props} />
  ),
  li: (props) => (
    <li
      className="max-w-[60ch] text-body-m text-ink/85 pl-s3 relative before:content-['+'] before:absolute before:left-0 before:font-bold before:text-pen"
      {...props}
    />
  ),
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
