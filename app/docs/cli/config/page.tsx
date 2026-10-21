import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/cli/config")

export default function CliConfigPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">gooze config</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Manage Gooze configuration. Today the only subcommand is <code>init</code>,
        which generates a starter config file.
      </p>

      <div>
        <div id="usage">
          <h2>Usage</h2>
          <CodeBlock lang="bash" code="gooze config <subcommand>" />
          <p>
            Subcommands: <Link href="#init"><code>init</code></Link>.
          </p>
        </div>

        <div id="init">
          <h2>gooze config init</h2>
          <p>
            Creates a starter <code>gooze.yaml</code> in the current directory.
          </p>

          <h3>When to use it</h3>
          <ul>
            <li>First time setting up Gooze in a repo</li>
            <li>You want a known-good config file to edit</li>
          </ul>

          <h3>Usage</h3>
          <CodeBlock lang="bash" code="gooze config init" />
          <p>
            This writes <code>gooze.yaml</code> and stops.
            It does not run mutation testing.
          </p>
          <CodeBlock lang="text" code="Wrote the default configuration to gooze.yaml" />
          <p>
            It never overwrites an existing file: if <code>gooze.yaml</code> is already there it
            exits <code>1</code> with{" "}
            <code>gooze.yaml already exists; edit it or remove it first</code>. For every key the
            file can contain, see <Link href="/docs/config">Configuration (<code>gooze.yaml</code>)</Link>.
          </p>

          <h3>Next step</h3>
          <p>After you have a config file, run:</p>
          <CodeBlock lang="bash" code="gooze run ./..." />
        </div>
      </div>
    </section>
  )
}
