import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/reports")

export default function ReportsPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Report format</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze writes reports after a run. The reports are also used as a cache for incremental runs.
      </p>

      <div className="space-y-12">
        <div id="where">
          <h2 className="text-2xl font-semibold mb-3">Where reports are stored</h2>
          <p className="mb-3 text-muted-foreground">
            Default output directory is <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports/</code>.
            You can change it with <code className="bg-muted px-1 py-0.5 rounded">-o/--output</code>.
          </p>
          <CodeBlock lang="bash" code="gooze run -o .gooze-reports ./..." />
        </div>

        <div id="files">
          <h2 className="text-2xl font-semibold mb-3">What gets written</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>One YAML file per report, named by hash: <code className="bg-muted px-1 py-0.5 rounded">&lt;hash&gt;.yaml</code></li>
            <li>
              After a sharded run (<code className="bg-muted px-1 py-0.5 rounded">-s INDEX/TOTAL</code>), one{" "}
              <code className="bg-muted px-1 py-0.5 rounded">shard_INDEX/</code> subdirectory per shard until you merge
            </li>
            <li>
              A summary index file: <code className="bg-muted px-1 py-0.5 rounded">_index.yaml</code>.
              When you use <code className="bg-muted px-1 py-0.5 rounded">--coverage-profile</code>, it
              also includes a <code className="bg-muted px-1 py-0.5 rounded">not_covered_mutations</code> count.
            </li>
          </ul>
        </div>

        <div id="tasks">
          <h2 className="text-2xl font-semibold mb-3">Working with reports</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              View them: <Link href="/docs/usage/results" className="underline underline-offset-4">Reading results</Link>
            </li>
            <li>
              Reuse them as a cache: <Link href="/docs/usage/incremental-runs" className="underline underline-offset-4">Incremental runs</Link>
            </li>
            <li>
              Combine shard directories: <Link href="/docs/ci/sharding" className="underline underline-offset-4">Sharding and merging</Link>
            </li>
            <li>
              Store them in a registry: <Link href="/docs/ci/sharing-reports" className="underline underline-offset-4">Sharing reports (OCI)</Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
