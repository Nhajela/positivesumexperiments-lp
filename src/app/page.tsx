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

const experiments = [
  {
    name: "Happy Mornings Club",
    sub: "[Placeholder — one line on the experiment, in Naman's words.]",
    state: "IDEATING",
    color: "bg-quiet",
    stateColor: "text-quiet",
  },
];

// Structure only — all reader-facing copy is Naman's to write (docs/ai-policy.md).
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
          [Placeholder — the one assertion this umbrella makes.]
        </h1>
        <p className="text-body-l max-w-[58ch] mt-s3 text-ink/80">
          [Placeholder — two sentences framing Positive Sum Experiments, in
          Naman&apos;s words.]
        </p>
      </section>

      <section className="mb-s6">
        <h2 className="font-mono text-[12px] uppercase tracking-[0.15em] text-quiet mb-s3">
          Experiments
        </h2>
        <div className="border-t-2 border-ink">
          {experiments.map((exp) => (
            <div
              key={exp.name}
              className="grid grid-cols-[18px_1fr_auto] items-baseline gap-s2 border-b border-rule py-s2"
            >
              <span
                className={`relative top-px h-[11px] w-[11px] rounded-[50%_46%_52%_48%] ${exp.color}`}
              />
              <div>
                <h3 className="font-display text-[20px]">{exp.name}</h3>
                <p className="mt-0.5 text-[14px] text-quiet">{exp.sub}</p>
              </div>
              <span
                className={`font-mono text-[12.5px] whitespace-nowrap ${exp.stateColor}`}
              >
                {exp.state}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-s5">
        <h2 className="font-mono text-[12px] uppercase tracking-[0.15em] text-quiet mb-s3">
          Read
        </h2>
        <div className="flex flex-col gap-s2 text-[17px] font-medium">
          <Link href="/manifesto" className="hover:text-pen w-fit">
            <span className="mr-1.5 font-bold text-pen">+</span>Manifesto — the
            guiding principles
          </Link>
          <Link href="/what-we-know" className="hover:text-pen w-fit">
            <span className="mr-1.5 font-bold text-pen">+</span>What we know —
            an ever-growing list
          </Link>
          <Link href="/ai" className="hover:text-pen w-fit">
            <span className="mr-1.5 font-bold text-pen">+</span>AI — how it is
            and isn&apos;t used here
          </Link>
        </div>
      </section>
    </div>
  );
}
