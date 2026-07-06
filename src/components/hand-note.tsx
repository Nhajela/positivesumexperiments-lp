import { type ReactNode, useId } from "react";

// A pen note that appears over a term on hover/focus/tap — the design
// system's tooltip. CSS-only (no client JS, keeps pages static): the bubble
// is Akriti in pen cobalt on paper, hand-ruled frame, sitting slightly
// off-true like a real margin note. tabIndex makes it keyboard- and
// touch-reachable.
export function HandNote({
  children,
  note,
}: {
  children: ReactNode;
  note: string;
}) {
  const id = useId();
  return (
    <span
      className="group relative cursor-help border-b border-dotted border-quiet outline-none focus-visible:border-pen"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: focus is what reveals the note on keyboards and touch
      tabIndex={0}
      aria-describedby={id}
    >
      {children}
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-10 w-max max-w-[240px] -translate-x-1/2 -rotate-1 rounded-[16px_255px_16px_225px/225px_16px_255px_16px] border-[1.5px] border-ink/70 bg-paper px-s2 py-s1 font-hand text-[19px] leading-snug text-pen opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100"
      >
        {note}
      </span>
    </span>
  );
}
