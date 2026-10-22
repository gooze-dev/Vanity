import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import Link from "next/link"
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
      text: "Run gooze report view to see per-file scores, surviving mutations and the mutation score.",
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
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Quick start</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Your tests pass, but would they fail if the code were wrong? In a few minutes you&apos;ll
        install Gooze, run it on a small package, find the tests that are missing and add them.
      </p>
      <p>
        The example is a package <code>calc</code> with one function, <code>InRange(n, lo, hi)</code>,
        which reports whether <code>n</code> is inside <code>[lo, hi]</code>. Its tests check{" "}
        <code>5</code>, <code>-3</code> and <code>42</code> against the range <code>0</code> to{" "}
        <code>10</code>. They pass. Run the same commands on your own module.
      </p>

      <div>
        <div id="installation">
          <h2>Installation</h2>
          <p>
            Install the latest <code>gooze</code> binary to your Go bin directory, then check that it runs:
          </p>
          <CodeBlock lang="bash" code="go install gooze.dev/pkg/gooze@latest" />
          <CodeBlock lang="bash" code="gooze version" />
        </div>

        <div id="init">
          <h2>(Optional) Create a config file</h2>
          <p>
            Gooze reads settings from <code>gooze.yaml</code>.
            This is useful in CI and for settings your team shares.
          </p>
          <CodeBlock lang="bash" code="gooze config init" />
          <p className="text-sm text-muted-foreground">
            This only creates the file. It does not run tests.
          </p>
        </div>

        <div id="estimate">
          <h2>Preview files and mutation counts</h2>
          <p>
            Before running any tests, see which files Gooze will mutate and how many mutations apply:
          </p>
          <CodeBlock lang="bash" code="gooze run --estimate ./..." />
          <Recording name="calc-estimate" title="Recorded gooze run --estimate before the first run" />
          <p className="mt-4 mb-3 text-muted-foreground">
            Exclude files with a regex (repeat the flag as needed):
          </p>
          <CodeBlock lang="bash" code="gooze run --estimate -x '^vendor/' -x '^mock_' ./..." />
          <p className="text-sm text-muted-foreground">
            If you get 0 mutations, first check that you&apos;re running from your module root (where <code>go.mod</code> is).
          </p>
        </div>

        <div id="run">
          <h2>Run mutation testing</h2>
          <p>
            Now run it. Gooze applies each of the 13 mutations and runs the package tests against it.
            The last line is the mutation score:
          </p>
          <CodeBlock lang="bash" code="gooze run ./..." />
          <Recording name="calc-first-run" title="Recorded last line of the first gooze run on calc" />
          <p>
            Two mutants survived: Gooze changed the code and every test still passed.
          </p>
        </div>

        <div id="view">
          <h2>Reports</h2>
          <p>
            Gooze writes reports to <code>.gooze-reports</code> (override with{" "}
            <code>-o/--output</code>). To see which mutants survived, view the last run:
          </p>
          <CodeBlock lang="bash" code="gooze report view" />
          <Recording name="calc-report-view" title="Recorded gooze report view after the first run" />
          <p>
            No test calls <code>InRange</code> with <code>n</code> equal to <code>lo</code> or{" "}
            <code>hi</code>, so <code>&lt;</code> and <code>&lt;=</code> (and <code>&gt;</code>{" "}
            and <code>&gt;=</code>) give the same answers for every input the tests use.
          </p>

          <p className="mt-5 mb-3 text-muted-foreground">
            Point <code>report view</code> at another directory with <code>-o</code>:
          </p>
          <CodeBlock lang="bash" code="gooze report view -o .gooze-reports" />

          <p>
            To browse every mutation with its diff, run{" "}
            <code>gooze report view --all</code>. In the interactive UI, move with{" "}
            <code>j</code>/<code>k</code>, press <code>enter</code> or <code>space</code> to open the
            diff, and <code>q</code> to quit. Here it opens the first survivor:
          </p>
          <Recording name="calc-report-view-all-tui" title="Recorded gooze report view --all session opening a survivor's diff" tui />
        </div>

        <div id="fix">
          <h2>Kill the survivors</h2>
          <p>Add the two boundary cases to the test table in <code>calc_test.go</code>:</p>
          <CodeBlock
            lang="go"
            code={`		{0, 0, 10, true},  // lower bound is inside
		{10, 0, 10, true}, // upper bound is inside`}
          />
          <p>Run Gooze again and view the report. Both mutants are killed now:</p>
          <Recording name="calc-fixed-run" title="Recorded last line of gooze run after adding the boundary tests" />
          <Recording name="calc-fixed-report-view" title="Recorded gooze report view after the fix" />
        </div>

        <div id="rerun">
          <h2>Run it again</h2>
          <p>
            Gooze caches results per file. Run it again without changes and nothing is re-tested; <code>--estimate</code> shows the same:
          </p>
          <Recording name="calc-cached-run" title="Recorded last line of a gooze run with nothing changed" />
          <Recording name="calc-cached-estimate" title="Recorded gooze run --estimate with everything cached" />
          <p className="text-sm text-muted-foreground">
            What triggers a re-test: <Link href="/docs/usage/incremental-runs">Incremental runs</Link>.
          </p>

          <h3>Make it faster</h3>
          <p>
            Run multiple workers in parallel:
          </p>
          <CodeBlock lang="bash" code="gooze run -p 4 ./..." />
          <p>
            Or pass a coverage profile, so mutations on uncovered lines are reported as{" "}
            <code>not_covered</code> without running tests:
          </p>
          <CodeBlock
            lang="bash"
            code={`go test -coverprofile=coverage.out ./...
gooze run --coverage-profile coverage.out ./...`}
          />

          <h3>Force a full re-run</h3>
          <p>
            To ignore cached results and re-test everything:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
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
