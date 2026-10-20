import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/usage/results")

export default function ResultsPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Reading results</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Every mutation ends in one status. The statuses decide your mutation score and tell you
        where your tests are weak.
      </p>

      <div>
        <div id="view">
          <h2>Open the results</h2>
          <p>
            After a run, open the viewer. It reads the reports directory and shows every mutation
            with its diff.
          </p>
          <CodeBlock lang="bash" code="gooze report view" />
          <p className="text-sm text-muted-foreground">
            Keys and flags: <Link href="/docs/cli/report#view">gooze report view</Link>.
            File layout: <Link href="/docs/reports">Report format</Link>.
          </p>
        </div>

        <div id="statuses">
          <h2>Statuses</h2>
          <ul>
            <li>
              <code>killed</code>: the tests of the package
              that owns the mutated file failed for the mutation
              (<code>go test -count=1</code> on that package).
              Usually good: your tests caught the change.
            </li>
            <li>
              <code>survived</code>: the package tests still
              passed. Usually a weak or missing assertion.
            </li>
            <li>
              <code>not_covered</code>: the mutated line is
              uncovered in the profile passed with{" "}
              <code>--coverage-profile</code>, so Gooze
              skipped its tests. It counts as a survivor (it lowers the score) but is tallied
              separately.
            </li>
            <li>
              <code>timeout</code>: the tests exceeded{" "}
              <code>--mutation-timeout</code> (default 120
              seconds). A timeout is not a kill.
            </li>
            <li>
              <code>error</code>: the mutant did not
              compile; excluded from the score.
            </li>
          </ul>
          <p>
            A missing test file does not skip anything: Gooze runs the sibling{" "}
            <code>&lt;name&gt;_test.go</code> if it exists, otherwise any{" "}
            <code>*_test.go</code> in the same package. If the package has no test file at all,
            the mutation is reported as <strong>survived</strong>.
          </p>
        </div>

        <div id="score">
          <h2>Mutation score</h2>
          <CodeBlock lang="text" code="score = killed / (all mutations - error)" />
          <ul>
            <li>
              Only <code>killed</code> counts in your favour.{" "}
              <code>survived</code>,{" "}
              <code>not_covered</code>, and{" "}
              <code>timeout</code> all lower the score.
            </li>
            <li>
              <code>error</code> mutants (did not compile) are
              left out entirely. With no scorable mutations the score is 100%.
            </li>
            <li>
              <code>gooze run</code>,{" "}
              <code>gooze report merge</code>, and a non-interactive{" "}
              <code>gooze report view</code> print it as{" "}
              <code>Mutation score: NN.NN%</code>. To fail CI
              below a minimum, see{" "}
              <Link href="/docs/ci/github#gate">the score gate</Link>.
            </li>
            <li>
              <code>_index.yaml</code> stores the raw counts but
              not the score; its <code>failed_mutations</code>{" "}
              lumps <code>error</code> and{" "}
              <code>timeout</code> together, so use the printed
              score rather than recomputing it.
            </li>
          </ul>
        </div>

        <div id="survivors">
          <h2>What to do when you see a survivor</h2>
          <p>
            A survivor is a hint.
            It usually means: your tests do not check this behavior.
          </p>
          <ol>
            <li>Open the diff in <code>gooze report view</code>.</li>
            <li>
              Ask: what behavior changed? Each{" "}
              <Link href="/docs/mutations">mutation operator</Link>{" "}
              explains what a survivor of its kind usually means.
            </li>
            <li>Add a test that would fail if this behavior changes.</li>
            <li>Run Gooze again and see if it is killed now.</li>
          </ol>
          <p>
            If the code genuinely should not be tested (generated code, debug helpers), skip it
            instead: see <Link href="/docs/usage/ignoring-code">Ignoring code</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
