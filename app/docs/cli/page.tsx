import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

const commands = [
  { title: "run", href: "/docs/cli/run", desc: "Run mutation testing (use --estimate to preview)" },
  { title: "report", href: "/docs/cli/report", desc: "View, merge, push, and pull reports" },
  { title: "config", href: "/docs/cli/config", desc: "Manage configuration (config init)" },
  { title: "version", href: "/docs/cli/version", desc: "Print version/build info" },
]

export const metadata = docsMetadata("/docs/cli")

export default function CliPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">CLI reference</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This page is a simple map of the Gooze commands and the most common flags.
      </p>

      <div className="space-y-12">
        <div id="basic">
          <h2 className="text-2xl font-semibold mb-3">Basic usage</h2>
          <CodeBlock lang="bash" code="gooze [global flags] <command> [command flags] [paths...]" />
          <p className="mt-3 text-muted-foreground">Most people start with:</p>
          <div className="space-y-2">
            <CodeBlock lang="bash" code="gooze run --estimate ./..." />
            <CodeBlock lang="bash" code="gooze run ./..." />
            <CodeBlock lang="bash" code="gooze report view" />
          </div>
        </div>

        <div id="global-flags">
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
              <code className="bg-muted px-1 py-0.5 rounded">--coverage-profile &lt;file&gt;</code>: skip mutations on lines not covered by an existing Go coverage profile (<code className="bg-muted px-1 py-0.5 rounded">run</code> only)
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

        <div id="exit-codes">
          <h2 className="text-2xl font-semibold mb-3">Exit codes</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><code className="bg-muted px-1 py-0.5 rounded">0</code>: the command completed, whatever the mutation score.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">1</code>: the command failed (bad flag or config, build or I/O error, registry error, interrupted).</li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            Survivors never change the exit code, and there is no threshold flag yet. To fail a
            build below a minimum score, use the{" "}
            <Link href="/docs/ci/github#gate" className="underline underline-offset-4">score gate step</Link>.
          </p>
        </div>

        <div id="commands">
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
