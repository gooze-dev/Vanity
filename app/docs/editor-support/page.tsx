import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

const GITHUB_REPO = "https://github.com/gooze-dev/goozels"

export const metadata = docsMetadata("/docs/editor-support")

export default function EditorSupportPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Editor support (goozels)</h1>
      <p className="text-lg text-muted-foreground mb-8">
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[color:var(--gooze-teal)] hover:underline"
        >
          goozels
        </a>{" "}
        is the Language Server for Gooze. It runs in front of <code className="bg-muted px-1 py-0.5 rounded">gopls</code>,
        so you keep all your normal Go features and get Gooze ones on top — autocompletion,
        hovers, live validation, and one-click mutation runs.
      </p>

      <div className="space-y-12">
        <div id="features" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">What you get</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              Completion, hover docs, and a warning for unknown names inside
              <code className="bg-muted px-1 py-0.5 rounded">{"//gooze:ignore"}</code> comments.
            </li>
            <li>
              Key/value completion, hover, and validation for your
              <code className="bg-muted px-1 py-0.5 rounded">gooze.yaml</code> config.
            </li>
            <li>
              <strong>▶ gooze run</strong>, <strong>gooze run --estimate</strong>, and
              <strong> 📊 gooze report</strong> code lenses at the top of every Go file.
            </li>
            <li>
              Mutation scores from your reports shown inline after a run.
            </li>
          </ul>
        </div>

        <div id="requirements" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">What you need</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Go installed on your machine.</li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">gopls</code> on your{" "}
              <code className="bg-muted px-1 py-0.5 rounded">PATH</code>:
            </li>
          </ul>
          <div className="mt-3">
            <CodeBlock lang="bash" code="go install golang.org/x/tools/gopls@latest" />
          </div>
          <p className="mt-3 text-muted-foreground">
            Gooze itself is only needed for the run / report actions.
          </p>
        </div>

        <div id="install" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Install goozels</h2>
          <CodeBlock lang="bash" code="go install gooze.dev/pkg/goozels/cmd/goozels@latest" />
          <p className="mt-3 text-muted-foreground">
            This puts a <code className="bg-muted px-1 py-0.5 rounded">goozels</code> binary in your Go bin
            directory. goozels finds <code className="bg-muted px-1 py-0.5 rounded">gopls</code> and{" "}
            <code className="bg-muted px-1 py-0.5 rounded">gooze</code> on your{" "}
            <code className="bg-muted px-1 py-0.5 rounded">PATH</code> automatically.
          </p>
        </div>

        <div id="vscode" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">VS Code</h2>
          <p className="mb-3 text-muted-foreground">
            Tell the Go extension to launch goozels instead of gopls (it proxies gopls for you):
          </p>
          <CodeBlock
            lang="json"
            code={`{
  "go.alternateTools": {
    "gopls": "goozels"
  }
}`}
          />
        </div>

        <div id="neovim" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Neovim</h2>
          <p className="text-muted-foreground">
            Point your Go LSP config at the <code className="bg-muted px-1 py-0.5 rounded">goozels</code>{" "}
            binary instead of <code className="bg-muted px-1 py-0.5 rounded">gopls</code>, and attach it to
            gooze config files. See{" "}
            <a
              href={`${GITHUB_REPO}/blob/main/editors/neovim.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--gooze-teal)] hover:underline"
            >
              editors/neovim.md
            </a>
            .
          </p>
        </div>

        <div id="jetbrains" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">JetBrains (GoLand / IntelliJ)</h2>
          <p className="text-muted-foreground">
            Register goozels through the LSP4IJ plugin. See{" "}
            <a
              href={`${GITHUB_REPO}/blob/main/editors/jetbrains.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--gooze-teal)] hover:underline"
            >
              editors/jetbrains.md
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
