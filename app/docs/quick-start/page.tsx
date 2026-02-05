import { CodeBlock } from "@/components/code-block"

export default function QuickStartPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Quick Start</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Install Gooze, preview what will be mutated, run mutation testing, then view reports.
      </p>

      <div className="space-y-10">
        <div id="installation">
          <h2 className="text-2xl font-semibold mb-3">Installation</h2>
          <p className="mb-3 text-muted-foreground">
            Install the latest <code className="bg-muted px-1 py-0.5 rounded">gooze</code> binary to your Go bin directory:
          </p>
          <CodeBlock lang="bash" code="go install gooze.dev/pkg/gooze@latest" />
          <p className="mt-3 text-muted-foreground">
            This command downloads Gooze and installs it.
            Next, verify:
          </p>
          <CodeBlock lang="bash" code="gooze version" />
        </div>

        <div id="init">
          <h2 className="text-2xl font-semibold mb-3">(Optional) Create a config file</h2>
          <p className="mb-3 text-muted-foreground">
            Gooze can read <code className="bg-muted px-1 py-0.5 rounded">gooze.yaml</code>.
            This is useful in CI and for shared settings.
          </p>
          <CodeBlock lang="bash" code="gooze init" />
          <p className="mt-3 text-sm text-muted-foreground">
            This only creates the file. It does not run tests.
          </p>
        </div>

        <div id="list">
          <h2 className="text-2xl font-semibold mb-3">List files and mutation counts</h2>
          <p className="mb-3 text-muted-foreground">
            Preview which files will be mutated and how many mutations apply.
          </p>
          <CodeBlock lang="bash" code="gooze list ./..." />
          <p className="mt-4 mb-3 text-muted-foreground">
            Exclude directories/files using regex (repeat the flag as needed):
          </p>
          <CodeBlock lang="bash" code="gooze list -x '^vendor/' -x '^internal/mocks/' ./..." />
          <p className="mt-3 text-sm text-muted-foreground">
            If you get 0 mutations, first check you are running from your module root (where <code className="bg-muted px-1 py-0.5 rounded">go.mod</code> is).
          </p>
        </div>

        <div id="run">
          <h2 className="text-2xl font-semibold mb-3">Run mutation testing</h2>
          <p className="mb-3 text-muted-foreground">Execute mutation testing across the target paths.</p>
          <CodeBlock lang="bash" code="gooze run ./..." />

          <h3 className="text-xl font-medium mt-6 mb-2">Make it faster</h3>
          <p className="mb-2 text-muted-foreground">
            Run multiple workers in parallel:
          </p>
          <CodeBlock lang="bash" code="gooze run -p 4 ./..." />

          <h3 className="text-xl font-medium mt-6 mb-2">Force a full re-run</h3>
          <p className="mb-2 text-muted-foreground">
            If you suspect cached results are reused:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>

        <div id="view">
          <h2 className="text-2xl font-semibold mb-3">Reports</h2>
          <p className="mb-3 text-muted-foreground">
            By default, Gooze writes mutation reports to{" "}
            <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code> (override with{" "}
            <code className="bg-muted px-1 py-0.5 rounded">-o/--output</code>).
          </p>

          <p className="mb-3 text-muted-foreground">View the last run:</p>
          <CodeBlock lang="bash" code="gooze view" />

          <p className="mt-5 mb-3 text-muted-foreground">
            Or point <code className="bg-muted px-1 py-0.5 rounded">view</code> at an explicit directory:
          </p>
          <CodeBlock lang="bash" code="gooze view -o .gooze-reports" />

          <p className="mt-6 text-muted-foreground">
            In the interactive UI you can usually:
            <code className="bg-muted px-1 py-0.5 rounded ml-2">/</code> to filter,
            <code className="bg-muted px-1 py-0.5 rounded ml-2">enter</code> to open the diff,
            and <code className="bg-muted px-1 py-0.5 rounded ml-2">q</code> to quit.
          </p>
        </div>

        <div id="ci">
          <h2 className="text-2xl font-semibold mb-3">(Optional) Shard in CI</h2>
          <p className="mb-3 text-muted-foreground">
            Sharding splits work across CI jobs. Example with 3 jobs:
          </p>
          <div className="space-y-2">
            <CodeBlock lang="bash" code="gooze run -s 0/3 ./..." />
            <CodeBlock lang="bash" code="gooze run -s 1/3 ./..." />
            <CodeBlock lang="bash" code="gooze run -s 2/3 ./..." />
          </div>
          <p className="my-3 text-muted-foreground">
            After all jobs finish, merge and view:
          </p>
          <CodeBlock lang="bash" code="gooze merge" />
          <div className="mt-2">
            <CodeBlock lang="bash" code="gooze view" />
          </div>
        </div>
      </div>
    </section>
  )
}
