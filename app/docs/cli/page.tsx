import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"

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
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">CLI reference</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This page is a simple map of the Gooze commands and the most common flags.
      </p>

      <div>
        <div id="basic">
          <h2>Basic usage</h2>
          <CodeBlock lang="bash" code="gooze [global flags] <command> [command flags] [paths...]" />
          <p>Most people start with:</p>
          <div>
            <CodeBlock lang="bash" code="gooze run --estimate ./..." />
            <CodeBlock lang="bash" code="gooze run ./..." />
            <CodeBlock lang="bash" code="gooze report view" />
          </div>
        </div>

        <div id="global-flags">
          <h2>Global flags</h2>
          <ul>
            <li>
              <code>-o, --output &lt;dir&gt;</code>: where reports are written (default is usually <code>.gooze-reports</code>)
            </li>
            <li>
              <code>--no-cache</code>: re-test everything (do not reuse cached reports)
            </li>
            <li>
              <code>-x, --exclude &lt;regex&gt;</code>: exclude files by regex (you can repeat this)
            </li>
            <li>
              <code>-v, --verbose</code>: write extra debug logs
            </li>
            <li>
              <code>--log-output &lt;path&gt;</code>: write logs to a specific file
            </li>
          </ul>
          <p>
            Flags that only apply to one command, such as <code>--coverage-profile</code>, are listed on that
            command&apos;s page (see <Link href="/docs/cli/run#flags">gooze run</Link>).
          </p>
          <p>
            Tip: flags can change between versions.
            If you are unsure, run <code>gooze --help</code> or <code>gooze run --help</code>.
          </p>
        </div>

        <div id="exit-codes">
          <h2>Exit codes</h2>
          <ul>
            <li><code>0</code>: the command completed, whatever the mutation score.</li>
            <li><code>1</code>: the command failed (bad flag or config, build or I/O error, registry error, interrupted).</li>
          </ul>
          <p>
            Survivors never change the exit code, and there is no threshold flag yet. To fail a
            build below a minimum score, use the{" "}
            <Link href="/docs/ci/github#gate">score gate step</Link>.
          </p>
        </div>

        <div id="commands">
          <h2>Commands</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {commands.map((cmd) => (
              <Item key={cmd.title} variant="outline" asChild className="hover:border-[color:var(--gooze-teal)]">
                <Link href={cmd.href}>
                  <ItemContent>
                    <ItemTitle>{cmd.title}</ItemTitle>
                    <ItemDescription>{cmd.desc}</ItemDescription>
                  </ItemContent>
                </Link>
              </Item>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
