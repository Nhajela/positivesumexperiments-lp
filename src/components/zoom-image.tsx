"use client";

import { useCallback, useEffect, useState } from "react";

// Every content image gets this behavior (wired via mdx-components):
// subtle zoom on hover, click opens a paper overlay, click again toggles
// closer zoom, backdrop/Esc/× closes. Works the same on touch — tap to
// open, tap image to zoom, tap backdrop to close.
export function ZoomImage({ src, alt }: { src?: string | Blob; alt?: string }) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setZoomed(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // lock page scroll behind the overlay
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const url = typeof src === "string" ? src : undefined;
  if (!url) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="my-s4 block w-full cursor-zoom-in border-0 bg-transparent p-0"
        aria-label={alt ? `Enlarge image: ${alt}` : "Enlarge image"}
      >
        {/* biome-ignore lint/performance/noImgElement: plain img keeps pages static; hand-drawn diagrams need no optimization pipeline */}
        <img
          src={url}
          alt={alt ?? ""}
          className="h-auto max-w-full mix-blend-multiply transition-transform duration-300 ease-out hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
        />
      </button>

      {open && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: Escape handled via document listener
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt ?? "Image"}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto bg-paper/95 backdrop-blur-[2px]"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="fixed top-4 right-4 z-[101] flex h-11 w-11 items-center justify-center text-ink hover:text-pen"
          >
            <svg viewBox="0 0 100 100" className="h-6 w-6" aria-hidden="true">
              <path
                d="M18 20 C40 38, 62 62, 83 81"
                fill="none"
                stroke="currentColor"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path
                d="M81 19 C60 40, 39 61, 19 82"
                fill="none"
                stroke="currentColor"
                strokeWidth="9"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: zoom toggle is a pointer affordance; keyboard users get the full-size view already */}
          {/* biome-ignore lint/performance/noImgElement: plain img keeps pages static; the overlay shows the original file */}
          <img
            src={url}
            alt={alt ?? ""}
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
            className={`max-h-[88vh] max-w-[92vw] object-contain mix-blend-multiply transition-transform duration-300 ease-out motion-reduce:transition-none ${
              zoomed
                ? "scale-[1.8] cursor-zoom-out"
                : "scale-100 cursor-zoom-in"
            }`}
          />
        </div>
      )}
    </>
  );
}
