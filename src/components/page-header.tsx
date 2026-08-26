import Link from "next/link";
import type { ReactNode } from "react";

// The header pattern established on /core: title on the left, a small note on
// the right, a rule under both. `eyebrow` is the way back up the hierarchy —
// an experiment says which hypothesis it belongs to before it says anything
// else.
export function PageHeader({
  title,
  eyebrow,
  aside,
  size = "xl",
}: {
  title: ReactNode;
  eyebrow?: { label: string; href: string };
  aside?: ReactNode;
  size?: "xl" | "l";
}) {
  return (
    <header className="mt-s5 mb-s4 border-b border-rule pb-s2">
      {eyebrow ? (
        <Link
          href={eyebrow.href}
          className="mb-s1 inline-block font-mono text-[13px] text-quiet hover:text-pen"
        >
          <span className="mr-1 text-pen">&larr;</span>
          {eyebrow.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-baseline justify-between gap-s2">
        <h1
          className={`font-display text-ink ${
            size === "xl" ? "text-display-xl" : "text-display-l max-w-[24ch]"
          }`}
        >
          {title}
        </h1>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
    </header>
  );
}
