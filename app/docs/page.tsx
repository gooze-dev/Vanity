import Link from "next/link"

import { GoozeLogo } from "@/components/gooze-logo"
import { GoozePrimaryCtaButton } from "@/components/gooze-cta-button"

export default function DocsPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        <GoozeLogo />
      </h1>
      <p className="text-lg text-muted-foreground mb-10">
        Mutation testing for Go: Gooze mutates your source and runs tests to see what your suite catches.
      </p>

      <div className="space-y-12">
        <div id="get-started" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Get started</h2>
          <p className="mb-4 text-muted-foreground">
            Install Gooze, preview what will be mutated, run mutation testing, then view the latest report.
          </p>

          <GoozePrimaryCtaButton asChild>
            <Link href="/docs/quick-start">Open Quick start</Link>
          </GoozePrimaryCtaButton>
        </div>

        <div id="features" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/docs/features/bypass-mutation"
              className="rounded-lg border bg-card p-5 hover:bg-muted/50 hover:border-[color:var(--gooze-teal)] transition-colors"
            >
              <div className="font-semibold mb-1">Bypass mutation</div>
              <div className="text-sm text-muted-foreground">Use -x and //gooze:ignore to skip.</div>
            </Link>
            <Link
              href="/docs/features/incremental-execution"
              className="rounded-lg border bg-card p-5 hover:bg-muted/50 hover:border-[color:var(--gooze-teal)] transition-colors"
            >
              <div className="font-semibold mb-1">Incremental execution</div>
              <div className="text-sm text-muted-foreground">Output (-o), reports, and OCI storage.</div>
            </Link>
            <Link
              href="/docs/features/ui-modes"
              className="rounded-lg border bg-card p-5 hover:bg-muted/50 hover:border-[color:var(--gooze-teal)] transition-colors"
            >
              <div className="font-semibold mb-1">UI modes</div>
              <div className="text-sm text-muted-foreground">TTY vs NOT TTY behavior.</div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

