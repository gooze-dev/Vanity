import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { withCode } from "@/components/docs-faq"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = docsMetadata("/docs/cli/run")

type RunFlag = {
  flag: string
  alias?: string
  description: string
  defaultValue?: string
  configKey?: string
}

const runFlags: RunFlag[] = [
  {
    flag: "--estimate",
    description: "List source files, applicable mutation counts and cached files without running tests.",
    defaultValue: "false",
  },
  {
    flag: "--diff",
    description:
      "Mutate only lines changed against a git ref (`REF`: branch, tag, SHA, `HEAD~3`). Needs git on `PATH` and a git repository. `--diff=\"\"` turns a configured value off. Env: `GOOZE_RUN_DIFF`.",
    defaultValue: "empty (disabled)",
    configKey: "run.diff",
  },
  {
    flag: "--run",
    description:
      "Mutate only functions whose name matches this Go regular expression, like `go test -run` (`Name`, and `Type.Name` for methods; unanchored). Flag only. Not with `--shard`.",
    defaultValue: "empty (all functions)",
  },
  {
    flag: "--mutagens",
    description:
      "Generate only these mutagens: comma-separated or repeated, any case (`arithmetic`, `boolean`, `numbers`, `comparison`, `logical`, `unary`). Env: `GOOZE_RUN_MUTAGENS`.",
    defaultValue: "empty (all six)",
    configKey: "run.mutagens",
  },
  {
    flag: "--parallel",
    alias: "-p",
    description: "Number of parallel workers for mutation testing (at least `1`).",
    defaultValue: "1",
    configKey: "run.parallel",
  },
  {
    flag: "--shard",
    alias: "-s",
    description: "Shard index and total shard count in the format `INDEX/TOTAL` (for example `0/3`).",
  },
  {
    flag: "--mutation-timeout",
    description: "Timeout in seconds for testing one mutation (at least `1`); a mutation that exceeds it is reported as `timeout`.",
    defaultValue: "120",
    configKey: "run.mutation_timeout",
  },
  {
    flag: "--coverage-profile",
    description:
      "Path to a Go coverage profile; mutations on uncovered lines are reported as `not_covered` without running tests.",
    defaultValue: "empty (disabled)",
    configKey: "run.coverage_profile",
  },
  {
    flag: "--exclude",
    alias: "-x",
    description: "Exclude files matching a regex (can be repeated).",
    configKey: "paths.exclude",
  },
  {
    flag: "--output",
    alias: "-o",
    description: "Output directory for mutation testing reports.",
    defaultValue: ".gooze-reports",
    configKey: "output",
  },
  {
    flag: "--no-cache",
    description: "Disable cached incremental runs (re-test everything).",
    defaultValue: "false",
    configKey: "no-cache",
  },
  {
    flag: "--verbose",
    alias: "-v",
    description: "Enable verbose logging.",
    defaultValue: "false",
    configKey: "log.verbose",
  },
  {
    flag: "--log-output",
    description: "Path to the log output file.",
    defaultValue: ".gooze.log",
    configKey: "log.filename",
  },
]

