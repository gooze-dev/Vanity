import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"

// Names every client asset by its hash alone (the client build otherwise keeps
// component and framework names such as ClientRouter.astro_astro_type_script).
// It runs last, after Astro sets its own names, and leaves the server build alone.
const hashOnlyAssetNames = {
  name: "hash-only-asset-names",
  apply: "build",
  enforce: "post",
  outputOptions(options) {
    const dir = String(options.dir ?? "")
    // The prerender build emits the page CSS; only its asset names change.
    if (dir.endsWith("/.prerender")) return { ...options, assetFileNames: "_gz/[hash][extname]" }
    if (!dir.endsWith("/out")) return
    return {
      ...options,
      entryFileNames: "_gz/[hash].js",
      chunkFileNames: "_gz/[hash].js",
      assetFileNames: "_gz/[hash][extname]",
    }
  },
}

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
  // Assets go to /_gz/ under hash-only names, so URLs don't name the framework
  // or the source components.
  build: { format: "directory", assets: "_gz" },
  // Links load on hover, so a click swaps the page without waiting.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss(), hashOnlyAssetNames],
    // Never publish source maps.
    build: {
      sourcemap: false,
    },
  },
})
