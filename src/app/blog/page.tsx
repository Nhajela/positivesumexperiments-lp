import type { Metadata } from "next";
import Link from "next/link";
import { post as abandonAdultingClub } from "./abandon-adulting-club/post";

// The blog index. Hardcoded on purpose: a post is a folder under
// src/app/blog/ with its own page.tsx (its own design) and a post.ts (the
// facts). Add a new one by writing the page, then listing it here at the
// top. No data layer, no tags, no feeds — nothing more.

// Naman's line about the blog (writing/2026-09-03-blog-and-abandon-adulting-club.txt).
const description =
  "We're gonna make a simple blog setup on here where we'll keep writing findings, understandings and more.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog", description },
  twitter: { title: "Blog", description },
};

// Newest first.
const posts = [{ ...abandonAdultingClub, eyebrow: "Experiment 1" }];

export default function BlogPage() {
  return (
    <div className="pb-s5">
      <div className="mt-s5 mb-s4 border-b border-rule pb-s2">
        <h1 className="font-display text-display-xl text-ink">Blog</h1>
      </div>

      <p className="text-body-l max-w-[58ch] text-ink/80">{description}</p>
      <p className="mt-s1 font-hand text-[22px] text-pen -rotate-1">
        Nothing more. no more structure.
      </p>

      <ol className="mt-s5">
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
                Abandon Adulting Club
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
