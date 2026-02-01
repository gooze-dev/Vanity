import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
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
          <Link
            href="https://github.com/gooze-dev/gooze"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
          <ThemeToggle />
        </div>

        {/* Hero Content */}
        <div className="flex max-w-[980px] flex-col items-center gap-8 text-center">
          <h1 className="text-6xl font-extrabold leading-tight md:text-8xl lg:text-9xl" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#7DBC23' }}>GO</span>
            <span style={{ color: '#4CB8B8' }}>OZE</span>
          </h1>
          <p className="max-w-[750px] text-xl text-muted-foreground sm:text-2xl">
            Mutation testing for Go that helps you assess the quality of your
            test suite
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/docs">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link
                href="https://github.com/gooze-dev/gooze"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-0.5 bg-foreground/20 rounded-full"></div>
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
              rerunning your test suite. If a test fails, the mutation is "killed".
              If tests still pass, the mutation "survived" — your tests didn’t notice a behavior change.
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
            <div className="rounded-lg  bg-card p-6 text-center mb-12">
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
                    <div className="text-zinc-300">    return "positive"</div>
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
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">Install GOOZE</h3>
                  <p className="text-muted-foreground mb-4">
                    Install with a single command using Go's package manager
                  </p>
                  <div className="rounded-lg bg-muted p-4">
                    <code className="text-sm">go install gooze.dev/pkg/gooze@latest</code>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">Run Mutation Tests</h3>
                  <p className="text-muted-foreground mb-4">
                    Execute mutation testing across your codebase
                  </p>
                  <div className="rounded-lg bg-muted p-4">
                    <code className="text-sm">gooze run ./...</code>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">View Results</h3>
                  <p className="text-muted-foreground mb-4">
                    Get detailed insights into your test suite's effectiveness
                  </p>
                  <div className="rounded-lg bg-muted p-4">
                    <code className="text-sm">gooze view</code>
                  </div>
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

