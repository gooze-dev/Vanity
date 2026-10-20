import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

// Stated plainly so readers (and search/AI summaries) don't have to guess.
// Keep in sync with the comparison page when a limitation is lifted.
const limitations = [
  {
    id: "threshold",
    title: "No score threshold flag",
    detail: "Survivors never change the exit code, so gooze can't fail CI on its own.",
    workaround: { text: "a three-line score gate step", href: "/docs/ci/github#gate" },
  },
  {
    id: "custom-mutators",
    title: "No custom mutator plugins",
    detail: "Only the built-in operators run, and there is no plugin API. Adding an operator to Gooze itself is one small function; caching, sharding, and reporting don't change.",
    workaround: { text: "the built-in operators", href: "/docs/mutations" },
  },
  {
    id: "exec",
    title: "No custom test runner",
    detail: "Gooze always runs go test on the package that owns the mutated file.",
  },
  {
    id: "json",
    title: "No JSON or HTML report",
    detail: "Results are YAML files plus _index.yaml.",
    workaround: { text: "the report format", href: "/docs/reports" },
  },
]

export const metadata = docsMetadata("/docs/roadmap")

export default function RoadmapPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Roadmap</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Known limitations, with workarounds, and a high-level view of what&apos;s planned for Gooze.
      </p>

      <div className="space-y-10">
        <div id="limitations">
          <h2 className="text-2xl font-semibold mb-3">Known limitations (v1.1.0)</h2>
          <ul className="space-y-3 text-muted-foreground">
            {limitations.map((item) => (
              <li key={item.id} id={item.id}>
                <span className="font-medium text-foreground">{item.title}</span>: {item.detail}
                {item.workaround && (
                  <>
                    {" "}Instead, use{" "}
                    <Link href={item.workaround.href} className="underline underline-offset-4">
                      {item.workaround.text}
                    </Link>
                    .
                  </>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            How this compares with other tools:{" "}
            <Link href="/docs/comparison" className="underline underline-offset-4">Gooze vs Gremlins vs go-mutesting</Link>.
          </p>
        </div>

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
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Timeouts</span>: per-mutation execution budgets (<code className="bg-muted px-1 py-0.5 rounded">--mutation-timeout</code>)
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Config file</span>: support{" "}
                <code className="bg-muted px-1 py-0.5 rounded">.gooze.yml</code> for persistent configuration
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Score threshold</span>: a built-in flag that fails the run below a minimum mutation score
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">JSON report</span>: machine-readable output for dashboards and other tools
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
                Run the tests of the package that owns each mutated source file
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
                Automatic report merging from multiple shards (<code className="bg-muted px-1 py-0.5 rounded">gooze report merge</code>)
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
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <Link href="/docs/ci/github" className="underline underline-offset-4">GitHub Actions workflow templates</Link>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked readOnly disabled className="mt-1" />
              <span className="text-muted-foreground">
                <Link href="/docs/ci/gitlab" className="underline underline-offset-4">GitLab CI pipeline configuration</Link>
              </span>
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}
