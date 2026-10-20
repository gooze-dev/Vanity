import Link from "next/link"
import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

const GITHUB_REPO = "https://github.com/gooze-dev/goozels"
const LINK = "text-[color:var(--gooze-teal)] hover:underline"

export const metadata = docsMetadata("/docs/editor-support")

const faqs = [
  {
    q: "What is goozels?",
    a: "goozels is the Gooze language server (LSP). It runs in front of gopls, so you keep all normal Go features and get Gooze ones on top: completion and validation for //gooze:ignore directives and gooze.yaml, code lenses to run gooze, and mutation scores shown inline.",
  },
  {
    q: "Does Gooze work in VS Code?",
    a: "Yes. Install goozels (go install gooze.dev/pkg/goozels/cmd/goozels@latest) and set go.alternateTools so the Go extension launches goozels instead of gopls: {\"go.alternateTools\": {\"gopls\": \"goozels\"}}. goozels proxies gopls for you.",
  },
  {
    q: "How do I use Gooze in Neovim or other editors?",
    a: "Point your Go LSP config at the goozels binary instead of gopls; goozels proxies gopls. JetBrains works via the LSP4IJ plugin. See the editor guides in the goozels repository.",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export default function EditorSupportPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
              <strong>gooze: run package</strong>, <strong>gooze: estimate</strong>, and
              <strong> gooze: report</strong> code lenses at the top of every Go file,
              scoped to that file&apos;s package.
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
            one per line, showing each surviving mutant&apos;s original and mutated code:
          </p>
          <CodeBlock
            lang="bash"
            code={`$ goozels check calc.go gooze.yaml
calc.go:1:1: warning: gooze: score 87.50% — 14 killed, 2 survived
calc.go:10:2: warning: gooze: surviving comparison mutant — tests still pass with \`if n < lo {\` → \`if n <= lo {\`
calc.go:13:2: warning: gooze: surviving comparison mutant — tests still pass with \`if n > hi {\` → \`if n >= hi {\`
gooze.yaml:1:1: error: missing a space after ":"; gooze will ignore this whole file and use its defaults`}
          />
          <p>
            Checking a <code>_test.go</code> file also reports the source files it
            tests. When a file changed since gooze last ran, goozels says so and prints
            the rerun command instead of pointing at lines that moved. It finds the
            workspace by walking up to <code>.gooze-reports</code>;{" "}
            <code>-max N</code> caps the output. It exits 1 when it reports an error
            (such as a gooze.yaml that gooze would ignore), so it also works in CI.
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
          <p>
            Install the gooze plugin, which sets a project up, runs the
            kill-survivors loop and uses goozels for results after every edit. See{" "}
            <Link href="/docs/claude-code" className={LINK}>
              Claude Code
            </Link>
            .
          </p>

          <h3>Codex</h3>
          <p className="text-sm text-muted-foreground">
            Not yet verified with Codex; support is on the way.
          </p>
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
          <p className="text-sm text-muted-foreground">
            Not yet verified with opencode; support is on the way.
          </p>
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

        <div id="faq">
          <h2>FAQ</h2>
          {faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
