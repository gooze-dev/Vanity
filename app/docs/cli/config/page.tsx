import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

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
          <p className="mt-3 text-muted-foreground">
            Subcommands: <Link href="#init" className="underline underline-offset-4">init</Link>.
          </p>
        </div>

        <div id="init" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">gooze config init</h2>
          <p className="text-muted-foreground">
            Creates a starter <code className="bg-muted px-1 py-0.5 rounded">gooze.yaml</code> in the current directory.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">When to use it</h3>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>First time setting up Gooze in a repo</li>
            <li>You want a known-good config file to edit</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-2">Usage</h3>
          <CodeBlock lang="bash" code="gooze config init" />
          <p className="mt-3 text-muted-foreground">
            This writes <code className="bg-muted px-1 py-0.5 rounded">gooze.yaml</code> and stops.
            It does not run mutation testing.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">Next step</h3>
          <p className="mb-3 text-muted-foreground">After you have config, run:</p>
          <CodeBlock lang="bash" code="gooze run ./..." />
        </div>
      </div>
    </section>
  )
}
