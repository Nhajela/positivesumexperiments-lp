import type { Metadata } from "next";
import Link from "next/link";
import { MachineReadable } from "@/components/machine-readable";
import { PageHeader } from "@/components/page-header";
import { TagPills } from "@/components/tag-pill";
import { formatDate } from "@/lib/content/format";
import { apiPaths } from "@/lib/content/paths";
import { getPosts } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing from Positive Sum Experiments.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="pb-s5">
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
        <p className="font-mono text-[13px] text-quiet">Nothing published.</p>
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
