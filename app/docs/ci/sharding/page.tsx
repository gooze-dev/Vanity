import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/ci/sharding")

export default function ShardingPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Sharding and merging</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Split one mutation run across parallel jobs to cut wall-clock time, then merge the
        shards back into a single report set.
      </p>

      <div className="space-y-12">
        <div id="run">
          <h2 className="text-2xl font-semibold mb-3">1. Run each shard</h2>
          <p className="mb-3 text-muted-foreground">
            Give every job the same <code className="bg-muted px-1 py-0.5 rounded">TOTAL</code> and its
            own <code className="bg-muted px-1 py-0.5 rounded">INDEX</code> with{" "}
            <code className="bg-muted px-1 py-0.5 rounded">-s INDEX/TOTAL</code>. Example with 3 jobs:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze run -s 0/3 ./...
gooze run -s 1/3 ./...
gooze run -s 2/3 ./...`}
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Shards are 0-based: the value must satisfy{" "}
            <code className="bg-muted px-1 py-0.5 rounded">0 &lt;= INDEX &lt; TOTAL</code>
            {" "}(<code className="bg-muted px-1 py-0.5 rounded">4/4</code> is an error). Each shard writes
            to <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports/shard_INDEX/</code>.
          </p>
        </div>

        <div id="merge">
          <h2 className="text-2xl font-semibold mb-3">2. Collect and merge</h2>
          <p className="mb-3 text-muted-foreground">
            Bring every <code className="bg-muted px-1 py-0.5 rounded">shard_*</code> directory back
            into one reports directory (in CI, upload each shard as an artifact and download them
            all in a final job), then merge. Results don&apos;t show up in the viewer until you do.
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze report merge
gooze report view`}
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Shard reports replace base reports for the same source file, and base reports for files
            no shard re-tested are kept, so the cache still works. Details:{" "}
            <Link href="/docs/cli/report#merge" className="underline underline-offset-4">gooze report merge</Link>.
          </p>
        </div>

        <div id="ci">
          <h2 className="text-2xl font-semibold mb-3">Ready-made CI pipelines</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <Link href="/docs/ci/github#sharded" className="underline underline-offset-4">GitHub Actions</Link>:
              a <code className="bg-muted px-1 py-0.5 rounded">matrix</code> of shards plus a merge job.
            </li>
            <li>
              <Link href="/docs/ci/gitlab#sharded" className="underline underline-offset-4">GitLab CI</Link>:{" "}
              <code className="bg-muted px-1 py-0.5 rounded">parallel: N</code> plus a merge stage
              (note <code className="bg-muted px-1 py-0.5 rounded">CI_NODE_INDEX</code> is 1-based).
            </li>
            <li>
              To also skip unchanged files across runs, combine sharding with a shared baseline:{" "}
              <Link href="/docs/ci/sharing-reports" className="underline underline-offset-4">Sharing reports (OCI)</Link>.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
