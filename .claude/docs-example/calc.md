# The `calc` story

The running example for the docs (see "Tell it as a story" in `../rules/writing.md`). Every
output below is real: gooze v1.2.0 and goozels v0.2.0 on Go 1.27.3, 2026-10-21. The code lives in
`examples/calc/`, and `scripts/record-casts.sh` records every step below into `public/casts/`
(`calc-*.cast`); copy outputs from there instead of writing them by hand. If gooze output changes, rerun the steps and update
this file and the pages that quote it.

## Code

`calc/calc.go` (the bound checks are on lines 10 and 13):

```go
// Package calc has small helpers for numeric input.
package calc

// InRange reports whether n is inside the range [lo, hi].
//
// Both bounds are inclusive: InRange(0, 0, 10) and
// InRange(10, 0, 10) are true, InRange(11, 0, 10) is false.
// It expects lo <= hi.
func InRange(n, lo, hi int) bool {
	if n < lo {
		return false
	}
	if n > hi {
		return false
	}
	return true
}
```

`calc/calc_test.go` before: the tests never try a value exactly on a bound.

```go
package calc

import "testing"

func TestInRange(t *testing.T) {
	tests := []struct {
		n, lo, hi int
		want      bool
	}{
		{5, 0, 10, true},
		{-3, 0, 10, false},
		{42, 0, 10, false},
	}
	for _, tt := range tests {
		if got := InRange(tt.n, tt.lo, tt.hi); got != tt.want {
			t.Errorf("InRange(%d, %d, %d) = %v, want %v", tt.n, tt.lo, tt.hi, got, tt.want)
		}
	}
}
```

The fix: two boundary cases, added to the table.

```go
		{0, 0, 10, true},  // lower bound is inside
		{10, 0, 10, true}, // upper bound is inside
```

## 1. Preview: `gooze run --estimate ./...`

```text
 PATH          │ MUTATIONS 
───────────────┼───────────
 calc.go       │    13     
───────────────┼───────────
 TOTAL FILES 1 │    13     
```

## 2. First run: `gooze run ./...` (last line)

```text
Mutation score: 84.62% (11 killed, 2 survived; 0 cached, 13 tested)
```

## 3. Read it: `gooze report view`

```text
 PATH          │ MUTATIONS │ KILLED │ SURVIVED │ NOT COVERED │  SCORE 
───────────────┼───────────┼────────┼──────────┼─────────────┼────────
 calc.go       │        13 │     11 │        2 │           0 │ 84.62% 
───────────────┼───────────┼────────┼──────────┼─────────────┼────────
 TOTAL FILES 1 │        13 │     11 │        2 │           0 │ 84.62% 

Survivors (2):
calc.go:10: survived (comparison): if n < lo { -> if n <= lo {
calc.go:13: survived (comparison): if n > hi { -> if n >= hi {

Mutation score: 84.62% (11 killed, 2 survived)
```

Same state in the editor or an agent hook: `goozels check calc.go` (also for `calc_test.go`):

```text
calc.go:1:1: warning: gooze: score 84.62% — 11 killed, 2 survived
calc.go:10:2: warning: gooze: surviving comparison mutant — tests still pass with `if n < lo {` → `if n <= lo {`
calc.go:13:2: warning: gooze: surviving comparison mutant — tests still pass with `if n > hi {` → `if n >= hi {`
```

Why they survive: no test calls `InRange` with `n` equal to `lo` or `hi`, so `<` and `<=`
(and `>` and `>=`) give the same answers for every input the tests use.

## 4. Kill the survivors: add the boundary tests, run again

```text
Mutation score: 100.00% (13 killed, 0 survived; 0 cached, 13 tested)
```

```text
 PATH          │ MUTATIONS │ KILLED │ SURVIVED │ NOT COVERED │   SCORE 
───────────────┼───────────┼────────┼──────────┼─────────────┼─────────
 calc.go       │        13 │     13 │        0 │           0 │ 100.00% 
───────────────┼───────────┼────────┼──────────┼─────────────┼─────────
 TOTAL FILES 1 │        13 │     13 │        0 │           0 │ 100.00% 

No survivors.

Mutation score: 100.00% (13 killed, 0 survived)
```

## 5. Run again without changes: everything is cached

```text
Mutation score: 100.00% (13 killed, 0 survived; 13 cached, 0 tested)
```

```text
 PATH          │ MUTATIONS │   CACHE   
───────────────┼───────────┼───────────
 calc.go       │    13     │ cached    
───────────────┼───────────┼───────────
 TOTAL FILES 1 │    13     │ 13 CACHED 

13 of 13 mutations are in cached files and will not be re-tested; use --no-cache to re-test everything.
```

## Notes

- The 13 mutations are 10 `comparison` and 3 `boolean`. For other operators (arithmetic,
  numbers, logical, unary) use a second small example and say so.
- Avoid a `Clamp`-style function for this story: there `if n < lo { return lo }` mutated to
  `n <= lo` is an equivalent mutant (same result when `n == lo`) and no test can kill it.

## Unreleased: diff mode, `--run`, `--mutagens`

`scripts/record-unreleased-casts.sh` records these from a pre-release gooze build (the cast
titles name its version) in `/tmp/calc`. Re-record them with the release build and move them
into `record-casts.sh` when the features ship.

- Diff mode (`calc-diff-*`, `diff-*`): a git repo whose `main` has the starting tests and a
  full run as the baseline (84.62%); the branch `boundary-tests` adds the two boundary tests.
  `gooze run --diff main` tests all 13 mutations (the test file changed) and scores
  `100.00% (13 killed, 0 survived; 0 cached, 13 tested; changed lines since main)` into
  `.gooze-reports/run/`; the main reports stay at 84.62% until `gooze report merge`.
- One function at a time (`calc-func-*`): calc grows a second function below `InRange`
  (lines 10 and 13 don't move), whose test kills all 10 of its mutants (8 arithmetic,
  2 numbers):

```go
// Percent returns part as a whole percentage of total, rounded down.
// It expects total > 0.
func Percent(part, total int) int {
	return part * 100 / total
}
```

  A full run is `91.30% (21 killed, 2 survived; 0 cached, 23 tested)`. With the lower bound case
  added, `gooze run --run '^InRange$'` is `92.31% (12 killed, 1 survived; 0 cached, 13 tested;
  functions matching ^InRange$)`; with both, 100%. After `gooze report merge`, `calc.go` is
  partial (13 results, because the test file changed) until the next full run (23 tested, 100%).
