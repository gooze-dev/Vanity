import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

const subcommands = [
  { title: "report view", href: "/docs/cli/report/view", desc: "View existing reports" },
  { title: "report merge", href: "/docs/cli/report/merge", desc: "Merge shard reports" },
  { title: "report push", href: "/docs/cli/report/push", desc: "Push reports to an OCI registry" },
  { title: "report pull", href: "/docs/cli/report/pull", desc: "Pull reports from an OCI registry" },
]

export default function CliReportPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze report</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Work with reports that Gooze has already written: view them, merge sharded
        results, and store or restore them from an OCI registry.
      </p>

      <div className="space-y-12">
        <div id="usage" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze report <subcommand> [flags]" />
          <p className="mt-3 text-muted-foreground">
            All subcommands read from (or write to) the reports directory set by{" "}
            <code className="bg-muted px-1 py-0.5 rounded">-o/--output</code>.
            Default is <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>.
          </p>
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
