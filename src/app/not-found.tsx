import Link from "next/link";

// Simple 404 on the design system — mono status label, print-voice
// assertion, hand-framed button home. Renders inside the root layout,
// so header/footer chrome is already there.
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col justify-center py-s6">
      <p className="font-mono text-[13px] uppercase tracking-[0.15em] text-quiet">
        404
      </p>
      <h1 className="font-display text-display-xl mt-s2 max-w-[16ch]">
        There&apos;s nothing at this address.
      </h1>
      <div className="mt-s4">
        <Link
          href="/"
          className="inline-block rounded-[16px_225px_16px_255px/255px_16px_225px_16px] border-[1.5px] border-ink px-s3 py-s1 text-[17px] font-medium -rotate-[0.6deg] transition-transform hover:-rotate-0 hover:border-pen hover:text-pen"
        >
          Back home
          <span className="ml-2 font-bold text-pen">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
