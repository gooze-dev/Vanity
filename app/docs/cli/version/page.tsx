import { CodeBlock } from "@/components/code-block"

export default function CliVersionPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze version</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Prints build/version information.
      </p>

      <div className="space-y-12">
        <div id="usage" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze version" />
        </div>

        <div id="why" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Why this matters</h2>
          <p className="text-muted-foreground">
            When you report a bug, include this output.
            It helps the team reproduce your issue.
          </p>
        </div>
      </div>
    </section>
  )
}
