import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

const subcommands = [
  { title: "config init", href: "/docs/cli/config/init", desc: "Create a starter gooze.yaml" },
]

export const metadata = docsMetadata("/docs/cli/config")

export default function CliConfigPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze config</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Manage Gooze configuration. Today this generates a starter config file;
        it is the home for configuration commands as more are added.
      </p>

      <div className="space-y-12">
        <div id="usage" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze config <subcommand>" />
        </div>

        <div id="subcommands" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-4">Subcommands</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {subcommands.map((cmd) => (
              <Link
                key={cmd.title}
                href={cmd.href}
                className="rounded-lg border bg-card p-5 hover:bg-muted/50 hover:border-[color:var(--gooze-teal)] transition-colors"
              >
                <div className="font-semibold mb-1">{cmd.title}</div>
                <div className="text-sm text-muted-foreground">{cmd.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
