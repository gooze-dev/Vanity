import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import { DocsFaq, faqPageJsonLd } from "@/components/docs-faq"
import Link from "next/link"
import { CodeBlock } from "@/components/code-block"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = docsMetadata("/docs/config")

// Visible Q&A + matching FAQPage JSON-LD. Facts verified against the gooze
// config schema (pkg/config/schema.go).
const faqs = [
  {
    q: "How do I configure Gooze?",
    a: "Put a `gooze.yaml` in your project root; run `gooze config init` to generate a starter file. Every key can also be set with a `GOOZE_*` environment variable, and the common ones (`output`, `no-cache`, `paths.exclude`, `run.*`) with a CLI flag.",
  },
  {
    q: "What is the configuration precedence in Gooze?",
    a: "CLI flags override environment variables, environment variables override `gooze.yaml`, and `gooze.yaml` overrides the built-in defaults.",
  },
  {
    q: "How do I turn a `gooze.yaml` key into an environment variable?",
    a: "Add the `GOOZE_` prefix, uppercase the key, and replace dots and hyphens with underscores. For example, `paths.exclude` becomes `GOOZE_PATHS_EXCLUDE` and `run.parallel` becomes `GOOZE_RUN_PARALLEL`.",
  },
  {
    q: "How do I exclude vendor or mock files?",
    a: "List regular-expression patterns under `paths.exclude` in `gooze.yaml`, or pass `-x`/`--exclude` on the CLI (repeat the flag for more than one pattern).",
  },
  {
    q: "Why is my logging configuration being ignored?",
    a: "The `--verbose` and `--log-output` CLI flags take precedence over the file and environment logging settings, so a flag on the command line overrides what is in `gooze.yaml`.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

export default function ConfigPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Configuration (gooze.yaml)</h1>
      <p className="text-lg text-muted-foreground mb-8">
        You want the same Gooze settings on your machine and in CI. Gooze reads them from a
        file named <code>gooze.yaml</code> that you commit with your code.
      </p>

      <div>
        <div id="create">
          <h2>Create a starter config</h2>
          <p>
            This command creates a starter <code>gooze.yaml</code> in the current directory.
          </p>
          <CodeBlock lang="bash" code="gooze config init" />
        </div>

        <div id="load">
          <h2>How config is loaded</h2>
          <ul>
            <li>File name: <code>gooze.yaml</code></li>
            <li>Location: the directory you run Gooze from</li>
            <li>
              Environment variables: prefix <code>GOOZE_</code>
              (use <code>_</code> instead of <code>-</code> and <code>.</code>)
            </li>
          </ul>
          <p>
            Example: the flag <code>--no-cache</code> can be set with <code>GOOZE_NO_CACHE=true</code>.
          </p>
        </div>

        <div id="env">
          <h2>Environment variables</h2>
          <p>
            Gooze can read settings from environment variables.
            The names are derived from config keys by prefixing <code>GOOZE_</code>, uppercasing,
            and replacing <code>.</code> and <code>-</code> with <code>_</code>.
          </p>
          <p>
            When the same setting comes from more than one place, higher
            precedence wins:
          </p>
          <div className="mt-3 rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Precedence</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-muted-foreground">
                <TableRow>
                  <TableCell>1 (highest)</TableCell>
                  <TableCell>CLI flag</TableCell>
                  <TableCell><code>gooze run --no-cache ./...</code></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>Environment variable</TableCell>
                  <TableCell><code>GOOZE_NO_CACHE=true</code></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell><code>gooze.yaml</code></TableCell>
                  <TableCell><code>no-cache: true</code></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4 (lowest)</TableCell>
                  <TableCell>Built-in default</TableCell>
                  <TableCell>cache enabled</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <p className="mt-3">
            For logging, the <code>--verbose</code> and <code>--log-output</code>{" "}
            flags override the environment and config settings.
          </p>

          <div className="mt-4 rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Env var</TableHead>
                  <TableHead>What it controls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-muted-foreground">
                <TableRow>
                  <TableCell>
                    <code>GOOZE_OUTPUT</code>
                  </TableCell>
                  <TableCell>Reports output directory</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_NO_CACHE</code>
                  </TableCell>
                  <TableCell>Disable incremental cache when <code>true</code></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_PATHS_EXCLUDE</code>
                  </TableCell>
                  <TableCell>Exclude patterns (space-separated)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_RUN_PARALLEL</code>
                  </TableCell>
                  <TableCell>
                    Worker count for <code>run</code>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_RUN_MUTATION_TIMEOUT</code>
                  </TableCell>
                  <TableCell>Per-mutation timeout (seconds)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_RUN_COVERAGE_PROFILE</code>
                  </TableCell>
                  <TableCell>
                    Path to a Go coverage profile; skips mutations on uncovered lines (default empty)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_RUN_DIFF</code>
                  </TableCell>
                  <TableCell>
                    Git ref for <Link href="/docs/usage/diff-mode">diff mode</Link>: mutate only lines
                    changed against it (default empty, off). Needs git on <code>PATH</code> and a git
                    repository.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_RUN_MUTAGENS</code>
                  </TableCell>
                  <TableCell>
                    Mutagens to run, comma-separated, for example <code>comparison,boolean</code>{" "}
                    (default empty, the nine defaults; <code>branch</code>, <code>statement</code> and{" "}
                    <code>loop</code> run only when listed). A value makes every run a{" "}
                    <Link href="/docs/usage/single-function#run-dir">narrowed run</Link> that writes to{" "}
                    <code>run/</code>.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_THRESHOLD_TOTAL</code>, <code>_AVERAGE</code>, <code>_FILE</code>
                  </TableCell>
                  <TableCell>
                    Minimum scores in percent (default <code>0</code>, off); see{" "}
                    <a href="#threshold">score thresholds</a>.{" "}
                    <code>GOOZE_THRESHOLD_DIFF_TOTAL</code> and the other{" "}
                    <code>GOOZE_THRESHOLD_DIFF_*</code> set the ones for <code>--diff</code> runs.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_LOG_FILENAME</code>
                  </TableCell>
                  <TableCell>Log file path</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_LOG_VERBOSE</code>
                  </TableCell>
                  <TableCell>Force verbose logging when <code>true</code></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_LOG_LEVEL</code>
                  </TableCell>
                  <TableCell>
                    Log level: <code>debug</code>, <code>info</code>, <code>warn</code> or{" "}
                    <code>error</code>, or a numeric slog level (<code>-4</code> debug, <code>0</code>{" "}
                    info, <code>4</code> warn, <code>8</code> error); default <code>info</code>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_LOG_MAX_SIZE</code>
                  </TableCell>
                  <TableCell>Max log size in MiB before rotation (default <code>10</code>)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_LOG_MAX_BACKUPS</code>
                  </TableCell>
                  <TableCell>Number of rotated log files to keep (default <code>3</code>)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_LOG_MAX_AGE</code>
                  </TableCell>
                  <TableCell>Days to keep rotated logs (default <code>28</code>)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_LOG_COMPRESS</code>
                  </TableCell>
                  <TableCell>Gzip rotated logs (default <code>true</code>)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 space-y-3">
            <CodeBlock
              lang="bash"
              code={`# Example: set output + disable cache for one run
export GOOZE_OUTPUT=.gooze-reports
export GOOZE_NO_CACHE=true

gooze run ./...`}
            />
            <CodeBlock
              lang="bash"
              code={`# Example: exclude vendor and mock files
export GOOZE_PATHS_EXCLUDE='^vendor/ ^mock_'

gooze run ./...`}
            />
          </div>
        </div>

        <div id="example">
          <h2>Complete gooze.yaml reference</h2>
          <p>
            Every supported key, with its default value. All keys are optional:
            Gooze falls back to these defaults when a key is omitted.
          </p>
          <CodeBlock
            lang="yaml"
            code={`# gooze.yaml
version: 1                    # config schema version
output: .gooze-reports        # where reports and the incremental cache live
no-cache: false               # set true to force a full re-run

paths:
  exclude: []                 # regex patterns of files to skip, e.g. '^vendor/'

run:
  parallel: 1                 # concurrent mutation workers
  mutation_timeout: 120       # per-mutation timeout, in seconds
  coverage_profile: ''        # e.g. coverage.out to skip uncovered lines
  diff: ''                    # git ref, e.g. origin/main: mutate only changed lines (needs git)
  mutagens: []                # e.g. [comparison, boolean]; empty runs the nine defaults

threshold:                    # minimum scores in percent; 0 is off; below one, exit code 3
  total: 0                    # the score of all mutations
  average: 0                  # the mean of the file scores
  file: 0                     # the score every file must reach
  diff:                       # used instead of the above by gooze run --diff
    total: 0
    average: 0
    file: 0

log:
  filename: .gooze.log
  level: info                 # debug | info | warn | error
  verbose: false              # overridden by --verbose
  max_size: 10                # MiB before the log rotates
  max_backups: 3              # rotated files to keep
  max_age: 28                 # days to keep rotated logs
  compress: true              # gzip rotated logs
`}
          />
        </div>

        <div id="threshold">
          <h2>Score thresholds</h2>
          <p>
            The <code>threshold</code> keys make <code>gooze run</code>,{" "}
            <code>gooze report view</code> and <code>gooze report merge</code> exit with code{" "}
            <code>3</code> when a score is below them: <code>total</code> for the score of all
            mutations, <code>average</code> for the mean of the file scores, and{" "}
            <code>file</code> for every file&apos;s own score. The <code>threshold.diff</code>{" "}
            keys replace them for <code>gooze run --diff</code>, on the changed lines. Flags{" "}
            <code>--threshold-total</code> and <code>--threshold-diff-total</code> (and the
            others) override them for one command. How to pick and use them:{" "}
            <Link href="/docs/ci/quality-gates">Quality gates</Link>.
          </p>
        </div>

        <div id="validation">
          <h2>Validation</h2>
          <p>
            <code>gooze run</code> checks the values before it starts and exits with an error for
            any value out of range:
          </p>
          <ul>
            <li><code>run.parallel</code> must be at least <code>1</code></li>
            <li><code>run.mutation_timeout</code> must be at least <code>1</code> (seconds)</li>
            <li><code>version</code> must be <code>1</code></li>
            <li>every <code>threshold</code> value must be a number from <code>0</code> to <code>100</code></li>
          </ul>
          <p>
            An invalid value exits with code <code>2</code>.
          </p>
          <Recording name="run-invalid-parallel" title="Recorded gooze run with --parallel 0" />
        </div>

        <div id="cli-vs-config">
          <h2>CLI flags vs config</h2>
          <p>
            CLI flags override config (see the precedence table above).
            If you see surprising behavior, print the help and compare:
          </p>
          <div className="mt-3 space-y-2">
            <CodeBlock lang="bash" code="gooze --help" />
            <CodeBlock lang="bash" code="gooze run --help" />
          </div>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
