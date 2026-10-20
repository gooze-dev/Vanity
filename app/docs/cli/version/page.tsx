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
          <p>
            The command takes no flags and prints one line: the gooze version
            and the Go version it was built with.
          </p>
        </div>

        <div id="output">
          <h2>Example output</h2>
          <CodeBlock lang="text" code={`gooze v1.1.1 (go1.27.3)`} />
          <p>
            The version comes from the module build info, so a binary installed
            with <code>go install …@latest</code> reports that release&apos;s tag.
          </p>
        </div>

        <div id="why">
          <h2>Why this matters</h2>
          <p>
            Include this output in every bug report — it lets the team reproduce
            your issue against the exact build you ran. It is also the quickest
            way to confirm an upgrade landed after{" "}
            <code>go install</code> or a binary swap.
          </p>
        </div>

        <div id="ci">
          <h2>Pinning in CI</h2>
          <p>
            Log the version at the start of a CI job so mutation results are
            traceable to a specific gooze build, and fail fast if the pinned
            version drifts:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze version
gooze version | grep -q 'v1.1.1' || { echo 'unexpected gooze version'; exit 1; }`}
          />
        </div>
      </div>
    </section>
  )
}
