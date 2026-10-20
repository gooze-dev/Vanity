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
            The command takes no flags and prints the version, the git commit it
            was built from, and the build date.
          </p>
        </div>

        <div id="output">
          <h2>Example output</h2>
          <CodeBlock
            lang="text"
            code={`gooze version 1.1.0
commit: 9f3c2a1
built:  2026-02-14T10:21:00Z`}
          />
          <p>
            The exact fields follow the release build; the version line always
            comes first so it is easy to grep in scripts.
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
gooze version | grep -q '1.1.0' || { echo 'unexpected gooze version'; exit 1; }`}
          />
        </div>
      </div>
    </section>
  )
}
