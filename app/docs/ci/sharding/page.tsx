import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/ci/sharding")

export default function ShardingPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Sharding and merging</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Split one mutation run across parallel jobs to cut wall-clock time, then merge the
        shards back into a single report set.
      </p>

      <div>
        <div id="run">
          <h2>1. Run each shard</h2>
          <p>
            Give every job the same <code>TOTAL</code> and its
            own <code>INDEX</code> with{" "}
            <code>-s INDEX/TOTAL</code>. Example with 3 jobs:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze run -s 0/3 ./...
gooze run -s 1/3 ./...
gooze run -s 2/3 ./...`}
          />
          <p className="text-sm text-muted-foreground">
            Shards are 0-based: the value must satisfy{" "}
            <code>0 &lt;= INDEX &lt; TOTAL</code>
            {" "}(<code>4/4</code> is an error). Each shard writes
            to <code>.gooze-reports/shard_INDEX/</code>.
          </p>
        </div>

        <div id="merge">
          <h2>2. Collect and merge</h2>
          <p>
            Bring every <code>shard_*</code> directory back
            into one reports directory (in CI, upload each shard as an artifact and download them
            all in a final job), then merge. Results don&apos;t show up in the viewer until you do.
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze report merge
gooze report view`}
          />
          <p className="text-sm text-muted-foreground">
            Shard reports replace base reports for the same source file, and base reports for files
            no shard re-tested are kept, so the cache still works. Each shard&apos;s{" "}
            <code>gooze run</code> prints the score of its shard only; the merge prints the full
            score. Details:{" "}
            <Link href="/docs/cli/report#merge">gooze report merge</Link>.
          </p>
        </div>

        <div id="ci">
          <h2>Ready-made CI pipelines</h2>
          <ul>
            <li>
              <Link href="/docs/ci/github#sharded">GitHub Actions</Link>:
              a <code>matrix</code> of shards plus a merge job.
            </li>
            <li>
              <Link href="/docs/ci/gitlab#sharded">GitLab CI</Link>:{" "}
              <code>parallel: N</code> plus a merge stage
              (note <code>CI_NODE_INDEX</code> is 1-based).
            </li>
            <li>
              To also skip unchanged files across runs, combine sharding with a shared baseline:{" "}
              <Link href="/docs/ci/sharing-reports">Sharing reports (OCI)</Link>.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
