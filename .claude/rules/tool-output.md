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

`npm run record:casts` (`scripts/record-casts.mts`) records every sample of the calc story and
the error and setup outputs into `public/casts/` (it checks that `gooze version` matches
`DOCS_FACTS_VERSION` first). Add new samples to that script instead of recording by hand, so one
command re-records them all:

```bash
npm run record:casts                          # every sample, the TUI too, works headless
node scripts/cast-text.mjs public/casts/calc-report-view.cast   # the text to copy
```

Each sample is one `rec("NAME", "COMMAND")` line, which runs
`asciinema rec -q --overwrite -i 1 -t "NAME (versions)" -c "COMMAND"`.

- Static samples pipe through `| cat`: in a terminal, `gooze run` and `--estimate` open an
  interactive view that waits for a key. Only `*-tui` casts record the TUI.
- `-i 1` caps idle pauses at one second; `-t` records the versions in the file.
- Record from a clean state (`rm -rf .gooze-reports` when the step expects a first run) so the
  output matches the story step.
- Keep `.cast` files in `public/casts/`, named `<example>-<step>.cast`, and commit them. They are
  the proof behind every sample and the source for re-recording.
- Record in a short, neutral directory. If a recording shows a long or private absolute path,
  record again from a better path instead of editing the output.

## Show it on the page

- Every tool output on a page is `<Recording name="…" title="…" />`
  (`components/recording.tsx`). It reads `public/casts/<name>.cast` at build time, plays it
  with asciinema-player (sized to the output), and puts the recorded text in the HTML for search
  engines, find-in-page and readers without JavaScript. Never paste output into a `CodeBlock`.
- Record one cast per sample. If a page shows only part of an output (the score line, the last
  lines of a report), record exactly that command (`| tail -n 1`, `| tail -n 4`) instead of
  cutting text.
- Full-screen TUI recordings use `<Recording … tui />` and are recorded with `tui` lines in the
  script (`tuiRecorder` in `scripts/record.mts` plays the terminal and presses the keys).
- The landing page keeps its own styled terminal (no player there). Its text comes from
  `recordingText(name)`, never typed.
- Recordings keep a clear gap from the text and code blocks around them (`TerminalCast` has
  `my-6`); don't remove it or squeeze a recording against a code block.
- Real output keeps characters the writing rules ban in prose (goozels prints `—`).

## Keep it current

- When `DOCS_FACTS_VERSION` or a goozels/plugin version on the site changes, re-record every cast
  that the change can affect, update the quoted text and `.claude/docs-example/calc.md`, and
  check that the explanations around each sample still match (numbers, line numbers).
- If a re-recording differs from the page, the recording wins: fix the page.
