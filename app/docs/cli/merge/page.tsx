import { CodeBlock } from "@/components/code-block"

export default function CliMergePage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze merge</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Merges sharded reports (from <code className="bg-muted px-1 py-0.5 rounded">shard_*</code> folders) into the base output dir.
      </p>

      <div className="space-y-12">
        <div id="usage" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze merge" />
        </div>

        <div id="when" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">When you need this</h2>
          <p className="text-muted-foreground">
            If you run <code className="bg-muted px-1 py-0.5 rounded">gooze run -s INDEX/TOTAL</code>, Gooze writes into shard folders.
            You merge them before running <code className="bg-muted px-1 py-0.5 rounded">gooze view</code>.
          </p>
        </div>

        <div id="example" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Example</h2>
          <CodeBlock
            lang="bash"
            code={`gooze run -s 0/4 ./...
gooze run -s 1/4 ./...
gooze run -s 2/4 ./...
gooze run -s 3/4 ./...

gooze merge
gooze view`}
          />
          <p className="mt-3 text-muted-foreground">
            This example splits work into 4 jobs, then merges, then opens the viewer.
          </p>
        </div>

        <div id="notes" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Notes</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>If there are no shard directories, merge just rebuilds the index.</li>
            <li>Merging keeps existing base reports, so caching can still work.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