export default function CliRunPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">gooze run</h1>
      <p className="text-lg text-muted-foreground mb-8">
        You want to know whether your tests catch real bugs, not only run the code.{" "}
        <code>gooze run</code> is the main command: it runs mutation testing and writes reports.
      </p>

      <div>
        <div id="usage">
          <h2>Usage</h2>
          <CodeBlock lang="bash" code="gooze run [global flags] [paths...]" />
          <p>
            With no paths, <code>run</code> defaults to{" "}
            <code>./...</code> (the current module,
            recursively), so <code>gooze run</code> is the
            same as <code>gooze run ./...</code>.
            Like <code>go list ./...</code>, scanning skips{" "}
            <code>vendor/</code>, <code>testdata/</code>, directories starting with{" "}
            <code>.</code> or <code>_</code>, and nested modules (directories with their own{" "}
            <code>go.mod</code>).
          </p>
        </div>

        <div id="flags">
          <h2>Flags</h2>
          <p>
            Every flag with a config key can also be set in <code>gooze.yaml</code> under that key, or
            through the matching <code>GOOZE_*</code> environment variable. Gooze reads{" "}
            <code>gooze.yaml</code> from the current directory; there is no{" "}
            <code>--config</code> flag. See <Link href="/docs/config">Configuration</Link> for precedence.
          </p>
          <ul className="space-y-3 lg:hidden">
            {runFlags.map((row) => (
              <li key={row.flag} className="rounded-lg border p-4 text-sm">
                <div className="flex flex-wrap items-center gap-1 font-mono">
                  <code>{row.flag}</code>
                  {row.alias && (
                    <>
                      <span className="text-muted-foreground">,</span>
                      <code>{row.alias}</code>
                    </>
                  )}
                </div>
                <p className="mt-2 text-muted-foreground">{withCode(row.description)}</p>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <dt>Default</dt>
                  <dd>{row.defaultValue ? <code>{row.defaultValue}</code> : "—"}</dd>
                  <dt>Config key</dt>
                  <dd>{row.configKey ? <code>{row.configKey}</code> : "—"}</dd>
                </dl>
              </li>
            ))}
          </ul>
          <div className="hidden rounded border lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flag</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Config key</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-muted-foreground">
                {runFlags.map((row) => (
                  <TableRow key={row.flag}>
                    <TableCell>
                      <code>{row.flag}</code>
                      {row.alias && (
                        <>
                          , <code>{row.alias}</code>
                        </>
                      )}
                    </TableCell>
                    <TableCell>{withCode(row.description)}</TableCell>
                    <TableCell>
                      {row.defaultValue ? <code>{row.defaultValue}</code> : "—"}
                    </TableCell>
                    <TableCell>
                      {row.configKey ? <code>{row.configKey}</code> : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div id="what">
          <h2>What it does (high level)</h2>
          <ol>
            <li>Generates mutations for a source file.</li>
            <li>Applies one mutation.</li>
            <li>
              Runs the tests of the package that owns the file (<code>go test -count=1 ./&lt;pkg&gt;</code>)
              to see if they fail. A mutant that does not compile is reported as{" "}
              <code>error</code>, not killed.
            </li>
            <li>Writes results into the reports directory.</li>
          </ol>
          <p>
            It ends with the mutation score of every result in scope, cached and tested, with a
            breakdown. The first run of the <code>calc</code> example tests all 13 mutations:
          </p>
          <Recording name="calc-first-run" title="Recorded last line of the first gooze run on calc" />
          <p>
            Run it again without changes (here after the boundary tests were added) and every
            result comes from the cache:
          </p>
          <Recording name="calc-cached-run" title="Recorded last line of a gooze run with nothing changed" />
          <p className="text-sm text-muted-foreground">
            With <code>--no-cache</code> it scores only what it tested; a sharded run scores its
            shard (<code>gooze report merge</code> gives the full score). A{" "}
            <a href="#narrowed">narrowed run</a> scores only its selection.
          </p>
        </div>

        <div id="estimate">
          <h2>Preview with --estimate</h2>
          <p>
            See which source files would be mutated and how many mutations apply, without
            running any tests. This is a safe first command.
          </p>
          <CodeBlock lang="bash" code="gooze run --estimate ./..." />
          <p className="mt-4 mb-2 text-muted-foreground">Scan only one sub-tree:</p>
          <CodeBlock lang="bash" code="gooze run --estimate ./internal/domain/..." />
          <p className="text-sm text-muted-foreground">
            In a TTY you get an interactive, filterable list; in CI you get a table with
            per-file mutation counts:
          </p>
          <Recording name="calc-estimate" title="Recorded gooze run --estimate before the first run" />
          <p className="text-sm text-muted-foreground">
            Files whose stored reports are still valid are marked in a <code>CACHE</code> column;
            they will not be re-tested:
          </p>
          <Recording name="calc-cached-estimate" title="Recorded gooze run --estimate with everything cached" />
        </div>

        <div id="diff">
          <h2>Changed lines only (--diff)</h2>
          <p>
            Mutate only the lines changed against a git ref:
          </p>
          <CodeBlock lang="bash" code="gooze run --diff origin/main ./..." />
          <ul>
            <li>
              Gooze diffs from <code>git merge-base REF HEAD</code> to the working tree: committed,
              staged and unstaged changes, plus untracked <code>.go</code> files git doesn&apos;t
              ignore. A changed <code>_test.go</code> puts the source file it tests in scope in full.
            </li>
            <li>
              It needs git on <code>PATH</code> and a git repository. Without either, or with an
              unknown ref or no merge base, the run exits <code>1</code>.
            </li>
            <li>
              Path arguments, <code>-x/--exclude</code>, <code>--shard</code>,{" "}
              <code>--coverage-profile</code> and <code>--estimate</code> work with it. The exit
              code doesn&apos;t change.
            </li>
            <li>
              It is a <a href="#narrowed">narrowed run</a>: its score covers the changed lines
              only, and its reports go to <code>.gooze-reports/run/</code>.
            </li>
          </ul>
          <p>
            Guide: <Link href="/docs/usage/diff-mode">Changed lines only (git diff mode)</Link>.
          </p>
        </div>

        <div id="run">
          <h2>Some functions only (--run)</h2>
          <p>
            Mutate only the functions whose name matches a Go regular expression:
          </p>
          <CodeBlock lang="bash" code="gooze run --run '^InRange$' ./..." />
          <ul>
            <li>
              Like <code>go test -run</code>, the pattern isn&apos;t anchored; write{" "}
              <code>^Name$</code> for an exact match. It is matched against the function each
              mutation is in: <code>Name</code>, and for a method also <code>Type.Name</code>{" "}
              (pointer, value and generic receivers; <code>Gen[T]</code> is matched as{" "}
              <code>Gen.Name</code>).
            </li>
            <li>
              Code in a closure belongs to its enclosing function. Package-level code matches no
              pattern.
            </li>
            <li>Each mutant still runs the full test suite of its package.</li>
            <li>
              Flag only, no config key. It works with <code>--estimate</code>, which then prints{" "}
              <code>Only functions matching REGEX.</code> first.
            </li>
            <li>
              With <code>--shard</code> it exits <code>1</code>:{" "}
              <code>--run can&apos;t be combined with --shard: a function-level run is small, so run it in one job</code>.
              A pattern that doesn&apos;t compile exits <code>1</code> with{" "}
              <code>invalid --run pattern ...</code>.
            </li>
          </ul>
          <Recording name="calc-func-run" title="Recorded last lines of gooze run --run '^InRange$'" />
          <p>
            Guide: <Link href="/docs/usage/single-function">One function at a time</Link>.
          </p>
        </div>

        <div id="mutagens">
          <h2>Some mutagens only (--mutagens)</h2>
          <p>
            Generate only the listed <Link href="/docs/mutations">mutagens</Link>. Names are case-insensitive, comma-separated or with the flag repeated:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze run --mutagens comparison,boolean ./...
gooze run --mutagens comparison --mutagens boolean ./...`}
          />
          <p>
            Valid names are the six mutagens Gooze runs. Any other name exits <code>1</code>:
          </p>
          <Recording name="run-unknown-mutagen" title="Recorded gooze run --mutagens with an unknown name" />
          <p>
            Also config key <code>run.mutagens</code> (a list; empty means all six) and{" "}
            <code>GOOZE_RUN_MUTAGENS</code>. A configured value narrows every run.
          </p>
        </div>

        <div id="narrowed">
          <h2>Narrowed runs and run/</h2>
          <p>
            A run with <code>--diff</code>, <code>--run</code> or <code>--mutagens</code> is a
            narrowed run:
          </p>
          <ul>
            <li>
              It writes its reports to a fresh <code>&lt;output&gt;/run/</code> (
              <code>run/shard_N</code> when sharded) and never changes the main reports.
            </li>
            <li>
              It uses the main reports as its cache: an unchanged file is skipped (
              <code>--no-cache</code> tests it anyway).
            </li>
            <li>
              Its score covers only the selection and names it at the end of the line, followed by
              where its reports are.
            </li>
            <li>
              <code>gooze report view -o .gooze-reports/run</code> shows its results;{" "}
              <Link href="/docs/cli/report#merge"><code>gooze report merge</code></Link> folds
              them into the main reports.
            </li>
          </ul>
          <Recording name="calc-diff-run" title="Recorded last lines of gooze run --diff main on the calc branch" />
          <p>
            Details: <Link href="/docs/usage/single-function#run-dir">the run directory</Link>.
          </p>
        </div>

        <div id="parallel">
          <h2>Parallel workers</h2>
          <p>
            Use several workers to test mutations in parallel:
          </p>
          <CodeBlock lang="bash" code="gooze run -p 4 ./..." />
          <p>
            This example runs up to 4 mutations at the same time. The value must be at least <code>1</code>:{" "}
            <code>run.parallel: 0</code> fails with{" "}
            <code>invalid run.parallel: 0 is out of range: must be at least 1</code>.
          </p>
        </div>

        <div id="timeout">
          <h2>Timeouts</h2>
          <p>
            The tests for each mutation must finish within{" "}
            <code>--mutation-timeout</code> seconds (default <code>120</code>). A mutation
            whose tests exceed it is reported as <code>timeout</code>. The timeout must be at
            least <code>1</code> second; <code>0</code> is an error, not &quot;no timeout&quot;.
          </p>
          <CodeBlock lang="bash" code="gooze run --mutation-timeout 300 ./..." />
          <p>
            You can also set it with <code>run.mutation_timeout</code> in{" "}
            <code>gooze.yaml</code> or <code>GOOZE_RUN_MUTATION_TIMEOUT</code>.
            If you see many unexpected timeouts, run verbose and inspect the logs:
          </p>
          <CodeBlock lang="bash" code="gooze run --verbose ./..." />
        </div>

        <div id="cache">
          <h2>Caching / incremental runs</h2>
          <p>
            Gooze can reuse stored reports if nothing changed
            (see <Link href="/docs/usage/incremental-runs">Incremental runs</Link>).
            To force a full re-run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>

        <div id="coverage-profile">
          <h2>Coverage profile (skip uncovered mutations)</h2>
          <p>
            Pass an existing Go coverage profile with{" "}
            <code>--coverage-profile</code> to skip
            mutations on lines your tests never execute. Gooze does not generate the profile;
            produce it first with <code>go test -coverprofile</code>.
          </p>
          <CodeBlock
            lang="bash"
            code={`# 1. Generate a coverage profile with the Go toolchain
go test -coverprofile=coverage.out ./...

# 2. Run gooze, skipping mutations on uncovered lines
gooze run --coverage-profile coverage.out ./...`}
          />
          <p>
            Before testing each mutation, Gooze checks whether the mutated line is covered by the
            profile. If the profile shows the line with a zero count, Gooze
            reports the mutation as{" "}
            <code>not_covered</code> and skips running its
            tests. Uncovered mutations can never be killed, so this is a large speed-up.
            Lines outside any profiled block (for example package-level{" "}
            <code>const</code>/<code>var</code> declarations) and files absent from the
            profile are tested normally.
          </p>
          <p>
            A <code>not_covered</code> mutation counts as a
            survivor in the mutation score (it lowers the score like{" "}
            <code>survived</code>) but is tallied
            separately. The default is empty, which disables the feature. You can also set it with{" "}
            <code>run.coverage_profile</code> in{" "}
            <code>gooze.yaml</code> or{" "}
            <code>GOOZE_RUN_COVERAGE_PROFILE</code>.
          </p>
        </div>

        <div id="shard">
          <h2>Sharding (CI)</h2>
          <p>
            Sharding splits the work across jobs
            (walkthrough: <Link href="/docs/ci/sharding">Sharding and merging</Link>).
            Example with 3 jobs:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze run -s 0/3 ./...
gooze run -s 1/3 ./...
gooze run -s 2/3 ./...`}
          />
          <p>
            After all jobs finish, merge reports:
          </p>
          <CodeBlock lang="bash" code="gooze report merge" />
          <p className="text-sm text-muted-foreground">
            The value must be <code>INDEX/TOTAL</code> with{" "}
            <code>0 &lt;= INDEX &lt; TOTAL</code>; anything else (for example{" "}
            <code>4/4</code> or <code>1/4abc</code>) is an error.
          </p>
        </div>

        <div id="next">
          <h2>Next</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/docs/usage/results">Reading results</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/cli/report#view"><code>gooze report view</code></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
