---
paths:
  - "app/**"
  - "components/**"
  - ".claude/docs-example/**"
  - "public/casts/**"
---

# Tool output: record it, never invent it

Every piece of tool output on the site is real: terminal samples in `CodeBlock`, report tables,
score lines, `--estimate` previews, goozels diagnostics, hook output, CI log lines, error
messages. Readers copy these and compare them with their own terminal, so a made-up line is a
bug.

## Never

- Write output by hand, "illustrate" it, or adjust numbers, paths, line numbers or wording.
- Combine lines from different runs into one sample, or reuse output from an older gooze version.
- Show output for a command you didn't run. If you can't run it (it needs registry credentials
  or only runs in CI), describe the result in words, or copy the real log from that run.

## Record with asciinema

Record the real command with [asciinema](https://docs.asciinema.org/) at the versions the docs
describe (`DOCS_FACTS_VERSION` in `lib/version.ts` for gooze; the goozels and plugin versions
named on the page). Use the running example from `.claude/docs-example/calc.md` unless the page
needs something it can't show.

`scripts/record-casts.sh` records every sample of the calc story and the error and setup
outputs into `public/casts/` (it checks that `gooze version` matches `DOCS_FACTS_VERSION` first).
Add new samples to that script instead of recording by hand, so one command re-records them all:

```bash
scripts/record-casts.sh                       # static samples, works headless
RECORD_TUI=1 scripts/record-casts.sh          # also the TUI, from a real terminal
node scripts/cast-text.mjs public/casts/calc-report-view.cast   # the text to copy
```

Each sample is one `rec NAME "COMMAND"` line, which runs
`asciinema rec -q --overwrite -i 1 -t "NAME (versions)" -c "COMMAND"`.

- Static samples pipe through `| cat`: in a terminal, `gooze run` and `--estimate` open an
  interactive view that waits for a key. Only `*-tui` casts record the TUI, and they need a real
  terminal (the TUI queries it at startup), so record them with `RECORD_TUI=1` yourself.
- `-i 1` caps idle pauses at one second; `-t` records the versions in the file.
- Record from a clean state (`rm -rf .gooze-reports` when the step expects a first run) so the
  output matches the story step.
- Keep `.cast` files in `public/casts/`, named `<example>-<step>.cast`, and commit them. They are
  the proof behind every sample and the source for re-recording.
- Record in a short, neutral directory. If a recording shows a long or private absolute path,
  record again from a better path instead of editing the output.

## Show it on the page

- **Tutorial steps** (the Quick start): show each step's output with `TerminalCast`
  (`components/terminal-cast.tsx`) playing its recording, under the command's `CodeBlock`.
  The player sizes itself to the recorded lines.
- **Static output** (`CodeBlock lang="text"`, everywhere else): copy the text from
  `node scripts/cast-text.mjs` (or `asciinema cat` in a terminal). You may strip
  ANSI color codes and trailing spaces, and show a contiguous excerpt (for example the last
  lines) with `...` on its own line where lines were left out. Never change a character inside a
  line. Use the non-TTY form of a command (plain output, as in CI) when that's what the reader
  will see.
- **Interactive output** (the TUI, progress bars, anything that changes over time): embed the
  `.cast` with `TerminalCast`, which wraps
  [asciinema-player](https://docs.asciinema.org/manual/player/). Don't use GIFs or
  screenshots of terminals. Set `poster` so the page shows a meaningful frame before playback,
  and keep `idleTimeLimit` short.
- Next to an important player, also show the key lines as static text, so they stay searchable
  and readable without JavaScript.
- Real output keeps characters the writing rules ban in prose (goozels prints `—`).

## Keep it current

- When `DOCS_FACTS_VERSION` or a goozels/plugin version on the site changes, re-record every cast
  that the change can affect, update the quoted text and `.claude/docs-example/calc.md`, and
  check that the explanations around each sample still match (numbers, line numbers).
- If a re-recording differs from the page, the recording wins: fix the page.
