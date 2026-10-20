import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen } from "lucide-react"

export const metadata = docsMetadata("/docs/usage/incremental-runs")

export default function IncrementalRunsPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Incremental runs</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze caches mutation results and skips unchanged files on subsequent runs. Use{" "}
        <code>--no-cache</code> to force a full re-test.
      </p>

      <Alert>
        <BookOpen />
        <AlertDescription>
          <p>
            Related pages: <Link href="/docs/reports">Report format</Link> and{" "}
            <Link href="/docs/cli/run#cache">gooze run</Link>.
          </p>
        </AlertDescription>
      </Alert>

      <div>
        <div id="output">
          <h2>
            Output directory <code>-o/--output</code>
          </h2>
          <p>
            Choose where reports are written. This is also where the incremental cache lives.
            Cache entries are keyed on the project-relative path, so a baseline pulled from a
            registry matches on another machine or CI runner. Re-testing a changed file replaces
            its previous reports.
          </p>
          <CodeBlock lang="bash" code="gooze run -o .gooze-reports ./..." />
          <p className="text-sm text-muted-foreground">
            Reports are written as one YAML per run (<code>&lt;hash&gt;.yaml</code>) plus an index (<code>_index.yaml</code>).
          </p>
        </div>

        <div id="invalidation">
          <h2>When a file is re-tested</h2>
          <p>
            On each run Gooze compares every source file against the stored reports and re-tests it when:
          </p>
          <ul>
            <li>it has no stored reports yet,</li>
            <li>its content changed,</li>
            <li>its test file (<code>&lt;name&gt;_test.go</code>) changed, or</li>
            <li>
              the mutators that produced its reports changed (a Gooze upgrade; for example v1.2.0
              re-tests reports from version 1 of the <code>comparison</code> mutator).
            </li>
          </ul>
          <p>
            Everything else is reused, and reports for deleted files are dropped, so the mutation
            score always covers the whole codebase, not only the files that were re-tested. The
            score line of <code>gooze run</code> counts cached and tested results in its scope
            and says how many were which:
          </p>
          <CodeBlock lang="text" code="Mutation score: 87.50% (14 killed, 2 survived; 16 cached, 0 tested)" />
          <p>
            <code>gooze run --estimate</code> marks the files that will be served from the cache
            in a <code>CACHE</code> column, with an <code>N CACHED</code> total.
          </p>
          <p>
            Changes are detected from file contents, not from git: no base branch, commit, or
            history is needed, and uncommitted edits are picked up. See{" "}
            <Link href="/docs/comparison#incremental-vs-diff">incremental execution vs git diff</Link>.
          </p>
          <p>
            What the cache does not see: changes in <em>other</em> files that a file&apos;s tests
            depend on (a helper in another file, a shared test fixture, testdata, a dependency bump).
            Those can leave a cached result out of date. Run a full pass with{" "}
            <code>--no-cache</code> on a schedule (for
            example nightly on main) to refresh the baseline.
          </p>
        </div>

        <div id="no-cache">
          <h2>Force a full re-run</h2>
          <p>
            If results look stale, or you changed something the cache can&apos;t see (test data,
            environment), ignore the cache for one run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
          <p className="text-sm text-muted-foreground">
            With <code>--no-cache</code> the score covers only what that run tested.
          </p>
        </div>

        <div id="share">
          <h2>Reuse the cache in CI</h2>
          <p>
            A fresh CI runner starts with an empty reports dir. Pull a baseline from an OCI
            registry before the run and push the updated one after:{" "}
            <Link href="/docs/ci/sharing-reports">Sharing reports (OCI)</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
