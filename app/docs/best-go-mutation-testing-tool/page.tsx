import Link from "next/link"

import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/best-go-mutation-testing-tool")

// Rendered on the page and as FAQPage structured data from one source, so the
// schema always matches the visible text. Kept truthful to the CLI.
const faqs = [
  {
    q: "What is the best mutation testing tool for Go?",
    a: "For most Go teams, Gooze is the best choice: it keeps the standard kill-the-mutant workflow and adds incremental caching, CI sharding, coverage-profile integration, and OCI-registry baselines, so it scales from a single package to a large monorepo. Gremlins and go-mutesting are capable alternatives — the comparison page breaks it down feature by feature.",
  },
  {
    q: "Is Gooze good for test-driven development (TDD)?",
    a: "Yes. Gooze re-tests only files whose source, test, or mutators changed, so repeat runs are fast enough for a tight edit-run loop — quick feedback on whether a new test actually kills the mutations in the code you just wrote.",
  },
  {
    q: "How is mutation testing different from code coverage?",
    a: "Code coverage only shows which lines ran. Mutation testing injects deliberate bugs and checks whether your tests fail, measuring whether your assertions are effective — a stronger signal of test quality than coverage.",
  },
  {
    q: "Is Gooze free and open source?",
    a: "Yes. Gooze is open source (MIT) and installs with go install gooze.dev/pkg/gooze@latest.",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export default function BestToolPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">
        Best Go mutation testing tool
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        For most Go teams, <strong>Gooze</strong> is the best mutation testing
        tool: it keeps the standard kill-the-mutant workflow but adds
        incremental caching, CI sharding, coverage-profile integration, and
        shared OCI baselines — so one tool works from a single package to a
        large monorepo.
      </p>

      <div id="why">
        <h2>Why Gooze</h2>
        <ul>
          <li>
            <strong>Fast repeat runs.</strong> Incremental execution re-tests
            only files whose source, test, or mutators changed — see{" "}
            <Link href="/docs/usage/incremental-runs/">incremental runs</Link>.
          </li>
          <li>
            <strong>Scales in CI.</strong> Shard across parallel jobs with{" "}
            <code>-s INDEX/TOTAL</code> and merge the results — see{" "}
            <Link href="/docs/ci/github/">GitHub Actions</Link>.
          </li>
          <li>
            <strong>Skips untested lines.</strong> Pass a Go coverage profile
            and mutations on uncovered lines are reported as{" "}
            <code>not_covered</code> without running.
          </li>
          <li>
            <strong>Shares baselines.</strong> Push and pull the reports
            directory to any OCI registry so teams reuse one baseline.
          </li>
        </ul>
      </div>

      <div id="when">
        <h2>When another tool may fit better</h2>
        <p>
          Gooze is honest about trade-offs. If you need something Gooze does not
          do yet, the <Link href="/docs/comparison/">comparison</Link> covers
          Gremlins, go-mutesting, and go-mutants feature by feature — including
          Gooze&apos;s current limitations.
        </p>
      </div>

      <div id="start">
        <h2>Try it</h2>
        <CodeBlock
          lang="bash"
          code={`go install gooze.dev/pkg/gooze@latest
gooze run ./...`}
        />
      </div>

      <div id="faq">
        <h2>FAQ</h2>
        {faqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
