import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Recording } from "@/components/recording"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = docsMetadata("/docs/reports")

// Keys of the scope field of a report file.
const scopeKeys = [
  { key: "base", from: "--diff", meaning: "The merge base commit the changed lines were taken against." },
  { key: "lines", from: "--diff", meaning: "The tested line ranges, as start and end lines (inclusive)." },
  { key: "run", from: "--run", meaning: "The pattern that selected the functions." },
  { key: "mutagens", from: "--mutagens", meaning: "The only mutagens the run generated." },
]

// SARIF result fields written by gooze report view --format sarif.
const sarifFields = [
  { field: "ruleId", meaning: "gooze/survived, gooze/not-covered, gooze/timeout or gooze/skipped: the first of these that a mutant on the line has." },
  { field: "level", meaning: "warning when a mutant on the line survived, note otherwise." },
  { field: "message.text", meaning: "One sentence per mutant, such as Tests still pass with `if n < lo {` changed to `if n <= lo {`." },
  { field: "locations", meaning: "The file, relative to %SRCROOT% (the repository root), and the line." },
  { field: "partialFingerprints", meaning: "goozeMutationIds/v1: a hash of the line's sorted mutation IDs, so code scanning keeps the same alert across runs while the mutants stay the same." },
  { field: "properties", meaning: "mutationIds and mutagens of the mutants on the line." },
]

export default function ReportsPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Report format</h1>
      <p className="text-lg text-muted-foreground mb-8">
        You want to know what a run leaves on disk, for example to cache it in CI, or what{" "}
        <code>gooze report view</code> writes for GitHub. Gooze writes reports after a run, and the
        reports are also used as a cache for incremental runs.
      </p>

      <div>
        <div id="where">
          <h2>Where reports are stored</h2>
          <p>
            The default output directory is <code>.gooze-reports/</code>.
            You can change it with <code>-o/--output</code>.
          </p>
          <CodeBlock lang="bash" code="gooze run -o .gooze-reports ./..." />
        </div>

        <div id="files">
          <h2>What gets written</h2>
          <ul>
            <li>One YAML file per report, named by hash: <code>&lt;hash&gt;.yaml</code></li>
            <li>
              After a sharded run (<code>-s INDEX/TOTAL</code>), one{" "}
              <code>shard_INDEX/</code> subdirectory per shard until you merge
            </li>
            <li>
              After a run with <code>--diff</code>, <code>--run</code> or <code>--mutagens</code>,
              a <code>run/</code> subdirectory (<code>run/shard_N/</code>{" "}
              when sharded) with that run&apos;s reports and index, until{" "}
              <code>gooze report merge</code> folds it in. The main reports, the cache,{" "}
              <code>gooze report view</code> without <code>-o</code>, and goozels don&apos;t read
              subdirectories, so they ignore it. See{" "}
              <Link href="/docs/usage/single-function#run-dir">the run directory</Link>.
            </li>
            <li>
              A summary index file: <code>_index.yaml</code>. It
              includes a <code>not_covered_mutations</code> count, which is non-zero only when you
              use <code>--coverage-profile</code>.
            </li>
          </ul>
        </div>

        <div id="fields">
          <h2>Line and scope fields</h2>
          <p>
            A report file has two more fields at the end:
          </p>
          <ul>
            <li>
              <code>line</code>: the source line of the mutation. Every run writes it; reports
              from older versions don&apos;t have it.
            </li>
            <li>
              <code>scope</code>: only in reports of a narrowed run. It records what the run
              selected. A report without <code>scope</code> covers its file in full.
            </li>
          </ul>
          <p>
            The end of a report file in <code>.gooze-reports/run/</code> after{" "}
            <code>gooze run --run &apos;^InRange$&apos;</code> on <code>calc</code> (see{" "}
            <Link href="/docs/usage/single-function">One function at a time</Link>):
          </p>
          <Recording name="calc-func-run-report" title="Recorded last lines of a report file in .gooze-reports/run" />
          <div className="mt-3 rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scope key</TableHead>
                  <TableHead>Set by</TableHead>
                  <TableHead>Meaning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-muted-foreground">
                {scopeKeys.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell>
                      <code>{row.key}</code>
                    </TableCell>
                    <TableCell>
                      <code>{row.from}</code>
                    </TableCell>
                    <TableCell>{row.meaning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p>
            A key is present only when its flag was used. When{" "}
            <code>gooze report merge</code> folds a run into the main reports, a file that ends up
            complete loses its <code>scope</code>; a file that stays partial keeps it, and the
            next full <code>gooze run</code> re-tests it in full.
          </p>
        </div>

        <div id="formats">
          <h2>Output formats of gooze report view</h2>
          <p>
            The report files are for Gooze and your own tools. For GitHub,{" "}
            <Link href="/docs/cli/report#view-format"><code>gooze report view --format</code></Link>{" "}
            turns the same reports into two formats GitHub reads. Both list the mutations that
            count against the score (survived, not covered, timed out, skipped), grouped by line:
            several mutants on one line make one entry.
          </p>

          <div id="github">
            <h3>GitHub annotations (--format github)</h3>
            <p>
              One workflow command per line with survivors, before the usual summary:
            </p>
            <CodeBlock lang="text" code="::warning file=<path>,line=<line>,title=<title>::<message>" />
            <ul>
              <li>
                <code>warning</code> when a mutant on the line survived, <code>notice</code> when
                they were only not covered, timed out or skipped.
              </li>
              <li>
                <code>title</code> names the mutants and their mutagens:{" "}
                <code>Surviving mutant (comparison)</code>,{" "}
                <code>2 surviving mutants (comparison)</code>, or{" "}
                <code>3 mutants (arithmetic, comparison)</code> when their statuses differ.
              </li>
              <li>
                The message has one sentence per mutant, such as{" "}
                <code>{"Tests still pass with `if n < lo {` changed to `if n <= lo {`"}</code>.
              </li>
            </ul>
          </div>

          <div id="sarif">
            <h3>SARIF (--format sarif)</h3>
            <p>
              A SARIF 2.1.0 log instead of the summary, for{" "}
              <code>github/codeql-action/upload-sarif</code> and other SARIF tools. The tool is{" "}
              <code>gooze</code> with its version, and it has one rule per status. Without
              survivors, <code>results</code> is an empty list. The <code>calc</code> survivors
              give:
            </p>
            <Recording name="calc-report-view-sarif" title="Recorded gooze report view --format sarif on calc" />
            <p>Each result is one line with survivors:</p>
            <div className="mt-3 rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Meaning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-muted-foreground">
                  {sarifFields.map((row) => (
                    <TableRow key={row.field}>
                      <TableCell>
                        <code>{row.field}</code>
                      </TableCell>
                      <TableCell>{row.meaning}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div id="tasks">
          <h2>Working with reports</h2>
          <ul>
            <li>
              View them: <Link href="/docs/usage/results">Reading results</Link>
            </li>
            <li>
              Reuse them as a cache: <Link href="/docs/usage/incremental-runs">Incremental runs</Link>
            </li>
            <li>
              Combine shard directories: <Link href="/docs/ci/sharding">Sharding and merging</Link>
            </li>
            <li>
              Store them in a registry: <Link href="/docs/ci/sharing-reports">Sharing reports (OCI)</Link>
            </li>
            <li>
              Show survivors on pull requests and in code scanning:{" "}
              <Link href="/docs/ci/github#survivors">GitHub Actions</Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
