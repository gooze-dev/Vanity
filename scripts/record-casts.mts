#!/usr/bin/env node
// Records the calc story (.claude/docs-example/calc.md) with asciinema into
// public/casts/. Every terminal sample on the site is copied from these
// recordings; see .claude/rules/tool-output.md.
//
// Needs asciinema, and gooze and goozels on PATH at the versions the docs
// describe (gooze must match DOCS_FACTS_VERSION in lib/version.ts).
//
//   npm run record:casts
import { mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync, writeFileSync, copyFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { calc, casts, docsVersions, onExit, recorder, startingTests, tuiRecorder } from "./record.mts"

const title = docsVersions()

mkdirSync(casts, { recursive: true })
process.chdir(calc)

// The story starts before the boundary tests exist: drop the two boundary
// cases from the table, keep the final test file in git.
const final = join(casts, ".calc_test.go.final")
copyFileSync("calc_test.go", final)
onExit(() => {
  renameSync(final, join(calc, "calc_test.go"))
  rmSync(join(calc, ".gooze-reports"), { recursive: true, force: true })
})
writeFileSync("calc_test.go", startingTests())

// Static samples record the plain output a reader sees in CI or a pipe
// (`| cat`): in a terminal, `--estimate` and `run` open an interactive view
// that waits for a key. *-tui casts record that view through tui, which plays
// the terminal and presses the keys.
const rec = recorder(title)
const tui = tuiRecorder(title)

rmSync(".gooze-reports", { recursive: true, force: true })
rec("calc-version", "gooze version | cat")
rec("calc-estimate", "gooze run --estimate ./... | cat")
await tui("calc-first-run-tui", "gooze run ./...", "wait:Test Results", "sleep:3", "q")
rmSync(".gooze-reports", { recursive: true, force: true })
rec("calc-first-run", "gooze run ./... | tail -n 1")
rec("calc-report-view", "gooze report view | cat")
rec("calc-survivors", "gooze report view | tail -n 4")
rec("calc-goozels-check", "goozels check calc.go | cat")
// Browse the mutations and open the first survivor's diff (5th in the list).
await tui("calc-report-view-all-tui", "gooze report view --all", "sleep:2", "j", "j", "j", "j", "sleep:1", " ", "sleep:4", "q")
// What Claude Code's PostToolUse hook gets after an edit of calc.go.
const payload = JSON.stringify({
  session_id: "docs",
  hook_event_name: "PostToolUse",
  tool_name: "Edit",
  tool_input: { file_path: join(calc, "calc.go") },
  cwd: calc,
})
rec("calc-hook-claude", `echo '${payload}' | goozels hook claude | cat`)

copyFileSync(final, "calc_test.go")
rec("calc-fixed-run", "gooze run ./... | tail -n 1")
rec("calc-fixed-report-view", "gooze report view | cat")
rec("calc-fixed-score", "gooze report view | tail -n 1")
rec("calc-cached-run", "gooze run ./... | tail -n 1")
rec("calc-cached-estimate", "gooze run --estimate ./... | cat")

// Errors and first-time setup, in an empty directory.
const empty = mkdtempSync(join(tmpdir(), "tmp."))
process.chdir(empty)
rec("config-init", "gooze config init | cat; gooze config init 2>&1 | cat")
rec("config-init-file", "cat gooze.yaml")
rec("report-view-no-reports", "gooze report view 2>&1 | cat")
process.chdir(calc)
rec("run-invalid-parallel", "gooze run --parallel 0 ./... 2>&1 | cat")
rmSync(empty, { recursive: true, force: true })

console.log(`recorded: ${readdirSync(casts).filter((f) => f.endsWith(".cast")).length} casts in public/casts`)
