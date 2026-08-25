import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyNote } from "@/components/empty-note";
import { MachineReadable } from "@/components/machine-readable";
import { PageHeader } from "@/components/page-header";
import { PlaceholderBanner } from "@/components/placeholder-banner";
import { ProseBody } from "@/components/prose-body";
import { StatusBadge } from "@/components/status-badge";
import { TagPills } from "@/components/tag-pill";
import { daysBetween, formatDate } from "@/lib/content/format";
import { apiPaths, paths } from "@/lib/content/paths";
import {
  getExperimentBySlug,
  getExperiments,
  getPostsAbout,
} from "@/lib/content/queries";

export const dynamicParams = false;

export function generateStaticParams() {
  return getExperiments().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experiment = getExperimentBySlug(slug);
  if (!experiment) return {};

  return {
    title: experiment.title,
    description: experiment.hypothesis.statement,
    alternates: { canonical: paths.experiment(experiment.slug) },
  };
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experiment = getExperimentBySlug(slug);
  if (!experiment) notFound();

  const posts = getPostsAbout({ experimentId: experiment.id });

  // Once it has run, how long it actually took beats how long it was meant to.
  const duration =
    experiment.startedAt && experiment.endedAt
      ? {
          label: "Ran for",
          value: `${daysBetween(experiment.startedAt, experiment.endedAt)} days`,
        }
      : experiment.plannedDurationDays
        ? {
            label: "Planned length",
            value: `${experiment.plannedDurationDays} days`,
          }
        : null;

  // A planned experiment has no dates worth printing. Build the row first so
  // the whole strip can be skipped rather than rendering an empty list.
  const facts = [
    experiment.startedAt
      ? { label: "Started", value: formatDate(experiment.startedAt) }
      : null,
    experiment.endedAt
      ? { label: "Ended", value: formatDate(experiment.endedAt) }
      : null,
    duration,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <article className="pb-s5">
      {experiment.placeholder ? <PlaceholderBanner /> : null}

      <PageHeader
        title={experiment.title}
        size="l"
        eyebrow={{
          label: experiment.hypothesis.title,
          href: experiment.hypothesis.url,
        }}
        aside={<StatusBadge status={experiment.status} />}
      />

      {facts.length > 0 ? (
        <dl className="mb-s3 flex flex-wrap gap-x-s3 gap-y-s1 font-mono text-[13px] text-quiet">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="inline">{fact.label} </dt>
              <dd className="inline text-ink/70">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <EmptyNote>Not started — no dates set yet.</EmptyNote>
      )}

      {experiment.tags.length > 0 ? (
        <TagPills tags={experiment.tags} className="mt-s2 mb-s4" />
      ) : (
        <div className="mb-s4" />
      )}

      <section className="mb-s4 border-t border-rule pt-s3">
        <h2 className="mb-s1 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
          Testing
        </h2>
        <Link
          href={experiment.hypothesis.url}
          className="font-display text-display-m max-w-[30ch] text-ink hover:text-pen"
        >
          {experiment.hypothesis.title}
        </Link>
      </section>

      <ProseBody
        collection="experiments"
        slug={experiment.slug}
        fallback={
          <EmptyNote>
            Not written up yet — this experiment has a record but no notes
            against it.
          </EmptyNote>
        }
      />

      {posts.length > 0 ? (
        <section className="mt-s5 border-t border-rule pt-s3">
          <h2 className="mb-s2 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
            Written about this
          </h2>
          <ul className="space-y-s1">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={post.url} className="text-body-m hover:text-pen">
                  <span className="mr-1.5 font-bold text-pen">+</span>
                  {post.title}
                </Link>
                <span className="ml-s1 font-mono text-[13px] text-quiet">
                  {formatDate(post.publishedAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <MachineReadable
        links={[
          { href: apiPaths.experiment(experiment.slug), label: "JSON" },
          { href: apiPaths.experimentsXml(), label: "XML (all)" },
        ]}
      />
    </article>
  );
}
