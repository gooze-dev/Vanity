import { CodeBlock } from "@/components/code-block"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ConfigPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Configuration</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze reads config from a file named <code className="bg-muted px-1 py-0.5 rounded">gooze.yaml</code>.
        This helps you keep the same settings in your repo and in CI.
      </p>

      <div className="space-y-12">
        <div id="create" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Create a starter config</h2>
          <p className="mb-3 text-muted-foreground">
            This command creates a starter <code className="bg-muted px-1 py-0.5 rounded">gooze.yaml</code> in the current directory.
          </p>
          <CodeBlock lang="bash" code="gooze init" />
        </div>

        <div id="load" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">How config is loaded</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>File name: <code className="bg-muted px-1 py-0.5 rounded">gooze.yaml</code></li>
            <li>Location: the directory you run Gooze from</li>
            <li>
              Environment variables: prefix <code className="bg-muted px-1 py-0.5 rounded">GOOZE_</code>
              (use <code className="bg-muted px-1 py-0.5 rounded">_</code> instead of <code className="bg-muted px-1 py-0.5 rounded">-</code> and <code className="bg-muted px-1 py-0.5 rounded">.</code>)
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Example: the flag <code className="bg-muted px-1 py-0.5 rounded">--no-cache</code> can be set via <code className="bg-muted px-1 py-0.5 rounded">GOOZE_NO_CACHE=true</code>.
          </p>
        </div>

        <div id="env" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Environment variables</h2>
          <p className="text-muted-foreground">
            Gooze can read settings from environment variables.
            The names are derived from config keys by prefixing <code className="bg-muted px-1 py-0.5 rounded">GOOZE_</code>, uppercasing,
            and replacing <code className="bg-muted px-1 py-0.5 rounded">.</code> and <code className="bg-muted px-1 py-0.5 rounded">-</code> with <code className="bg-muted px-1 py-0.5 rounded">_</code>.
          </p>
          <p className="mt-3 text-muted-foreground">
            Typical precedence is: CLI flags -&gt; env vars -&gt; config file -&gt; defaults.
            For logging, <code className="bg-muted px-1 py-0.5 rounded">--verbose</code> and <code className="bg-muted px-1 py-0.5 rounded">--log-output</code> override env/config.
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
                    <code className="bg-muted px-1 py-0.5 rounded">GOOZE_OUTPUT</code>
                  </TableCell>
                  <TableCell>Reports output directory</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code className="bg-muted px-1 py-0.5 rounded">GOOZE_NO_CACHE</code>
                  </TableCell>
                  <TableCell>Disable incremental cache when true</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code className="bg-muted px-1 py-0.5 rounded">GOOZE_PATHS_EXCLUDE</code>
                  </TableCell>
                  <TableCell>Exclude patterns (comma-separated)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code className="bg-muted px-1 py-0.5 rounded">GOOZE_RUN_PARALLEL</code>
                  </TableCell>
                  <TableCell>
                    Worker count for <code className="bg-muted px-1 py-0.5 rounded">run</code>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code className="bg-muted px-1 py-0.5 rounded">GOOZE_RUN_MUTATION_TIMEOUT</code>
                  </TableCell>
                  <TableCell>Per-mutation timeout (seconds)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code className="bg-muted px-1 py-0.5 rounded">GOOZE_LOG_FILENAME</code>
                  </TableCell>
                  <TableCell>Log file path</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code className="bg-muted px-1 py-0.5 rounded">GOOZE_LOG_VERBOSE</code>
                  </TableCell>
                  <TableCell>Force verbose logging when true</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code className="bg-muted px-1 py-0.5 rounded">GOOZE_LOG_LEVEL</code>
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

        <div id="example" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">A common config example</h2>
          <p className="mb-3 text-muted-foreground">
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

        <div id="cli-vs-config" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">CLI flags vs config</h2>
          <p className="text-muted-foreground">
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
