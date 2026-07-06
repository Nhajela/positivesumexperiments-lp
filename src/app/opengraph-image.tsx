import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Placeholder OG image — plain wordmark on a dark field. Gets restyled once
// the moodboard locks the brand's type and palette.

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        color: "#ededed",
        fontSize: 72,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        textAlign: "center",
        padding: 80,
      }}
    >
      {site.name}
    </div>,
    size,
  );
}
