// The first thing on any page that isn't finished writing.
//
// It sits above the title rather than inside the prose, so it is read before
// anything it qualifies — a reader should never get a paragraph in before
// learning it is scaffolding. Red pen, the palette's correction colour.
//
// Driven by `placeholder: true` on the record (src/data/), and carried in the
// API too, so a site consuming the feed isn't misled either. Required by
// docs/ai-policy.md.
export function PlaceholderBanner({ note }: { note?: string }) {
  return (
    <aside
      role="note"
      className="mt-s5 -mb-s3 rounded-[16px_225px_16px_255px/255px_16px_225px_16px] border-[1.5px] border-red-pen/60 px-s3 py-s2"
    >
      <p className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-red-pen">
        This is a placeholder.
      </p>
      <p className="mt-1 max-w-[62ch] text-[14px] leading-relaxed text-red-pen/80">
        {note ?? "Nothing on this page is finished writing yet."}
      </p>
    </aside>
  );
}
