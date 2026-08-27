"use client";

import { useState } from "react";
import type { ReactNode } from "react";

// Long-form prose (a hypothesis's full case, an experiment's write-up)
// clipped to a readable first screenful, fading into the page background
// with a "see more" pill sitting on the fade. Tapping anywhere in the
// clipped text also expands it, not just the pill — mirrors how a phone's
// "read more" affordance works, since the whole block is the target, not
// just a small link at the end of it.
//
// Deliberately NOT scroll-triggered: everything renders in full in markup
// and JS only clips the visual height, so this degrades to "fully visible"
// with JS disabled (max-height never gets set) rather than "invisible until
// scrolled to."
export function RevealMore({
  children,
  collapsedHeight = 320,
}: {
  children: ReactNode;
  collapsedHeight?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="cursor-pointer overflow-hidden transition-[max-height] duration-500 ease-out"
        style={{ maxHeight: open ? 4000 : collapsedHeight }}
        onClick={open ? undefined : () => setOpen(true)}
      >
        {children}
      </div>
      {open ? null : (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-gradient-to-b from-transparent to-paper pb-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Show the rest of this"
            className="animate-[nudge_2.6s_ease-in-out_infinite] motion-reduce:animate-none pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-rule bg-paper px-5 py-2 font-mono text-[13px] uppercase tracking-[0.08em] text-pen hover:border-pen"
          >
            <span className="font-bold">+</span> See more
          </button>
        </div>
      )}
    </div>
  );
}
