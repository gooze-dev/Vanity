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

// Keys of the scope field of a report file (next release).
const scopeKeys = [
  { key: "base", from: "--diff", meaning: "The merge base commit the changed lines were taken against." },
  { key: "lines", from: "--diff", meaning: "The tested line ranges, as start and end lines (inclusive)." },
  { key: "run", from: "--run", meaning: "The pattern that selected the functions." },
  { key: "mutagens", from: "--mutagens", meaning: "The only mutagens the run generated." },
]

export default function ReportsPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Report format</h1>
      <p className="text-lg text-muted-foreground mb-8">
        You want to know what a run leaves on disk, for example to cache it in CI. Gooze writes
        reports after a run, and the reports are also used as a cache for incremental runs.
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
            {/* TODO(version): run/ arrives in the next gooze release. */}
            <li>
              After a run with <code>--diff</code>, <code>--run</code> or <code>--mutagens</code>{" "}
              (next Gooze release), a <code>run/</code> subdirectory (<code>run/shard_N/</code>{" "}
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

        {/* TODO(version): line and scope arrive in the next gooze release. */}
        <div id="fields">
          <h2>Line and scope fields</h2>
          <p>
            From the next Gooze release, a report file has two more fields at the end:
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
          </ul>
        </div>
      </div>
    </section>
  )
}
