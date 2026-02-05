import { CodeBlock } from "@/components/code-block"

export default function InstallPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Installation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Install Gooze with Go, then verify it works.
      </p>

      <div className="space-y-12">
        <div id="requirements" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">What you need</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Go installed on your machine.</li>
            <li>A Go project with a <code className="bg-muted px-1 py-0.5 rounded">go.mod</code> file.</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Note: Gooze itself is built with a specific Go version.
            If you see install/build errors, first try updating Go.
          </p>
        </div>

        <div id="install" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Install Gooze</h2>
          <CodeBlock lang="bash" code="go install gooze.dev/pkg/gooze@latest" />
          <p className="mt-3 text-muted-foreground">
            This downloads Gooze and puts the binary in your Go bin directory.
          </p>
        </div>

        <div id="verify" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Verify the install</h2>
          <CodeBlock lang="bash" code="gooze version" />
          <p className="mt-3 text-muted-foreground">
            Use this output when you report bugs.
          </p>
        </div>

          <div id="path" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold mb-3">If you get &quot;command not found&quot;</h2>
          <p className="mb-3 text-muted-foreground">
            Go installs binaries into your Go bin dir.
            Often it is <code className="bg-muted px-1 py-0.5 rounded">$(go env GOPATH)/bin</code>.
            Make sure this directory is in your <code className="bg-muted px-1 py-0.5 rounded">PATH</code>.
          </p>
            <CodeBlock lang="bash" code='echo "$(go env GOPATH)/bin"' />
        </div>

        <div id="tty" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Interactive vs CI output</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>In a terminal (TTY), Gooze shows an interactive UI.</li>
            <li>In CI (or when output is redirected), Gooze prints plain text.</li>
          </ul>
        </div>

        <div id="logs" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Logs</h2>
          <p className="text-muted-foreground">
            If something looks wrong, run with <code className="bg-muted px-1 py-0.5 rounded">--verbose</code>.
            Then check the log file (often <code className="bg-muted px-1 py-0.5 rounded">.gooze.log</code>).
          </p>
          <div className="mt-3">
            <CodeBlock lang="bash" code="gooze run --verbose ./..." />
          </div>
        </div>
      </div>
    </section>
  )
}
