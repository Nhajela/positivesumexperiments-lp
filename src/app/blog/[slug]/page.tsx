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
import { formatDate } from "@/lib/content/format";
import { apiPaths, paths } from "@/lib/content/paths";
import { getPostBySlug, getPosts } from "@/lib/content/queries";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary ?? undefined,
    alternates: { canonical: paths.post(post.slug) },
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const linked = [...post.hypotheses, ...post.experiments];

  return (
    <article className="pb-s5">
      {post.placeholder ? <PlaceholderBanner /> : null}

      <PageHeader
        title={post.title}
        size="l"
        eyebrow={{ label: "Blog", href: paths.blog() }}
        aside={
          <time
            dateTime={post.publishedAt}
            className="font-mono text-[13px] text-quiet"
          >
            {formatDate(post.publishedAt)}
          </time>
        }
      />

      {post.tags.length > 0 ? (
        <TagPills tags={post.tags} className="mb-s4" />
      ) : (
        <div className="mb-s4" />
      )}

      <ProseBody
        collection="posts"
        slug={post.slug}
        fallback={<EmptyNote>This post has no body yet.</EmptyNote>}
      />

      {linked.length > 0 ? (
        <section className="mt-s5 border-t border-rule pt-s3">
          <h2 className="mb-s2 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
            About
          </h2>
          <ul className="space-y-s1">
            {post.hypotheses.map((h) => (
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
            {post.experiments.map((e) => (
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
        </section>
      ) : null}

      <MachineReadable
        links={[
          { href: apiPaths.post(post.slug), label: "JSON" },
          { href: apiPaths.feed(), label: "RSS" },
        ]}
      />
    </article>
  );
}
