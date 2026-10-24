#!/usr/bin/env node
// Records the samples of narrowed runs: git diff mode (--diff), --run,
// --mutagens, the run/ directory they write to, and gooze report merge folding
// it in. Same style as record-casts.mts; see .claude/rules/tool-output.md.
//
// Needs asciinema, git, and a gooze and goozels with --run, --mutagens and
// --diff first on PATH:
//
//   npm run record:narrowed-casts
import { appendFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import {
  boundaryBranch,
  calc,
  calcRepo,
  casts,
  fail,
  freshCalc,
  isExecutable,
  onExit,
  quiet,
  recorder,
  requireGooze,
  run,
  stableGit,
  which,
} from "./record.mts"

// A short, neutral path: report files and errors print it.
const work = "/tmp/calc"

requireGooze(["run", "--help"], "--mutagens", "--run/--mutagens")
const goozeVersion = run("gooze", "version")
const goozelsVersion = run("goozels", "version")
const goozeBinDir = dirname(which("gooze") ?? fail("gooze is not on PATH"))
if (isExecutable(join(goozeBinDir, "git"))) {
  fail(`${goozeBinDir} contains git; diff-no-git needs a directory without it`)
}
const title = goozeVersion.replace(/ \((go[0-9.]*)\)$/, `, ${goozelsVersion}, $1`)
stableGit()
const rec = recorder(title)

// Adds one boundary case of examples/calc/calc_test.go back, after the line
// that holds AFTER.
function addCase(after: string, testCase: string) {
  const add = readFileSync(join(calc, "calc_test.go"), "utf8")
    .split("\n")
    .filter((line) => line.includes(testCase))
    .join("\n")
  const lines = readFileSync("calc_test.go", "utf8").replace(/\n$/, "").split("\n")
  writeFileSync("calc_test.go", lines.flatMap((line) => (line.includes(after) ? [line, add] : [line])).join("\n") + "\n")
}

onExit(() => rmSync(work, { recursive: true, force: true }))
mkdirSync(casts, { recursive: true })

// --- Git diff mode (app/docs/usage/diff-mode) ---------------------------
// main: calc.go and the starting tests, with a full run as the baseline.
// Branch boundary-tests: adds the two boundary tests.
freshCalc(work)
process.chdir(work)
calcRepo()
boundaryBranch()

rec("calc-diff-estimate", "gooze run --estimate --diff main ./... | cat")
rec("calc-diff-run", "gooze run --diff main ./... | tail -n 2")
rec("calc-diff-run-view", "gooze report view -o .gooze-reports/run | cat")
rec("calc-diff-main-view", "gooze report view | tail -n 1")
rec("calc-diff-merge", "gooze report merge | cat")
rec("calc-diff-merged-view", "gooze report view | tail -n 1")
quiet("git", "switch", "-q", "main")
rec("calc-diff-no-changes", "gooze run --diff main ./... | tail -n 2")

rec("diff-unknown-ref", "gooze run --diff no-such-branch ./... 2>&1 | cat")
// Only gooze's own directory on PATH, so git is not found.
rec("diff-no-git", `PATH='${goozeBinDir}' gooze run --diff main ./... 2>&1 | cat`)
rmSync(".git", { recursive: true, force: true })
rmSync(".gitignore", { force: true })
rec("diff-no-repo", "gooze run --diff main ./... 2>&1 | cat")

// --- One function at a time (app/docs/usage/single-function) ------------
// calc grows a second function, Percent, below InRange (lines 10 and 13
// don't move), with a test that kills all of its mutants.
freshCalc(work)
process.chdir(work)
appendFileSync(
  "calc.go",
  `
// Percent returns part as a whole percentage of total, rounded down.
// It expects total > 0.
func Percent(part, total int) int {
	return part * 100 / total
}
`,
)
appendFileSync(
  "calc_test.go",
  `
func TestPercent(t *testing.T) {
	if got := Percent(1, 4); got != 25 {
		t.Errorf("Percent(1, 4) = %d, want 25", got)
	}
	if got := Percent(3, 3); got != 100 {
		t.Errorf("Percent(3, 3) = %d, want 100", got)
	}
}
`,
)
if (run("gofmt", "-l", ".") !== "") fail("gofmt -l . lists files")

rec("calc-func-first-run", "gooze run ./... | tail -n 1")
rec("calc-func-report-view", "gooze report view | cat")
rec("calc-func-cached-run", "gooze run --run '^InRange$' ./... | tail -n 2")

addCase("{42, 0, 10, false},", "lower bound is inside")
rec("calc-func-estimate", "gooze run --estimate --run '^InRange$' ./... | cat")
rec("calc-func-run", "gooze run --run '^InRange$' ./... | tail -n 2")
rec("calc-func-run-view", "gooze report view -o .gooze-reports/run | cat")
rec("calc-func-main-view", "gooze report view | tail -n 1")
// The end of one report file in run/: the new line and scope fields.
rec("calc-func-run-report", `tail -n 4 "$(grep -l '^line: 10$' .gooze-reports/run/*.yaml | head -n 1)"`)

addCase("lower bound is inside", "upper bound is inside")
rec("calc-func-rerun", "gooze run --run '^InRange$' ./... | tail -n 2")
rec("calc-func-merge", "gooze report merge | cat")
rec("calc-func-merged-view", "gooze report view | cat")
// goozels after the merge: the summary says calc.go is partly tested.
rec("calc-func-goozels-check", "goozels check calc.go | cat")
rec("calc-func-full-run", "gooze run ./... | tail -n 1")
rec("calc-func-mutagens-estimate", "gooze run --estimate --mutagens arithmetic,numbers ./... | cat")

rec("run-invalid-pattern", "gooze run --run '(' ./... 2>&1 | cat")
rec("run-run-with-shard", "gooze run --run '^InRange$' -s 0/2 ./... 2>&1 | cat")

console.log(`recorded the narrowed-run casts with ${title}`)
