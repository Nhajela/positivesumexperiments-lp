import { ImageResponse } from "next/og";
import { OG_FONT, ogFonts } from "./fonts";

// The OG card, in the site's own visual language: warm paper, print ink, the
// cobalt pen, a hairline frame so it reads as a printed page rather than a
// social banner. Every route's opengraph-image is a few lines on top of
// `ogImage(...)` — the shape is always the same, only the slots change, so a
// link to any page looks like it came from here.
//
// Written for Satori, which renders a subset of CSS: flexbox only (no grid),
// no cascade, and every element with more than one child needs an explicit
// `display: flex`. Hence the inline styles and the explicit flex everywhere.

/** Straight from globals.css — Satori has no access to the stylesheet. */
const COLOR = {
  paper: "#f7f6f1",
  ink: "#1a1917",
  quiet: "#8b8a83",
  rule: "#e2e1d9",
  pen: "#1d3fe8",
} as const;

/** 1200×630 — what Open Graph, X, Slack and iMessage all expect. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export type OgCard = {
  /** Small mono line above the title — what kind of page this is. */
  eyebrow?: string;
  title: string;
  /** One or two lines under the title. Keep it short; nothing trims it. */
  description?: string;
  /** Footer right — a date, an author. */
  meta?: string[];
};

// Titles step down a size so they still fit the plate. The text column is
// ~1028px and Young Serif averages close to half its point size per
// character: one line at 76, two at 64, three at 52, four at 44.
function titleSize(title: string): number {
  if (title.length > 100) return 44;
  if (title.length > 60) return 52;
  if (title.length > 30) return 64;
  return 76;
}

function Card({ card }: { card: OgCard }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLOR.paper,
        color: COLOR.ink,
        fontFamily: OG_FONT.sans,
        padding: 40,
      }}
    >
      {/* The printed plate: a hairline frame inset from the paper edge. */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: `2px solid ${COLOR.rule}`,
          borderRadius: 10,
          padding: 44,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexShrink: 1,
            overflow: "hidden",
            paddingBottom: 20,
          }}
        >
          {card.eyebrow ? (
            <div
              style={{
                display: "flex",
                marginBottom: 28,
                fontFamily: OG_FONT.mono,
                fontSize: 21,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: COLOR.quiet,
              }}
            >
              {card.eyebrow}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              fontFamily: OG_FONT.display,
              fontSize: titleSize(card.title),
              lineHeight: 1.13,
              letterSpacing: -1,
            }}
          >
            {card.title}
          </div>

          {card.description ? (
            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontSize: 25,
                lineHeight: 1.45,
                color: COLOR.quiet,
              }}
            >
              {card.description}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexShrink: 0,
            borderTop: `2px solid ${COLOR.rule}`,
            paddingTop: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: OG_FONT.display,
              fontSize: 27,
            }}
          >
            positive
            <span style={{ color: COLOR.pen, padding: "0 5px" }}>+</span>
            sum experiments
          </div>

          {card.meta && card.meta.length > 0 ? (
            <div
              style={{
                display: "flex",
                fontFamily: OG_FONT.mono,
                fontSize: 20,
                color: COLOR.quiet,
              }}
            >
              {card.meta.join("  ·  ")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export async function ogImage(card: OgCard): Promise<ImageResponse> {
  return new ImageResponse(<Card card={card} />, {
    ...OG_SIZE,
    fonts: await ogFonts(),
  });
}
