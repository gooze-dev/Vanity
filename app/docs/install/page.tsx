import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/install")

export default function InstallPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Installation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Install Gooze with Go, then verify it works.
      </p>

      <div>
        <div id="requirements">
          <h2>What you need</h2>
          <ul>
            <li>Go installed on your machine.</li>
            <li>A Go project with a <code>go.mod</code> file.</li>
          </ul>
          <p>
            Note: Gooze itself is built with a specific Go version.
            If you see install/build errors, first try updating Go.
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
      </div>
    </section>
  )
}
