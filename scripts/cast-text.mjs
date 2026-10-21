#!/usr/bin/env node
// Prints the plain text a recording shows: the output events of an asciicast
// v2 file with ANSI escape codes removed. Works without a terminal, unlike
// `asciinema cat`. Copy samples for CodeBlock from here; see
// .claude/rules/tool-output.md.
//
//   node scripts/cast-text.mjs public/casts/calc-report-view.cast
import { readFileSync } from "node:fs"

const file = process.argv[2]
if (!file) {
  console.error("usage: node scripts/cast-text.mjs FILE.cast")
  process.exit(2)
}

const [, ...events] = readFileSync(file, "utf8").trimEnd().split("\n")
const raw = events
  .map((line) => JSON.parse(line))
  .filter(([, type]) => type === "o")
  .map(([, , data]) => data)
  .join("")

const text = raw
  // OSC sequences (window title, colour queries), then CSI and other escapes.
  .replace(/\x1b\][^\x07\x1b]*(\x07|\x1b\\)/g, "")
  .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "")
  .replace(/\x1b[@-_]/g, "")
  .replace(/\r\n/g, "\n")
  .replace(/\r/g, "")
  .replace(/[ \t]+$/gm, "")

process.stdout.write(text.endsWith("\n") ? text : text + "\n")
