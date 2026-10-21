import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/cli/report")

export default function CliReportPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">gooze report</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A run has finished and you want to see what survived, combine shard results or share
        them. <code>gooze report</code> works with reports Gooze has already written: view them,
        merge sharded results, and store or restore them from an OCI registry.
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
            <Link href="#view"><code>view</code></Link>,{" "}
            <Link href="#push"><code>push</code></Link>,{" "}
            <Link href="#pull"><code>pull</code></Link>, and{" "}
            <Link href="#merge"><code>merge</code></Link>.
          </p>
        </div>

        <div id="view">
          <h2>gooze report view</h2>
          <p>
            Loads reports from the output directory and prints a per-file score table, one line
            per mutation that counts against the score, and the mutation score.
          </p>

          <h3>Usage</h3>
          <CodeBlock lang="bash" code="gooze report view [paths...]" />
          <p>
            If you used a custom output directory, pass it:
          </p>
          <CodeBlock lang="bash" code="gooze report view -o DIR" />

          <h3>Example output</h3>
          <p>
            After the first run of the <code>calc</code> example, both bound checks in{" "}
            <code>calc.go</code> survive:
          </p>
          <Recording name="calc-report-view" title="Recorded gooze report view after the first run" />
          <p>
            Each survivor line reads <code>path:line: status (mutagen): original -&gt; mutated</code>.
            Survived, not covered, timed out and skipped mutations are listed; with none, <code>view</code>
            prints <code>No survivors.</code> The output is the same in a TTY and in CI.
          </p>

          <h3>Paths</h3>
          <p>
            Paths limit the output to matching source files and read like{" "}
            <Link href="/docs/cli/run#usage"><code>gooze run</code></Link> arguments, relative to the module root:
          </p>
          <ul>
            <li><code>./...</code>: every file (the default)</li>
            <li><code>./pkg/...</code>: files under <code>pkg</code>, recursively</li>
            <li><code>./pkg</code>: files directly in <code>pkg</code></li>
            <li><code>./pkg/file.go</code>: a single file</li>
          </ul>
          <CodeBlock lang="bash" code="gooze report view ./internal/domain/..." />
          <p>
            If no report matches, <code>view</code> exits <code>1</code> with{" "}
            <code>no reports in .gooze-reports match ./internal/domain/...</code>. If the reports
            directory does not exist, it names the directory and suggests running{" "}
            <code>gooze run</code> first or passing <code>-o</code>.
          </p>

          <div id="view-run">
            <h3>Results of a narrowed run</h3>
            <p>
              A run with <code>--diff</code>, <code>--run</code> or <code>--mutagens</code>{" "}
              writes its reports to <code>.gooze-reports/run/</code>, and{" "}
              <code>view</code> without <code>-o</code> doesn&apos;t read them: it skips
              subdirectories. Point <code>-o</code> at the run to see its score and survivors:
            </p>
            <CodeBlock lang="bash" code="gooze report view -o .gooze-reports/run" />
            <Recording name="calc-func-run-view" title="Recorded gooze report view -o .gooze-reports/run after a --run run" />
          </div>

          <h3>Every mutation (--all)</h3>
          <p>
            <code>--all</code> lists every mutation with its status and diff instead of the
            summary. It takes the same paths:
          </p>
          <CodeBlock lang="bash" code="gooze report view --all ./cmd/run.go" />
          <p>In a TTY, <code>--all</code> opens an interactive list where you can:</p>
          <ul>
            <li>See the mutation score</li>
            <li>Scroll results by file/type/status</li>
            <li>Filter by id/file/type/status</li>
            <li>
              Open a diff for any mutation that was not killed (<code>survived</code>,{" "}
              <code>not_covered</code>, <code>timeout</code>, <code>error</code>)
            </li>
          </ul>

          <h3>Keybindings (TTY, --all)</h3>
          <ul>
            <li><code>↑/k</code>, <code>↓/j</code>: move</li>
            <li><code>g</code> / <code>G</code>: top / bottom</li>
            <li><code>/</code>: filter</li>
            <li><code>enter</code> / <code>space</code>: toggle diff</li>
            <li><code>q</code>: quit</li>
          </ul>
          <p>
            When not interactive (for example in CI or piped), <code>--all</code> prints every
            mutation linearly, with diffs for the ones not killed:
          </p>
          <CodeBlock lang="bash" code="gooze report view --all | cat" />

          <h3>Thresholds</h3>
          <p>
            <code>--threshold-total</code>, <code>--threshold-average</code> and{" "}
            <code>--threshold-file</code> (or <code>threshold.*</code> in{" "}
            <code>gooze.yaml</code>) make <code>view</code> exit with code <code>3</code> when
            a score of the viewed reports is below them, so a last CI step can gate on the
            reports. Paths limit which files count. See{" "}
            <Link href="/docs/ci/quality-gates">Quality gates</Link>.
          </p>
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
            The reference must include a tag (digest references are rejected), and the reports directory
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
              password may be a token or PAT. For GHCR, use your GitHub username with a PAT (or{" "}
              <code>GITHUB_TOKEN</code> in CI). The same
              variables apply to <Link href="#pull"><code>pull</code></Link>.
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
            The reference must include a tag or a digest. Extracting into the current directory
            (<code>-o .</code>) works, file modes are preserved, and pulling an artifact that was not
            pushed by Gooze fails with an error saying it is not a gooze reports artifact.
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
            Merges sharded reports (from <code>shard_*</code> folders) into the base output
            directory. It also folds in the reports of a narrowed run
            (<code>run/</code> and <code>run/shard_*</code>) and removes <code>run/</code>.
          </p>

          <h3>Usage</h3>
          <CodeBlock lang="bash" code="gooze report merge" />

          <p>
            It takes the same threshold flags as <code>view</code>, checked on the merged
            reports. A shard doesn&apos;t check thresholds, so put them here when you shard.
          </p>

          <h3>When you need this</h3>
          <p>
            If you run <code>gooze run -s INDEX/TOTAL</code>, Gooze writes into shard folders.
            You merge them before running <code>gooze report view</code>. After a run with{" "}
            <code>--diff</code>, <code>--run</code> or <code>--mutagens</code>, merge to add its
            results to the main reports before you read the project score.
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
            This example splits work into 4 jobs, then merges, then prints the full score and survivors.
          </p>

          <h3>Notes</h3>
          <ul>
            <li>If there are no shard directories, <code>merge</code> just rebuilds the index and prints the score.</li>
            <li>
              Shard reports replace base reports for the same source file; base reports for files
              no shard re-tested are kept, so caching can still work.
            </li>
            <li>
              Reports in <code>run/</code> (and <code>run/shard_*</code>) are folded in after the
              shards. For a file unchanged since the main reports (same source and test file
              hashes), they replace only the matching mutations, and the file stays complete. For
              a changed or new file, they replace all of the file&apos;s results; if the run tested
              only part of the file, it is marked partial, and the next full{" "}
              <code>gooze run</code> re-tests it in full. Then <code>run/</code> is removed.
            </li>
            <li>When <code>merge</code> runs inside the checkout, base reports for files that no longer exist are dropped.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
