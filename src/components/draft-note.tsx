import type { ReactNode } from "react";

// The red pen: this is not finished writing.
//
// docs/ai-policy.md requires that anything not written by Naman be
// unmistakable on the page, so nothing scaffolded can be read as his voice or
// ship unnoticed. Wrap placeholder scaffolding and verbatim-but-unedited
// source material in this, and delete it when the real prose lands.
export function DraftNote({ children }: { children: ReactNode }) {
  return (
    <p className="my-s3 max-w-[62ch] border-l-[3px] border-red-pen pl-s2 font-mono text-[13px] leading-relaxed text-red-pen/85">
      {children}
    </p>
  );
}
