import type { Metadata } from "next";
import Link from "next/link";
import { EmptyNote } from "@/components/empty-note";
import { MachineReadable } from "@/components/machine-readable";
import { PageHeader } from "@/components/page-header";
import { PlaceholderBanner } from "@/components/placeholder-banner";
import { TagPills } from "@/components/tag-pill";
import { formatDate } from "@/lib/content/format";
import { paths } from "@/lib/content/paths";
import { plural, toMetadata } from "@/lib/content/seo";
import type { OgCard } from "@/lib/og/card";
import { publishedPosts } from "./posts";

const posts = publishedPosts();

// The banner clears itself: it shows only while every post listed is
// scaffolding, so publishing one real post retires it.
const allPlaceholders = posts.length > 0 && posts.every((p) => p.placeholder);

const description = `Writing from Positive Sum Experiments — ${plural(posts.length, "post")}.`;

export const ogCard: OgCard = {
  eyebrow: "Blog",
  title: "Writing from Positive Sum Experiments",
  meta: [plural(posts.length, "post")],
  placeholder: allPlaceholders,
};

// The feed link is the one thing the shared generator does not know about.
export const metadata: Metadata = {
  ...toMetadata({
    title: "Blog",
    description,
    path: paths.blog(),
    card: ogCard,
  }),
  alternates: {
    canonical: paths.blog(),
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function BlogPage() {
  return (
    <div className="pb-s5">
      {allPlaceholders ? (
        <PlaceholderBanner note="Every post listed here is scaffolding. Naman has not published a real one yet." />
      ) : null}

      <PageHeader
        title="Blog"
        aside={
          <a
            href="/feed.xml"
            className="font-mono text-[13px] text-quiet hover:text-pen"
          >
            <span className="mr-1 text-pen">+</span>RSS
          </a>
        }
      />

      {posts.length === 0 ? (
        <EmptyNote>
          Nothing published yet. Posts live in content/posts — see
          content/README.md.
        </EmptyNote>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.slug} className="mb-s4 border-b border-rule pb-s3">
              <p className="mb-s1 font-mono text-[13px] text-quiet">
                {formatDate(post.publishedAt)}
              </p>
              <h2 className="font-display text-display-m max-w-[30ch]">
                <Link
                  href={paths.post(post.slug)}
                  className="text-ink hover:text-pen"
                >
                  {post.title}
                </Link>
              </h2>
              {post.summary ? (
                <p className="mt-s1 max-w-[62ch] text-body-m text-ink/70">
                  {post.summary}
                </p>
              ) : null}
              <TagPills tags={post.tags ?? []} className="mt-s2" />
            </li>
          ))}
        </ul>
      )}

      <MachineReadable
        links={[
          { href: "/blog.json", label: "JSON" },
          { href: "/blog.xml", label: "XML" },
          { href: "/feed.xml", label: "RSS" },
        ]}
      />
    </div>
  );
}
