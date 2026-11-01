import { readFileSync } from "node:fs"
import path from "node:path"

// Plain text and line count of an asciicast v2 recording (output events,
// escape codes removed). Same logic as scripts/cast-text.mjs.
export function castText(cast: string) {
  const raw = cast
    .split("\n")
    .slice(1)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as [number, string, string])
    .filter(([, type]) => type === "o")
    .map(([, , data]) => data)
    .join("")
  return raw
    .replace(/\x1b\][^\x07\x1b]*(\x07|\x1b\\)/g, "")
    .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "")
    .replace(/\x1b[@-_]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/^\n+|\n+$/g, "")
}

export function readCast(name: string) {
  return readFileSync(path.join(process.cwd(), "public", "casts", `${name}.cast`), "utf8")
}

// The text of public/casts/<name>.cast, read at build time.
export function recordingText(name: string) {
  return castText(readCast(name))
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function span(className: string, text: string) {
  return `<span class="${className}">${escapeHtml(text)}</span>`
}

// Colours only what the brand gives meaning: the survivors heading, the original
// code, the mutation and the score. It adds spans and never changes a character.
function colourLine(line: string) {
  if (/^Survivors \(\d+\):$/.test(line)) return span("t-surv", line)
  const survivor = line.match(/^(.* survived \([^)]*\): )(.*)( -> )(.*)$/)
  if (survivor) {
    const [, where, original, arrow, mutant] = survivor
    return `${escapeHtml(where)}${span("t-orig", original)}${escapeHtml(arrow)}${span("t-mut", mutant)}`
  }
  const score = line.match(/^(Mutation score: )(\d+(?:\.\d+)?%)(.*)$/)
  if (score) return `${escapeHtml(score[1])}${span("t-score", score[2])}${escapeHtml(score[3])}`
  return escapeHtml(line)
}

// A row of a report table, drawn with box characters.
const isTableLine = (line: string) => /[│┼]/.test(line)

// Returns HTML for a .gz-term body: one <span class="ln"> per output line, so the
// window can reflow it on phones. Report tables keep their columns in one block
// that scrolls by itself. The newlines stay, for copying and for search engines.
export function terminalHtml(text: string) {
  const lines = text.split("\n")
  const parts: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (!isTableLine(lines[i])) {
      parts.push(`<span class="ln">${colourLine(lines[i])}\n</span>`)
      continue
    }
    const table: string[] = []
    while (i < lines.length && isTableLine(lines[i])) table.push(escapeHtml(lines[i++]))
    i--
    parts.push(`<span class="gz-term__table gz-scroll-fade" tabindex="0">${table.join("\n")}\n</span>`)
  }
  return parts.join("")
}

// The working directory shown in a window's title bar. The calc story is the only
// one recorded in a named project; other samples show no title.
export function recordingDir(name: string) {
  return name.startsWith("calc-") ? "~/calc" : undefined
}

// The parts of a report line like
// "calc.go:10: survived (comparison): if n < lo { -> if n <= lo {".
export function survivorLine(line: string) {
  const match = line.match(/^(\S+): survived \(([^)]*)\): (.*) -> (.*)$/)
  if (!match) return undefined
  const [, where, mutagen, original, mutated] = match
  return { where, mutagen, original, mutated }
}
