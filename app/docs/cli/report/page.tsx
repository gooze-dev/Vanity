import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/cli/report")

export default function CliReportPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze report</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Work with reports that Gooze has already written: view them, merge sharded
        results, and store or restore them from an OCI registry.
      </p>

      <div className="space-y-12">
        <div id="usage">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze report <subcommand> [flags]" />
          <p className="mt-3 text-muted-foreground">
            All subcommands read from (or write to) the reports directory set by{" "}
            <code className="bg-muted px-1 py-0.5 rounded">-o/--output</code>.
            Default is <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>.
          </p>
          <p className="mt-3 text-muted-foreground">
            Subcommands:{" "}
            <Link href="#view" className="underline underline-offset-4">view</Link>,{" "}
            <Link href="#push" className="underline underline-offset-4">push</Link>,{" "}
            <Link href="#pull" className="underline underline-offset-4">pull</Link>, and{" "}
            <Link href="#merge" className="underline underline-offset-4">merge</Link>.
          </p>
        </div>

        <div id="view">
          <h2 className="text-2xl font-semibold mb-3">gooze report view</h2>
          <p className="text-muted-foreground">
            Loads reports from the output directory and displays results.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">Usage</h3>
          <CodeBlock lang="bash" code="gooze report view" />
          <p className="mt-3 text-muted-foreground">
            If you used a custom output dir, pass it:
          </p>
          <CodeBlock lang="bash" code="gooze report view -o DIR" />

          <h3 className="text-xl font-medium mt-6 mb-2">What you can do</h3>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>See the mutation score</li>
            <li>Scroll results by file/type/status</li>
            <li>Filter by id/file/type/status</li>
            <li>
              Open a diff for any mutation that was not killed (<code className="bg-muted px-1 py-0.5 rounded">survived</code>,{" "}
              <code className="bg-muted px-1 py-0.5 rounded">not_covered</code>, <code className="bg-muted px-1 py-0.5 rounded">timeout</code>, <code className="bg-muted px-1 py-0.5 rounded">error</code>)
            </li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-2">Keybindings (TTY)</h3>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><code className="bg-muted px-1 py-0.5 rounded">↑/k</code>, <code className="bg-muted px-1 py-0.5 rounded">↓/j</code>: move</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">g</code> / <code className="bg-muted px-1 py-0.5 rounded">G</code>: top / bottom</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">/</code>: filter</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">enter</code> / <code className="bg-muted px-1 py-0.5 rounded">space</code>: toggle diff</li>
            <li><code className="bg-muted px-1 py-0.5 rounded">q</code>: quit</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-2">Non-TTY behavior (CI)</h3>
          <p className="mb-3 text-muted-foreground">
            When not interactive, view prints results linearly.
            Example:
          </p>
          <CodeBlock lang="bash" code="gooze report view | cat" />
        </div>

        <div id="push">
          <h2 className="text-2xl font-semibold mb-3">gooze report push</h2>
          <p className="text-muted-foreground">
            Packages the reports directory and pushes it to an OCI registry as an artifact.
            Use this to share baseline results with CI and teammates.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">Usage</h3>
          <CodeBlock lang="bash" code="gooze report push <reference>" />
          <p className="mt-3 text-muted-foreground">
            The reference must include a tag (digest references are rejected), and the reports dir
            must exist and contain files. Symlinks inside it are skipped.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">Example</h3>
          <CodeBlock lang="bash" code="gooze report push ghcr.io/your-org/your-repo/gooze-reports:main" />

          <h3 className="text-xl font-medium mt-6 mb-2">Flags</h3>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">-o, --output &lt;dir&gt;</code>: reports directory to package (default <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>)
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">--plain-http</code>: use a non-TLS (HTTP) registry
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">--insecure</code>: skip TLS certificate verification
            </li>
          </ul>

          <div id="auth">
            <h3 className="text-xl font-medium mt-6 mb-2">Authentication</h3>
            <p className="mb-3 text-muted-foreground">
              For registries that require login, set{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_USERNAME</code> and{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_PASSWORD</code>. The
              password may be a token/PAT — for GHCR, use your GitHub username with a PAT (or{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GITHUB_TOKEN</code> in CI). The same
              variables apply to <Link href="#pull" className="underline underline-offset-4">pull</Link>.
            </p>
            <CodeBlock
              lang="bash"
              code={`export GOOZE_REGISTRY_USERNAME="$USER"
export GOOZE_REGISTRY_PASSWORD="$GITHUB_TOKEN"
gooze report push ghcr.io/your-org/your-repo/gooze-reports:main`}
            />
            <p className="mt-3 text-muted-foreground">
              If both are unset, Gooze falls back to the Docker credential store (whatever{" "}
              <code className="bg-muted px-1 py-0.5 rounded">docker login</code> saved). Setting{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_USERNAME</code> without{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_PASSWORD</code> is an error;{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_PASSWORD</code> alone is sent as a bearer token. See{" "}
              <Link href="/docs/ci/sharing-reports" className="underline underline-offset-4">Sharing reports (OCI)</Link>{" "}
              for the full baseline workflow.
            </p>
          </div>
        </div>

        <div id="pull">
          <h2 className="text-2xl font-semibold mb-3">gooze report pull</h2>
          <p className="text-muted-foreground">
            Pulls reports from an OCI registry and extracts them into the reports directory.
            Use this to restore a baseline before an incremental run.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">Usage</h3>
          <CodeBlock lang="bash" code="gooze report pull <reference>" />
          <p className="mt-3 text-muted-foreground">
            The reference must include a tag. Extracting into the current directory
            (<code className="bg-muted px-1 py-0.5 rounded">-o .</code>) works, file modes are preserved, and pulling an artifact that was not
            pushed by Gooze fails with a clear error.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">Example</h3>
          <CodeBlock lang="bash" code="gooze report pull ghcr.io/your-org/your-repo/gooze-reports:main" />

          <h3 className="text-xl font-medium mt-6 mb-2">Flags</h3>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">-o, --output &lt;dir&gt;</code>: reports directory to extract into (default <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>)
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">--plain-http</code>: use a non-TLS (HTTP) registry
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">--insecure</code>: skip TLS certificate verification
            </li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-2">Authentication</h3>
          <p className="text-muted-foreground">
            Pull uses the same credentials as push: see{" "}
            <Link href="#auth" className="underline underline-offset-4">Authentication</Link> above.
          </p>
        </div>

        <div id="merge">
          <h2 className="text-2xl font-semibold mb-3">gooze report merge</h2>
          <p className="text-muted-foreground">
            Merges sharded reports (from <code className="bg-muted px-1 py-0.5 rounded">shard_*</code> folders) into the base output dir.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">Usage</h3>
          <CodeBlock lang="bash" code="gooze report merge" />

          <h3 className="text-xl font-medium mt-6 mb-2">When you need this</h3>
          <p className="text-muted-foreground">
            If you run <code className="bg-muted px-1 py-0.5 rounded">gooze run -s INDEX/TOTAL</code>, Gooze writes into shard folders.
            You merge them before running <code className="bg-muted px-1 py-0.5 rounded">gooze report view</code>.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">Example</h3>
          <CodeBlock
            lang="bash"
            code={`gooze run -s 0/4 ./...
gooze run -s 1/4 ./...
gooze run -s 2/4 ./...
gooze run -s 3/4 ./...

gooze report merge
gooze report view`}
          />
          <p className="mt-3 text-muted-foreground">
            This example splits work into 4 jobs, then merges, then opens the viewer.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">Notes</h3>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>If there are no shard directories, merge just rebuilds the index and prints the score.</li>
            <li>
              Shard reports replace base reports for the same source file; base reports for files
              no shard re-tested are kept, so caching can still work.
            </li>
            <li>When merge runs inside the checkout, base reports for files that no longer exist are dropped.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
