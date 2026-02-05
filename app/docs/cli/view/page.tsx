import { CodeBlock } from "@/components/code-block"

export default function CliViewPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze view</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Loads reports from the output directory and displays results.
      </p>

      <div className="space-y-12">
        <div id="usage" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze view" />
          <p className="mt-3 text-muted-foreground">
            This reads from <code className="bg-muted px-1 py-0.5 rounded">--output</code>.
            Default is usually <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>.
          </p>
        </div>

        <div id="what" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">What you can do</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>See the mutation score</li>
            <li>Scroll results by file/type/status</li>
            <li>Filter by id/file/type/status</li>
            <li>Open a diff for survived mutations</li>
          </ul>
        </div>

        <div id="keys" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Keybindings (TTY)</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><code className="bg-muted px-1 py-0.5 rounded">↑/k</code>, <code className="bg-muted px-1 py-0.5 rounded">↓/j</code>: move</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">g</code> / <code className="bg-muted px-1 py-0.5 rounded">G</code>: top / bottom</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">/</code>: filter</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">enter</code> / <code className="bg-muted px-1 py-0.5 rounded">space</code>: toggle diff</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">q</code>: quit</li>
          </ul>
        </div>

        <div id="non-tty" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Non-TTY behavior (CI)</h2>
          <p className="mb-3 text-muted-foreground">
            When not interactive, view prints results linearly.
            Example:
          </p>
          <CodeBlock lang="bash" code="gooze view | cat" />
        </div>
      </div>
    </section>
  )
}
