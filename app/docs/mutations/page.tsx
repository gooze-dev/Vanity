import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"

export default function MutationsPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Mutations</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A mutation is a tiny change in your code.
        Gooze applies one mutation and runs tests to see if tests notice.
      </p>

      <div className="space-y-12">
        <div id="statuses" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Statuses</h2>
          <p className="mb-3 text-muted-foreground">
            Each mutation ends in a status.
            Simple meaning:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong>Killed</strong>: tests failed for the mutation (usually good)
            </li>
            <li>
              <strong>Survived</strong>: tests still passed (usually means weak/missing assertion)
            </li>
            <li>
              <strong>Skipped</strong>: Gooze did not run it (example: no matching test)
            </li>
            <li>
              <strong>Error</strong>: Gooze had an unexpected error
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            About timeouts: different Gooze versions can show timeouts differently.
            If you see many suspicious kills, check logs and try <code className="bg-muted px-1 py-0.5 rounded">--verbose</code>.
          </p>
        </div>

        <div id="types" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Mutation types (common)</h2>
          <p className="mb-3 text-muted-foreground">
            Gooze usually enables a subset of mutation types by default.
            Common ones you may see:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>arithmetic</li>
            <li>boolean</li>
            <li>numbers</li>
            <li>comparison</li>
            <li>logical</li>
            <li>unary</li>
          </ul>
        </div>

        <div id="what-to-do" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">What to do when you see a survivor</h2>
          <p className="mb-3 text-muted-foreground">
            A survivor is a hint.
            It usually means: your tests do not check this behavior.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Open the diff in <code className="bg-muted px-1 py-0.5 rounded">gooze view</code>.</li>
            <li>Ask: what behavior changed?</li>
            <li>Add a test that would fail if this behavior changes.</li>
            <li>Run Gooze again and see if it is killed now.</li>
          </ol>
          <div className="mt-4">
            <CodeBlock lang="bash" code="gooze view" />
          </div>
        </div>

        <div id="learn" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Next pages</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/docs/mutation-testing">Mutation testing basics</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/reports">Reports</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/troubleshooting">Troubleshooting</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
