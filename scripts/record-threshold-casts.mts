#!/usr/bin/env node
// Records the samples of quality gates (--threshold-*, threshold.* in
// gooze.yaml) and gooze's exit codes. Same style as record-casts.mts; see
// .claude/rules/tool-output.md.
//
// Each sample that shows an exit code ends with `echo "exit code $?"`, so the
// recording shows the code gooze returned.
//
// Needs asciinema, git, and a gooze with --threshold-total first on PATH:
//
//   npm run record:threshold-casts
import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { boundaryBranch, calcRepo, casts, freshCalc, onExit, quiet, recorder, requireGooze, run, stableGit } from "./record.mts"

// A short, neutral path: report files and errors print it.
const work = "/tmp/calc"

requireGooze(["run", "--help"], "--threshold-total", "--threshold-total")
const title = run("gooze", "version")
stableGit()
const rec = recorder(title, { bash: true })

onExit(() => rmSync(work, { recursive: true, force: true }))
mkdirSync(casts, { recursive: true })

// --- Thresholds on the calc story at 84.62% -------------------------------
// Two shards, then the merge that checks the thresholds on all the results.
freshCalc(work)
process.chdir(work)
quiet("gooze", "run", "-s", "1/2", "--threshold-total", "90", "./...")
rec("calc-threshold-shard", 'gooze run -s 0/2 --threshold-total 90 ./... | tail -n 2; echo "exit code ${PIPESTATUS[0]}"')
rec("calc-threshold-merge", 'gooze report merge --threshold-total 90 2>&1 | cat; echo "exit code ${PIPESTATUS[0]}"')

rec("calc-threshold-total", 'gooze run --threshold-total 90 ./... 2>&1 | tail -n 2; echo "exit code ${PIPESTATUS[0]}"')
rec("calc-threshold-met", 'gooze run --threshold-total 80 ./... | tail -n 1; echo "exit code ${PIPESTATUS[0]}"')
rec("calc-threshold-file", 'gooze report view --threshold-file 90 2>&1 | tail -n 2; echo "exit code ${PIPESTATUS[0]}"')
rec("calc-threshold-max-survivors", 'gooze report view --threshold-max-survivors 1 2>&1 | tail -n 2; echo "exit code ${PIPESTATUS[0]}"')
// Fail fast, each on a fresh calc so nothing is cached.
freshCalc(work)
process.chdir(work)
rec("calc-fail-fast-gate", 'gooze run --fail-fast gate --threshold-total 90 ./... 2>&1 | tail -n 2; echo "exit code ${PIPESTATUS[0]}"')
freshCalc(work)
process.chdir(work)
rec("calc-fail-fast-first", 'gooze run --fail-fast first ./... 2>&1 | tail -n 2; echo "exit code ${PIPESTATUS[0]}"')
rec("threshold-out-of-range", 'gooze run --threshold-total 101 ./... 2>&1 | cat; echo "exit code ${PIPESTATUS[0]}"')

// --- Diff thresholds: main at 84.62%, a branch adds the boundary tests ----
freshCalc(work)
process.chdir(work)
writeFileSync(
  "gooze.yaml",
  `threshold:
  total: 80
  diff:
    total: 100
`,
)
calcRepo()
boundaryBranch()

rec("calc-threshold-config", "cat gooze.yaml")
rec("calc-threshold-diff", 'gooze run --diff main ./... | tail -n 2; echo "exit code ${PIPESTATUS[0]}"')

// --- Exit codes of other errors -------------------------------------------
rec("exit-code-usage", 'gooze run --run "(" ./... 2>&1 | tail -n 1; echo "exit code ${PIPESTATUS[0]}"')
rec("exit-code-git", 'gooze run --diff no-such-branch ./... 2>&1 | tail -n 1; echo "exit code ${PIPESTATUS[0]}"')
rec("exit-code-no-reports", 'gooze report view -o missing 2>&1 | cat; echo "exit code ${PIPESTATUS[0]}"')

console.log(`recorded the threshold casts with ${title}`)
