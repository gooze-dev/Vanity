import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
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
    description: "List source files and applicable mutation counts without running tests.",
    defaultValue: "false",
  },
  {
    flag: "--parallel",
    alias: "-p",
    description: "Number of parallel workers for mutation testing.",
    defaultValue: "1",
    configKey: "run.parallel",
  },
  {
    flag: "--shard",
    alias: "-s",
    description: "Shard index and total shard count in the format INDEX/TOTAL (for example 0/3).",
  },
  {
    flag: "--mutation-timeout",
    description: "Timeout in seconds for testing one mutation; a mutation that exceeds it is reported as timeout.",
    defaultValue: "120",
    configKey: "run.mutation_timeout",
  },
  {
    flag: "--coverage-profile",
    description:
      "Path to a Go coverage profile; mutations on uncovered lines are reported as not_covered without running tests.",
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
        Runs mutation testing and writes reports.
        This is the main command.
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
            Every flag can also be set in <code>gooze.yaml</code> under its config key, or
            through the matching <code>GOOZE_*</code> environment variable. Gooze reads{" "}
            <code>gooze.yaml</code> from the current directory; there is no{" "}
            <code>--config</code> flag. See <Link href="/docs/config">Configuration</Link> for precedence.
          </p>
          <ul className="space-y-3 md:hidden">
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
                <p className="mt-2 text-muted-foreground">{row.description}</p>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <dt>Default</dt>
                  <dd>{row.defaultValue ? <code>{row.defaultValue}</code> : "—"}</dd>
                  <dt>Config key</dt>
                  <dd>{row.configKey ? <code>{row.configKey}</code> : "—"}</dd>
                </dl>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto rounded border md:block">
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
                    <TableCell className="whitespace-nowrap">
                      <code>{row.flag}</code>
                      {row.alias && (
                        <>
                          , <code>{row.alias}</code>
                        </>
                      )}
                    </TableCell>
                    <TableCell className="min-w-64">{row.description}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {row.defaultValue ? <code>{row.defaultValue}</code> : "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
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
            per-file mutation counts.
          </p>
        </div>

        <div id="parallel">
          <h2>Parallel workers</h2>
          <p>
            Run faster by using multiple workers:
          </p>
          <CodeBlock lang="bash" code="gooze run -p 4 ./..." />
          <p>
            This example runs up to 4 mutations at the same time.
          </p>
        </div>

        <div id="timeout">
          <h2>Timeouts</h2>
          <p>
            The tests for each mutation must finish within{" "}
            <code>--mutation-timeout</code> seconds (default 120). A mutation
            whose tests exceed it is reported as <code>timeout</code>.
          </p>
          <CodeBlock lang="bash" code="gooze run --mutation-timeout 300 ./..." />
          <p>
            You can also set it via <code>run.mutation_timeout</code> in{" "}
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
            separately. The default is empty, which disables the feature. You can also set it via{" "}
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
              <Link href="/docs/cli/report#view">gooze report view</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
