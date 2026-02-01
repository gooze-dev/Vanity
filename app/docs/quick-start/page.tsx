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
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>go install gooze.dev/pkg/gooze@latest</code>
          </pre>
        </div>

        <div id="list">
          <h2 className="text-2xl font-semibold mb-3">List files and mutation counts</h2>
          <p className="mb-3 text-muted-foreground">
            Preview which files will be mutated and how many mutations apply.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>gooze list ./...</code>
          </pre>
        </div>

        <div id="run">
          <h2 className="text-2xl font-semibold mb-3">Run mutation testing</h2>
          <p className="mb-3 text-muted-foreground">Execute mutation testing across the target paths.</p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>gooze run ./...</code>
          </pre>
        </div>

        <div id="view">
          <h2 className="text-2xl font-semibold mb-3">Reports</h2>
          <p className="mb-3 text-muted-foreground">
            By default, Gooze writes mutation reports to{" "}
            <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code> (override with{" "}
            <code className="bg-muted px-1 py-0.5 rounded">-o/--output</code>).
          </p>

          <p className="mb-3 text-muted-foreground">View the last run:</p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>gooze view</code>
          </pre>

          <p className="mt-5 mb-3 text-muted-foreground">
            Or point <code className="bg-muted px-1 py-0.5 rounded">view</code> at an explicit directory:
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>gooze view -o .gooze-reports</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
