// Helpers shared by the record-*.mts scripts, which record the terminal
// samples on the site with asciinema into public/casts/; see
// .claude/rules/tool-output.md. Run them with a Node that strips types
// (22.18 or later), for example `npm run record:casts`.
import { execFileSync, spawnSync } from "node:child_process"
import { accessSync, constants, cpSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { delimiter, dirname, join } from "node:path"
import { spawn } from "node-pty"

export const root = dirname(import.meta.dirname)
export const casts = join(root, "public/casts")
export const calc = join(root, "examples/calc")

export function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

// Runs fn when the script exits, also on an error or Ctrl-C.
export function onExit(fn: () => void) {
  process.on("exit", fn)
  process.on("SIGINT", () => process.exit(130))
  process.on("SIGTERM", () => process.exit(143))
}

// Runs a program and returns what it prints, like $(...) in a shell. Throws if
// it fails.
export function run(file: string, ...args: string[]): string {
  return execFileSync(file, args, { encoding: "utf8", stdio: ["inherit", "pipe", "inherit"] }).replace(/\n+$/, "")
}

// Runs a program for its effect, with its output discarded (>/dev/null).
export function quiet(file: string, ...args: string[]) {
  execFileSync(file, args, { stdio: ["inherit", "ignore", "inherit"] })
}

// The full path of a program on PATH, like `command -v`.
export function which(name: string): string | undefined {
  for (const dir of (process.env.PATH ?? "").split(delimiter)) {
    if (isExecutable(join(dir, name))) return join(dir, name)
  }
}

export function isExecutable(path: string): boolean {
  try {
    accessSync(path, constants.X_OK)
    return true
  } catch {
    return false
  }
}

// Exits unless `gooze ARGS` prints TEXT: the gooze on PATH has the feature
// the casts show.
export function requireGooze(args: string[], text: string, missing: string) {
  if (!run("gooze", ...args).includes(text)) {
    fail(`gooze on PATH (${run("gooze", "version")}) has no ${missing}`)
  }
}

// Exits unless the gooze on PATH is DOCS_FACTS_VERSION in lib/version.ts, and
// returns the versions for the cast titles: "gooze v1.4.1, goozels v0.4.0,
// go1.27.3".
export function docsVersions(): string {
  const version = readFileSync(join(root, "lib/version.ts"), "utf8")
  const want = /^export const DOCS_FACTS_VERSION = "(.*)";$/m.exec(version)?.[1]
  const gooze = run("gooze", "version")
  if (!gooze.startsWith(`gooze ${want} `)) fail(`gooze on PATH is '${gooze}', docs describe ${want}`)
  const go = /\((go[0-9.]*)\)/.exec(gooze)?.[1] ?? ""
  return `gooze ${want}, ${run("goozels", "version")}, ${go}`
}

// Returns rec(NAME, COMMAND), which records COMMAND into public/casts/NAME.cast.
// With bash, COMMAND runs in bash (for ${PIPESTATUS[0]}) instead of sh.
export function recorder(title: string, { bash = false } = {}) {
  return (name: string, command: string) => {
    const { status } = spawnSync("asciinema", recArgs(name, title, bash ? `bash -c '${command}'` : command), {
      stdio: "inherit",
    })
    if (status !== 0) throw new Error(`asciinema rec ${name} exited with ${status}`)
  }
}

function recArgs(name: string, title: string, command: string) {
  return ["rec", "-q", "--overwrite", "-i", "1", "-t", `${name} (${title})`, "-c", command, join(casts, `${name}.cast`)]
}

const QUERY_BG = /\x1b\]11;\?(\x07|\x1b\\)/
const QUERY_POS = "\x1b[6n"
const ANSI = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(\x07|\x1b\\)/g

