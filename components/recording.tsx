import { readFileSync } from "node:fs"
import path from "node:path"

import { TerminalCast } from "@/components/terminal-cast"

// Plain text and line count of an asciicast v2 recording (output events,
// escape codes removed). Same logic as scripts/cast-text.mjs.
function castText(cast: string) {
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

function readCast(name: string) {
  return readFileSync(path.join(process.cwd(), "public", "casts", `${name}.cast`), "utf8")
}

// The text of public/casts/<name>.cast, read at build time. For places that
// style output themselves (the landing page terminal) instead of playing it.
export function recordingText(name: string) {
  return castText(readCast(name))
}

// Real tool output on a page: plays public/casts/<name>.cast (recorded by
// scripts/record-casts.sh) and puts its text in the HTML for search engines,
// readers without JavaScript and find-in-page. Pages never copy output by
// hand; see .claude/rules/tool-output.md.
export function Recording({
  name,
  title,
  tui = false,
}: {
  /** Cast name in public/casts, without .cast. */
  name: string
  /** What the recording shows, for screen readers. */
  title: string
  /** Full-screen TUI recording: keep the recorded terminal size. */
  tui?: boolean
}) {
  const cast = readCast(name)
  const header = JSON.parse(cast.slice(0, cast.indexOf("\n"))) as { height: number }
  const text = castText(cast)
  const rows = tui ? header.height : Math.min(header.height, Math.max(2, text.split("\n").length + 1))

  return (
    <TerminalCast src={`/casts/${name}.cast`} title={title} rows={rows} poster={tui ? "npt:0:2" : "npt:0:10"}>
      {tui ? null : text}
    </TerminalCast>
  )
}
