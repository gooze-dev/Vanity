import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"

// Default mutation types and their before -> after transformations.
const mutationTypes = [
  {
    name: "arithmetic",
    ops: "+ - * / %",
    desc: "Swaps a binary math operator. Catches off-by-operator bugs and results that are computed but never asserted.",
    rule: "each operator becomes every other arithmetic operator (- shown; also *, /, %)",
    example: `- sum := a + b
+ sum := a - b`,
    survives: "no test checks the numeric result of this expression.",
  },
  {
    name: "comparison",
    ops: "< > <= >= == !=",
    desc: "Swaps a relational operator. Great at exposing untested boundaries (off-by-one) and branches that are never taken in tests.",
    rule: "each operator becomes every other comparison operator (>= shown; also >, <=, ==, !=)",
    example: `- if a < b {
+ if a >= b {`,
    survives: "a boundary or the two branches of this condition aren't both exercised.",
  },
  {
    name: "logical",
    ops: "&& ||",
    desc: "Flips AND/OR. Reveals conditions where one operand never actually decides the outcome in your tests.",
    rule: "&& becomes ||, and || becomes &&",
    example: `- if a && b {
+ if a || b {`,
    survives: "one side of the condition is never the deciding factor in any test.",
  },
  {
    name: "boolean",
    ops: "true false",
    desc: "Inverts a boolean literal. Surfaces feature flags and defaults whose effect is never asserted.",
    rule: "true becomes false, and false becomes true",
    example: `- enabled := true
+ enabled := false`,
    survives: "the value of this flag doesn't change any tested behavior.",
  },
  {
    name: "numbers",
    ops: "int & float literals",
    desc: "Replaces a numeric constant with 0 and 1. Finds magic numbers (limits, sizes, rates) that no test pins down.",
    rule: "a numeric literal becomes 0 and 1 (0 shown)",
    example: `- limit := 5
+ limit := 0`,
    survives: "the exact value of this constant doesn't matter to any test.",
  },
  {
    name: "unary",
    ops: "- + ! ^",
    desc: "Flips a sign or drops a negation. Catches missing checks on negation, sign, and bitwise complement.",
    rule: "-x becomes +x (and vice versa); ! and ^ are removed",
    example: `- ok := !flag
+ ok := flag`,
    survives: "the negation/sign here isn't checked by a test.",
  },
]

const reference = `arithmetic   + - * / %         each -> every other operator
comparison   < > <= >= == !=   each -> every other operator
logical       && ||            && <-> ||
boolean       true false       true <-> false
numbers       5, 2.5, ...      literal -> 0 and 1
unary         - + ! ^          - <-> + ;  ! and ^ removed`

export const metadata = docsMetadata("/docs/mutations")

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
              <strong>Not covered</strong>: the mutated line is not covered by the coverage profile
              passed with <code className="bg-muted px-1 py-0.5 rounded">--coverage-profile</code>, so
              Gooze skipped its tests. It counts as a survivor (it lowers the score) but is tallied
              separately.
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
          <h2 className="text-2xl font-semibold mb-3">Mutation types</h2>
          <p className="mb-3 text-muted-foreground">
            These six types run by default. Each one makes a single, mechanical change to
            one spot in your code, then your tests run against it. If the tests still pass,
            the mutation <strong>survived</strong> — a gap in coverage. Each example below is
            shown as a diff: the <code className="bg-muted px-1 py-0.5 rounded">-</code> line is
            your code, the <code className="bg-muted px-1 py-0.5 rounded">+</code> line is what
            Gooze runs instead.
          </p>
          <p className="mb-3 text-muted-foreground">Quick reference:</p>
          <CodeBlock lang="text" code={reference} />

          <div className="mt-6 space-y-8">
            {mutationTypes.map((t) => (
              <div key={t.name} id={t.name} className="scroll-mt-20">
                <h3 className="text-lg font-semibold">
                  <code className="bg-muted px-1 py-0.5 rounded">{t.name}</code>{" "}
                  <span className="text-sm font-normal text-muted-foreground">— {t.ops}</span>
                </h3>
                <p className="mt-1 mb-1 text-muted-foreground">{t.desc}</p>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-medium">Rule:</span> {t.rule}
                </p>
                <CodeBlock lang="diff" code={t.example} />
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">If it survives:</span> {t.survives}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-muted-foreground">
            The engine also contains <code className="bg-muted px-1 py-0.5 rounded">branch</code>{" "}
            (replace a condition with <code className="bg-muted px-1 py-0.5 rounded">true</code>/<code className="bg-muted px-1 py-0.5 rounded">false</code>),{" "}
            <code className="bg-muted px-1 py-0.5 rounded">statement</code> (delete a statement), and{" "}
            <code className="bg-muted px-1 py-0.5 rounded">loop</code> (loop boundaries and body
            removal) mutators; these are not part of the default set.
          </p>

          <p className="mt-3 text-muted-foreground">
            Skip a line or block with the{" "}
            <Link href="/docs/features/bypass-mutation" className="underline underline-offset-4">bypass annotation</Link>.
          </p>
        </div>

        <div id="what-to-do" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">What to do when you see a survivor</h2>
          <p className="mb-3 text-muted-foreground">
            A survivor is a hint.
            It usually means: your tests do not check this behavior.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Open the diff in <code className="bg-muted px-1 py-0.5 rounded">gooze report view</code>.</li>
            <li>Ask: what behavior changed?</li>
            <li>Add a test that would fail if this behavior changes.</li>
            <li>Run Gooze again and see if it is killed now.</li>
          </ol>
          <div className="mt-4">
            <CodeBlock lang="bash" code="gooze report view" />
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
