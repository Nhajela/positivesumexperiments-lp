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
            , and I&rsquo;m running experiments with fundamentals rooted in
            this positive sum philosophy.
          </p>
          <p>
            My aim is to enable everyone involved in each of my
            initiatives, and document it all here as a giveback for the world.
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

      {/* the Core, as one drawn door: what's inside, then the way in */}
      <section className="mt-s5">
        <Link
          href="/core"
          className="group relative block rounded-[18px_255px_18px_225px/225px_18px_255px_18px] border-[1.5px] border-ink px-s3 pt-s3 pb-s2 -rotate-[0.4deg] transition-transform hover:-rotate-0 hover:border-pen"
        >
          <span className="absolute -top-[11px] left-s3 bg-paper px-1.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-quiet">
            Read first
          </span>
          <span className="font-display text-display-m block text-ink group-hover:text-pen">
            The Core
          </span>
          <span className="mt-s2 block font-display text-[20px] leading-[1.35] text-ink">
            It is a game, time is limited.
            <br />
            Give back to all audaciously.
          </span>
          <ol className="mt-s2 space-y-1 pl-s2 text-[15.5px] text-ink/85">
            {corePrinciples.map((p, i) => (
              <li key={p} className="flex gap-s2">
                <span className="w-[1.4ch] shrink-0 font-mono text-[13px] text-pen">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ol>
          <span className="mt-s3 block text-[17px] font-medium text-ink group-hover:text-pen">
            Read the Core
            <span className="ml-2 font-bold text-pen">&rarr;</span>
          </span>
        </Link>
      </section>

      {/* the log — one dated row per experiment, newest first */}
      <section className="mt-s5 grid grid-cols-1 gap-s2 border-t border-rule pt-s4 sm:grid-cols-[11ch_1fr] sm:gap-s3">
        <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-quiet sm:pt-2">
          Experiments
          <span className="mt-1 block normal-case tracking-normal">
            {posts.length} started
          </span>
        </p>
        <ol>
          {posts.map((p) => (
            <li key={p.path} className="grid gap-s1">
              <div className="flex flex-wrap justify-between gap-x-s2 font-mono text-[13px] text-quiet">
                <span>
                  <span className="mr-1 font-bold text-pen">+</span>
                  {p.eyebrow}
                </span>
                <span>
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-marker align-[1px]" />
                  started {p.dateLabel}
                </span>
              </div>
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
