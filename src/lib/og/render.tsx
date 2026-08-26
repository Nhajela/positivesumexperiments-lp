import { ImageResponse } from "next/og";
import { type OgCard, OgCardTemplate } from "./card";
import { ogFonts } from "./fonts";

// Every opengraph-image route in the app is three lines on top of this: build
// the card from the record, hand it here. Size, fonts and content type live in
// one place so the whole site's social previews stay identical in shape.

/** 1200×630 — what Open Graph, X, Slack and iMessage all expect. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export async function ogImageResponse(card: OgCard): Promise<ImageResponse> {
  return new ImageResponse(<OgCardTemplate card={card} />, {
    ...OG_SIZE,
    fonts: await ogFonts(),
  });
}
