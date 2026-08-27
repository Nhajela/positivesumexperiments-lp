import { notFound } from "next/navigation";

// Parked along with /hypotheses — see CLAUDE.md. No slugs are generated, so
// every /hypotheses/<slug> 404s until this is rebuilt under /life-design.
export const dynamicParams = false;

export function generateStaticParams() {
  return [];
}

export default function HypothesisPage() {
  notFound();
}
