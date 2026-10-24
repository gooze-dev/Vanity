#!/usr/bin/env node
// Records the samples of report view's output formats (--format github,
// --format sarif, --format gitlab, --format codeclimate). Same style as
// record-casts.mts; see .claude/rules/tool-output.md.
//
// Needs asciinema, git, and a gooze with report view --format first on PATH:
//
//   npm run record:format-casts
import { mkdirSync, rmSync } from "node:fs"
import { calcRepo, casts, freshCalc, onExit, recorder, requireGooze, run, stableGit } from "./record.mts"

// A short, neutral path: report files and errors print it.
const work = "/tmp/calc"

requireGooze(["report", "view", "--help"], "--format", "report view --format")
const title = run("gooze", "version")
stableGit()
const rec = recorder(title, { bash: true })

onExit(() => rmSync(work, { recursive: true, force: true }))
mkdirSync(casts, { recursive: true })

// --- calc at 84.62%, in a git repository ----------------------------------
// The two boundary tests aren't there yet, so both bound checks survive.
freshCalc(work)
process.chdir(work)
calcRepo()

rec("calc-report-view-github", "gooze report view --format github | cat")
rec("calc-report-view-sarif", "gooze report view --format sarif | cat")
rec("calc-report-view-sarif-gate", 'gooze report view --format sarif --threshold-total 90 >gooze.sarif; echo "exit code $?"; ls gooze.sarif')
rec("calc-report-view-gitlab", "gooze report view --format gitlab | cat")
rec("calc-report-view-codeclimate", 'gooze report view --format codeclimate --threshold-total 90 >gl-code-quality-report.json; echo "exit code $?"; head -n 5 gl-code-quality-report.json')

console.log(`recorded the format casts with ${title}`)
