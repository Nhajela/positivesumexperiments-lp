import type { Metadata } from "next";
import Link from "next/link";
import { author, ids, site } from "@/lib/site";
import { post } from "./post";

// Experiment 1. Every post on this blog is hardcoded with its own design;
// this one reads as a letter — a thesis, a run of questions, a red-pen list
// of what to unlearn, then the announcement. All prose is Naman's, verbatim
// (writing/2026-09-03-blog-and-abandon-adulting-club.txt).

export const metadata: Metadata = {
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

const url = `${site.url}${post.path}`;

// BlogPosting + the trail back to the index. Author/publisher point at the
// nodes declared on the home page.
const jsonLd = {
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

// Shared bits of this page's own vocabulary — local, not a design system.
const p = "text-body-m max-w-[62ch] mb-s3 text-ink/85";
const h2 = "font-display text-display-l mt-s5 mb-s3 text-ink";

export default function AbandonAdultingClub() {
  return (
    <article className="pb-s5">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from this page's own facts
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* head: where this sits, what it is, when */}
      <header className="mt-s5 mb-s5 border-b border-rule pb-s3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-s2 font-mono text-[13px] text-quiet">
          <span>
            <Link href="/blog" className="hover:text-pen">
              <span className="mr-1 font-bold text-pen">+</span>Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="uppercase tracking-[0.12em]">Experiment 1</span>
          </span>
          <time dateTime={post.date}>{post.dateLabel}</time>
        </div>
        <h1 className="font-display text-display-xl mt-s3 max-w-[14ch] text-ink">
          Abandon Adulting Club
        </h1>
        <p className="mt-s2 font-hand text-[22px] text-pen -rotate-1">
          Author: Nmn
        </p>
      </header>

      <h2 className="font-display text-display-l mb-s3 text-ink">
        The Thesis:
      </h2>

      <p className="text-body-l max-w-[58ch] mb-s3 text-ink">
        When we were kids, we had a lot of fundamentals right. As we became
        adults, we lost touch of them.
      </p>
      <p className="text-body-l max-w-[58ch] mb-s3 text-ink">
        Connecting back to the same truth we intuitively knew as kids will help
        liberate us and lead us to more fulfilling lives.
      </p>

      <h2 className={h2}>What kind of truths?</h2>

      <p className={p}>
        Do you remember when you were a kid? What did you like the most about
        that? How did that feel like?
      </p>

      {/* the questions — set apart, in the print voice, one breath each */}
      <ul className="my-s4 space-y-s2 border-l-[3px] border-marigold pl-s3">
        <li className="font-display text-display-m max-w-[30ch] text-ink">
          Did you ever worry about the future?
        </li>
        <li className="font-display text-display-m max-w-[30ch] text-ink">
          Did you ever carry the weight of so called responsibilities?
        </li>
        <li className="font-display text-display-m max-w-[30ch] text-ink">
          Did you ever mind a breakup too much or fret over a friend as if it
          was the end of your life?
        </li>
        <li className="font-display text-display-m max-w-[30ch] text-ink">
          Did you even realize that life was finite?{" "}
          <span className="ml-1 inline-block whitespace-nowrap font-hand text-[21px] leading-none text-pen -rotate-2">
            (not saying it&rsquo;s true)
          </span>
        </li>
        <li className="font-display text-display-m max-w-[30ch] text-ink">
          Did you do something because you were supposed to?
        </li>
      </ul>

      <p className={p}>
        I&rsquo;m sure you know the answer to these questions, I&rsquo;m sure
        you feel them when you think about it.
      </p>
      <p className={p}>That&rsquo;s the truth I&rsquo;m talking about.</p>
      <p className={p}>
        <strong className="font-semibold text-ink">
          They say kids are a representation of god,
        </strong>{" "}
        I agree. And by learning from them, we can find god within ourselves
        too.
      </p>

      <hr className="border-rule my-s5" />

      <p className={p}>
        There are many things that the world and society feeded us that were of
        no use.
      </p>

      {/* the unlearning list — red pen crosses instead of the site's + bullets */}
      <ul className="mb-s3 -mt-s2 space-y-s1 [&>li]:relative [&>li]:pl-s3 [&>li]:before:content-['×'] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:font-bold [&>li]:before:text-red-pen">
        <li className="max-w-[60ch] text-body-m text-ink/85">
          That you have to care about what others think.
        </li>
        <li className="max-w-[60ch] text-body-m text-ink/85">
          The concept of rushing to places.
        </li>
        <li className="max-w-[60ch] text-body-m text-ink/85">
          That we&rsquo;re &lsquo;supposed&rsquo; to do things.
        </li>
        <li className="max-w-[60ch] text-body-m text-ink/85">
          That there&rsquo;s a &lsquo;success&rsquo; to chase after which life
          will be &lsquo;set&rsquo;
        </li>
        <li className="max-w-[60ch] text-body-m text-ink/85">
          That worrying will help
        </li>
        <li className="max-w-[60ch] text-body-m text-ink/85">
          That perfection is the goal
        </li>
        <li className="max-w-[60ch] text-body-m text-ink/85">
          That people know what they&rsquo;re doing and talking about.
        </li>
      </ul>

      <p className={p}>
        Most of these are questionable at best and dangerous at worst.
      </p>

      <p className={p}>
        Yes there are layers of logical patterns that emerge at a large scale
        when we observe the world. Patterns that might say that hey good looking
        people are more likely to get the job, or that what your boss thinks of
        you deeply influences your promotion, or that being likable gets you
        girls and money. You get the point.
      </p>

      <p className={p}>
        But that data is deeply misinterpreted at the individual scale, where an
        individual has to decide within the abundance of infinite options, on
        how to lead their lives.
      </p>

      {/* the announcement — highlighter on the name, the way the pen would */}
      <p className="text-body-l max-w-[58ch] mt-s4 mb-s3 text-ink">
        Which is why I&rsquo;m starting{" "}
        <mark className="bg-[color-mix(in_srgb,var(--color-marigold)_38%,transparent)] px-1 text-ink">
          abandon adulting club
        </mark>{" "}
        with the goal to facilitate experiences online and offline that help
        individuals reconnect to the truths their kid selves knew all along!
      </p>

      <p className={p}>Follow along to know how I&rsquo;ll be doing this.</p>

      <p className={p}>
        Already got the domain a while back -{" "}
        <a
          href="https://abandonadulting.club"
          className="text-pen border-b border-pen/35 hover:border-pen pb-px"
        >
          abandonadulting.club
        </a>
      </p>

      <p className="mt-s4 font-hand text-[28px] text-pen -rotate-2">See ya!</p>

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
