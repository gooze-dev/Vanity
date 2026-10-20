import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { GoozeLogo } from "@/components/gooze-logo"
import { GoozePrimaryCtaButton } from "@/components/gooze-cta-button"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"

// One row of cards per sidebar section, pointing at the most-used pages.
const sections = [
  {
    id: "using",
    title: "Using gooze",
    cards: [
      { title: "Reading results", href: "/docs/usage/results", desc: "Statuses, survivors, and what to do next." },
      { title: "Ignoring code", href: "/docs/usage/ignoring-code", desc: "Use -x and //gooze:ignore to skip." },
      { title: "Incremental runs", href: "/docs/usage/incremental-runs", desc: "Re-test only what changed." },
    ],
  },
  {
    id: "ci",
    title: "CI & teams",
    cards: [
      { title: "GitHub Actions", href: "/docs/ci/github", desc: "From a one-liner to a cached pipeline." },
      { title: "Sharding and merging", href: "/docs/ci/sharding", desc: "Split a run across parallel jobs." },
      { title: "Sharing reports (OCI)", href: "/docs/ci/sharing-reports", desc: "One baseline for CI and teammates." },
    ],
  },
  {
    id: "reference",
    title: "Reference",
    cards: [
      { title: "CLI reference", href: "/docs/cli", desc: "Every command and flag." },
      { title: "Configuration", href: "/docs/config", desc: "gooze.yaml, env vars, and precedence." },
      { title: "Mutation operators", href: "/docs/mutations", desc: "What gooze changes in your code." },
    ],
  },
]

export const metadata = docsMetadata("/docs")

export default function DocsPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        <GoozeLogo />
      </h1>
      <p className="text-lg text-muted-foreground mb-10">
        Mutation testing for Go: Gooze mutates your source and runs tests to see what your suite catches.
      </p>

      <div className="rounded-lg border bg-card p-5 mb-12">
        <h2 className="text-xl font-semibold mb-2">New to mutation testing?</h2>
        <p className="text-muted-foreground mb-4">
          No problem. Start with the basics, then run Gooze once and read a report.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/mutation-testing"
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
          >
            What is mutation testing?
          </Link>
          <Link
            href="/docs/install"
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
          >
            Installation
          </Link>
          <Link
            href="/docs/cli"
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
          >
            CLI reference
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        <div id="get-started">
          <h2 className="text-2xl font-semibold mb-3">Get started</h2>
          <p className="mb-4 text-muted-foreground">
            Install Gooze, preview what will be mutated, run mutation testing, then view the latest report.
          </p>

          <GoozePrimaryCtaButton asChild>
            <Link href="/docs/quick-start">Open Quick start</Link>
          </GoozePrimaryCtaButton>
        </div>

        {sections.map((section) => (
          <div key={section.id} id={section.id}>
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {section.cards.map((card) => (
                <Item key={card.href} variant="outline" asChild className="hover:border-[color:var(--gooze-teal)]">
                  <Link href={card.href}>
                    <ItemContent>
                      <ItemTitle>{card.title}</ItemTitle>
                      <ItemDescription>{card.desc}</ItemDescription>
                    </ItemContent>
                  </Link>
                </Item>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

