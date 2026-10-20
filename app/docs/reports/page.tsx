import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/reports")

export default function ReportsPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Report format</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze writes reports after a run. The reports are also used as a cache for incremental runs.
      </p>

      <div>
        <div id="where">
          <h2>Where reports are stored</h2>
          <p>
            Default output directory is <code>.gooze-reports/</code>.
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
              A summary index file: <code>_index.yaml</code>.
              When you use <code>--coverage-profile</code>, it
              also includes a <code>not_covered_mutations</code> count.
            </li>
          </ul>
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
