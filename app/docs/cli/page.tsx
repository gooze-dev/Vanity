import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

const commands = [
  { title: "init", href: "/docs/cli/init", desc: "Create a starter gooze.yaml" },
  { title: "list", href: "/docs/cli/list", desc: "Dry run: what would be mutated" },
  { title: "run", href: "/docs/cli/run", desc: "Run mutation testing" },
  { title: "view", href: "/docs/cli/view", desc: "View existing reports" },
  { title: "merge", href: "/docs/cli/merge", desc: "Merge shard reports" },
  { title: "version", href: "/docs/cli/version", desc: "Print version/build info" },
]

export default function CliPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">CLI reference</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This page is a simple map of the Gooze commands and the most common flags.
      </p>

      <div className="space-y-12">
        <div id="basic" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Basic usage</h2>
          <CodeBlock lang="bash" code="gooze [global flags] <command> [command flags] [paths...]" />
          <p className="mt-3 text-muted-foreground">Most people start with:</p>
          <div className="space-y-2">
            <CodeBlock lang="bash" code="gooze list ./..." />
            <CodeBlock lang="bash" code="gooze run ./..." />
            <CodeBlock lang="bash" code="gooze view" />
          </div>
        </div>

        <div id="global-flags" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Global flags</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">-o, --output &lt;dir&gt;</code>: where reports are written (default is usually <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>)
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">--no-cache</code>: re-test everything (do not reuse cached reports)
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">-x, --exclude &lt;regex&gt;</code>: exclude files by regex (you can repeat this)
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">-v, --verbose</code>: write extra debug logs
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">--log-output &lt;path&gt;</code>: write logs to a specific file
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Tip: flags can change between versions.
            If you are unsure, run <code className="bg-muted px-1 py-0.5 rounded">gooze --help</code> or <code className="bg-muted px-1 py-0.5 rounded">gooze run --help</code>.
          </p>
        </div>

        <div id="commands" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-4">Commands</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {commands.map((cmd) => (
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
