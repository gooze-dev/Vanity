import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"

export default function CliRunPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze run</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Runs mutation testing and writes reports.
        This is the main command.
      </p>

      <div className="space-y-12">
        <div id="usage" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze run [global flags] [paths...]" />
        </div>

        <div id="what" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">What it does (high level)</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Generates mutations for a source file.</li>
            <li>Applies one mutation.</li>
            <li>Runs tests to see if they fail.</li>
            <li>Writes results into the reports directory.</li>
          </ol>
        </div>

        <div id="parallel" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Parallel workers</h2>
          <p className="mb-3 text-muted-foreground">
            Run faster by using multiple workers:
          </p>
          <CodeBlock lang="bash" code="gooze run -p 4 ./..." />
          <p className="mt-3 text-muted-foreground">
            This example runs up to 4 mutations at the same time.
          </p>
        </div>

        <div id="timeout" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Timeouts</h2>
          <p className="mb-3 text-muted-foreground">
            Gooze stops a mutation test if it takes too long.
            In some versions you can configure this with a flag.
            Check your version with <code className="bg-muted px-1 py-0.5 rounded">gooze run --help</code>.
          </p>
          <CodeBlock lang="bash" code="gooze run --help" />
          <p className="mt-4 text-muted-foreground">
            If you see many suspicious failures, run verbose and inspect logs:
          </p>
          <CodeBlock lang="bash" code="gooze run --verbose ./..." />
        </div>

        <div id="cache" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Caching / incremental runs</h2>
          <p className="mb-3 text-muted-foreground">
            Gooze can reuse stored reports if nothing changed.
            To force a full re-run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>

        <div id="shard" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Sharding (CI)</h2>
          <p className="mb-3 text-muted-foreground">
            Sharding splits the work across jobs.
            Example with 3 jobs:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze run -s 0/3 ./...
gooze run -s 1/3 ./...
gooze run -s 2/3 ./...`}
          />
          <p className="mt-3 text-muted-foreground">
            After all jobs finish, merge reports:
          </p>
          <CodeBlock lang="bash" code="gooze merge" />
        </div>

        <div id="next" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Next</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/docs/reports">Reports</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/cli/view">gooze view</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
