import Link from "next/link";

// A tag as a small drawn chip — the same wobbly border radius as the home
// page's button, so classification reads as something written on the page
// rather than a database field. Plain inline shape: a tag is just a slug and
// a label, wherever a page defines its own.
export type PillTag = { slug: string; label: string };

export function TagPill({ tag }: { tag: PillTag }) {
  return (
    <Link
      href={`/tags/${tag.slug}`}
      className="inline-block rounded-[14px_200px_14px_220px/220px_14px_200px_14px] border border-rule px-2 py-0.5 font-mono text-[12px] text-quiet hover:border-pen hover:text-pen"
    >
      {tag.label}
    </Link>
  );
}

export function TagPills({
  tags,
  className = "",
}: {
  tags: PillTag[];
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <span className={`inline-flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <TagPill key={tag.slug} tag={tag} />
      ))}
    </span>
  );
}
