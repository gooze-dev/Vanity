import { docsMetadata } from "@/lib/docs-meta"
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

export default function ConfigPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Configuration (gooze.yaml)</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze reads config from a file named <code>gooze.yaml</code>.
        This helps you keep the same settings in your repo and in CI.
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
            Example: the flag <code>--no-cache</code> can be set via <code>GOOZE_NO_CACHE=true</code>.
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
            Typical precedence is: CLI flags -&gt; env vars -&gt; config file -&gt; defaults.
            For logging, <code>--verbose</code> and <code>--log-output</code> override env/config.
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
                  <TableCell>Disable incremental cache when true</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_PATHS_EXCLUDE</code>
                  </TableCell>
                  <TableCell>Exclude patterns (comma-separated)</TableCell>
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
                    <code>GOOZE_LOG_FILENAME</code>
                  </TableCell>
                  <TableCell>Log file path</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_LOG_VERBOSE</code>
                  </TableCell>
                  <TableCell>Force verbose logging when true</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>GOOZE_LOG_LEVEL</code>
                  </TableCell>
                  <TableCell>Log level (for example: debug, info, warn, error)</TableCell>
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
export GOOZE_PATHS_EXCLUDE='^vendor/,^mock_'

gooze run ./...`}
            />
          </div>
        </div>

        <div id="example">
          <h2>A common config example</h2>
          <p>
            This example does:
            (1) sets output dir, (2) excludes vendor/examples, (3) sets parallel workers, (4) enables verbose logs.
          </p>
          <CodeBlock
            lang="yaml"
            code={`# gooze.yaml
output: .gooze-reports
no-cache: false

run:
  parallel: 1
  # Some versions support a timeout flag/config.
  # Check: gooze run --help
  mutation_timeout: 120
  # Skip mutations on lines not covered by an existing Go coverage profile.
  # Generate it first: go test -coverprofile=coverage.out ./...
  # Default empty (disabled).
  coverage_profile: coverage.out

paths:
  exclude:
    - '^vendor/'
    - '^examples/'

logging:
  verbose: false
  output: .gooze.log
`}
          />
        </div>

        <div id="cli-vs-config">
          <h2>CLI flags vs config</h2>
          <p>
            In most tools, CLI flags override config.
            If you see surprising behavior, print help and compare:
          </p>
          <div className="mt-3 space-y-2">
            <CodeBlock lang="bash" code="gooze --help" />
            <CodeBlock lang="bash" code="gooze run --help" />
          </div>
        </div>
      </div>
    </section>
  )
}
