import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"

export const metadata = docsMetadata("/docs/cli/run")

export default function CliRunPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze run</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Runs mutation testing and writes reports.
        This is the main command.
      </p>

      <div className="space-y-12">
        <div id="usage" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze run [global flags] [paths...]" />
          <p className="mt-4 text-muted-foreground">
            With no paths, <code className="bg-muted px-1 py-0.5 rounded">run</code> defaults to{" "}
            <code className="bg-muted px-1 py-0.5 rounded">./...</code> (the current module,
            recursively), so <code className="bg-muted px-1 py-0.5 rounded">gooze run</code> is the
            same as <code className="bg-muted px-1 py-0.5 rounded">gooze run ./...</code>.
          </p>
        </div>

        <div id="what" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">What it does (high level)</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Generates mutations for a source file.</li>
            <li>Applies one mutation.</li>
            <li>Runs tests to see if they fail.</li>
            <li>Writes results into the reports directory.</li>
          </ol>
        </div>

        <div id="estimate" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Preview with --estimate</h2>
          <p className="mb-3 text-muted-foreground">
            See which source files would be mutated and how many mutations apply, without
            running any tests. This is a safe first command.
          </p>
          <CodeBlock lang="bash" code="gooze run --estimate ./..." />
          <p className="mt-4 mb-2 text-muted-foreground">Scan only one sub-tree:</p>
          <CodeBlock lang="bash" code="gooze run --estimate ./internal/domain/..." />
          <p className="mt-3 text-sm text-muted-foreground">
            In a TTY you get an interactive, filterable list; in CI you get a table with
            per-file mutation counts.
          </p>
        </div>

        <div id="parallel" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Parallel workers</h2>
          <p className="mb-3 text-muted-foreground">
            Run faster by using multiple workers:
          </p>
          <CodeBlock lang="bash" code="gooze run -p 4 ./..." />
          <p className="mt-3 text-muted-foreground">
            This example runs up to 4 mutations at the same time.
          </p>
        </div>

        <div id="timeout" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Timeouts</h2>
          <p className="mb-3 text-muted-foreground">
            Gooze stops a mutation test if it takes too long.
            In some versions you can configure this with a flag.
            Check your version with <code className="bg-muted px-1 py-0.5 rounded">gooze run --help</code>.
          </p>
          <CodeBlock lang="bash" code="gooze run --help" />
          <p className="mt-4 text-muted-foreground">
            If you see many suspicious failures, run verbose and inspect logs:
          </p>
          <CodeBlock lang="bash" code="gooze run --verbose ./..." />
        </div>

        <div id="cache" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Caching / incremental runs</h2>
          <p className="mb-3 text-muted-foreground">
            Gooze can reuse stored reports if nothing changed.
            To force a full re-run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>

        <div id="coverage-profile" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Coverage profile (skip uncovered mutations)</h2>
          <p className="mb-3 text-muted-foreground">
            Pass an existing Go coverage profile with{" "}
            <code className="bg-muted px-1 py-0.5 rounded">--coverage-profile</code> to skip
            mutations on lines your tests never execute. Gooze does not generate the profile;
            produce it first with <code className="bg-muted px-1 py-0.5 rounded">go test -coverprofile</code>.
          </p>
          <CodeBlock
            lang="bash"
            code={`# 1. Generate a coverage profile with the Go toolchain
go test -coverprofile=coverage.out ./...

# 2. Run gooze, skipping mutations on uncovered lines
gooze run --coverage-profile coverage.out ./...`}
          />
          <p className="mt-4 text-muted-foreground">
            Before testing each mutation, Gooze checks whether the mutated line is covered by the
            profile. If the line is not covered (or its file is absent from the profile), Gooze
            reports the mutation as{" "}
            <code className="bg-muted px-1 py-0.5 rounded">not_covered</code> and skips running its
            tests. Uncovered mutations can never be killed, so this is a large speed-up.
          </p>
          <p className="mt-3 text-muted-foreground">
            A <code className="bg-muted px-1 py-0.5 rounded">not_covered</code> mutation counts as a
            survivor in the mutation score (it lowers the score like{" "}
            <code className="bg-muted px-1 py-0.5 rounded">survived</code>) but is tallied
            separately. The default is empty, which disables the feature. You can also set it via{" "}
            <code className="bg-muted px-1 py-0.5 rounded">run.coverage_profile</code> in{" "}
            <code className="bg-muted px-1 py-0.5 rounded">gooze.yaml</code> or{" "}
            <code className="bg-muted px-1 py-0.5 rounded">GOOZE_RUN_COVERAGE_PROFILE</code>.
          </p>
        </div>

        <div id="shard" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Sharding (CI)</h2>
          <p className="mb-3 text-muted-foreground">
            Sharding splits the work across jobs.
            Example with 3 jobs:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze run -s 0/3 ./...
gooze run -s 1/3 ./...
gooze run -s 2/3 ./...`}
          />
          <p className="mt-3 text-muted-foreground">
            After all jobs finish, merge reports:
          </p>
          <CodeBlock lang="bash" code="gooze report merge" />
        </div>

        <div id="next" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Next</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/docs/reports">Reports</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/cli/report/view">gooze report view</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
