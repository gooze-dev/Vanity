import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/install")

// Visible Q&A + matching FAQPage JSON-LD. Only methods that exist (go install
// + the verify/PATH/update/uninstall flow); no Homebrew/script/action.
const faqs = [
  {
    q: "How do I install the Gooze CLI?",
    a: "Run go install gooze.dev/pkg/gooze@latest, then make sure your Go bin directory ($(go env GOPATH)/bin) is on your PATH.",
  },
  {
    q: "What are the prerequisites for installing Gooze?",
    a: "Go 1.27 or newer and a Go module with a go.mod file. Gooze runs on Linux, macOS, and Windows.",
  },
  {
    q: "How do I verify Gooze is installed correctly?",
    a: "Run gooze version. It prints the gooze version and the Go version it was built with.",
  },
  {
    q: "How do I fix 'gooze: command not found' after installing?",
    a: "Your Go bin directory is not on your PATH. Add $(go env GOPATH)/bin to PATH (for example export PATH=$PATH:$(go env GOPATH)/bin in your shell profile) and restart the terminal.",
  },
  {
    q: "How do I update Gooze to the latest version?",
    a: "Run go install gooze.dev/pkg/gooze@latest again; it fetches and builds the newest release over the old binary.",
  },
  {
    q: "How do I uninstall Gooze?",
    a: "Delete the binary: rm $(go env GOPATH)/bin/gooze.",
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

export default function InstallPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Installation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Install Gooze with Go, then verify it works.
      </p>

      <div>
        <div id="requirements">
          <h2>What you need</h2>
          <ul>
            <li><strong>Go 1.27 or newer</strong> (Gooze is built with Go 1.27).</li>
            <li>A Go module with a <code>go.mod</code> file.</li>
            <li>Linux, macOS, or Windows.</li>
          </ul>
          <p>
            If you see install or build errors, update Go first.
          </p>
        </div>

        <div id="install">
          <h2>Install Gooze</h2>
          <CodeBlock lang="bash" code="go install gooze.dev/pkg/gooze@latest" />
          <p>
            This downloads Gooze and puts the binary in your Go bin directory.
          </p>
          <p>
            Gooze needs Go 1.27.3 to build. On an older Go, let Go fetch the toolchain
            for the install; your project keeps its own Go version:
          </p>
          <CodeBlock lang="bash" code="GOTOOLCHAIN=auto go install gooze.dev/pkg/gooze@latest" />
        </div>

        <div id="verify">
          <h2>Verify the install</h2>
          <CodeBlock lang="bash" code="gooze version" />
          <p>
            Use this output when you report bugs.
          </p>
        </div>

          <div id="path">
            <h2>If you get &quot;command not found&quot;</h2>
          <p>
            Go installs binaries into your Go bin dir.
            Often it is <code>$(go env GOPATH)/bin</code>.
            Make sure this directory is in your <code>PATH</code>.
          </p>
            <CodeBlock lang="bash" code='echo "$(go env GOPATH)/bin"' />
        </div>

        <div id="tty">
          <h2>Interactive vs CI output</h2>
          <ul>
            <li>In a terminal (TTY), Gooze shows an interactive UI.</li>
            <li>In CI (or when output is redirected), Gooze prints plain text.</li>
          </ul>
        </div>

        <div id="logs">
          <h2>Logs</h2>
          <p>
            If something looks wrong, run with <code>--verbose</code>.
            Then check the log file (often <code>.gooze.log</code>).
          </p>
          <div>
            <CodeBlock lang="bash" code="gooze run --verbose ./..." />
          </div>
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
