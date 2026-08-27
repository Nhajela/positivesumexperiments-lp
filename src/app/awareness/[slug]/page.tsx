import { redirect } from "next/navigation";

// Stopgap: individual pieces of awareness don't have their own pages yet —
// they're all sections on the one /awareness page — but they might later.
// This gives each piece a stable URL now (/awareness/<slug>) that a "See
// also" link elsewhere can point at, without committing to real per-piece
// pages before there's enough content to justify them. When that day comes,
// replace this redirect with a real page per slug; nothing that links here
// needs to change.
export default async function AwarenessItemRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/awareness#${slug}`);
}
