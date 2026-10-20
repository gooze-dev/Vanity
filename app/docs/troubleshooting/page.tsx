import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/troubleshooting")

export default function TroubleshootingPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Troubleshooting</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Common problems and simple things to try.
      </p>

      <div>
        <div id="everything-killed">
          <h2>“Everything is killed” (or killed looks suspicious)</h2>
          <p>
            <strong>Killed</strong> means the tests of the package that owns the mutated file failed for that mutation
            (<code>go test -count=1</code> on that package).
            A mutant that does not compile is reported as <strong>error</strong>, not killed.
            Sometimes a kill is good (your tests catch the bug).
            Sometimes it is not (timeouts, flaky tests, setup problems).
          </p>
          <p>
            Timeouts are not kills: a mutation whose tests exceed{" "}
            <code>--mutation-timeout</code> (default 120 seconds) is reported with status{" "}
            <code>timeout</code>. If kills still look suspicious, run verbose and check the logs:
          </p>
          <div>
            <CodeBlock lang="bash" code="gooze run --verbose ./..." />
          </div>
        </div>

        <div id="zero">
          <h2>Gooze finds 0 files / 0 mutations</h2>
          <ul>
            <li>Run from the module root (where <code>go.mod</code> is).</li>
            <li>Preview what Gooze sees (below) and verify the paths.</li>
            <li>Check your exclude regex rules. You can exclude everything by mistake.</li>
            <li>
              <code>vendor/</code>, <code>testdata/</code>, directories starting with{" "}
              <code>.</code> or <code>_</code>, and nested modules (their own{" "}
              <code>go.mod</code>) are skipped automatically, like <code>go list ./...</code>.
            </li>
            <li>Files that fail to parse are skipped with a warning in the log.</li>
          </ul>
          <div>
            <CodeBlock lang="bash" code="gooze run --estimate ./..." />
          </div>
        </div>

        <div id="statuses">
          <h2>Not sure what a status means</h2>
          <p>
            Killed, survived, not covered, timeout, and error are explained in{" "}
            <Link href="/docs/usage/results#statuses">Reading results</Link>.
          </p>
        </div>

        <div id="stale">
          <h2>Reports look stale</h2>
          <p>
            If you suspect cached results are reused
            (see <Link href="/docs/usage/incremental-runs">Incremental runs</Link>),
            check which files are cached (the <code>CACHE</code> column of{" "}
            <code>gooze run --estimate</code>) or force a full re-run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>

        <div id="no-reports">
          <h2>&quot;no reports directory&quot; or &quot;no reports ... match&quot;</h2>
          <p>
            <code>gooze report view</code> reads the reports directory set by <code>-o</code>
            (default <code>.gooze-reports</code>). If it does not exist, run{" "}
            <code>gooze run</code> first or pass <code>-o</code> with the right directory:
          </p>
          <CodeBlock
            lang="text"
            code="Error: no reports directory at .gooze-reports; run `gooze run` first, or pass -o with the reports directory"
          />
          <p>
            Path arguments are module-relative, like <code>gooze run</code>&apos;s (
            <code>./...</code>, <code>./pkg/...</code>, <code>./pkg</code>,{" "}
            <code>./pkg/file.go</code>). When none matches a report, view exits 1 with{" "}
            <code>no reports in .gooze-reports match ...</code>.
          </p>
        </div>

        <div id="shards">
          <h2>Shards not showing up in view</h2>
          <p>
            If you ran with <code>-s INDEX/TOTAL</code>, you need to merge before viewing
            (see <Link href="/docs/ci/sharding">Sharding and merging</Link>):
          </p>
          <CodeBlock lang="bash" code="gooze report merge" />
          <div>
            <CodeBlock lang="bash" code="gooze report view" />
          </div>
        </div>
      </div>
    </section>
  )
}
