import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyNote } from "@/components/empty-note";
import { MachineReadable } from "@/components/machine-readable";
import { PageHeader } from "@/components/page-header";
import { PlaceholderBanner } from "@/components/placeholder-banner";
import { ProseBody } from "@/components/prose-body";
import { TagPills } from "@/components/tag-pill";
import { formatDate } from "@/lib/content/format";
import { paths } from "@/lib/content/paths";
import { describe, toMetadata } from "@/lib/content/seo";
import type { OgCard } from "@/lib/og/card";
import { postBySlug, publishedPosts } from "../posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

function cardFor(post: NonNullable<ReturnType<typeof postBySlug>>): OgCard {
  return {
    eyebrow: ["Blog", ...(post.tags ?? []).map((t) => t.label)].join(" · "),
    title: post.title,
    description: post.summary,
    meta: [formatDate(post.publishedAt)],
    placeholder: post.placeholder,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};

  return toMetadata({
    title: post.title,
    description: describe(
      post.summary ?? "A post from Positive Sum Experiments.",
      [],
      post.placeholder,
    ),
    path: paths.post(post.slug),
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    keywords: (post.tags ?? []).map((t) => t.label),
    card: cardFor(post),
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

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

      {(post.tags ?? []).length > 0 ? (
        <TagPills tags={post.tags ?? []} className="mb-s4" />
      ) : (
        <div className="mb-s4" />
      )}

      <ProseBody
        load={post.body}
        fallback={<EmptyNote>This post has no body yet.</EmptyNote>}
      />

      <MachineReadable
        links={[
          { href: `/blog/${post.slug}/data`, label: "JSON" },
          { href: "/feed.xml", label: "RSS" },
        ]}
      />
    </article>
  );
}
