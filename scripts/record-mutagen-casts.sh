#!/usr/bin/env bash
# Records the samples of the mutagens: the bitwise, increment and assignment
# mutagens on a small package, the mutagens that run only when selected, and
# the error for an unknown name. Same style as record-casts.sh; see
# .claude/rules/tool-output.md.
#
# Each sample that shows an exit code ends with `echo "exit code $?"`, so the
# recording shows the code gooze returned.
#
# Needs asciinema and a gooze with the bitwise mutagen first on PATH:
#
#   scripts/record-mutagen-casts.sh
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
casts="$root/public/casts"
# Short, neutral paths: report files and errors print them.
work=/tmp/perm

if ! gooze run --help | grep -q -- 'bitwise'; then
  echo "gooze on PATH ($(gooze version)) has no bitwise mutagen" >&2
  exit 1
fi
title="$(gooze version)"

rec() { # rec NAME COMMAND
  asciinema rec -q --overwrite -i 1 -t "$1 ($title)" -c "bash -c '$2'" "$casts/$1.cast"
}

cleanup() { rm -rf "$work" /tmp/calc; }
trap cleanup EXIT
mkdir -p "$casts"

# --- perm: one function for each default mutagen added to calc's six ------
rm -rf "$work"
mkdir -p "$work"
cd "$work"
cat >go.mod <<'GO'
module example.com/perm

go 1.25
GO
cat >perm.go <<'GO'
// Package perm works with Unix permission bits.
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
GO
cat >perm_test.go <<'GO'
package perm

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
GO

rec perm-source 'cat perm.go'
rec perm-run 'gooze run ./... | tail -n 1'
rec perm-view 'gooze report view | cat'

# --- The mutagens you select, on calc ---------------------------------------
rm -rf /tmp/calc
cp -r "$root/examples/calc" /tmp/calc
cd /tmp/calc
rec calc-opt-in-mutagens 'gooze run --mutagens branch,statement,loop ./... | tail -n 2'
rec run-unknown-mutagen 'gooze run --mutagens conditional ./... 2>&1 | tail -n 1; echo "exit code ${PIPESTATUS[0]}"'

echo "recorded the mutagen casts with $title"
