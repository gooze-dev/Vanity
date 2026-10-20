// Deletes source maps from the static export. Next copies a prebuilt map for
// the legacy polyfill chunk into out/ even with productionBrowserSourceMaps
// off; no script references it (no sourceMappingURL), so removing it cannot
// break the site. Fails the build if a map is still referenced somewhere.
import { readdirSync, readFileSync, rmSync } from "node:fs"
import { join } from "node:path"

const OUT = "out"

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

const files = walk(OUT)
const maps = files.filter((file) => file.endsWith(".map"))

const referenced = files.filter(
  (file) => /\.(js|css|html)$/.test(file) && readFileSync(file, "utf-8").includes("sourceMappingURL=")
)
if (referenced.length > 0) {
  console.error(`strip-source-maps: maps are referenced by ${referenced.join(", ")}`)
  process.exit(1)
}

for (const map of maps) rmSync(map)
console.log(`strip-source-maps: removed ${maps.length} file(s)`)
