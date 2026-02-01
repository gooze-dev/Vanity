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
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">NOT TTY (simple/CI)</h2>
          <p className="mb-3 text-muted-foreground">
            When output is redirected (or in CI), Gooze uses a simple UI.
          </p>
          <CodeBlock lang="bash" code={"gooze run ./... | cat"} />
        </div>
      </div>
    </section>
  )
}
