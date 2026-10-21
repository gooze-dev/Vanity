import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/usage/ui-modes")

export default function UIModesPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">UI modes</h1>
      <p className="text-lg text-muted-foreground mb-8">
        The same <code>gooze run ./...</code> behaves differently on your laptop and in CI. Gooze
        picks its UI from whether output is a TTY (interactive) or not (for example CI or
        redirected output), so you get a live view locally and plain logs in pipelines.
      </p>

      <div>
        <div>
          <h2>TTY (interactive)</h2>
          <p>
            When running in a terminal, Gooze uses an interactive TUI. This is the first run of the{" "}
            <code>calc</code> package from the Quick start:
          </p>
          <Recording name="calc-first-run-tui" title="Recorded gooze run TUI on the calc package" tui />
          <p>
            After a run, open every mutation with its diff to see exactly what a survivor changed.
            Here <code>gooze report view --all</code> moves to the first survivor and opens its diff:
          </p>
          <Recording name="calc-report-view-all-tui" title="Recorded gooze report view --all session opening a survivor's diff" tui />

          <div className="mt-4">
            <p className="text-muted-foreground mb-2">
              Common keys in the viewer (<code>gooze report view --all</code>):
            </p>
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
              More details: <Link href="/docs/cli/report#view"><code>gooze report view</code></Link>.
            </p>
          </div>
        </div>

        <div>
          <h2>Non-TTY (simple/CI)</h2>
          <p>
            When output is redirected (or in CI), Gooze uses a simple UI.
          </p>
          <CodeBlock lang="bash" code={"gooze run ./... | cat"} />

          <p className="text-sm text-muted-foreground">
            This example forces non-interactive mode by piping output.
            It is useful when you want stable CI logs.
          </p>
          <p className="text-sm text-muted-foreground">
            <code>gooze report view</code> without <code>--all</code> prints the same plain
            summary in both modes.
          </p>
        </div>
      </div>
    </section>
  )
}
