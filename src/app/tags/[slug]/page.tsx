import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MachineReadable } from "@/components/machine-readable";
import { PageHeader } from "@/components/page-header";
import { ProseBody } from "@/components/prose-body";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/content/format";
import { apiPaths, paths } from "@/lib/content/paths";
import { getTagBySlug, getTagRollup, getTags } from "@/lib/content/queries";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTags().map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) return {};

  return {
    title: tag.label,
    description: `Everything filed under ${tag.label} — hypotheses, experiments and writing.`,
    alternates: { canonical: paths.tag(tag.slug) },
  };
}

// A tag page is a roll-up, not a list of one thing: experiments inherit their
// hypothesis's tags, so a tag gathers the whole line of enquiry and anything
// written about it.
export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) notFound();

  const rollup = getTagRollup(tag.id);

  return (
    <div className="pb-s5">
      <PageHeader
        title={tag.label}
        eyebrow={{ label: "Experiments", href: paths.experiments() }}
        aside={
          <span className="font-mono text-[13px] text-quiet">
            {tag.group.label}
          </span>
        }
      />

      <ProseBody collection="tags" slug={tag.slug} />

      <section className="mt-s4 border-t border-rule pt-s3">
        <h2 className="mb-s2 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
          Hypotheses
        </h2>
        {rollup.hypotheses.length === 0 ? (
          <p className="font-mono text-[13px] text-quiet">None yet.</p>
        ) : (
          <ul className="space-y-s1">
            {rollup.hypotheses.map((h) => (
              <li key={h.id}>
                <Link
                  href={h.url}
                  className="max-w-[52ch] text-body-m hover:text-pen"
                >
                  <span className="mr-1.5 font-bold text-pen">+</span>
                  {h.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-s4 border-t border-rule pt-s3">
        <h2 className="mb-s2 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
          Experiments
        </h2>
        {rollup.experiments.length === 0 ? (
          <p className="font-mono text-[13px] text-quiet">None yet.</p>
        ) : (
          <ul className="space-y-s1">
            {rollup.experiments.map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-baseline justify-between gap-s1"
              >
                <Link
                  href={e.url}
                  className="max-w-[46ch] text-body-m hover:text-pen"
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

      {rollup.posts.length > 0 ? (
        <section className="mt-s4 border-t border-rule pt-s3">
          <h2 className="mb-s2 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
            Writing
          </h2>
          <ul className="space-y-s1">
            {rollup.posts.map((post) => (
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
          { href: apiPaths.tags(), label: "JSON" },
          { href: apiPaths.graph(), label: "everything" },
        ]}
      />
    </div>
  );
}
