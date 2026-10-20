import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

const GITHUB_REPO = "https://github.com/gooze-dev/goozels"
const CLAUDE_PLUGIN_REPO = "https://github.com/gooze-dev/claude-plugin"
const LINK = "text-[color:var(--gooze-teal)] hover:underline"

export const metadata = docsMetadata("/docs/editor-support")

export default function EditorSupportPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Editor support (goozels)</h1>
      <p className="text-lg text-muted-foreground mb-8">
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[color:var(--gooze-teal)] hover:underline"
        >
          goozels
        </a>{" "}
        is the Language Server for Gooze. It runs in front of <code>gopls</code>,
        so you keep all your normal Go features and get Gooze ones on top — autocompletion,
        hovers, live validation, and one-click mutation runs.
      </p>

      <div>
        <div id="features">
          <h2>What you get</h2>
          <ul>
            <li>
              Completion, hover docs, and a warning for unknown names inside
              <code>{"//gooze:ignore"}</code> comments.
            </li>
            <li>
              Key/value completion, hover, and validation for your
              <code>gooze.yaml</code> config.
            </li>
            <li>
              <strong>▶ gooze run</strong>, <strong>gooze run --estimate</strong>, and
              <strong> 📊 gooze report</strong> code lenses at the top of every Go file.
            </li>
            <li>
              Mutation scores from your reports shown inline after a run, and a
              marker on each line where a mutant survived, naming the change your
              tests missed.
            </li>
            <li>
              The same diagnostics from the command line and for AI coding agents
              (Claude Code, Codex, opencode) after every edit.
            </li>
          </ul>
        </div>

        <div id="requirements">
          <h2>What you need</h2>
          <ul>
            <li>Go installed on your machine.</li>
            <li>
              <code>gopls</code> on your{" "}
              <code>PATH</code>:
            </li>
          </ul>
          <div>
            <CodeBlock lang="bash" code="go install golang.org/x/tools/gopls@latest" />
          </div>
          <p>
            Gooze itself is only needed for the run / report actions.
          </p>
        </div>

        <div id="install">
          <h2>Install goozels</h2>
          <CodeBlock lang="bash" code="go install gooze.dev/pkg/goozels/cmd/goozels@latest" />
          <p>
            This puts a <code>goozels</code> binary in your Go bin
            directory. goozels finds <code>gopls</code> and{" "}
            <code>gooze</code> on your{" "}
            <code>PATH</code> automatically.
          </p>
        </div>

        <div id="vscode">
          <h2>VS Code</h2>
          <p>
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

        <div id="neovim">
          <h2>Neovim</h2>
          <p>
            Point your Go LSP config at the <code>goozels</code>{" "}
            binary instead of <code>gopls</code>, and attach it to
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

        <div id="jetbrains">
          <h2>JetBrains (GoLand / IntelliJ)</h2>
          <p>
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

        <div id="command-line">
          <h2>Command line</h2>
          <p>
            <code>goozels check</code> prints the same diagnostics without an editor,
            one per line, and nothing for clean files:
          </p>
          <CodeBlock
            lang="bash"
            code={`$ goozels check calc/calc.go gooze.yaml
calc/calc.go:1:1: warning: gooze: 2/16 mutants survived — score 87.50%
calc/calc.go:10:2: warning: gooze: surviving comparison mutant — tests still pass with: if n <= lo {
gooze.yaml:13:1: error: missing a space after ":"; gooze will ignore this whole file and use its defaults`}
          />
          <p>
            Checking a <code>_test.go</code> file also reports the source files it
            tests. Run it from your project root, or pass <code>-workdir DIR</code>{" "}
            to say where <code>.gooze-reports</code> lives.
          </p>
        </div>

        <div id="ai-agents">
          <h2>AI coding agents</h2>
          <p>
            Coding agents keep their own Go tooling; goozels adds gooze diagnostics
            after each edit, so the agent sees the mutation score and every
            surviving mutant right away and can write tests that kill them. Editing a
            test file shows the survivors of the code it tests.
          </p>

          <h3>Claude Code</h3>
          <p>Install the gooze plugin from its marketplace, in a Claude Code session:</p>
          <CodeBlock
            lang="text"
            code={`/plugin marketplace add gooze-dev/claude-plugin
/plugin install gooze@gooze`}
          />
          <p>
            It adds a <code>/gooze:mutation-testing</code> skill that teaches Claude
            the run, read, kill-survivors loop, and a post-edit hook that uses
            goozels. Keep the official <code>gopls-lsp</code> plugin enabled for Go
            code intelligence. See{" "}
            <a href={CLAUDE_PLUGIN_REPO} target="_blank" rel="noopener noreferrer" className={LINK}>
              gooze-dev/claude-plugin
            </a>
            .
          </p>

          <h3>Codex</h3>
          <p>
            Copy{" "}
            <a href={`${GITHUB_REPO}/blob/main/editors/codex/hooks.json`} target="_blank" rel="noopener noreferrer" className={LINK}>
              editors/codex/hooks.json
            </a>{" "}
            to <code>.codex/hooks.json</code> in your project and trust it once with{" "}
            <code>/hooks</code>. It runs <code>goozels hook codex</code> after every{" "}
            <code>apply_patch</code> (Codex 0.125 or later). See{" "}
            <a href={`${GITHUB_REPO}/blob/main/editors/codex/README.md`} target="_blank" rel="noopener noreferrer" className={LINK}>
              editors/codex
            </a>
            .
          </p>

          <h3>opencode</h3>
          <p>
            Copy the plugin for your version to{" "}
            <code>.opencode/plugins/goozels.ts</code>:{" "}
            <a href={`${GITHUB_REPO}/blob/main/editors/opencode/v1/goozels.ts`} target="_blank" rel="noopener noreferrer" className={LINK}>
              v1
            </a>{" "}
            for 1.x or{" "}
            <a href={`${GITHUB_REPO}/blob/main/editors/opencode/v2/goozels.ts`} target="_blank" rel="noopener noreferrer" className={LINK}>
              v2
            </a>{" "}
            for 2.x. See{" "}
            <a href={`${GITHUB_REPO}/blob/main/editors/opencode/README.md`} target="_blank" rel="noopener noreferrer" className={LINK}>
              editors/opencode
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
