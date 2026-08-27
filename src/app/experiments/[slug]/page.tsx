import { notFound } from "next/navigation";

// Parked along with /experiments — see CLAUDE.md. No slugs are generated, so
// every /experiments/<slug> 404s until this is rebuilt under /life-design.
export const dynamicParams = false;

export function generateStaticParams() {
  return [];
}

export default function ExperimentPage() {
  notFound();
}
