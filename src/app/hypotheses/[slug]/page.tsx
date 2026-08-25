import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftNote } from "@/components/draft-note";
import { MachineReadable } from "@/components/machine-readable";
import { PageHeader } from "@/components/page-header";
import { ProseBody } from "@/components/prose-body";
import { StatusBadge } from "@/components/status-badge";
import { TagPills } from "@/components/tag-pill";
import { formatDate } from "@/lib/content/format";
import { apiPaths, paths } from "@/lib/content/paths";
import {
  getHypotheses,
  getHypothesisBySlug,
  getPostsAbout,
} from "@/lib/content/queries";

export const dynamicParams = false;

export function generateStaticParams() {
  return getHypotheses().map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hypothesis = getHypothesisBySlug(slug);
  if (!hypothesis) return {};

  return {
    title: hypothesis.title,
    description: hypothesis.statement,
    alternates: { canonical: paths.hypothesis(hypothesis.slug) },
  };
}

export default async function HypothesisPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hypothesis = getHypothesisBySlug(slug);
  if (!hypothesis) notFound();

  const posts = getPostsAbout({ hypothesisId: hypothesis.id });

  return (
    <article className="pb-s5">
      <PageHeader
        title={hypothesis.title}
        size="l"
        eyebrow={{ label: "Experiments", href: paths.experiments() }}
        aside={
          <span className="font-mono text-[13px] text-quiet">
            {formatDate(hypothesis.createdAt)}
          </span>
        }
      />

      <p className="max-w-[62ch] text-body-l text-ink/80">
        {hypothesis.statement}
      </p>

      <TagPills tags={hypothesis.tags} className="mt-s3 mb-s4" />

      {/* The rule from /core: a hypothesis says which principle it descends
          from. Saying so out loud is the point, so an empty list is shown as
          missing rather than hidden. */}
      <section className="mb-s4 border-t border-rule pt-s3">
        <h2 className="mb-s1 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
          Descends from
        </h2>
        {hypothesis.core.length === 0 ? (
          <DraftNote>
            No principle of the core named yet — Naman decides which one this
            descends from.
          </DraftNote>
        ) : (
          <ul className="space-y-s1">
            {hypothesis.core.map((principle) => (
              <li key={principle.id}>
                <Link
                  href={principle.url}
                  className="text-body-m text-ink hover:text-pen"
                >
                  <span className="mr-1.5 font-mono text-[14px] text-pen">
                    {principle.number}.
                  </span>
                  {principle.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-s4 border-t border-rule pt-s3">
        <h2 className="mb-s2 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
          Experiments testing it
        </h2>
        {hypothesis.experiments.length === 0 ? (
          <p className="font-mono text-[13px] text-quiet">None yet.</p>
        ) : (
          <ul className="space-y-s1">
            {hypothesis.experiments.map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-baseline justify-between gap-s1"
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

      <ProseBody collection="hypotheses" slug={hypothesis.slug} />

      {hypothesis.related.length > 0 ? (
        <section className="mt-s5 border-t border-rule pt-s3">
          <h2 className="mb-s2 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
            Reads alongside
          </h2>
          <ul className="space-y-s1">
            {hypothesis.related.map((related) => (
              <li key={related.id}>
                <Link
                  href={related.url}
                  className="max-w-[52ch] text-body-m hover:text-pen"
                >
                  <span className="mr-1.5 font-bold text-pen">+</span>
                  {related.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {posts.length > 0 ? (
        <section className="mt-s4 border-t border-rule pt-s3">
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
          { href: apiPaths.hypothesis(hypothesis.slug), label: "JSON" },
          { href: apiPaths.hypothesesXml(), label: "XML (all)" },
        ]}
      />
    </article>
  );
}
