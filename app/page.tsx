import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GoozeOutlineCtaButton,
  GoozePrimaryCtaButton,
} from "@/components/gooze-cta-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { GoozeLogo } from "@/components/gooze-logo";
import { LatestReleaseBadge } from "@/components/latest-release-badge";
import { Github } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { ClaudeCodeAnnouncement } from "@/components/agent-install";

// Self-canonical for the homepage. The root layout no longer sets a default
// canonical (it would leak onto every other page).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Q&As rendered visibly on the page AND emitted as FAQPage JSON-LD from the
// same source, so the structured data always matches what people read. Wording
// kept truthful to the CLI (e.g. the score gate is a documented CI step, not a
// built-in flag).
const faqs = [
  {
    q: "What is Gooze?",
    a: "Gooze is an open-source mutation testing tool for Go (Golang) that measures the quality of your test suite by injecting small, deliberate bugs (mutations) into your code and checking whether your tests catch them.",
  },
  {
    q: "Why use Gooze for Go mutation testing?",
    a: "Gooze is built for scale and CI/CD. It features incremental caching that re-tests only changed files, sharding across parallel CI runners, coverage-profile integration to skip untested lines, and OCI-registry support to share baseline reports across teams.",
  },
  {
    q: "How can I speed up Go mutation testing with Gooze?",
    a: "Use incremental runs (Gooze caches results and re-tests only files whose source, test, or mutators changed), raise the --parallel worker count, or pass --coverage-profile so mutations on uncovered lines are tallied as not_covered without running tests.",
  },
  {
    q: "Our coverage is high but bugs still reach production. How does Gooze help?",
    a: "High line coverage only proves your code was executed, not that your assertions check the result. Gooze injects deliberate faults into your code and verifies your tests actually fail, proving the tests are meaningful.",
  },
  {
    q: "Mutation testing is slow. Will it block our CI/CD pipeline?",
    a: "Gooze is optimized for CI. Passing a Go coverage profile skips uncovered lines, incremental caching reuses unchanged results, and parallel workers keep builds fast.",
  },
  {
    q: "How can we use mutation testing as an automated quality gate?",
    a: "Configure your pipeline to compare the mutation score against a threshold and fail the job when it drops below it, using a short documented CI step (gooze does not need a built-in flag). This blocks pull requests that weaken your tests.",
  },
  {
    q: "How do we store reports across ephemeral CI runners?",
    a: "Gooze packages the reports directory as an OCI artifact. CI jobs can push and pull it to your existing container registry (such as GHCR) with gooze report push and gooze report pull, so runs share one baseline.",
  },
  {
    q: "How can developers see mutation results without waiting for CI?",
    a: "Gooze ships goozels, a language server (LSP) that surfaces mutation results inline in LSP-capable editors such as Neovim and Helix, so developers can fix weak tests before they commit.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero Section - Full Height */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
        {/* Floating Nav */}
        <div className="absolute top-8 right-8 z-10 flex items-center gap-4">
          <Link
            href="/docs"
            className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Documentation
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/gooze-dev/gooze"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
            <LatestReleaseBadge className="px-2 py-0.5 text-xs" />
          </div>
          <ThemeToggle />
        </div>

        {/* Hero Content */}
        <div className="flex w-full max-w-[980px] flex-col items-center gap-8 text-center">
          <h1 className="text-6xl font-extrabold leading-tight md:text-8xl lg:text-9xl">
            <GoozeLogo className="text-inherit" />
          </h1>
          <p className="max-w-[750px] text-xl text-muted-foreground sm:text-2xl">
            Gooze is an open-source mutation testing tool for Go that measures
            how good your tests really are: it injects small bugs into your
            code and checks whether your tests catch them.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <GoozePrimaryCtaButton
              asChild
              size="lg"
            >
              <Link href="/docs">Get Started</Link>
            </GoozePrimaryCtaButton>
            <GoozeOutlineCtaButton
              asChild
              variant="outline"
              size="lg"
            >
              <Link
                href="https://github.com/gooze-dev/gooze"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </Link>
            </GoozeOutlineCtaButton>
          </div>

          <div className="min-w-0 max-w-full text-left">
            <CodeBlock code="go install gooze.dev/pkg/gooze@latest" lang="bash" />
          </div>

          <ClaudeCodeAnnouncement />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-0.5 rounded-full bg-gradient-to-b from-[color:var(--gooze-green)] to-[color:var(--gooze-teal)] opacity-60" />
        </div>
      </section>

      {/* What is Mutation Testing Section */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              What is Mutation Testing?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Mutation testing measures how good your tests are at catching real bugs.
              It works by making small, intentional changes (mutations) to your code and
              rerunning your test suite. If a test fails, the mutation is &quot;killed&quot;.
              If tests still pass, the mutation &quot;survived&quot;: your tests didn&apos;t notice a behavior change.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              The research backs this up. Just et al. (FSE 2014) found that a test
              suite&apos;s ability to{" "}
              <a
                href="https://dl.acm.org/doi/10.1145/2635868.2635929"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                kill mutants correlates with detecting real faults
              </a>
              , while Inozemtseva &amp; Holmes (ICSE 2014) showed that{" "}
              <a
                href="https://dl.acm.org/doi/10.1145/2568225.2568271"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                code coverage alone is not strongly correlated with test-suite
                effectiveness
              </a>
              . Mutation score measures what coverage can&apos;t.
            </p>
            <div className="mx-auto max-w-2xl text-center mb-10">
              <p className="text-lg text-muted-foreground leading-relaxed mb-3">
                Here’s what mutation testing does on each run:
              </p>
              <ol className="mx-auto inline-block list-decimal pl-5 space-y-2 text-left text-lg text-muted-foreground leading-relaxed">
                <li>Generate a mutant (a small code change).</li>
                <li>Run the test suite against that mutant.</li>
                <li>
                  Report <span className="font-medium text-foreground">killed</span> vs{' '}
                  <span className="font-medium text-foreground">survived</span> and compute a mutation score.
                </li>
              </ol>
            </div>



            {/* Mutation Example */}
            <div className="rounded-lg  p-6 text-center mb-12">
              <h3 className="text-lg font-semibold mb-2">Here’s an example mutation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                One common mutation changes a comparison operator (like <code className="px-1.5 py-0.5 rounded bg-muted text-xs">&gt;</code> → <code className="px-1.5 py-0.5 rounded bg-muted text-xs">&gt;=</code>).
              </p>
              <div className="overflow-hidden rounded-md border border-zinc-700 text-left">
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>
                <div className="bg-black dark:bg-zinc-950 p-4 font-mono text-sm overflow-x-auto">
                  <div className="space-y-1">
                    <div className="text-zinc-500">gooze@linux:~/app $ gooze run ./...</div>
                    <div className="text-zinc-500">--- a/balance.go</div>
                    <div className="text-zinc-500">+++ b/balance.go</div>
                    <div className="text-zinc-500">@@ function label(balance int) string @@</div>
                    <div className="flex">
                      <span className="text-red-500 mr-2">-</span>
                      <span className="text-red-300">if balance &gt; 0 &#123;</span>
                    </div>
                    <div className="flex">
                      <span className="text-green-500 mr-2">+</span>
                      <span className="text-green-300">if balance &gt;= 0 &#123;</span>
                    </div>
                      <div className="text-zinc-300">    return &quot;positive&quot;</div>
                    <div className="text-zinc-300">&#125;</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight text-center mb-16">
              Get Started in 3 Steps
            </h2>
            
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="flex flex-col gap-4 items-stretch sm:flex-row sm:gap-8 sm:items-start">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--gooze-green)] to-[color:var(--gooze-teal)] text-white text-xl font-bold md:h-16 md:w-16 md:text-2xl">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold mb-3">Install Gooze</h3>
                  <p className="text-muted-foreground mb-4">
                      Install with a single command using Go&apos;s package manager
                  </p>
                  <CodeBlock code="go install gooze.dev/pkg/gooze@latest" lang="bash" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col gap-4 items-stretch sm:flex-row sm:gap-8 sm:items-start">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--gooze-green)] to-[color:var(--gooze-teal)] text-white text-xl font-bold md:h-16 md:w-16 md:text-2xl">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold mb-3">Run Mutation Tests</h3>
                  <p className="text-muted-foreground mb-4">
                    Execute mutation testing across your codebase
                  </p>
                  <CodeBlock code="gooze run ./..." lang="bash" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col gap-4 items-stretch sm:flex-row sm:gap-8 sm:items-start">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--gooze-green)] to-[color:var(--gooze-teal)] text-white text-xl font-bold md:h-16 md:w-16 md:text-2xl">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold mb-3">View Results</h3>
                  <p className="text-muted-foreground mb-4">
                      Get detailed insights into your test suite&apos;s effectiveness
                  </p>
                  <CodeBlock code="gooze report view" lang="bash" />
                </div>
              </div>
            </div>

            {/* Link to Documentation */}
            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/docs" className="flex items-center gap-2">
                  Read Full Documentation
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight text-center mb-12">
              Frequently asked questions
            </h2>
            <dl className="space-y-8">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-lg font-semibold mb-2">{f.q}</dt>
                  <dd className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-12 text-center text-muted-foreground">
              See how Gooze compares with other Go mutation testing tools in the{" "}
              <Link
                href="/docs/comparison/"
                className="underline underline-offset-4"
              >
                comparison
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Built by the Gooze team. Open source on GitHub.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://github.com/gooze-dev/gooze"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

