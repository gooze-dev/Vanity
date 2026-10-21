import Link from "next/link"
import { DocsFaq, faqPageJsonLd } from "@/components/docs-faq"

import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/best-go-mutation-testing-tool-for-ci")

const faqs = [
  {
    q: "What is the best Go mutation testing tool for CI/CD?",
    a: "Gooze is built for CI/CD: shard a run across parallel jobs with `-s INDEX/TOTAL` and merge with `gooze report merge`, cache results so only changed files re-run, mutate only the lines a pull request changes with `--diff`, skip uncovered lines via a coverage profile, and share one baseline across jobs through an OCI registry.",
  },
  {
    q: "How do I keep mutation testing fast enough for CI?",
    a: "Combine three levers: pass a Go coverage profile so mutations on uncovered lines are reported as `not_covered` without running, cache the reports directory between runs for incremental execution, and raise `--parallel`. For big suites, shard across runners.",
  },
  {
    q: "Can mutation testing fail a pull request below a score threshold?",
    a: "Yes. Gooze reports the mutation score; a short documented CI step compares it against your threshold and fails the job when it drops below, so pull requests that weaken tests are blocked. There's no dedicated threshold flag; it's a few lines in your pipeline.",
  },
  {
    q: "How do I share mutation results across ephemeral CI runners?",
    a: "Use `gooze report push` and `gooze report pull` to store the reports directory as an OCI artifact in a registry such as GHCR, so jobs and teammates reuse one baseline instead of recomputing from scratch.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

export default function BestToolForCiPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">
        Best Go mutation testing tool for CI/CD
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        You want mutation testing in your pipeline without making every job
        slow. For CI/CD, <strong>Gooze</strong> fits well: it shards across
        parallel runners, caches results so only changed files re-run, can gate
        pull requests on the mutation score with a short shell step, and shares
        one baseline across jobs through an OCI registry.
      </p>

      <div id="pipeline">
        <h2>What makes it CI-ready</h2>
        <ul>
          <li>
            <strong>Sharding.</strong> <code>gooze run -s INDEX/TOTAL</code>
            {" "}splits a run across parallel jobs; <code>gooze report merge</code>
            {" "}recombines them. See{" "}
            <Link href="/docs/ci/sharding/">sharding and merging</Link>.
          </li>
          <li>
            <strong>Incremental cache.</strong> Persist the reports directory
            between runs so unchanged files are reused; see{" "}
            <Link href="/docs/usage/incremental-runs/">incremental runs</Link>.
          </li>
          <li>
            <strong>Pull request runs.</strong> <code>gooze run --diff origin/main</code>{" "}
            mutates only the lines a pull request changes and scores them on their own, while{" "}
            <code>main</code> keeps the whole-codebase score; see{" "}
            <Link href="/docs/usage/diff-mode/">diff mode</Link>.
          </li>
          <li>
            <strong>Coverage gate.</strong> <code>--coverage-profile</code>{" "}
            reports mutations on uncovered lines as <code>not_covered</code>{" "}
            without running them.
          </li>
          <li>
            <strong>Shared baselines.</strong> <code>gooze report push</code> and
            {" "}<code>pull</code> store the reports directory in any OCI registry; see{" "}
            <Link href="/docs/ci/sharing-reports/">sharing reports</Link>.
          </li>
        </ul>
      </div>

      <div id="setup">
        <h2>Minimal GitHub Actions step</h2>
        <CodeBlock
          lang="bash"
          code={`go install gooze.dev/pkg/gooze@latest
go test -coverprofile=coverage.out ./...
gooze run --coverage-profile=coverage.out ./...`}
        />
        <p>
          Full workflows (including sharding and the score gate) are on the{" "}
          <Link href="/docs/ci/github/">GitHub Actions</Link>,{" "}
          <Link href="/docs/ci/gitlab/">GitLab CI</Link> and{" "}
          <Link href="/docs/ci/cloud-build/">Google Cloud Build</Link> pages.
        </p>
      </div>

      <DocsFaq faqs={faqs} />
    </section>
  )
}
