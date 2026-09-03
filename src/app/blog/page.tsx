import type { Metadata } from "next";
import Link from "next/link";
import { ids, site } from "@/lib/site";
import { posts } from "./posts";

// The blog index. Hardcoded on purpose: a post is a folder under
// src/app/blog/ with its own page.tsx (its own design) and a post.ts (the
// facts), listed in posts.ts. No tags, no pagination — nothing more.

// No intro on the index — the posts are the page. Metadata falls back to
// the site's own description.
const description = site.description;

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": `${site.url}/feed.xml` },
  },
  openGraph: { title: "Blog", description },
  twitter: { title: "Blog", description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${site.url}/blog#blog`,
  name: `Blog — ${site.name}`,
  description,
  url: `${site.url}/blog`,
  inLanguage: site.language,
  publisher: { "@id": ids.organization },
  isPartOf: { "@id": ids.website },
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    "@id": `${site.url}${p.path}#post`,
    headline: p.title,
    datePublished: p.date,
    url: `${site.url}${p.path}`,
  })),
};

export default function BlogPage() {
  return (
    <div className="pb-s5">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from the hardcoded post list
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mt-s5 mb-s4 flex flex-wrap items-baseline justify-between gap-s2 border-b border-rule pb-s2">
        <h1 className="font-display text-display-xl text-ink">Blog</h1>
        <a
          href="/feed.xml"
          className="font-mono text-[13px] text-quiet hover:text-pen"
        >
          <span className="mr-1 font-bold text-pen">+</span>RSS
        </a>
      </div>

      <ol>
        {posts.map((p) => (
          <li key={p.path} className="border-t border-rule py-s3">
            <Link href={p.path} className="group block">
              <div className="flex flex-wrap items-baseline justify-between gap-x-s2 font-mono text-[13px] text-quiet">
                <span>
                  <span className="mr-1 font-bold text-pen">+</span>
                  {p.eyebrow}
                </span>
                <time dateTime={p.date}>{p.dateLabel}</time>
              </div>
              <h2 className="font-display text-display-m mt-s1 max-w-[30ch] text-ink group-hover:text-pen">
                {p.heading}
              </h2>
              <p className="mt-s1 max-w-[58ch] text-body-m text-ink/70">
                {p.description}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
