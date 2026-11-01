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
