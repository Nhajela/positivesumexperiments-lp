import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// OG image in the system palette (warm paper / print ink / cobalt pen).
// Full styling with the real mark waits on Naman's pen assets
// (docs/future-changes.md).

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
        backgroundColor: "#f7f6f1",
        color: "#1a1917",
        fontSize: 72,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        textAlign: "center",
        padding: 80,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span>positive</span>
        <span style={{ color: "#1d3fe8", fontSize: 80 }}>+</span>
        <span>sum experiments</span>
      </div>
    </div>,
    size,
  );
}
