import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH?.trim() || "";

const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  // Never publish source maps (scripts/strip-source-maps.mjs also removes
  // the prebuilt polyfill map Next copies into out/).
  productionBrowserSourceMaps: false,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
