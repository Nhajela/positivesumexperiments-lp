import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let .mdx files act as pages so /manifesto and /what-we-know can live as
  // plain markdown files that Naman edits directly.
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Pin the workspace root: a stray lockfile in the user home directory
  // otherwise makes Next infer the wrong root and warn on every build.
  turbopack: {
    root: __dirname,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
