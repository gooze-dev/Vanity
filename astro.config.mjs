import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"

// Project-site builds set BASE_PATH (see .github/workflows/pages.yml).
const basePath = process.env.BASE_PATH?.trim() || ""

// A fully static site: GitHub Pages serves out/ as files, so there is no adapter.
// Directory output keeps every URL the same as before, and out/ is what the scripts and the deploy workflow read.
export default defineConfig({
  site: "https://gooze.dev",
  ...(basePath ? { base: basePath } : {}),
  output: "static",
  outDir: "out",
  // Pages link with the slash and build as directories. GitHub Pages answers
  // /docs with a 301 to /docs/; "ignore" lets dev and preview resolve /docs too,
  // where "always" would answer 404.
  trailingSlash: "ignore",
  build: { format: "directory" },
  // Links load on hover, so a click swaps the page without waiting.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // Never publish source maps.
    build: { sourcemap: false },
  },
})
