#!/usr/bin/env bash
# Records the samples of report view's output formats (--format github,
# --format sarif, --format gitlab). Same style as record-casts.sh; see
# .claude/rules/tool-output.md.
#
# Needs asciinema, git, and a gooze with report view --format first on PATH:
#
#   scripts/record-format-casts.sh
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
casts="$root/public/casts"
# A short, neutral path: report files and errors print it.
work=/tmp/calc

if ! gooze report view --help | grep -q -- '--format'; then
  echo "gooze on PATH ($(gooze version)) has no report view --format" >&2
  exit 1
fi
title="$(gooze version)"

export GIT_AUTHOR_NAME=docs GIT_AUTHOR_EMAIL=docs@example.com
export GIT_COMMITTER_NAME=docs GIT_COMMITTER_EMAIL=docs@example.com
export GIT_AUTHOR_DATE=2026-10-21T12:00:00Z GIT_COMMITTER_DATE=2026-10-21T12:00:00Z

rec() { # rec NAME COMMAND
  asciinema rec -q --overwrite -i 1 -t "$1 ($title)" -c "bash -c '$2'" "$casts/$1.cast"
}

cleanup() { rm -rf "$work"; }
trap cleanup EXIT
mkdir -p "$casts"

# --- calc at 84.62%, in a git repository ----------------------------------
# The two boundary tests aren't there yet, so both bound checks survive.
rm -rf "$work"
cp -r "$root/examples/calc" "$work"
grep -v 'bound is inside' "$root/examples/calc/calc_test.go" >"$work/calc_test.go"
cd "$work"
printf '.gooze-reports/\n.gooze.log\n' >.gitignore
git init -q -b main
git add -A
git commit -qm "calc: InRange and its first tests"
gooze run ./... >/dev/null

rec calc-report-view-github 'gooze report view --format github | cat'
rec calc-report-view-sarif 'gooze report view --format sarif | cat'
rec calc-report-view-sarif-gate 'gooze report view --format sarif --threshold-total 90 >gooze.sarif; echo "exit code $?"; ls gooze.sarif'
rec calc-report-view-gitlab 'gooze report view --format gitlab | cat'

echo "recorded the format casts with $title"
