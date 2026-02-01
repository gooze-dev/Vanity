export default function RoadmapPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Roadmap</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A high-level view of what&apos;s planned for Gooze.
      </p>

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Core features</h2>
          <div className="space-y-2">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Annotation skipping</span>: support{" "}
                <code className="bg-muted px-1 py-0.5 rounded">{"//gooze:ignore"}</code> at file/function/line scope (optionally per mutagen)
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Custom exec hook</span>: custom test runner command (similar to go-mutesting&apos;s{" "}
                <code className="bg-muted px-1 py-0.5 rounded">--exec</code>)
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Function selection</span>: target specific functions/methods (e.g. regex)
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Timeouts</span>: per-mutation execution budgets
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Config file</span>: support{" "}
                <code className="bg-muted px-1 py-0.5 rounded">.gooze.yml</code> for persistent configuration
              </span>
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Smart test execution</h2>
          <div className="space-y-2">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                Run only matching <code className="bg-muted px-1 py-0.5 rounded">*_test.go</code> files for each mutated source file
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">Reduce test execution time by running relevant tests only</span>
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Performance &amp; scalability</h2>
          <div className="space-y-2">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <code className="bg-muted px-1 py-0.5 rounded">--parallel</code> flag for concurrent mutation testing
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">Sharding support for distributed execution across multiple machines</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">Compatible with parallel execution within shards</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                Automatic report merging from multiple shards (<code className="bg-muted px-1 py-0.5 rounded">gooze merge</code>)
              </span>
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Reporting</h2>
          <div className="space-y-2">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">Incremental testing: cache and reuse results for unchanged files</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">Per-file mutation reports for granular analysis</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                Index file with summary (<code className="bg-muted px-1 py-0.5 rounded">_index.yaml</code>)
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">OCI artifact integration with automated push/pull workflows</span>
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">CI/CD integration</h2>
          <div className="space-y-2">
            <label className="flex items-start gap-3">
              <input type="checkbox" readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">GitHub Actions workflow templates</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">GitLab CI pipeline configuration</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}