// Returns tui(NAME, COMMAND, KEYS...), which records an interactive gooze TUI
// headless. The TUI asks the terminal for its background colour and cursor
// position at startup and waits for keys, so this runs `asciinema rec` in a
// pseudo-terminal of a fixed size, answers those queries like a terminal
// would, and types the keys with pauses, as a person would. The recorded
// output is gooze's own.
//
// KEYS are sent in order. Each is either "wait:TEXT" (wait until TEXT appears
// on screen, up to 120s), "sleep:SECONDS", or keys to type ("q", "j", "\\r"
// for enter, "/" ...).
export function tuiRecorder(title: string) {
  return async (name: string, command: string, ...keys: string[]) => {
    const term = spawn("asciinema", recArgs(name, title, command), {
      name: "xterm-256color",
      cols: 100,
      rows: 30,
      cwd: process.cwd(),
      env: { ...process.env, TERM: "xterm-256color" },
    })
    let screen = ""
    let exited = false
    term.onData((data) => {
      if (QUERY_BG.test(data)) term.write("\x1b]11;rgb:1e1e/1e1e/1e1e\x1b\\")
      if (data.includes(QUERY_POS)) term.write("\x1b[1;1R")
      screen = (screen + data.replace(ANSI, "")).slice(-20000)
    })
    const exit = new Promise<number>((resolve) =>
      term.onExit(({ exitCode }) => {
        exited = true
        resolve(exitCode)
      }),
    )

    await sleep(1)
    for (const key of keys) {
      if (key.startsWith("wait:")) {
        const text = key.slice(5)
        const deadline = Date.now() + 120_000
        while (!screen.includes(text) && Date.now() < deadline && !exited) await sleep(0.2)
        if (!screen.includes(text)) throw new Error(`timed out waiting for '${text}'`)
        await sleep(1)
      } else if (key.startsWith("sleep:")) {
        await sleep(Number(key.slice(6)))
      } else {
        term.write(unescape(key))
        await sleep(0.8)
      }
    }

    // Let the program exit and asciinema write the file.
    const status = await exit
    if (status !== 0) throw new Error(`asciinema rec ${name} exited with ${status}`)
  }
}

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

const ESCAPES: Record<string, string> = { r: "\r", n: "\n", t: "\t", "\\": "\\" }

function unescape(key: string) {
  return key.replace(/\\(x[0-9a-fA-F]{2}|[rnt\\])/g, (_, c: string) =>
    c.length > 1 ? String.fromCharCode(parseInt(c.slice(1), 16)) : ESCAPES[c],
  )
}

// Fixed authors and dates, so commits and the merge base in the output are
// the same on every run.
export function stableGit() {
  Object.assign(process.env, {
    GIT_AUTHOR_NAME: "docs",
    GIT_AUTHOR_EMAIL: "docs@example.com",
    GIT_COMMITTER_NAME: "docs",
    GIT_COMMITTER_EMAIL: "docs@example.com",
    GIT_AUTHOR_DATE: "2026-10-21T12:00:00Z",
    GIT_COMMITTER_DATE: "2026-10-21T12:00:00Z",
  })
}

// examples/calc/calc_test.go as the story starts: without the two boundary
// cases.
export function startingTests(): string {
  return readFileSync(join(calc, "calc_test.go"), "utf8")
    .split("\n")
    .filter((line) => !line.includes("bound is inside"))
    .join("\n")
}

// A copy of calc at DIR as the story starts, so the score is 84.62%.
export function freshCalc(dir: string) {
  rmSync(dir, { recursive: true, force: true })
  cpSync(calc, dir, { recursive: true })
  writeFileSync(join(dir, "calc_test.go"), startingTests())
}

// Makes the current directory (a fresh calc) a git repository whose main has
// the starting tests, with a full run as the baseline.
export function calcRepo() {
  writeFileSync(".gitignore", ".gooze-reports/\n.gooze.log\n")
  quiet("git", "init", "-q", "-b", "main")
  quiet("git", "add", "-A")
  quiet("git", "commit", "-qm", "calc: InRange and its first tests")
  quiet("gooze", "run", "./...")
}

// Adds the branch boundary-tests, which adds the two boundary tests.
export function boundaryBranch() {
  quiet("git", "switch", "-qc", "boundary-tests")
  cpSync(join(calc, "calc_test.go"), "calc_test.go")
  quiet("git", "commit", "-qam", "calc: test both bounds of InRange")
}
