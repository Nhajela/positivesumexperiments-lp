import type { Metadata } from "next";
import Link from "next/link";
import { paths } from "@/lib/content/paths";
import { CARD_CHARS, clamp, toMetadata } from "@/lib/content/seo";
import type { OgCard } from "@/lib/og/card";
import { site } from "@/lib/site";

// site.description opens with the assertion that is also the home card's
// title. The card shows what follows it, so the two don't say the same
// sentence twice.
const HOME_SUBTITLE = site.description.split(". ").slice(1).join(". ");

export const ogCard: OgCard = {
  title: "For us to win, no one has to lose.",
  description: clamp(HOME_SUBTITLE, CARD_CHARS),
};

export const metadata: Metadata = toMetadata({
  title: site.name,
  description: clamp(site.description),
  path: "/",
  absoluteTitle: true,
  card: ogCard,
});

// Organization + WebSite structured data for the umbrella brand. Rendered as
// JSON-LD on the home page only — search engines pick it up site-wide from here.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      description: site.description,
      founder: {
        "@type": "Person",
        name: "Naman Hajela",
        url: "https://namanhajela.com",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

// The four sections a first-time visitor has no way to guess the shape of
// from the nav alone ("Core"/"Awareness" tell you nothing before you click —
// confirmed independently by three cold-read visitor tests). One-line
// explainer per section, plus a small line-drawn icon. The explainer text
// itself is placeholder scaffolding — Naman writes the real one-liners; see
// docs/ai-policy.md.
const onramp = [
  {
    href: paths.core(),
    label: "Core",
    icon: (
      <path
        d="M14 4 L24 20 L14 24 L4 20 Z M14 12 v6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    placeholder:
      '[Placeholder — one line, e.g. "The principles everything else answers to."]',
  },
  {
    href: paths.awareness(),
    label: "Awareness",
    icon: (
      <>
        <path
          d="M4 14 C7 8 11 6 14 6 C17 6 21 8 24 14 C21 20 17 22 14 22 C11 22 7 20 4 14 Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="14" r="3.2" />
      </>
    ),
    placeholder:
      '[Placeholder — one line, e.g. "Short standalone insights, smaller than a whole principle."]',
  },
  {
    href: paths.experiments(),
    label: "Experiments",
    icon: (
      <path
        d="M11 4 h6 M12.5 4 v7 L6 22 a2 2 0 0 0 1.8 3 h12.4 a2 2 0 0 0 1.8-3 L15.5 11 V4 M9.5 16 h9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    placeholder:
      '[Placeholder — one line, e.g. "Beliefs I\'m testing on myself, and what happened."]',
  },
  {
    href: paths.blog(),
    label: "Blog",
    icon: (
      <path
        d="M6 22 L7 17.5 L19 5.5 a1.8 1.8 0 0 1 2.5 0 l1 1 a1.8 1.8 0 0 1 0 2.5 L10.5 21 Z M17 8 l3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    placeholder:
      '[Placeholder — one line, e.g. "Longer writing, sometimes tied to a specific experiment."]',
  },
] as const;

// The three places to go from here. Core first: it is what the other two are
// answerable to.
const destinations = [
  { href: paths.core(), label: "Read the Core", tilt: "-rotate-[0.6deg]" },
  {
    href: paths.experiments(),
    label: "See the experiments",
    tilt: "rotate-[0.5deg]",
  },
  { href: paths.blog(), label: "Read the blog", tilt: "-rotate-[0.35deg]" },
] as const;

// Copy is Naman's, verbatim (writing/2026-07-06-landing-and-core.txt).
export default function Home() {
  return (
    <div className="pb-s5">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from our own config
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pt-s5 pb-s5">
        <h1 className="font-display text-display-xl max-w-[16ch]">
          For us to win, no one has to lose.
        </h1>
        <p className="text-body-l max-w-[58ch] mt-s3 text-ink/80">
          Positive Sum Experiments is a venture by{" "}
          <a
            href="https://namanhajela.com"
            className="underline underline-offset-4 decoration-pen/50 hover:decoration-pen hover:text-pen"
          >
            Naman Hajela
          </a>{" "}
          running experiments with their fundamentals rooted in this philosophy.
        </p>
      </section>

      <section className="mb-s5">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-quiet mb-s2">
          How this site is organized
        </p>
        <ul className="divide-y divide-rule border-t border-rule">
          {onramp.map((item) => (
            <li
              key={item.href}
              className="flex flex-col gap-s1 py-s2 sm:flex-row sm:items-baseline sm:gap-s2"
            >
              <span className="flex shrink-0 items-center gap-s1 sm:basis-[9ch]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 28 28"
                  className="h-5 w-5 shrink-0 text-pen"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  {item.icon}
                </svg>
                <span className="font-display text-[19px]">
                  <Link href={item.href} className="hover:text-pen">
                    {item.label}
                  </Link>
                </span>
              </span>
              <span className="font-mono text-[13px] text-red-pen/80">
                {item.placeholder}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-s6">
        {/* hand-ruled frames, same trick as the dialogue card — drawn buttons.
            Each sits at its own angle so the stack reads as three things
            drawn by hand rather than one control repeated. Stacked one per
            line at every width: at the 680px content measure the three
            labels never fit one row (they run ~665px against 632px of
            usable space), so a wrapping flex row always broke unevenly
            into 2-then-1 — this makes the one-per-line layout the design
            instead of an overflow accident. */}
        <div className="flex flex-col items-start gap-s2">
          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className={`inline-block rounded-[16px_225px_16px_255px/255px_16px_225px_16px] border-[1.5px] border-ink px-s3 py-s1 text-[17px] font-medium ${destination.tilt} transition-transform hover:-rotate-0 hover:border-pen hover:text-pen`}
            >
              {destination.label}
              <span className="ml-2 font-bold text-pen">&rarr;</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
