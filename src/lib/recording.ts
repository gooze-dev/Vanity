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

// The text of public/casts/<name>.cast, read at build time. For places that
// style output themselves (the landing page terminal) instead of playing it.
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
// Returns HTML, for set:html in a .gz-term body.
export function terminalHtml(text: string) {
  return text
    .split("\n")
    .map((line) => {
      if (/^Survivors \(\d+\):$/.test(line)) return span("t-surv", line)
      const survivor = line.match(/^(.* survived \([^)]*\): )(.*)( -> )(.*)$/)
      if (survivor) {
        const [, where, original, arrow, mutant] = survivor
        return `${escapeHtml(where)}${span("t-orig", original)}${escapeHtml(arrow)}${span("t-mut", mutant)}`
      }
      const score = line.match(/^(Mutation score: )(\d+(?:\.\d+)?%)(.*)$/)
      if (score) return `${escapeHtml(score[1])}${span("t-score", score[2])}${escapeHtml(score[3])}`
      return escapeHtml(line)
    })
    .join("\n")
}

// The parts of a report line like
// "calc.go:10: survived (comparison): if n < lo { -> if n <= lo {".
export function survivorLine(line: string) {
  const match = line.match(/^(\S+): survived \(([^)]*)\): (.*) -> (.*)$/)
  if (!match) return undefined
  const [, where, mutagen, original, mutated] = match
  return { where, mutagen, original, mutated }
}
