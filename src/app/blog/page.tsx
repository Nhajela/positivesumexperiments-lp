import type { Metadata } from "next";
import Link from "next/link";
import { EmptyNote } from "@/components/empty-note";
import { MachineReadable } from "@/components/machine-readable";
import { PageHeader } from "@/components/page-header";
import { PlaceholderBanner } from "@/components/placeholder-banner";
import { TagPills } from "@/components/tag-pill";
import { formatDate } from "@/lib/content/format";
import { apiPaths, paths } from "@/lib/content/paths";
import { getPosts } from "@/lib/content/queries";
import { seoForBlogIndex, toMetadata } from "@/lib/content/seo";

// The feed link is the one thing the shared generator does not know about.
export const metadata: Metadata = {
  ...toMetadata(seoForBlogIndex()),
  alternates: {
    canonical: paths.blog(),
    types: { "application/rss+xml": apiPaths.feed() },
  },
};

export default function BlogPage() {
  const posts = getPosts();
  // The banner clears itself: it shows only while every post listed is
  // scaffolding, so publishing one real post retires it.
  const allPlaceholders =
    posts.length > 0 && posts.every((post) => post.placeholder);

  return (
    <div className="pb-s5">
      {allPlaceholders ? (
        <PlaceholderBanner note="Every post listed here is scaffolding. Naman has not published a real one yet." />
      ) : null}

      <PageHeader
        title="Blog"
        aside={
          <a
            href={apiPaths.feed()}
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
            <li key={post.id} className="mb-s4 border-b border-rule pb-s3">
              <p className="mb-s1 font-mono text-[13px] text-quiet">
                {formatDate(post.publishedAt)}
              </p>
              <h2 className="font-display text-display-m max-w-[30ch]">
                <Link href={post.url} className="text-ink hover:text-pen">
                  {post.title}
                </Link>
              </h2>
              {post.summary ? (
                <p className="mt-s1 max-w-[62ch] text-body-m text-ink/70">
                  {post.summary}
                </p>
              ) : null}
              <TagPills tags={post.tags} className="mt-s2" />
            </li>
          ))}
        </ul>
      )}

      <MachineReadable
        links={[
          { href: apiPaths.posts(), label: "JSON" },
          { href: apiPaths.postsXml(), label: "XML" },
          { href: apiPaths.feed(), label: "RSS" },
        ]}
      />
    </div>
  );
}
