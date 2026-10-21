import Link from "next/link"
import { DocsFaq, faqPageJsonLd } from "@/components/docs-faq"

import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = docsMetadata("/docs/mutation-testing")

// Visible Q&A + matching FAQPage JSON-LD from one source. Conceptual queries;
// the score wording matches Gooze's real formula and /docs/usage/results.
const faqs = [
  {
    q: "What is mutation testing?",
    a: "Mutation testing measures the quality of your test suite. It injects tiny, deliberate bugs (mutants) into your source code and runs your tests to see whether they catch the change.",
  },
  {
    q: "What is the difference between code coverage and mutation testing?",
    a: "Code coverage only measures whether a line ran during a test; it does not check that the result was asserted. Mutation testing checks that your tests have effective assertions: they must fail when the code's behavior changes.",
  },
  {
    q: "What does it mean when a mutant survives?",
    a: "A survived mutant means a bug was injected into your code but your tests still passed, which points to a gap in your assertions or missing coverage for that logic.",
  },
  {
    q: "What does it mean when a mutant is killed?",
    a: "A killed mutant is the success case: Gooze injected a bug and your test suite caught it by failing.",
  },
  {
    q: "How is the mutation score calculated?",
    a: "Mutation score = `killed / (all mutations − error)`. Survived, `not_covered`, and `timeout` results are in the denominator and lower the score; error mutations (mutants that don't compile) are left out.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

export default function MutationTestingPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">What is mutation testing?</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Mutation testing measures the quality of your test suite by injecting
        small, deliberate bugs (mutations) into your code and checking whether
        your tests catch them. It asks: if we break the code, do the tests fail?
      </p>

      <div id="vs-coverage">
        <h2>Code coverage vs. mutation testing</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>What it measures</TableHead>
              <TableHead>The blind spot</TableHead>
              <TableHead>How Gooze uses it</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Code coverage</TableCell>
              <TableCell>Which lines ran during the tests.</TableCell>
              <TableCell>
                A line can run without any assertion checking the result.
              </TableCell>
              <TableCell>
                Read as a filter (<code>--coverage-profile</code>) to skip
                untested lines, not trusted as a quality signal.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Mutation testing</TableCell>
              <TableCell>Whether tests fail when behavior changes.</TableCell>
              <TableCell>
                Needs a reasonable existing suite; more compute than a plain run.
              </TableCell>
              <TableCell>
                Injects mutations and verifies your tests catch them.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p>
          This is not just intuition. Just et al. (FSE 2014) found a test
          suite&apos;s ability to{" "}
          <a
            href="https://dl.acm.org/doi/10.1145/2635868.2635929"
            target="_blank"
            rel="noopener noreferrer"
          >
            kill mutants correlates with detecting real faults
          </a>
          , and Inozemtseva &amp; Holmes (ICSE 2014) found that{" "}
          <a
            href="https://dl.acm.org/doi/10.1145/2568225.2568271"
            target="_blank"
            rel="noopener noreferrer"
          >
            coverage alone is not strongly correlated with test-suite
            effectiveness
          </a>
          .
        </p>
      </div>

      <div id="glossary">
        <h2>Core terminology</h2>
        <dl>
          <dt><strong>Mutant</strong></dt>
          <dd>
            A copy of your code with one small, deliberate change injected by
            Gooze (for example, <code>&gt;</code> → <code>&gt;=</code>).
          </dd>
          <dt><strong>Killed</strong></dt>
          <dd>The desired outcome: a test failed on the mutant, so the change was caught.</dd>
          <dt><strong>Survived</strong></dt>
          <dd>A gap: the mutant was injected but every test still passed.</dd>
          <dt><strong>Mutation score</strong></dt>
          <dd>
            <code>killed / (all mutations − error)</code>. Survived,
            <code>not_covered</code>, and <code>timeout</code> lower it; <code>error</code> is excluded. See{" "}
            <Link href="/docs/usage/results/">reading results</Link> for every
            status.
          </dd>
        </dl>
      </div>

      <div>
        <div id="idea">
          <h2>The basic idea</h2>
          <ol>
            <li>Take your real code.</li>
            <li>Make one tiny change (a mutation).</li>
            <li>Run your tests.</li>
            <li>
              If tests fail, good: the mutation is <strong>killed</strong>.
              If tests still pass, not good: the mutation <strong>survived</strong>.
            </li>
          </ol>
        </div>

        <div id="why">
          <h2>Why people use it</h2>
          <ul>
            <li>Your tests can be green but still miss important behavior.</li>
            <li>Mutation testing shows where assertions are missing or too weak.</li>
            <li>It gives a repeatable signal in CI (not just &quot;coverage&quot;).</li>
          </ul>
        </div>

        <div id="example">
          <h2>A small example (what Gooze finds)</h2>
          <p>
            Code:
          </p>
          <CodeBlock
            lang="go"
            code={`func label(balance int) string {
    if balance > 0 {
        return "positive"
    }
    return "not-positive"
}
`}
          />

          <p>
            Test (too weak): it only checks <code>balance = 1</code>.
          </p>
          <CodeBlock
            lang="go"
            code={`import "testing"

func TestLabel_Positive(t *testing.T) {
    got := label(1)
    if got != "positive" {
        t.Fatalf("expected positive, got %q", got)
    }
}
`}
          />

          <p>
            One common mutation is changing <code>&gt;</code> to <code>&gt;=</code>.
            With that change, <code>balance = 0</code> returns <code>&quot;positive&quot;</code>.
            If you do not test <code>balance = 0</code>, this mutation can survive.
          </p>
          <CodeBlock
            lang="diff"
            code={`- if balance > 0 {
+ if balance >= 0 {
    return "positive"
}`}
          />

          <p>
            Fix: add a test for <code>balance = 0</code> (and maybe negative too).
          </p>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
