import { docsMetadata } from "@/lib/docs-meta"
import { DocsFaq, faqPageJsonLd, withCode } from "@/components/docs-faq"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BookOpen } from "lucide-react"

export const metadata = docsMetadata("/docs/usage/incremental-runs")

// Cache state per developer action — a table engines can extract to answer
// "when does Gooze re-run?". Matches the invalidation rules documented below.
const cacheRows = [
  {
    action: "No changes since the last run",
    state: "Hit",
    behavior: "Reuses stored results; the run is near-instant.",
  },
  {
    action: "Edit a source file",
    state: "Partial miss",
    behavior: "Re-tests that file; reuses every other file.",
  },
  {
    action: "Edit its `_test.go` file",
    state: "Partial miss",
    behavior: "Re-tests the associated source file.",
  },
  {
    action: "Upgrade Gooze to a version that changes a mutator",
    state: "Partial miss",
    behavior: "Re-tests every file whose reports came from an older version of that mutator.",
  },
  {
    action: "`gooze run --no-cache`",
    state: "Bypass",
    behavior: "Ignores stored results and re-tests everything.",
  },
  {
    action: "Delete the reports directory",
    state: "Reset",
    behavior: "Rebuilds a fresh baseline from scratch.",
  },
]

const faqs = [
  {
    q: "How does Gooze speed up mutation testing?",
    a: "Gooze caches results per file and, on the next run, re-tests only files whose source, test file, or mutators changed; everything else is reused, so repeat runs are fast.",
  },
  {
    q: "How do I disable the Gooze cache?",
    a: "Pass `--no-cache` for a one-off full re-run, or set `GOOZE_NO_CACHE=true` in the environment.",
  },
  {
    q: "Where does Gooze store its incremental cache?",
    a: "In the reports directory (default `.gooze-reports`), alongside the YAML reports. Change it with `-o/--output`.",
  },
  {
    q: "How do I clear or reset the Gooze cache?",
    a: "Delete the reports directory (for example `rm -rf .gooze-reports`); Gooze rebuilds it on the next run.",
  },
  {
    q: "Why did Gooze finish instantly and skip my mutations?",
    a: "A full cache hit: nothing the cache tracks (source, test files, mutators) changed since the last run, so Gooze reused the previous results instead of re-running them.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

export default function IncrementalRunsPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Incremental runs</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Mutation testing runs your tests once per mutant, so a full run on a large module is slow.
        Gooze caches results per file and, on the next run, re-tests only what changed. Use{" "}
        <code>--no-cache</code> to force a full re-test.
      </p>

      <Alert>
        <BookOpen />
        <AlertDescription>
          <p>
            Related pages: <Link href="/docs/reports">Report format</Link> and{" "}
            <Link href="/docs/cli/run#cache"><code>gooze run</code></Link>.
          </p>
        </AlertDescription>
      </Alert>

      <div>
        <div id="output">
          <h2>
            Output directory <code>-o/--output</code>
          </h2>
          <p>
            Choose where reports are written. This is also where the incremental cache lives.
            Cache entries are keyed on the project-relative path, so a baseline pulled from a
            registry matches on another machine or CI runner. Re-testing a changed file replaces
            its previous reports.
          </p>
          <CodeBlock lang="bash" code="gooze run -o .gooze-reports ./..." />
          <p className="text-sm text-muted-foreground">
            Reports are written as one YAML file per report (<code>&lt;hash&gt;.yaml</code>) plus an index (<code>_index.yaml</code>).
          </p>
        </div>

        <div id="invalidation">
          <h2>When a file is re-tested</h2>
          <p>
            On each run Gooze compares every source file against the stored reports and re-tests it when:
          </p>
          <ul>
            <li>it has no stored reports yet,</li>
            <li>its content changed,</li>
            <li>its test file (<code>&lt;name&gt;_test.go</code>) changed, or</li>
            <li>
              the mutators that produced its reports changed (a Gooze upgrade; for example <code>v1.2.0</code>{" "}
              re-tests reports from version 1 of the <code>comparison</code> mutator).
            </li>
          </ul>
          <p>
            Everything else is reused, and reports for deleted files are dropped, so the mutation
            score always covers the whole codebase, not only the files that were re-tested. The
            score line of <code>gooze run</code> counts cached and tested results in its scope
            and says how many were which.
          </p>
          <p>
            In the <Link href="/docs/quick-start"><code>calc</code> example</Link>, the run after
            the boundary tests were added tested all 13 mutations, because the test file changed.
            Running again without changes tests nothing and still reports the full score:
          </p>
          <CodeBlock lang="text" code="Mutation score: 100.00% (13 killed, 0 survived; 13 cached, 0 tested)" />
          <p>
            To check before a run, <code>gooze run --estimate</code> marks the files that will be
            served from the cache in a <code>CACHE</code> column, with an <code>N CACHED</code> total:
          </p>
          <CodeBlock
            lang="text"
            code={` PATH          │ MUTATIONS │   CACHE   
───────────────┼───────────┼───────────
 calc.go       │    13     │ cached    
───────────────┼───────────┼───────────
 TOTAL FILES 1 │    13     │ 13 CACHED 

13 of 13 mutations are in cached files and will not be re-tested; use --no-cache to re-test everything.`}
          />
          <p>
            Changes are detected from file contents, not from git: no base branch, commit, or
            history is needed, and uncommitted edits are picked up. See{" "}
            <Link href="/docs/comparison#incremental-vs-diff">incremental execution vs git diff</Link>.
          </p>
          <p>
            What the cache does not see: changes in <em>other</em> files that a file&apos;s tests
            depend on (a helper in another file, a shared test fixture, <code>testdata</code>, a dependency bump).
            Those can leave a cached result out of date. Run a full pass with{" "}
            <code>--no-cache</code> on a schedule (for
            example nightly on <code>main</code>) to refresh the baseline.
          </p>
        </div>

        <div id="cache-matrix">
          <h2>Cache states at a glance</h2>
          <div className="mt-3 rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Cache</TableHead>
                  <TableHead>Behavior</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-muted-foreground">
                {cacheRows.map((r) => (
                  <TableRow key={r.action}>
                    <TableCell className="align-top">{withCode(r.action)}</TableCell>
                    <TableCell className="align-top">{r.state}</TableCell>
                    <TableCell className="align-top">{r.behavior}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div id="no-cache">
          <h2>Force a full re-run</h2>
          <p>
            If results look stale, or you changed something the cache can&apos;t see (test data,
            environment), ignore the cache for one run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
          <p className="text-sm text-muted-foreground">
            With <code>--no-cache</code> the score covers only what that run tested.
          </p>
        </div>

        <div id="share">
          <h2>Reuse the cache in CI</h2>
          <p>
            A fresh CI runner starts with an empty reports directory. Pull a baseline from an OCI
            registry before the run and push the updated one after:{" "}
            <Link href="/docs/ci/sharing-reports">Sharing reports (OCI)</Link>.
          </p>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
