import { CodeBlock } from "@/components/code-block"

export default function CliInitPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze init</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Creates a starter <code className="bg-muted px-1 py-0.5 rounded">gooze.yaml</code> in the current directory.
      </p>

      <div className="space-y-12">
        <div id="when" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">When to use it</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>First time setting up Gooze in a repo</li>
            <li>You want a known-good config file to edit</li>
          </ul>
        </div>

        <div id="usage" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze init" />
          <p className="mt-3 text-muted-foreground">
            This example writes <code className="bg-muted px-1 py-0.5 rounded">gooze.yaml</code> and stops.
            It does not run mutation testing.
          </p>
        </div>

        <div id="next" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Next step</h2>
          <p className="mb-3 text-muted-foreground">After you have config, run:</p>
          <CodeBlock lang="bash" code="gooze run ./..." />
        </div>
      </div>
    </section>
  )
}
