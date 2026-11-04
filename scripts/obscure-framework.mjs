// Renames the framework's runtime names in the built site (data-astro-*
// attributes, astro:* events, astro-<hash> transition names, the astro CSS
// layer and keyframes) to gz equivalents, so pages don't advertise the
// framework. Every HTML, JS and CSS file goes through the same rules, so the
// names still match each other: the client router and our own page scripts
// keep working. Fails if any lowercase "astro" is left, so a framework update
// that adds a new form is caught at build time.
import { readdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

const outDir = process.argv[2] ?? "out"

const rules = [
  [/data-astro-/g, "data-gz-"],
  [/\bastro([A-Z])/g, "gz$1"], // dataset.astroExec, astroFadeIn, ...
  [/\bastro:/g, "gz:"],
  [/\bastro-/g, "gz-"],
  [/@layer astro\b/g, "@layer gz"],
  [/\[(if )?astro\]/g, "[$1gz]"], // log prefix and server island markers
]

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* files(path)
    else if (/\.(html|js|css)$/.test(entry.name)) yield path
  }
}

let changed = 0
const left = []
for await (const path of files(outDir)) {
  const text = await readFile(path, "utf8")
  const next = rules.reduce((s, [re, to]) => s.replace(re, to), text)
  if (next !== text) {
    await writeFile(path, next)
    changed++
  }
  const rest = next.match(/[\w.@:-]{0,20}\bastro\b[\w:-]{0,20}/g)
  if (rest) left.push(`${path}: ${[...new Set(rest)].join(", ")}`)
}

if (left.length) {
  console.error(`obscure-framework: "astro" still in ${left.length} file(s):\n${left.slice(0, 10).join("\n")}`)
  process.exit(1)
}
console.log(`obscure-framework: renamed framework names in ${changed} file(s)`)
