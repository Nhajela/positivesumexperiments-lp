import type { Metadata } from "next";
import Link from "next/link";
import { paths } from "@/lib/content/paths";
import { getCounts } from "@/lib/content/queries";
import { seoForHome, toMetadata } from "@/lib/content/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = toMetadata(seoForHome());

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
  const counts = getCounts();

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

      <section className="mb-s6">
        {/* hand-ruled frames, same trick as the dialogue card — drawn buttons.
            Each sits at its own angle so the row reads as three things drawn
            by hand rather than one control repeated. */}
        <div className="flex flex-wrap gap-s2">
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

        {/* "Open" rather than "running": planned and paused experiments are
            still live questions, they just aren't in motion today. */}
        <p className="mt-s3 font-mono text-[13px] text-quiet">
          {counts.experiments > 0
            ? `${counts.experiments} ${counts.experiments === 1 ? "experiment" : "experiments"} across ${counts.hypotheses} ${counts.hypotheses === 1 ? "hypothesis" : "hypotheses"}, ${counts.live} still open.`
            : "No experiments yet."}
        </p>
      </section>
    </div>
  );
}
