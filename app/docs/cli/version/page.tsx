import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/cli/version")

export default function CliVersionPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">gooze version</h1>
      <p className="text-lg text-muted-foreground mb-8">
        You&apos;re filing a bug report or checking that an upgrade landed.{" "}
        <code>gooze version</code> prints the Gooze version and the Go version it was built with.
      </p>

      <div>
        <div id="usage">
          <h2>Usage</h2>
          <CodeBlock lang="bash" code="gooze version" />
          <p>
            The command takes no flags and prints one line on stdout: the module
            version and the Go version the binary was built with.
          </p>
        </div>

        <div id="output">
          <h2>Example output</h2>
          <Recording name="calc-version" title="Recorded gooze version" />
          <p>
            The version comes from the Go build info, so a binary built from a
            local checkout instead of <code>go install ...@vX.Y.Z</code> shows{" "}
            <code>(devel)</code> in its place.
          </p>
        </div>

        <div id="why">
          <h2>Why this matters</h2>
          <p>
            Include this output in every bug report: it lets the team reproduce
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
gooze version | grep -q 'gooze v1.2.0 ' || { echo 'unexpected gooze version'; exit 1; }`}
          />
        </div>
      </div>
    </section>
  )
}
