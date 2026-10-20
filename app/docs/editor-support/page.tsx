import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

const GITHUB_REPO = "https://github.com/gooze-dev/goozels"

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
              <strong>▶ gooze run</strong>, <strong>gooze run --estimate</strong>, and
              <strong> 📊 gooze report</strong> code lenses at the top of every Go file.
            </li>
            <li>
              Mutation scores from your reports shown inline after a run.
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
