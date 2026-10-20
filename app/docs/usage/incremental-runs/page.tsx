import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/usage/incremental-runs")

export default function IncrementalRunsPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Incremental runs</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze caches mutation results and skips unchanged files on subsequent runs. Use{" "}
        <code className="bg-muted px-1 py-0.5 rounded">--no-cache</code> to force a full re-test.
      </p>

      <div className="rounded-lg border bg-card p-5 mb-10">
        <p className="text-muted-foreground">
          Related pages: <Link href="/docs/reports" className="underline underline-offset-4">Report format</Link> and{" "}
          <Link href="/docs/cli/run#cache" className="underline underline-offset-4">gooze run</Link>.
        </p>
      </div>

      <div className="space-y-10">
        <div id="output">
          <h2 className="text-2xl font-semibold mb-3">
            Output directory <code className="bg-muted px-1 py-0.5 rounded">-o/--output</code>
          </h2>
          <p className="mb-3 text-muted-foreground">
            Choose where reports are written. This is also where the incremental cache lives.
            Cache entries are keyed on the project-relative path, so a baseline pulled from a
            registry matches on another machine or CI runner. Re-testing a changed file replaces
            its previous reports.
          </p>
          <CodeBlock lang="bash" code="gooze run -o .gooze-reports ./..." />
          <p className="mt-3 text-sm text-muted-foreground">
            Reports are written as one YAML per run (<code className="bg-muted px-1 py-0.5 rounded">&lt;hash&gt;.yaml</code>) plus an index (<code className="bg-muted px-1 py-0.5 rounded">_index.yaml</code>).
          </p>
        </div>

        <div id="no-cache">
          <h2 className="text-2xl font-semibold mb-3">Force a full re-run</h2>
          <p className="mb-3 text-muted-foreground">
            If results look stale, or you changed something the cache can&apos;t see (test data,
            environment), ignore the cache for one run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>

        <div id="share">
          <h2 className="text-2xl font-semibold mb-3">Reuse the cache in CI</h2>
          <p className="text-muted-foreground">
            A fresh CI runner starts with an empty reports dir. Pull a baseline from an OCI
            registry before the run and push the updated one after:{" "}
            <Link href="/docs/ci/sharing-reports" className="underline underline-offset-4">Sharing reports (OCI)</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
