import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/cli/report")

export default function CliReportPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">gooze report</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Work with reports that Gooze has already written: view them, merge sharded
        results, and store or restore them from an OCI registry.
      </p>

      <div>
        <div id="usage">
          <h2>Usage</h2>
          <CodeBlock lang="bash" code="gooze report <subcommand> [flags]" />
          <p>
            All subcommands read from (or write to) the reports directory set by{" "}
            <code>-o/--output</code>.
            Default is <code>.gooze-reports</code>.
          </p>
          <p>
            Subcommands:{" "}
            <Link href="#view">view</Link>,{" "}
            <Link href="#push">push</Link>,{" "}
            <Link href="#pull">pull</Link>, and{" "}
            <Link href="#merge">merge</Link>.
          </p>
        </div>

        <div id="view">
          <h2>gooze report view</h2>
          <p>
            Loads reports from the output directory and displays results.
          </p>

          <h3>Usage</h3>
          <CodeBlock lang="bash" code="gooze report view" />
          <p>
            If you used a custom output dir, pass it:
          </p>
          <CodeBlock lang="bash" code="gooze report view -o DIR" />

          <h3>What you can do</h3>
          <ul>
            <li>See the mutation score</li>
            <li>Scroll results by file/type/status</li>
            <li>Filter by id/file/type/status</li>
            <li>
              Open a diff for any mutation that was not killed (<code>survived</code>,{" "}
              <code>not_covered</code>, <code>timeout</code>, <code>error</code>)
            </li>
          </ul>

          <h3>Keybindings (TTY)</h3>
          <ul>
            <li><code>↑/k</code>, <code>↓/j</code>: move</li>
            <li><code>g</code> / <code>G</code>: top / bottom</li>
            <li><code>/</code>: filter</li>
            <li><code>enter</code> / <code>space</code>: toggle diff</li>
            <li><code>q</code>: quit</li>
          </ul>

          <h3>Non-TTY behavior (CI)</h3>
          <p>
            When not interactive, view prints results linearly.
            Example:
          </p>
          <CodeBlock lang="bash" code="gooze report view | cat" />
        </div>

        <div id="push">
          <h2>gooze report push</h2>
          <p>
            Packages the reports directory and pushes it to an OCI registry as an artifact.
            Use this to share baseline results with CI and teammates.
          </p>

          <h3>Usage</h3>
          <CodeBlock lang="bash" code="gooze report push <reference>" />
          <p>
            The reference must include a tag (digest references are rejected), and the reports dir
            must exist and contain files. Symlinks inside it are skipped.
          </p>

          <h3>Example</h3>
          <CodeBlock lang="bash" code="gooze report push ghcr.io/your-org/your-repo/gooze-reports:main" />

          <h3>Flags</h3>
          <ul>
            <li>
              <code>-o, --output &lt;dir&gt;</code>: reports directory to package (default <code>.gooze-reports</code>)
            </li>
            <li>
              <code>--plain-http</code>: use a non-TLS (HTTP) registry
            </li>
            <li>
              <code>--insecure</code>: skip TLS certificate verification
            </li>
          </ul>

          <div id="auth">
            <h3>Authentication</h3>
            <p>
              For registries that require login, set{" "}
              <code>GOOZE_REGISTRY_USERNAME</code> and{" "}
              <code>GOOZE_REGISTRY_PASSWORD</code>. The
              password may be a token/PAT — for GHCR, use your GitHub username with a PAT (or{" "}
              <code>GITHUB_TOKEN</code> in CI). The same
              variables apply to <Link href="#pull">pull</Link>.
            </p>
            <CodeBlock
              lang="bash"
              code={`export GOOZE_REGISTRY_USERNAME="$USER"
export GOOZE_REGISTRY_PASSWORD="$GITHUB_TOKEN"
gooze report push ghcr.io/your-org/your-repo/gooze-reports:main`}
            />
            <p>
              If both are unset, Gooze falls back to the Docker credential store (whatever{" "}
              <code>docker login</code> saved). Setting{" "}
              <code>GOOZE_REGISTRY_USERNAME</code> without{" "}
              <code>GOOZE_REGISTRY_PASSWORD</code> is an error;{" "}
              <code>GOOZE_REGISTRY_PASSWORD</code> alone is sent as a bearer token. See{" "}
              <Link href="/docs/ci/sharing-reports">Sharing reports (OCI)</Link>{" "}
              for the full baseline workflow.
            </p>
          </div>
        </div>

        <div id="pull">
          <h2>gooze report pull</h2>
          <p>
            Pulls reports from an OCI registry and extracts them into the reports directory.
            Use this to restore a baseline before an incremental run.
          </p>

          <h3>Usage</h3>
          <CodeBlock lang="bash" code="gooze report pull <reference>" />
          <p>
            The reference must include a tag. Extracting into the current directory
            (<code>-o .</code>) works, file modes are preserved, and pulling an artifact that was not
            pushed by Gooze fails with a clear error.
          </p>

          <h3>Example</h3>
          <CodeBlock lang="bash" code="gooze report pull ghcr.io/your-org/your-repo/gooze-reports:main" />

          <h3>Flags</h3>
          <ul>
            <li>
              <code>-o, --output &lt;dir&gt;</code>: reports directory to extract into (default <code>.gooze-reports</code>)
            </li>
            <li>
              <code>--plain-http</code>: use a non-TLS (HTTP) registry
            </li>
            <li>
              <code>--insecure</code>: skip TLS certificate verification
            </li>
          </ul>

          <h3>Authentication</h3>
          <p>
            Pull uses the same credentials as push: see{" "}
            <Link href="#auth">Authentication</Link> above.
          </p>
        </div>

        <div id="merge">
          <h2>gooze report merge</h2>
          <p>
            Merges sharded reports (from <code>shard_*</code> folders) into the base output dir.
          </p>

          <h3>Usage</h3>
          <CodeBlock lang="bash" code="gooze report merge" />

          <h3>When you need this</h3>
          <p>
            If you run <code>gooze run -s INDEX/TOTAL</code>, Gooze writes into shard folders.
            You merge them before running <code>gooze report view</code>.
          </p>

          <h3>Example</h3>
          <CodeBlock
            lang="bash"
            code={`gooze run -s 0/4 ./...
gooze run -s 1/4 ./...
gooze run -s 2/4 ./...
gooze run -s 3/4 ./...

gooze report merge
gooze report view`}
          />
          <p>
            This example splits work into 4 jobs, then merges, then opens the viewer.
          </p>

          <h3>Notes</h3>
          <ul>
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
