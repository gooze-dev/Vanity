#!/usr/bin/env bash
# Records the calc story (.claude/docs-example/calc.md) with asciinema into
# public/casts/. Every terminal sample on the site is copied from these
# recordings; see .claude/rules/tool-output.md.
#
# Needs asciinema, and gooze and goozels on PATH at the versions the docs
# describe (gooze must match DOCS_FACTS_VERSION in lib/version.ts).
#
#   scripts/record-casts.sh
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
calc="$root/examples/calc"
casts="$root/public/casts"
want="$(sed -n 's/^export const DOCS_FACTS_VERSION = "\(.*\)";$/\1/p' "$root/lib/version.ts")"

gooze_version="$(gooze version)"
case "$gooze_version" in
  "gooze $want "*) ;;
  *) echo "gooze on PATH is '$gooze_version', docs describe $want" >&2; exit 1 ;;
esac
goozels_version="$(goozels version)"
go_version="$(sed -n 's/.*(\(go[0-9.]*\)).*/\1/p' <<<"$gooze_version")"
title="gooze $want, $goozels_version, $go_version"

mkdir -p "$casts"
cd "$calc"

# The story starts before the boundary tests exist: drop the two boundary
# cases from the table, keep the final test file in git.
cp calc_test.go "$casts/.calc_test.go.final"
restore() { mv "$casts/.calc_test.go.final" "$calc/calc_test.go"; rm -rf "$calc/.gooze-reports"; }
trap restore EXIT
grep -v 'bound is inside' "$casts/.calc_test.go.final" >calc_test.go

# Static samples record the plain output a reader sees in CI or a pipe
# (`| cat`): in a terminal, `--estimate` and `run` open an interactive view
# that waits for a key. *-tui casts record that view through
# scripts/record-tui.py, which plays the terminal and presses the keys.
rec() { # rec NAME COMMAND
  asciinema rec -q --overwrite -i 1 -t "$1 ($title)" -c "$2" "$casts/$1.cast"
}

tui() { # tui NAME COMMAND KEYS... (interactive TUI, driven like a person)
  python3 -I "$root/scripts/record-tui.py" "$casts/$1.cast" "$1 ($title)" "$2" "${@:3}"
}

rm -rf .gooze-reports
rec calc-version "gooze version | cat"
rec calc-estimate "gooze run --estimate ./... | cat"
tui calc-first-run-tui "gooze run ./..." "wait:Test Results" "sleep:3" "q"
rm -rf .gooze-reports
rec calc-first-run "gooze run ./... | tail -n 1"
rec calc-report-view "gooze report view | cat"
rec calc-survivors "gooze report view | tail -n 4"
rec calc-goozels-check "goozels check calc.go | cat"
# Browse the mutations and open the first survivor's diff (5th in the list).
tui calc-report-view-all-tui "gooze report view --all" "sleep:2" j j j j "sleep:1" " " "sleep:4" q
# What Claude Code's PostToolUse hook gets after an edit of calc.go.
payload="{\"session_id\":\"docs\",\"hook_event_name\":\"PostToolUse\",\"tool_name\":\"Edit\",\"tool_input\":{\"file_path\":\"$calc/calc.go\"},\"cwd\":\"$calc\"}"
rec calc-hook-claude "echo '$payload' | goozels hook claude | cat"

cp "$casts/.calc_test.go.final" calc_test.go
rec calc-fixed-run "gooze run ./... | tail -n 1"
rec calc-fixed-report-view "gooze report view | cat"
rec calc-fixed-score "gooze report view | tail -n 1"
rec calc-cached-run "gooze run ./... | tail -n 1"
rec calc-cached-estimate "gooze run --estimate ./... | cat"

# Errors and first-time setup, in an empty directory.
empty="$(mktemp -d)"
cd "$empty"
rec config-init "gooze config init | cat; gooze config init 2>&1 | cat"
rec config-init-file "cat gooze.yaml"
rec report-view-no-reports "gooze report view 2>&1 | cat"
cd "$calc"
rec run-invalid-parallel "gooze run --parallel 0 ./... 2>&1 | cat"
rm -rf "$empty"

echo "recorded: $(ls "$casts"/*.cast | wc -l) casts in public/casts"
