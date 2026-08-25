// The footer that tells a reader — or the program they sent — where the same
// page lives as data. Every listing and detail page carries one, because the
// point of the structure is that anyone can query it.
export function MachineReadable({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <aside className="mt-s5 border-t border-rule pt-s3 font-mono text-[13px] text-quiet">
      <span className="mr-s2">Same page, as data:</span>
      <span className="inline-flex flex-wrap gap-s2">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-pen">
            <span className="mr-1 text-pen">+</span>
            {link.label}
          </a>
        ))}
      </span>
    </aside>
  );
}
