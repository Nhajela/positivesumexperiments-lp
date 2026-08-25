import type { Metadata } from "next";
import Link from "next/link";
import { DraftNote } from "@/components/draft-note";
import { MachineReadable } from "@/components/machine-readable";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { TagPills } from "@/components/tag-pill";
import { apiPaths } from "@/lib/content/paths";
import {
  getCounts,
  getExperimentsByHypothesis,
  getStatusCounts,
} from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "Every experiment run under Positive Sum Experiments, filed under the hypothesis it tests.",
  alternates: { canonical: "/experiments" },
};

// The index reads top-down as the structure itself: hypothesis, then the
// experiments testing it. Grouping is the whole point — an experiment on its
// own says what was done, but only its hypothesis says why.
export default function ExperimentsPage() {
  const hypotheses = getExperimentsByHypothesis();
  const counts = getCounts();
  const statusCounts = getStatusCounts().filter((s) => s.count > 0);

  return (
    <div className="pb-s5">
      <PageHeader
        title="Experiments"
        aside={
          <span className="font-mono text-[13px] text-quiet">
            {counts.experiments} across {counts.hypotheses} hypotheses
          </span>
        }
      />

      <DraftNote>
        Naman's words from the 25 Aug 2026 brief, standing in until he writes
        the opening of this page.
      </DraftNote>

      <blockquote className="my-s4 border-l-[3px] border-marigold pl-s3 text-quiet">
        <p className="text-[15px]">
          The goal of this whole exercise is to frankly make public whatever I
          try and do, whatever my intents are with anything related to work and
          beyond work as well.
        </p>
      </blockquote>

      {/* Doubles as the legend for the status vocabulary — the colours here
          are the same ones used against every experiment below. */}
      <p className="mb-s5 font-mono text-[13px] text-quiet">
        {statusCounts.map((s, i) => (
          <span key={s.status}>
            {i > 0 ? <span className="mx-s1 text-rule">/</span> : null}
            <span className="mr-1.5">{s.count}</span>
            <StatusBadge status={s.status} />
          </span>
        ))}
      </p>

      {hypotheses.map((h) => (
        <section key={h.id} className="mb-s5">
          <h2 className="font-display text-display-m max-w-[30ch] text-ink">
            <Link href={h.url} className="hover:text-pen">
              {h.title}
            </Link>
          </h2>

          <p className="mt-s1 mb-s2 max-w-[62ch] text-body-m text-ink/70">
            {h.statement}
          </p>

          <TagPills tags={h.tags} className="mb-s3" />

          {h.experiments.length === 0 ? (
            <p className="font-mono text-[13px] text-quiet">
              No experiments under this yet.
            </p>
          ) : (
            <ul className="space-y-s1">
              {h.experiments.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-baseline justify-between gap-s1 border-t border-rule pt-s1"
                >
                  <Link
                    href={e.url}
                    className="max-w-[46ch] text-body-m text-ink hover:text-pen"
                  >
                    <span className="mr-1.5 font-bold text-pen">+</span>
                    {e.title}
                  </Link>
                  <StatusBadge status={e.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <MachineReadable
        links={[
          { href: apiPaths.experiments(), label: "JSON" },
          { href: apiPaths.experimentsXml(), label: "XML" },
          { href: apiPaths.graph(), label: "everything" },
        ]}
      />
    </div>
  );
}
