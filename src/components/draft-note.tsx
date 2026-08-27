// The red pen: this is not finished writing.
//
// docs/ai-policy.md requires that anything not written by Naman be
// unmistakable on the page, so nothing scaffolded can be read as his voice or
// ship unnoticed. Wrap placeholder scaffolding and verbatim-but-unedited
// source material in this, and delete it when the real prose lands.
//
// Takes its text as a string prop, not JSX children — see
// src/components/mdx-labels.tsx for why: MDX re-parses multi-line JSX
// children as markdown, wrapping them in their own <p> and nesting it inside
// this one, which is invalid HTML and a hydration mismatch.
export function DraftNote({ text }: { text: string }) {
  return (
    <p className="my-s3 max-w-[62ch] border-l-[3px] border-red-pen pl-s2 font-mono text-[13px] leading-relaxed text-red-pen/85">
      {text}
    </p>
  );
}
