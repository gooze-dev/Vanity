#!/usr/bin/env bash
# Records the samples of narrowed runs: git diff mode (--diff), --run,
# --mutagens, the run/ directory they write to, and gooze report merge folding
# it in. Same style as record-casts.sh; see .claude/rules/tool-output.md.
#
# Needs asciinema, git, and a gooze and goozels with --run, --mutagens and
# --diff first on PATH:
#
#   scripts/record-narrowed-casts.sh
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
casts="$root/public/casts"
# A short, neutral path: report files and errors print it.
work=/tmp/calc

if ! gooze run --help | grep -q -- '--mutagens'; then
  echo "gooze on PATH ($(gooze version)) has no --run/--mutagens" >&2
  exit 1
fi
gooze_version="$(gooze version)"
goozels_version="$(goozels version)"
gooze_bin_dir="$(dirname "$(command -v gooze)")"
if [ -x "$gooze_bin_dir/git" ]; then
  echo "$gooze_bin_dir contains git; diff-no-git needs a directory without it" >&2
  exit 1
fi
title="$(sed 's/ (\(go[0-9.]*\))$/, '"$goozels_version"', \1/' <<<"$gooze_version")"

# Stable commits, so the merge base in the output is the same on every run.
export GIT_AUTHOR_NAME=docs GIT_AUTHOR_EMAIL=docs@example.com
export GIT_COMMITTER_NAME=docs GIT_COMMITTER_EMAIL=docs@example.com
export GIT_AUTHOR_DATE=2026-10-21T12:00:00Z GIT_COMMITTER_DATE=2026-10-21T12:00:00Z

rec() { # rec NAME COMMAND
  asciinema rec -q --overwrite -i 1 -t "$1 ($title)" -c "$2" "$casts/$1.cast"
}

# calc as the story starts: the two boundary tests aren't there yet.
fresh_calc() {
  rm -rf "$work"
  cp -r "$root/examples/calc" "$work"
  grep -v 'bound is inside' "$root/examples/calc/calc_test.go" >"$work/calc_test.go"
}

# Adds one boundary case of examples/calc/calc_test.go back, after the
# line that holds AFTER.
add_case() { # add_case AFTER CASE
  local line
  line="$(grep -F -- "$2" "$root/examples/calc/calc_test.go")"
  awk -v after="$1" -v add="$line" '{ print } index($0, after) { print add }' calc_test.go >calc_test.go.new
  mv calc_test.go.new calc_test.go
}

cleanup() { rm -rf "$work" "${empty:-}"; }
trap cleanup EXIT
mkdir -p "$casts"

# --- Git diff mode (app/docs/usage/diff-mode) ---------------------------
# main: calc.go and the starting tests, with a full run as the baseline.
# Branch boundary-tests: adds the two boundary tests.
fresh_calc
cd "$work"
printf '.gooze-reports/\n.gooze.log\n' >.gitignore
git init -q -b main
git add -A
git commit -qm "calc: InRange and its first tests"
gooze run ./... >/dev/null
git switch -qc boundary-tests
cp "$root/examples/calc/calc_test.go" calc_test.go
git commit -qam "calc: test both bounds of InRange"

rec calc-diff-estimate "gooze run --estimate --diff main ./... | cat"
rec calc-diff-run "gooze run --diff main ./... | tail -n 2"
rec calc-diff-run-view "gooze report view -o .gooze-reports/run | cat"
rec calc-diff-main-view "gooze report view | tail -n 1"
rec calc-diff-merge "gooze report merge | cat"
rec calc-diff-merged-view "gooze report view | tail -n 1"
git switch -q main
rec calc-diff-no-changes "gooze run --diff main ./... | tail -n 2"

rec diff-unknown-ref "gooze run --diff no-such-branch ./... 2>&1 | cat"
# Only gooze's own directory on PATH, so git is not found.
rec diff-no-git "PATH='$gooze_bin_dir' gooze run --diff main ./... 2>&1 | cat"
rm -rf .git .gitignore
rec diff-no-repo "gooze run --diff main ./... 2>&1 | cat"

# --- One function at a time (app/docs/usage/single-function) ------------
# calc grows a second function, Percent, below InRange (lines 10 and 13
# don't move), with a test that kills all of its mutants.
fresh_calc
cd "$work"
cat >>calc.go <<'EOF'

// Percent returns part as a whole percentage of total, rounded down.
// It expects total > 0.
func Percent(part, total int) int {
	return part * 100 / total
}
EOF
cat >>calc_test.go <<'EOF'

func TestPercent(t *testing.T) {
	if got := Percent(1, 4); got != 25 {
		t.Errorf("Percent(1, 4) = %d, want 25", got)
	}
	if got := Percent(3, 3); got != 100 {
		t.Errorf("Percent(3, 3) = %d, want 100", got)
	}
}
EOF
test -z "$(gofmt -l .)"

rec calc-func-first-run "gooze run ./... | tail -n 1"
rec calc-func-report-view "gooze report view | cat"
rec calc-func-cached-run "gooze run --run '^InRange\$' ./... | tail -n 2"

add_case "{42, 0, 10, false}," "lower bound is inside"
rec calc-func-estimate "gooze run --estimate --run '^InRange\$' ./... | cat"
rec calc-func-run "gooze run --run '^InRange\$' ./... | tail -n 2"
rec calc-func-run-view "gooze report view -o .gooze-reports/run | cat"
rec calc-func-main-view "gooze report view | tail -n 1"
# The end of one report file in run/: the new line and scope fields.
rec calc-func-run-report "tail -n 4 \"\$(grep -l '^line: 10\$' .gooze-reports/run/*.yaml | head -n 1)\""

add_case "lower bound is inside" "upper bound is inside"
rec calc-func-rerun "gooze run --run '^InRange\$' ./... | tail -n 2"
rec calc-func-merge "gooze report merge | cat"
rec calc-func-merged-view "gooze report view | cat"
# goozels after the merge: the summary says calc.go is partly tested.
rec calc-func-goozels-check "goozels check calc.go | cat"
rec calc-func-full-run "gooze run ./... | tail -n 1"
rec calc-func-mutagens-estimate "gooze run --estimate --mutagens arithmetic,numbers ./... | cat"

rec run-invalid-pattern "gooze run --run '(' ./... 2>&1 | cat"
rec run-unknown-mutagen "gooze run --mutagens conditional ./... 2>&1 | cat"
rec run-run-with-shard "gooze run --run '^InRange\$' -s 0/2 ./... 2>&1 | cat"

echo "recorded the narrowed-run casts with $title"
