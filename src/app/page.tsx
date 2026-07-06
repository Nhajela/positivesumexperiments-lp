import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

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

// Copy is Naman's, verbatim (writing/2026-07-06-landing-and-core.txt).
export default function Home() {
  return (
    <div className="pb-s5">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from our own config
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pt-s5 pb-s6">
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
        <Link
          href="/core"
          className="text-[17px] font-medium hover:text-pen w-fit"
        >
          <span className="mr-1.5 font-bold text-pen">+</span>Core
        </Link>
      </section>
    </div>
  );
}
