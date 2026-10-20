// Writes out/llms-full.txt: the full text of every docs page as Markdown, in
// the same order as out/llms.txt. Runs after `next build` and reads the
// exported HTML, so it always matches what is published.
//
// Plain .mjs with no dependencies on purpose: CI builds with Node 20, which
// can't import the TypeScript page registry directly.
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const OUT = "out"
const SITE_URL = "https://gooze.dev"

const entities = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
  mdash: "—",
  ndash: "–",
  hellip: "…",
}

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return String.fromCodePoint(n)
    }
    return entities[code.toLowerCase()] ?? match
  })
}

const stripTags = (html) => decode(html.replace(/<[^>]+>/g, ""))

function articleHtml(html) {
  const start = html.search(/<article[^>]*id="docs-content"/)
  if (start === -1) return null
  const end = html.indexOf("</article>", start)
  return html.slice(html.indexOf(">", start) + 1, end)
}

// Tables become Markdown tables with one line per row; cell contents (badges,
// notes) are flattened onto that line.
function tableToMarkdown(table) {
  const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) =>
    [...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) =>
      stripTags(cell[1].replace(/<\/span>\s*<div/gi, ":</span> <div").replace(/<\/(div|p|span)>/gi, " "))
        .replace(/\s+/g, " ")
        .replace(/\|/g, "\\|")
        .trim()
    )
  )
  if (rows.length === 0) return ""
  const line = (cells) => `| ${cells.join(" | ")} |`
  return `\n\n${[line(rows[0]), line(rows[0].map(() => "---")), ...rows.slice(1).map(line)].join("\n")}\n\n`
}

function toMarkdown(html) {
  let s = html
    .replace(/<(script|style|svg|button|template)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<table\b[\s\S]*?<\/table>/gi, tableToMarkdown)
    // Code blocks: one element per line, so start a new line at each one.
    .replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, body) => {
      const code = stripTags(body.replace(/<[^>]*data-slot="code-block-line"[^>]*>/g, "\n"))
        .replace(/^\n/, "")
        .replace(/\s+$/, "")
      return `\n\n\`\`\`\n${code}\n\`\`\`\n\n`
    })
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, body) => `\`${stripTags(body)}\``)
    .replace(/<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, body) => `\n\n${"#".repeat(Number(level))} ${stripTags(body).trim()}\n\n`)
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, body) => {
      const url = href.startsWith("/") ? `${SITE_URL}${href}` : href
      // Card links hold a title and a description in separate blocks.
      const card = /<(div|p)\b/i.test(body)
      const text = stripTags(body.replace(/<\/(div|p)>/gi, " \u2014 "))
        .replace(/\s+/g, " ")
        .replace(/( \u2014 ?)+$/, "")
        .trim()
      if (!text) return ""
      return card ? `\n- [${text}](${url})\n` : ` [${text}](${url})`
    })
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<(p|div|ul|ol|table|section)\b[^>]*>/gi, "\n\n")
    .replace(/<br\b[^>]*>/gi, "\n")

  s = stripTags(s)
  return s
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, "").replace(/ {2,}\[/g, " [").replace(/^ \[/, "[").replace(/\( \[/g, "(["))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

const index = readFileSync(join(OUT, "llms.txt"), "utf-8")
const urls = [...index.matchAll(/\]\((https:\/\/gooze\.dev\/docs[^)]*)\)/g)].map((m) => m[1])

const parts = [
  "# Gooze documentation (full text)",
  `> Every page of ${SITE_URL}/docs in reading order. Index with key facts: ${SITE_URL}/llms.txt`,
]

for (const url of urls) {
  const path = url.slice(SITE_URL.length).replace(/\/$/, "")
  const file = join(OUT, path, "index.html")
  if (!existsSync(file)) continue
  const article = articleHtml(readFileSync(file, "utf-8"))
  if (!article) continue
  parts.push(`---\n\nSource: ${url}\n\n${toMarkdown(article)}`)
}

writeFileSync(join(OUT, "llms-full.txt"), parts.join("\n\n") + "\n")
console.log(`llms-full.txt: ${urls.length} pages`)
