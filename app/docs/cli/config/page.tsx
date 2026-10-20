import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/cli/config")

export default function CliConfigPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">gooze config</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Manage Gooze configuration. Today this generates a starter config file;
        it is the home for configuration commands as more are added.
      </p>

      <div>
        <div id="usage">
          <h2>Usage</h2>
          <CodeBlock lang="bash" code="gooze config <subcommand>" />
          <p>
            Subcommands: <Link href="#init">init</Link>.
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

          <h3>Next step</h3>
          <p>After you have config, run:</p>
          <CodeBlock lang="bash" code="gooze run ./..." />
        </div>
      </div>
    </section>
  )
}
