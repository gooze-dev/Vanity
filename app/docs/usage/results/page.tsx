import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/usage/results")

export default function ResultsPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Reading results</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Every mutation ends in one status. The statuses decide your mutation score and tell you
        where your tests are weak.
      </p>

      <div className="space-y-12">
        <div id="view">
          <h2 className="text-2xl font-semibold mb-3">Open the results</h2>
          <p className="mb-3 text-muted-foreground">
            After a run, open the viewer. It reads the reports directory and shows every mutation
            with its diff.
          </p>
          <CodeBlock lang="bash" code="gooze report view" />
          <p className="mt-3 text-sm text-muted-foreground">
            Keys and flags: <Link href="/docs/cli/report#view" className="underline underline-offset-4">gooze report view</Link>.
            File layout: <Link href="/docs/reports" className="underline underline-offset-4">Report format</Link>.
          </p>
        </div>

        <div id="statuses">
          <h2 className="text-2xl font-semibold mb-3">Statuses</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">killed</code>: the tests of the package
              that owns the mutated file failed for the mutation
              (<code className="bg-muted px-1 py-0.5 rounded">go test -count=1</code> on that package).
              Usually good: your tests caught the change.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">survived</code>: the package tests still
              passed. Usually a weak or missing assertion.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">not_covered</code>: the mutated line is
              uncovered in the profile passed with{" "}
              <code className="bg-muted px-1 py-0.5 rounded">--coverage-profile</code>, so Gooze
              skipped its tests. It counts as a survivor (it lowers the score) but is tallied
              separately.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">timeout</code>: the tests exceeded{" "}
              <code className="bg-muted px-1 py-0.5 rounded">--mutation-timeout</code> (default 120
              seconds). A timeout is not a kill.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">error</code>: the mutant did not
              compile; excluded from the score.
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            A missing test file does not skip anything: Gooze runs the sibling{" "}
            <code className="bg-muted px-1 py-0.5 rounded">&lt;name&gt;_test.go</code> if it exists, otherwise any{" "}
            <code className="bg-muted px-1 py-0.5 rounded">*_test.go</code> in the same package. If the package has no test file at all,
            the mutation is reported as <strong>survived</strong>.
          </p>
        </div>

        <div id="score">
          <h2 className="text-2xl font-semibold mb-3">Mutation score</h2>
          <CodeBlock lang="text" code="score = killed / (all mutations - error)" />
          <ul className="mt-3 list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              Only <code className="bg-muted px-1 py-0.5 rounded">killed</code> counts in your favour.{" "}
              <code className="bg-muted px-1 py-0.5 rounded">survived</code>,{" "}
              <code className="bg-muted px-1 py-0.5 rounded">not_covered</code>, and{" "}
              <code className="bg-muted px-1 py-0.5 rounded">timeout</code> all lower the score.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">error</code> mutants (did not compile) are
              left out entirely. With no scorable mutations the score is 100%.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">gooze run</code>,{" "}
              <code className="bg-muted px-1 py-0.5 rounded">gooze report merge</code>, and a non-interactive{" "}
              <code className="bg-muted px-1 py-0.5 rounded">gooze report view</code> print it as{" "}
              <code className="bg-muted px-1 py-0.5 rounded">Mutation score: NN.NN%</code>. To fail CI
              below a minimum, see{" "}
              <Link href="/docs/ci/github#gate" className="underline underline-offset-4">the score gate</Link>.
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">_index.yaml</code> stores the raw counts but
              not the score; its <code className="bg-muted px-1 py-0.5 rounded">failed_mutations</code>{" "}
              lumps <code className="bg-muted px-1 py-0.5 rounded">error</code> and{" "}
              <code className="bg-muted px-1 py-0.5 rounded">timeout</code> together, so use the printed
              score rather than recomputing it.
            </li>
          </ul>
        </div>

        <div id="survivors">
          <h2 className="text-2xl font-semibold mb-3">What to do when you see a survivor</h2>
          <p className="mb-3 text-muted-foreground">
            A survivor is a hint.
            It usually means: your tests do not check this behavior.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Open the diff in <code className="bg-muted px-1 py-0.5 rounded">gooze report view</code>.</li>
            <li>
              Ask: what behavior changed? Each{" "}
              <Link href="/docs/mutations" className="underline underline-offset-4">mutation operator</Link>{" "}
              explains what a survivor of its kind usually means.
            </li>
            <li>Add a test that would fail if this behavior changes.</li>
            <li>Run Gooze again and see if it is killed now.</li>
          </ol>
          <p className="mt-4 text-muted-foreground">
            If the code genuinely should not be tested (generated code, debug helpers), skip it
            instead: see <Link href="/docs/usage/ignoring-code" className="underline underline-offset-4">Ignoring code</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
