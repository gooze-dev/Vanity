import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/cli/version")

export default function CliVersionPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">gooze version</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Prints build/version information.
      </p>

      <div>
        <div id="usage">
          <h2>Usage</h2>
          <CodeBlock lang="bash" code="gooze version" />
        </div>

        <div id="why">
          <h2>Why this matters</h2>
          <p>
            When you report a bug, include this output.
            It helps the team reproduce your issue.
          </p>
        </div>
      </div>
    </section>
  )
}
