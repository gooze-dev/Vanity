import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/quick-start")

// HowTo structured data mirroring the visible steps below, so AI assistants
// extract the exact install→run→view sequence. Commands verified against the CLI.
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Run your first Gooze mutation test",
  description:
    "Install Gooze, preview what will be mutated, run mutation testing on a Go project, and view the report.",
  step: [
    {
      "@type": "HowToStep",
      name: "Install Gooze",
      text: "Run go install gooze.dev/pkg/gooze@latest and verify with gooze version.",
    },
    {
      "@type": "HowToStep",
      name: "Preview the mutations",
      text: "Run gooze run --estimate ./... to list the files and mutation counts without running tests.",
    },
    {
      "@type": "HowToStep",
      name: "Run mutation testing",
      text: "Run gooze run ./... from your module root to inject mutations and produce a report.",
    },
    {
      "@type": "HowToStep",
      name: "View the report",
      text: "Run gooze report view to open the interactive report and inspect killed and surviving mutations.",
    },
  ],
}

export default function QuickStartPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Quick Start</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Install Gooze, preview what will be mutated, run mutation testing, then view reports.
      </p>

      <div>
        <div id="installation">
          <h2>Installation</h2>
          <p>
            Install the latest <code>gooze</code> binary to your Go bin directory:
          </p>
          <CodeBlock lang="bash" code="go install gooze.dev/pkg/gooze@latest" />
          <p>
            This command downloads Gooze and installs it.
            Next, verify:
          </p>
          <CodeBlock lang="bash" code="gooze version" />
        </div>

        <div id="init">
          <h2>(Optional) Create a config file</h2>
          <p>
            Gooze can read <code>gooze.yaml</code>.
            This is useful in CI and for shared settings.
          </p>
          <CodeBlock lang="bash" code="gooze config init" />
          <p className="text-sm text-muted-foreground">
            This only creates the file. It does not run tests.
          </p>
        </div>

        <div id="estimate">
          <h2>Preview files and mutation counts</h2>
          <p>
            Preview which files will be mutated and how many mutations apply, without running tests.
          </p>
          <CodeBlock lang="bash" code="gooze run --estimate ./..." />
          <p className="mt-4 mb-3 text-muted-foreground">
            Exclude directories/files using regex (repeat the flag as needed):
          </p>
          <CodeBlock lang="bash" code="gooze run --estimate -x '^vendor/' -x '^internal/mocks/' ./..." />
          <p className="text-sm text-muted-foreground">
            If you get 0 mutations, first check you are running from your module root (where <code>go.mod</code> is).
          </p>
        </div>

        <div id="run">
          <h2>Run mutation testing</h2>
          <p>Execute mutation testing across the target paths.</p>
          <CodeBlock lang="bash" code="gooze run ./..." />

          <h3>Make it faster</h3>
          <p>
            Run multiple workers in parallel:
          </p>
          <CodeBlock lang="bash" code="gooze run -p 4 ./..." />

          <h3>Force a full re-run</h3>
          <p>
            If you suspect cached results are reused:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>

        <div id="view">
          <h2>Reports</h2>
          <p>
            By default, Gooze writes mutation reports to{" "}
            <code>.gooze-reports</code> (override with{" "}
            <code>-o/--output</code>).
          </p>

          <p>View the last run (per-file scores, survivors, and the mutation score):</p>
          <CodeBlock lang="bash" code="gooze report view" />

          <p className="mt-5 mb-3 text-muted-foreground">
            Or point <code>report view</code> at an explicit directory:
          </p>
          <CodeBlock lang="bash" code="gooze report view -o .gooze-reports" />

          <p>
            To browse every mutation with its diff, run{" "}
            <code>gooze report view --all</code>. In the interactive UI:
            <code className="ml-2">/</code> to filter,
            <code className="ml-2">enter</code> to open the diff,
            and <code className="ml-2">q</code> to quit.
          </p>
        </div>

        <div id="ci">
          <h2>(Optional) Shard in CI</h2>
          <p>
            Sharding splits work across CI jobs. Example with 3 jobs:
          </p>
          <div>
            <CodeBlock lang="bash" code="gooze run -s 0/3 ./..." />
            <CodeBlock lang="bash" code="gooze run -s 1/3 ./..." />
            <CodeBlock lang="bash" code="gooze run -s 2/3 ./..." />
          </div>
          <p className="my-3 text-muted-foreground">
            After all jobs finish, merge and view:
          </p>
          <CodeBlock lang="bash" code="gooze report merge" />
          <div>
            <CodeBlock lang="bash" code="gooze report view" />
          </div>
        </div>
      </div>
    </section>
  )
}
