// The design system's typefaces, as font data for the OG image renderer.
//
// Satori (behind `next/og`) cannot use webfonts or CSS — it needs the raw
// bytes of every face it will draw with, and it only reads ttf/otf/woff. So
// the four faces are vendored in `assets/fonts/` rather than pulled from
// Google at build time: the OG images then render identically offline, on a
// preview deploy, and in five years when a font URL has moved.
//
// `assets/` rather than `public/`: these are build inputs, not files anyone
// should be able to download from the site.

import { readFile } from "node:fs/promises";
import path from "node:path";

/** Font family names, matching the CSS variables in globals.css. */
export const OG_FONT = {
  display: "Young Serif",
  sans: "Instrument Sans",
  mono: "Spline Sans Mono",
} as const;

type LoadedFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600;
  style: "normal";
};

const FACES = [
  { file: "young-serif-400.ttf", name: OG_FONT.display, weight: 400 },
  { file: "instrument-sans-400.ttf", name: OG_FONT.sans, weight: 400 },
  { file: "instrument-sans-600.ttf", name: OG_FONT.sans, weight: 600 },
  { file: "spline-sans-mono-400.ttf", name: OG_FONT.mono, weight: 400 },
] as const;

async function load(): Promise<LoadedFont[]> {
  const dir = path.join(process.cwd(), "assets", "fonts");

  return Promise.all(
    FACES.map(async (face) => {
      const buffer = await readFile(path.join(dir, face.file));
      return {
        name: face.name,
        // Buffers from the file pool share their backing store, so slice out
        // this file's own bytes rather than handing over the whole pool.
        data: buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength,
        ) as ArrayBuffer,
        weight: face.weight,
        style: "normal" as const,
      };
    }),
  );
}

let cached: Promise<LoadedFont[]> | null = null;

/**
 * Read once per process. A build renders one OG image per route, and without
 * this each of them would re-read the same 236 KB from disk.
 */
export function ogFonts(): Promise<LoadedFont[]> {
  cached ??= load();
  return cached;
}
