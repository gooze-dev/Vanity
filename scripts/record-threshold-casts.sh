#!/usr/bin/env bash
# Records the samples of quality gates (--threshold-*, threshold.* in
# gooze.yaml) and gooze's exit codes. Same style as record-casts.sh; see
# .claude/rules/tool-output.md.
#
# Each sample that shows an exit code ends with `echo "exit code $?"`, so the
# recording shows the code gooze returned.
#
# Needs asciinema, git, and a gooze with --threshold-total first on PATH:
#
#   scripts/record-threshold-casts.sh
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
casts="$root/public/casts"
# A short, neutral path: report files and errors print it.
work=/tmp/calc

if ! gooze run --help | grep -q -- '--threshold-total'; then
  echo "gooze on PATH ($(gooze version)) has no --threshold-total" >&2
  exit 1
fi
title="$(gooze version)"

# Stable commits, so the merge base in the output is the same on every run.
export GIT_AUTHOR_NAME=docs GIT_AUTHOR_EMAIL=docs@example.com
export GIT_COMMITTER_NAME=docs GIT_COMMITTER_EMAIL=docs@example.com
export GIT_AUTHOR_DATE=2026-10-21T12:00:00Z GIT_COMMITTER_DATE=2026-10-21T12:00:00Z

rec() { # rec NAME COMMAND
  asciinema rec -q --overwrite -i 1 -t "$1 ($title)" -c "bash -c '$2'" "$casts/$1.cast"
}

# calc as the story starts: the two boundary tests aren't there yet, so the
# score is 84.62%.
fresh_calc() {
  rm -rf "$work"
  cp -r "$root/examples/calc" "$work"
  grep -v 'bound is inside' "$root/examples/calc/calc_test.go" >"$work/calc_test.go"
}

cleanup() { rm -rf "$work"; }
trap cleanup EXIT
mkdir -p "$casts"

# --- Thresholds on the calc story at 84.62% -------------------------------
# Two shards, then the merge that checks the thresholds on all the results.
fresh_calc
cd "$work"
gooze run -s 1/2 --threshold-total 90 ./... >/dev/null
rec calc-threshold-shard 'gooze run -s 0/2 --threshold-total 90 ./... | tail -n 2; echo "exit code ${PIPESTATUS[0]}"'
rec calc-threshold-merge 'gooze report merge --threshold-total 90 2>&1 | cat; echo "exit code ${PIPESTATUS[0]}"'

rec calc-threshold-total 'gooze run --threshold-total 90 ./... 2>&1 | tail -n 2; echo "exit code ${PIPESTATUS[0]}"'
rec calc-threshold-met 'gooze run --threshold-total 80 ./... | tail -n 1; echo "exit code ${PIPESTATUS[0]}"'
rec calc-threshold-file 'gooze report view --threshold-file 90 2>&1 | tail -n 2; echo "exit code ${PIPESTATUS[0]}"'
rec calc-threshold-max-survivors 'gooze report view --threshold-max-survivors 1 2>&1 | tail -n 2; echo "exit code ${PIPESTATUS[0]}"'
rec threshold-out-of-range 'gooze run --threshold-total 101 ./... 2>&1 | cat; echo "exit code ${PIPESTATUS[0]}"'

# --- Diff thresholds: main at 84.62%, a branch adds the boundary tests ----
fresh_calc
cd "$work"
printf '.gooze-reports/\n.gooze.log\n' >.gitignore
cat >gooze.yaml <<'EOF'
threshold:
  total: 80
  diff:
    total: 100
EOF
git init -q -b main
git add -A
git commit -qm "calc: InRange and its first tests"
gooze run ./... >/dev/null
git switch -qc boundary-tests
cp "$root/examples/calc/calc_test.go" calc_test.go
git commit -qam "calc: test both bounds of InRange"

rec calc-threshold-config 'cat gooze.yaml'
rec calc-threshold-diff 'gooze run --diff main ./... | tail -n 2; echo "exit code ${PIPESTATUS[0]}"'

# --- Exit codes of other errors -------------------------------------------
rec exit-code-usage 'gooze run --run "(" ./... 2>&1 | tail -n 1; echo "exit code ${PIPESTATUS[0]}"'
rec exit-code-git 'gooze run --diff no-such-branch ./... 2>&1 | tail -n 1; echo "exit code ${PIPESTATUS[0]}"'
rec exit-code-no-reports 'gooze report view -o missing 2>&1 | cat; echo "exit code ${PIPESTATUS[0]}"'

echo "recorded the threshold casts with $title"
