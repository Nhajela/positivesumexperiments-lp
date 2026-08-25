import type { ReactNode } from "react";

// One voice for "there is nothing here yet".
//
// Empty is a normal state in this system — a hypothesis can exist before any
// experiment tests it, an experiment before it has been written up — so these
// say so plainly rather than collapsing the section and leaving the reader to
// wonder whether the page is broken.
export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[13px] leading-relaxed text-quiet">
      {children}
    </p>
  );
}
