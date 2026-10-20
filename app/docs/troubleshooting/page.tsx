import { docsMetadata } from "@/lib/docs-meta"
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
          <h2 className="text-2xl font-semibold mb-3">Statuses you will see</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><code className="bg-muted px-1 py-0.5 rounded">killed</code>: the package tests failed for the mutation.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">survived</code>: the package tests still passed.</li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">not_covered</code>: the mutated line is uncovered in the{" "}
              <code className="bg-muted px-1 py-0.5 rounded">--coverage-profile</code>, so its tests were not run; counts as a survivor.
            </li>
            <li><code className="bg-muted px-1 py-0.5 rounded">timeout</code>: the tests exceeded <code className="bg-muted px-1 py-0.5 rounded">--mutation-timeout</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">error</code>: the mutant did not compile; excluded from the score.</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            A missing test file does not skip anything: Gooze runs the sibling{" "}
            <code className="bg-muted px-1 py-0.5 rounded">&lt;name&gt;_test.go</code> if it exists, otherwise any{" "}
            <code className="bg-muted px-1 py-0.5 rounded">*_test.go</code> in the same package. If the package has no test file at all,
            the mutation is reported as <strong>survived</strong>.
          </p>
        </div>

        <div id="stale">
          <h2 className="text-2xl font-semibold mb-3">Reports look stale</h2>
          <p className="mb-3 text-muted-foreground">
            If you suspect cached results are reused, force a full re-run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>

        <div id="shards">
          <h2 className="text-2xl font-semibold mb-3">Shards not showing up in view</h2>
          <p className="mb-3 text-muted-foreground">
            If you ran with <code className="bg-muted px-1 py-0.5 rounded">-s INDEX/TOTAL</code>, you need to merge before viewing:
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
