import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export default function UIModesPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">UI modes</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze selects its UI based on whether output is a TTY (interactive) or NOT (non-TTY, e.g. CI or redirected output).
      </p>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">TTY (interactive)</h2>
          <p className="text-muted-foreground">
            When running in a terminal, Gooze uses an interactive TUI.
          </p>

          <div className="mt-4">
            <p className="text-muted-foreground mb-2">Common keys in the viewer:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">↑/↓</code> or <code className="bg-muted px-1 py-0.5 rounded">j/k</code> to move
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">/</code> to filter
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">enter</code> / <code className="bg-muted px-1 py-0.5 rounded">space</code> to toggle the diff
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">q</code> to quit
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              More details: <Link href="/docs/cli/view" className="underline underline-offset-4">gooze view</Link>.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">NOT TTY (simple/CI)</h2>
          <p className="mb-3 text-muted-foreground">
            When output is redirected (or in CI), Gooze uses a simple UI.
          </p>
          <CodeBlock lang="bash" code={"gooze run ./... | cat"} />

          <p className="mt-3 text-sm text-muted-foreground">
            This example forces non-interactive mode by piping output.
            It is useful when you want stable CI logs.
          </p>
        </div>
      </div>
    </section>
  )
}
