import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/troubleshooting")

export default function TroubleshootingPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Troubleshooting</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Common problems and simple things to try.
      </p>

      <div className="space-y-12">
        <div id="everything-killed">
          <h2 className="text-2xl font-semibold mb-3">“Everything is killed” (or killed looks suspicious)</h2>
          <p className="text-muted-foreground">
            <strong>Killed</strong> means the tests of the package that owns the mutated file failed for that mutation
            (<code className="bg-muted px-1 py-0.5 rounded">go test -count=1</code> on that package).
            A mutant that does not compile is reported as <strong>error</strong>, not killed.
            Sometimes a kill is good (your tests catch the bug).
            Sometimes it is not (timeouts, flaky tests, setup problems).
          </p>
          <p className="mt-4 text-muted-foreground">
            Timeouts are not kills: a mutation whose tests exceed{" "}
            <code className="bg-muted px-1 py-0.5 rounded">--mutation-timeout</code> (default 120 seconds) is reported with status{" "}
            <code className="bg-muted px-1 py-0.5 rounded">timeout</code>. If kills still look suspicious, run verbose and check the logs:
          </p>
          <div className="mt-3">
            <CodeBlock lang="bash" code="gooze run --verbose ./..." />
          </div>
        </div>

        <div id="zero">
          <h2 className="text-2xl font-semibold mb-3">Gooze finds 0 files / 0 mutations</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Run from the module root (where <code className="bg-muted px-1 py-0.5 rounded">go.mod</code> is).</li>
            <li>Preview what Gooze sees (below) and verify the paths.</li>
            <li>Check your exclude regex rules. You can exclude everything by mistake.</li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">vendor/</code>, <code className="bg-muted px-1 py-0.5 rounded">testdata/</code>, directories starting with{" "}
              <code className="bg-muted px-1 py-0.5 rounded">.</code> or <code className="bg-muted px-1 py-0.5 rounded">_</code>, and nested modules (their own{" "}
              <code className="bg-muted px-1 py-0.5 rounded">go.mod</code>) are skipped automatically, like <code className="bg-muted px-1 py-0.5 rounded">go list ./...</code>.
            </li>
            <li>Files that fail to parse are skipped with a warning in the log.</li>
          </ul>
          <div className="mt-3">
            <CodeBlock lang="bash" code="gooze run --estimate ./..." />
          </div>
        </div>

        <div id="statuses">
          <h2 className="text-2xl font-semibold mb-3">Not sure what a status means</h2>
          <p className="text-muted-foreground">
            Killed, survived, not covered, timeout, and error are explained in{" "}
            <Link href="/docs/usage/results#statuses" className="underline underline-offset-4">Reading results</Link>.
          </p>
        </div>

        <div id="stale">
          <h2 className="text-2xl font-semibold mb-3">Reports look stale</h2>
          <p className="mb-3 text-muted-foreground">
            If you suspect cached results are reused
            (see <Link href="/docs/usage/incremental-runs" className="underline underline-offset-4">Incremental runs</Link>),
            force a full re-run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>

        <div id="shards">
          <h2 className="text-2xl font-semibold mb-3">Shards not showing up in view</h2>
          <p className="mb-3 text-muted-foreground">
            If you ran with <code className="bg-muted px-1 py-0.5 rounded">-s INDEX/TOTAL</code>, you need to merge before viewing
            (see <Link href="/docs/ci/sharding" className="underline underline-offset-4">Sharding and merging</Link>):
          </p>
          <CodeBlock lang="bash" code="gooze report merge" />
          <div className="mt-2">
            <CodeBlock lang="bash" code="gooze report view" />
          </div>
        </div>
      </div>
    </section>
  )
}
