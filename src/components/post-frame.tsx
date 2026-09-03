import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { author, ids, site } from "@/lib/site";

// The frame around a blog post's writing: where it sits (Blog / eyebrow),
// when, the title, the author's hand, and the way back — plus the metadata
// and JSON-LD every post needs. A post is a page.mdx that exports
// `postMetadata(post)` and a default layout returning <PostFrame post={post}>;
// the markdown inside is the writing, styled by mdx-components. Anything
// bespoke to one post is inline JSX in that file.

export type PostFacts = {
  path: string;
  /** Full title for <title>, OG and the feed. */
  title: string;
  /** Small mono line above the heading, e.g. "Experiment 1". */
  eyebrow?: string;
  /** What the page shows as its h1 — usually the title minus the eyebrow. */
  heading: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  dateLabel: string;
};

export function postMetadata(post: PostFacts): Metadata {
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [author.url],
    },
    twitter: { title: post.title, description: post.description },
  };
}

// BlogPosting + the trail back to the index. Author/publisher point at the
// nodes declared on the home page.
function jsonLd(post: PostFacts) {
  const url = `${site.url}${post.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: site.language,
        url,
        image: `${url}/opengraph-image`,
        author: { "@id": ids.person },
        publisher: { "@id": ids.organization },
        isPartOf: { "@id": `${site.url}/blog#blog` },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Blog",
            item: `${site.url}/blog`,
          },
          { "@type": "ListItem", position: 2, name: post.title, item: url },
        ],
      },
    ],
  };
}

export function PostFrame({
  post,
  children,
}: {
  post: PostFacts;
  children: ReactNode;
}) {
  return (
    <article className="pb-s5">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from the post's own facts
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(post)) }}
      />

      <header className="mt-s5 mb-s4 border-b border-rule pb-s3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-s2 font-mono text-[13px] text-quiet">
          <span>
            <Link href="/blog" className="hover:text-pen">
              <span className="mr-1 font-bold text-pen">+</span>Blog
            </Link>
            {post.eyebrow ? (
              <>
                <span className="mx-2">/</span>
                <span className="uppercase tracking-[0.12em]">
                  {post.eyebrow}
                </span>
              </>
            ) : null}
          </span>
          <time dateTime={post.date}>{post.dateLabel}</time>
        </div>
        <h1 className="font-display text-display-xl mt-s3 max-w-[14ch] text-ink">
          {post.heading}
        </h1>
        <p className="mt-s2 font-hand text-[22px] text-pen -rotate-1">
          Author: Nmn
        </p>
      </header>

      {/* the writing; a post that opens on a heading sits flush to the rule */}
      <div className="[&>h2:first-child]:mt-0">{children}</div>

      <footer className="mt-s6 border-t border-rule pt-s3">
        <Link
          href="/blog"
          className="font-mono text-[13px] text-quiet hover:text-pen"
        >
          <span className="mr-1 font-bold text-pen">&larr;</span>All posts
        </Link>
      </footer>
    </article>
  );
}
