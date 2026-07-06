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

// Placeholder structure only — the real home page gets designed after the
// moodboard phase, and all copy is Naman's to write.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-12 px-6 py-24">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from our own config
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">{site.name}</h1>
        <p className="text-lg opacity-70">
          [Placeholder — one-line framing of the umbrella, in Naman&apos;s
          words.]
        </p>
      </header>

      <nav className="space-y-2">
        <Link href="/manifesto" className="block underline underline-offset-4">
          Manifesto
        </Link>
        <Link
          href="/what-we-know"
          className="block underline underline-offset-4"
        >
          What we know
        </Link>
      </nav>

      <section className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-widest opacity-50">
          Experiments
        </h2>
        <p className="opacity-70">
          [Placeholder — Happy Mornings Club, and whatever runs next.]
        </p>
      </section>
    </main>
  );
}
