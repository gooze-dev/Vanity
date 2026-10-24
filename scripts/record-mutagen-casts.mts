#!/usr/bin/env node
// Records the samples of the mutagens: the bitwise, increment and assignment
// mutagens on a small package, the mutagens that run only when selected, and
// the error for an unknown name. Same style as record-casts.mts; see
// .claude/rules/tool-output.md.
//
// Each sample that shows an exit code ends with `echo "exit code $?"`, so the
// recording shows the code gooze returned.
//
// Needs asciinema and a gooze with the bitwise mutagen first on PATH:
//
//   npm run record:mutagen-casts
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { calc, casts, onExit, recorder, requireGooze, run } from "./record.mts"

// Short, neutral paths: report files and errors print them.
const work = "/tmp/perm"

requireGooze(["run", "--help"], "bitwise", "bitwise mutagen")
const title = run("gooze", "version")
const rec = recorder(title, { bash: true })

onExit(() => {
  rmSync(work, { recursive: true, force: true })
  rmSync("/tmp/calc", { recursive: true, force: true })
})
mkdirSync(casts, { recursive: true })

// --- perm: one function for each default mutagen added to calc's six ------
rmSync(work, { recursive: true, force: true })
mkdirSync(work, { recursive: true })
process.chdir(work)
writeFileSync(
  "go.mod",
  `module example.com/perm

go 1.25
`,
)
writeFileSync(
  "perm.go",
  `// Package perm works with Unix permission bits.
package perm

// Private clears the group and other bits of mode.
func Private(mode uint32) uint32 {
	return mode &^ 0o077
}

// Total sums the sizes of files, counting how many there are.
func Total(sizes []int) (total, count int) {
	for _, size := range sizes {
		total += size
		count++
	}
	return total, count
}
`,
)
writeFileSync(
  "perm_test.go",
  `package perm

import "testing"

func TestPrivate(t *testing.T) {
	if got := Private(0o755); got != 0o700 {
		t.Errorf("Private(0o755) = %o, want 700", got)
	}
}

func TestTotal(t *testing.T) {
	if total, _ := Total([]int{3, 4}); total != 7 {
		t.Errorf("total = %d, want 7", total)
	}
}
`,
)

rec("perm-source", "cat perm.go")
rec("perm-run", "gooze run ./... | tail -n 1")
rec("perm-view", "gooze report view | cat")

// --- The mutagens you select, on calc ---------------------------------------
rmSync("/tmp/calc", { recursive: true, force: true })
cpSync(calc, "/tmp/calc", { recursive: true })
process.chdir("/tmp/calc")
rec("calc-opt-in-mutagens", "gooze run --mutagens branch,statement,loop ./... | tail -n 2")
rec("run-unknown-mutagen", 'gooze run --mutagens conditional ./... 2>&1 | tail -n 1; echo "exit code ${PIPESTATUS[0]}"')

console.log(`recorded the mutagen casts with ${title}`)
