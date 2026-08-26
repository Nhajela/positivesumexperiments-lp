import { OG_FONT } from "./fonts";

// The OG card, in the site's own visual language: warm paper, print ink, the
// cobalt pen, a hairline frame so it reads as a printed page rather than a
// social banner. One template for every route — the shape is always the same,
// only the slots change, so a link to any page looks like it came from here.
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
  redPen: "#c93b2e",
  greenMarker: "#1e8a4c",
  marigold: "#f0a81c",
} as const;

/** The status colours, matching src/components/status-badge.tsx. */
export const OG_STATUS_COLOR: Record<string, string> = {
  planned: COLOR.quiet,
  ongoing: COLOR.pen,
  paused: COLOR.marigold,
  concluded: COLOR.greenMarker,
  abandoned: COLOR.redPen,
};

export type OgCard = {
  /** Small mono line above the title — what kind of page this is. */
  eyebrow?: string;
  title: string;
  /** One or two lines under the title. Trimmed by the caller, not here. */
  description?: string;
  /** Top-right marker, for an experiment's status. */
  status?: { label: string; color: string };
  /** Footer right — dates, counts, tags. */
  meta?: string[];
  /** Prints the same warning the page itself carries. */
  placeholder?: boolean;
};

/**
 * Titles step down a size so they still fit the plate.
 *
 * The plate's text column is ~1028px. Young Serif averages close to half its
 * point size per character, so the buckets below are "how many lines will this
 * take" expressed as a length: one line at 76, two at 64, three at 52, four at
 * 44. Four lines of 44 is the tallest a title can get and still leave room for
 * the description, the placeholder mark and the footer.
 */
function titleSize(title: string): number {
  if (title.length > 100) return 44;
  if (title.length > 60) return 52;
  if (title.length > 30) return 64;
  return 76;
}

export function OgCardTemplate({ card }: { card: OgCard }) {
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
        {/* The head shrinks and clips before it will push the footer out of
            the frame — the wordmark leaving the plate is the one failure a
            social card cannot recover from. Sizing above should mean this
            never actually clips. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexShrink: 1,
            overflow: "hidden",
            paddingBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: OG_FONT.mono,
                fontSize: 21,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: COLOR.quiet,
              }}
            >
              {card.eyebrow ?? ""}
            </div>

            {card.status ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: OG_FONT.mono,
                  fontSize: 21,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: card.status.color,
                }}
              >
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 13,
                    marginRight: 11,
                    backgroundColor: card.status.color,
                  }}
                />
                {card.status.label}
              </div>
            ) : null}
          </div>

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

          {card.placeholder ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 24,
                paddingLeft: 16,
                borderLeft: `4px solid ${COLOR.redPen}`,
                fontFamily: OG_FONT.mono,
                fontSize: 20,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: COLOR.redPen,
              }}
            >
              This is a placeholder
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
