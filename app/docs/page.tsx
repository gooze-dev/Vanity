import { docsMetadata } from "@/lib/docs-meta"
import { docsSections, getSectionLanding } from "@/lib/docs-pages"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { GoozeLogo } from "@/components/gooze-logo"
import { GoozePrimaryCtaButton } from "@/components/gooze-cta-button"

// Section links come from lib/docs-pages.ts, the same source as the sidebar.
// "Get started" is skipped: its landing page is this page.
const sectionLinks = docsSections.flatMap((section) => {
  const landing = getSectionLanding(section)
  return landing && landing.href !== "/docs" ? [{ section, href: landing.href }] : []
})

export const metadata = docsMetadata("/docs")

export default function DocsPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">
        <GoozeLogo />
      </h1>
      <p className="text-lg text-muted-foreground mb-10">
        Your tests pass, but would they fail if the code were wrong? Gooze is mutation testing for
        Go: it makes small changes to your source, runs your tests against each one and shows you
        the changes they miss.
      </p>

      <div className="rounded-lg border bg-card p-5 mb-12">
        <h2>New to mutation testing?</h2>
        <p>
          Read{" "}
          <Link href="/docs/mutation-testing" className="underline underline-offset-4">
            What is mutation testing?
          </Link>{" "}
          first, then come back for your first run.
        </p>
      </div>

      <div id="get-started">
        <h2>Get started</h2>
        <p>Install Gooze, run it from your module root, then read the report:</p>

        <CodeBlock
          lang="bash"
          code={`go install gooze.dev/pkg/gooze@latest
gooze run ./...
gooze report view`}
        />
        <p className="text-sm text-muted-foreground mb-4">
          The Quick start walks through a first run on a small package, from the surviving mutants
          to the tests that kill them, plus faster runs with <code>--coverage-profile</code> and
          parallel workers.
        </p>

        <GoozePrimaryCtaButton asChild>
          <Link href="/docs/quick-start">Open Quick start</Link>
        </GoozePrimaryCtaButton>
      </div>

      <div id="sections" className="mt-12">
        <h2>Sections</h2>
        <p>
          {sectionLinks.map((link, i) => (
            <span key={link.href}>
              {i > 0 && " · "}
              <Link href={link.href} className="underline underline-offset-4">
                {link.section}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
