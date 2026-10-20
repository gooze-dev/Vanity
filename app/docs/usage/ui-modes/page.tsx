import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/usage/ui-modes")

export default function UIModesPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">UI modes</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze selects its UI based on whether output is a TTY (interactive) or NOT (non-TTY, e.g. CI or redirected output).
      </p>

      <div>
        <div>
          <h2>TTY (interactive)</h2>
          <p>
            When running in a terminal, Gooze uses an interactive TUI.
          </p>

          <div className="mt-4">
            <p className="text-muted-foreground mb-2">Common keys in the viewer:</p>
            <ul>
              <li>
                <code>↑/↓</code> or <code>j/k</code> to move
              </li>
              <li>
                <code>/</code> to filter
              </li>
              <li>
                <code>enter</code> / <code>space</code> to toggle the diff
              </li>
              <li>
                <code>q</code> to quit
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              More details: <Link href="/docs/cli/report#view">gooze report view</Link>.
            </p>
          </div>
        </div>

        <div>
          <h2>NOT TTY (simple/CI)</h2>
          <p>
            When output is redirected (or in CI), Gooze uses a simple UI.
          </p>
          <CodeBlock lang="bash" code={"gooze run ./... | cat"} />

          <p className="text-sm text-muted-foreground">
            This example forces non-interactive mode by piping output.
            It is useful when you want stable CI logs.
          </p>
        </div>
      </div>
    </section>
  )
}
