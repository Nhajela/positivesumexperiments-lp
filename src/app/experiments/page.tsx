import type { Metadata } from "next";
import Link from "next/link";
import { EmptyNote } from "@/components/empty-note";
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
import { seoForExperimentsIndex, toMetadata } from "@/lib/content/seo";

export const metadata: Metadata = toMetadata(seoForExperimentsIndex());

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
            {counts.experiments}{" "}
            {counts.experiments === 1 ? "experiment" : "experiments"} across{" "}
            {counts.hypotheses}{" "}
            {counts.hypotheses === 1 ? "hypothesis" : "hypotheses"}
          </span>
        }
      />

      <blockquote className="my-s4 border-l-[3px] border-marigold pl-s3 text-quiet">
        <p className="text-[15px]">
          The goal of this whole exercise is to frankly make public whatever I
          try and do, whatever my intents are with anything related to work and
          beyond work as well.
        </p>
      </blockquote>

      {/* Doubles as the legend for the status vocabulary — the colours here
          are the same ones used against every experiment below. */}
      {statusCounts.length > 0 ? (
        <p className="mb-s5 font-mono text-[13px] text-quiet">
          <span className="mr-s2 uppercase tracking-[0.08em]">Status</span>
          {statusCounts.map((s, i) => (
            <span key={s.status}>
              {i > 0 ? <span className="mx-s1 text-rule">/</span> : null}
              <span className="mr-1.5">{s.count}</span>
              <StatusBadge status={s.status} />
            </span>
          ))}
        </p>
      ) : null}

      {hypotheses.length === 0 ? (
        <EmptyNote>
          Nothing here yet. Experiments hang off a hypothesis — adding one
          starts in src/data/hypotheses.ts, see content/README.md.
        </EmptyNote>
      ) : null}

      {hypotheses.map((h) => (
        <section key={h.id} className="mb-s5">
          <p className="mb-1 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
            Hypothesis
          </p>
          <h2 className="font-display text-display-m max-w-[30ch] text-ink">
            <Link href={h.url} className="hover:text-pen">
              {h.title}
            </Link>
          </h2>

          <p className="mt-s1 mb-s2 max-w-[62ch] text-body-m text-ink/70">
            {h.statement}
          </p>

          {h.tags.length > 0 ? (
            <TagPills tags={h.tags} className="mb-s3" />
          ) : null}

          <p className="mb-s1 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
            Experiments testing it
          </p>

          {h.experiments.length === 0 ? (
            <EmptyNote>Nothing testing this yet.</EmptyNote>
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
