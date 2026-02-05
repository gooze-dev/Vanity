import { CodeBlock } from "@/components/code-block"

export default function ReportsPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Reports</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze writes reports after a run. The reports are also used as a cache for incremental runs.
      </p>

      <div className="space-y-12">
        <div id="where" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Where reports are stored</h2>
          <p className="mb-3 text-muted-foreground">
            Default output directory is usually <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports/</code>.
            You can change it with <code className="bg-muted px-1 py-0.5 rounded">-o/--output</code>.
          </p>
          <CodeBlock lang="bash" code="gooze run -o .gooze-reports ./..." />
        </div>

        <div id="files" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">What gets written</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>One YAML file per report, named by hash: <code className="bg-muted px-1 py-0.5 rounded">&lt;hash&gt;.yaml</code></li>
            <li>A summary index file: <code className="bg-muted px-1 py-0.5 rounded">_index.yaml</code></li>
          </ul>
        </div>

        <div id="view" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Viewing reports</h2>
          <p className="mb-3 text-muted-foreground">
            This reads from the output directory and shows results.
          </p>
          <CodeBlock lang="bash" code="gooze view" />
          <p className="mt-4 text-muted-foreground">
            If you used a custom output dir, pass it:
          </p>
          <CodeBlock lang="bash" code="gooze view -o .gooze-reports" />
        </div>

        <div id="shards" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Shards and merge</h2>
          <p className="mb-3 text-muted-foreground">
            When you run with <code className="bg-muted px-1 py-0.5 rounded">-s INDEX/TOTAL</code>, Gooze writes into shard directories.
            After that, you merge:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze run -s 0/3 ./...
gooze run -s 1/3 ./...
gooze run -s 2/3 ./...

gooze merge
gooze view`}
          />
          <p className="mt-3 text-muted-foreground">
            This example splits work into 3 jobs, then merges results, then opens the viewer.
          </p>
        </div>

        <div id="cache" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Cache behavior (incremental runs)</h2>
          <p className="mb-3 text-muted-foreground">
            Gooze can reuse stored reports for unchanged sources.
            If you want to force a full re-run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>
      </div>
    </section>
  )
}
