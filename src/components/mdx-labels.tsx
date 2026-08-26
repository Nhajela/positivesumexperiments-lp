import Link from "next/link";

// Small mono/uppercase labels for use inside MDX prose bodies (core,
// awareness, hypotheses) — the same eyebrow language the app's own pages use
// for section labels like "Descends from".
//
// Both take their text as string props, never as JSX children. Two things
// conspire against a children-based API here: MDX resolves a literal <p> tag
// written in content through the same override as its auto-generated
// paragraphs (src/mdx-components.tsx), and — less obviously — it re-parses a
// *component's* text children as markdown too whenever they sit on their own
// line, wrapping them in that same overridden <p>. Either way the result is a
// <p> nested inside a <div>/<a> where none was written, which is invalid HTML
// and a hydration mismatch. A string prop is a plain JS value the markdown
// parser never touches, so it can't happen.

/** A one-line cross-reference: "Lead text, a Link to somewhere else." */
export function CrossLink({
  lead,
  href,
  label,
  className = "mb-s4",
}: {
  lead: string;
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`font-mono text-[13px] uppercase tracking-[0.08em] text-quiet ${className}`}
    >
      {lead}{" "}
      <Link href={href} className="text-pen hover:underline">
        {label}
      </Link>
    </div>
  );
}

/** The label above a related-links block, e.g. "See also". */
export function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-s1 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
      {label}
    </div>
  );
}
