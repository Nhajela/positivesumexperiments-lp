import type { Metadata } from "next";
import Link from "next/link";
import { author, ids, site } from "@/lib/site";
import { posts } from "./blog/posts";

// The seven headings of src/app/core/page.mdx, so the door shows what's
// inside. Update here when a value is added there.
const corePrinciples = [
  "Play positive sum games.",
  "Respect time above all else.",
  "Strive to give out disproportionate value.",
  "Have audacious intent, and patient persistence.",
  "Play with the power laws.",
  "Compounding shall be your best friend.",
  "Sincerity over Seriousness",
];

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

// Organization + WebSite + Person structured data for the umbrella brand.
// Rendered as JSON-LD on the home page only — search engines pick it up
// site-wide from here; other pages reference these nodes by @id.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ids.organization,
      name: site.name,
      url: site.url,
      description: site.description,
      email: author.email,
      founder: { "@id": ids.person },
      sameAs: ["https://x.com/crazyxnaman"],
    },
    {
      "@type": "WebSite",
      "@id": ids.website,
      name: site.name,
      url: site.url,
      inLanguage: site.language,
      publisher: { "@id": ids.organization },
    },
    {
      "@type": "Person",
      "@id": ids.person,
      name: author.name,
      url: author.url,
      email: author.email,
      sameAs: author.sameAs,
      worksFor: { "@id": ids.organization },
    },
  ],
};

// The assertion (writing/2026-07-06-landing-and-core.txt) and the letter
// (writing/2026-09-03-home-letter.txt) are Naman's, verbatim.
export default function Home() {
  return (
    <div className="pb-s5">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from our own config
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pt-s5">
        <h1 className="font-display text-display-xl max-w-[16ch]">
          For us to win, no one has to lose.
        </h1>

        {/* the letter — Naman's, verbatim (writing/2026-09-03-home-letter.txt);
            set as one column of print-voice prose, signed in his hand */}
        <div className="mt-s4 max-w-[58ch] space-y-s3 text-body-l text-ink">
          <p>
            Hi I&rsquo;m{" "}
            <a
              href="https://namanhajela.com"
              className="underline underline-offset-4 decoration-pen/50 hover:decoration-pen hover:text-pen"
            >
              Naman
            </a>
            , and I&rsquo;m running experiments with fundamentals rooted in this
            positive sum philosophy.
          </p>
          <p>
            My goal is to enable everyone involved in each of my initiatives,
            the customers of course, my team, myself, and the wider world.
          </p>
          <p>
            I shall document my learnings and journey here as a giveback for the
            world.
          </p>
          <p>
            I have a few core principles I want to build this on top of,
            they&rsquo;re listed below. Read them first to understand how we
            operate. Following which will come a log of all the experiments I
            run and things I do.
          </p>
          <p>
            The wins, the failures, the learnings, all of it shared
            transparently.
          </p>
          <p className="font-hand text-[26px] leading-none text-pen -rotate-2">
            ~ Nmn
          </p>
        </div>
      </section>

      {/* the Core — same vocabulary as the Core page itself: its two-line
          summary as the marigold-ruled quote, the seven headings, the way in */}
      <section className="mt-s5">
        {/* the hand-ruled frame, tagged on its edge; the button is the link */}
        <div className="relative rounded-[18px_255px_18px_225px/225px_18px_255px_18px] border-[1.5px] border-ink px-s3 pt-s3 pb-s3 -rotate-[0.4deg]">
          <span className="absolute -top-[11px] left-s3 bg-paper px-1.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-quiet">
            Read first
          </span>
          <h2 className="font-display text-display-m text-ink">The Core</h2>
          {/* two lines, each unbroken from sm up; phones may still wrap */}
          <blockquote className="my-s3 border-l-[3px] border-marigold pl-s3 font-display text-[22px] leading-[1.3] text-ink sm:whitespace-nowrap">
            It is a game, time is limited.
            <br />
            Give back to all audaciously.
          </blockquote>
          {/* fills down then across (1–4 left, 5–7 right) so no row is a
              lone item at the bottom */}
          <ol className="grid gap-x-s4 gap-y-1 text-[15.5px] text-ink/85 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-4">
            {corePrinciples.map((p, i) => (
              <li key={p} className="flex gap-s2">
                <span className="w-[1.4ch] shrink-0 font-mono text-[13px] text-pen">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ol>
          <Link
            href="/core"
            className="mt-s3 block rounded-[16px_225px_16px_255px/255px_16px_225px_16px] border-[1.5px] border-ink px-s3 py-s1 text-center text-[17px] font-medium -rotate-[0.4deg] transition-transform hover:-rotate-0 hover:border-pen hover:text-pen"
          >
            Read the Core
            <span className="ml-2 font-bold text-pen">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* the log — one row per experiment, newest first */}
      <section className="mt-s6">
        <h2 className="mb-s3 border-b border-rule pb-s2 font-display text-display-l text-ink">
          Experiments
        </h2>
        <ol className="space-y-s3">
          {posts.map((p) => (
            <li key={p.path} className="grid gap-s1">
              <p className="font-mono text-[13px] text-quiet">
                <span className="mr-1 font-bold text-pen">+</span>
                {p.eyebrow}
              </p>
              <Link
                href={p.path}
                className="font-display text-display-m text-ink hover:text-pen"
              >
                {p.heading}
              </Link>
              <p className="max-w-[58ch] text-body-m text-ink/70">
                {p.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
