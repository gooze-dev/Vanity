import { CodeBlock } from "@/components/code-block"

export default function CliListPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze list</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Shows what Gooze <em>would</em> mutate, without running tests.
        This is a safe first command.
      </p>

      <div className="space-y-12">
        <div id="when" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">When to use it</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Sanity check that Gooze sees your code</li>
            <li>Quick estimate before <code className="bg-muted px-1 py-0.5 rounded">gooze run</code></li>
            <li>Confirm your exclude rules are working</li>
          </ul>
        </div>

        <div id="usage" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze list [global flags] [paths...]" />
        </div>

        <div id="examples" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Examples (and what they do)</h2>
          <p className="mb-2 text-muted-foreground">Scan everything in the current module:</p>
          <CodeBlock lang="bash" code="gooze list ./..." />

          <p className="mt-6 mb-2 text-muted-foreground">Exclude vendor and examples folders:</p>
          <CodeBlock lang="bash" code="gooze list -x '^vendor/' -x '^examples/' ./..." />

          <p className="mt-6 mb-2 text-muted-foreground">Scan only one sub-tree:</p>
          <CodeBlock lang="bash" code="gooze list ./internal/domain/..." />
        </div>

        <div id="output" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Output</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><strong>TTY</strong>: interactive list with filter</li>
            <li><strong>Non-TTY</strong>: a table with per-file mutation counts</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
