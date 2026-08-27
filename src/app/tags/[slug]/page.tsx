import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyNote } from "@/components/empty-note";
import { MachineReadable } from "@/components/machine-readable";
import { PageHeader } from "@/components/page-header";
import { PlaceholderBanner } from "@/components/placeholder-banner";
import { ProseBody } from "@/components/prose-body";
import { formatDate } from "@/lib/content/format";
import { paths } from "@/lib/content/paths";
import { describe, join, plural, toMetadata } from "@/lib/content/seo";
import type { OgCard } from "@/lib/og/card";
import { publishedPosts } from "../../blog/posts";
import { tagBySlug, tags } from "../tags-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return tags.map((tag) => ({ slug: tag.slug }));
}

function postsForTag(slug: string) {
  return publishedPosts().filter((post) =>
    (post.tags ?? []).some((t) => t.slug === slug),
  );
}

function cardFor(tag: NonNullable<ReturnType<typeof tagBySlug>>): OgCard {
  const count = postsForTag(tag.slug).length;
  return {
    eyebrow: "Tag",
    title: tag.label,
    description: `Everything filed under ${tag.label}.`,
    meta: [plural(count, "post")],
    placeholder: tag.placeholder,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = tagBySlug(slug);
  if (!tag) return {};

  const count = postsForTag(tag.slug).length;
  return toMetadata({
    title: tag.label,
    description: describe(
      `Everything filed under ${tag.label} — ${join([plural(count, "post")])}`,
      [],
      tag.placeholder,
    ),
    path: paths.tag(tag.slug),
    keywords: [tag.label],
    card: cardFor(tag),
  });
}

// A tag page shows what has been written under it. Hypotheses and
// experiments used to roll up here too — they're parked for now (see
// CLAUDE.md), so this is blog posts only until that graph comes back.
export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = tagBySlug(slug);
  if (!tag) notFound();

  const posts = postsForTag(tag.slug);

  return (
    <div className="pb-s5">
      {tag.placeholder ? <PlaceholderBanner /> : null}

      <PageHeader
        title={tag.label}
        eyebrow={{ label: "Blog", href: paths.blog() }}
      />

      <ProseBody
        load={tag.body}
        fallback={
          <EmptyNote>What this tag means is not written up yet.</EmptyNote>
        }
      />

      {posts.length === 0 ? (
        <div className="mt-s4 border-t border-rule pt-s3">
          <EmptyNote>Nothing is filed under {tag.label} yet.</EmptyNote>
        </div>
      ) : (
        <section className="mt-s4 border-t border-rule pt-s3">
          <h2 className="mb-s2 font-mono text-[13px] uppercase tracking-[0.08em] text-quiet">
            Writing
          </h2>
          <ul className="space-y-s1">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={paths.post(post.slug)}
                  className="text-body-m hover:text-pen"
                >
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
      )}

      <MachineReadable
        links={[{ href: `/tags/${tag.slug}/data`, label: "JSON" }]}
      />
    </div>
  );
}
