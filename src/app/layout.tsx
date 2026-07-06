import type { Metadata } from "next";
import {
  Instrument_Sans,
  Spline_Sans_Mono,
  Young_Serif,
} from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import { PlusDrawn } from "@/components/mark";
import { site } from "@/lib/site";
import "./globals.css";

// The decided type system (moodboards/01b-system.html): Young Serif is the
// print voice, Instrument Sans the body voice, Spline Sans Mono the
// typewriter, Akriti the pen (stand-in for Naman's real handwriting).
const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-young-serif",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-spline-mono",
});

const akriti = localFont({
  src: "../../public/fonts/akriti-regular.otf",
  variable: "--font-akriti",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
};

const navLinks = [
  { href: "/manifesto", label: "Manifesto" },
  { href: "/what-we-know", label: "What we know" },
  { href: "/ai", label: "AI" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${youngSerif.variable} ${instrumentSans.variable} ${splineMono.variable} ${akriti.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="mx-auto w-full max-w-[680px] px-6 pt-s4 pb-s5">
          <div className="flex flex-wrap items-baseline justify-between gap-s2">
            <Link
              href="/"
              className="font-display text-[22px] inline-flex items-center text-ink"
            >
              positive
              <PlusDrawn className="mx-[3px] inline-block h-[0.68em] w-[0.68em] -rotate-4 translate-y-[1px] text-pen" />
              sum experiments
            </Link>
            <nav className="flex gap-s3 text-[15px] font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-ink hover:text-pen"
                >
                  <span className="mr-1 font-bold text-pen">+</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[680px] flex-1 px-6">
          {children}
        </main>

        <footer className="mx-auto w-full max-w-[680px] px-6 pt-s6 pb-s4">
          <div className="flex flex-wrap justify-between gap-s2 border-t border-rule pt-s3 font-mono text-[13px] text-quiet">
            <span>
              positive<span className="text-pen">+</span>sum experiments
            </span>
            <span className="flex gap-s2">
              <a
                href="https://x.com/crazyxnaman"
                className="hover:text-pen"
                rel="me"
              >
                @crazyxnaman
              </a>
              <a href="mailto:hey@namanhajela.com" className="hover:text-pen">
                hey@namanhajela.com
              </a>
              <Link href="/ai" className="hover:text-pen">
                /ai
              </Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
