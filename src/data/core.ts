import type { CorePrinciple } from "./schema";

// The seven principles of /core, as referenceable records. Titles are the
// headings from src/app/core/page.mdx, verbatim — if a heading changes there,
// change it here too. Nothing else in the codebase restates them.
//
// Hypotheses cite these ids, which is how every experiment traces back to the
// core rather than floating on its own.
export const corePrinciples = [
  {
    id: "positive-sum-games",
    number: 1,
    title: "Play positive sum games.",
  },
  {
    id: "respect-time",
    number: 2,
    title: "Respect time above all else.",
  },
  {
    id: "disproportionate-value",
    number: 3,
    title: "Strive to give out disproportionate value.",
  },
  {
    id: "audacious-intent",
    number: 4,
    title: "Have audacious intent, and patient persistence.",
  },
  {
    id: "power-laws",
    number: 5,
    title: "Play with the power laws.",
  },
  {
    id: "compounding",
    number: 6,
    title: "Compounding shall be your best friend.",
  },
  {
    id: "sincerity",
    number: 7,
    title: "Sincerity over Seriousness",
  },
] as const satisfies readonly CorePrinciple[];

export type CorePrincipleId = (typeof corePrinciples)[number]["id"];
