import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Recording } from "@/components/recording"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { withCode } from "@/components/docs-faq"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"

const commands = [
  { title: "run", href: "/docs/cli/run", desc: "Run mutation testing (use `--estimate` to preview)" },
  { title: "report", href: "/docs/cli/report", desc: "View, merge, push, and pull reports" },
  { title: "config", href: "/docs/cli/config", desc: "Manage configuration (`config init`)" },
  { title: "version", href: "/docs/cli/version", desc: "Print version/build info" },
]

// One row per exit code; the CI guides link here instead of repeating it.
const exitCodes: { code: string; meaning: string; action: string }[] = [
  { code: "0", meaning: "Completed; every threshold set is met.", action: "Nothing." },
  { code: "1", meaning: "Unexpected failure, such as reading or writing reports.", action: "Read the error; rerun with -v for the log." },
  { code: "2", meaning: "Bad flag, argument or config value (an invalid --run pattern, a threshold above 100).", action: "Fix the command or gooze.yaml." },
  { code: "3", meaning: "Completed, but a score is below a threshold. Reports are written.", action: "Kill the survivors, or treat it as a warning." },
  { code: "4", meaning: "--diff can't compare against git: no git, not a repository, unknown ref.", action: "Install git, or fetch the base ref (fetch-depth: 0)." },
  { code: "5", meaning: "report push or pull failed at the registry.", action: "Check the reference and credentials." },
  { code: "6", meaning: "No reports to view or merge.", action: "Run gooze run first, or point -o at the reports." },
  { code: "7", meaning: "A package's tests fail without any mutation, so its mutants weren't tested. Other packages are scored and saved.", action: "Make go test pass for the packages listed, then rerun." },
  { code: "130", meaning: "Interrupted (Ctrl-C, SIGINT or SIGTERM).", action: "Rerun the command." },
]

export const metadata = docsMetadata("/docs/cli")

export default function CliPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">CLI reference</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Look up which Gooze command to run and the flags they share. Each command has its own
        page with every flag.
      </p>

      <div>
        <div id="basic">
          <h2>Basic usage</h2>
          <CodeBlock lang="bash" code="gooze [global flags] <command> [command flags] [paths...]" />
          <p>Most people start with:</p>
          <div>
            <CodeBlock lang="bash" code="gooze run --estimate ./..." />
            <CodeBlock lang="bash" code="gooze run ./..." />
            <CodeBlock lang="bash" code="gooze report view" />
          </div>
        </div>

        <div id="global-flags">
          <h2>Global flags</h2>
          <ul>
            <li>
              <code>-o, --output &lt;dir&gt;</code>: where reports are written (default <code>.gooze-reports</code>)
            </li>
            <li>
              <code>--no-cache</code>: re-test everything (don&apos;t reuse cached reports)
            </li>
            <li>
              <code>-x, --exclude &lt;regex&gt;</code>: exclude files by regex (you can repeat this)
            </li>
            <li>
              <code>-v, --verbose</code>: write extra debug logs
            </li>
            <li>
              <code>--log-output &lt;path&gt;</code>: write logs to a specific file
            </li>
          </ul>
          <p>
            Flags that only apply to one command, such as <code>--coverage-profile</code>, are listed on that
            command&apos;s page (see <Link href="/docs/cli/run#flags"><code>gooze run</code></Link>).
          </p>
          <p>
            Tip: flags can change between versions.
            If you are unsure, run <code>gooze --help</code> or <code>gooze run --help</code>.
          </p>
        </div>

        <div id="exit-codes">
          <h2>Exit codes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Meaning</TableHead>
                <TableHead>What to do</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              {exitCodes.map((row) => (
                <TableRow key={row.code}>
                  <TableCell><code>{row.code}</code></TableCell>
                  <TableCell>{withCode(row.meaning)}</TableCell>
                  <TableCell>{withCode(row.action)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p>Some of them, recorded:</p>
          <Recording name="exit-code-usage" title="Recorded exit code 2 for an invalid --run pattern" />
          <Recording name="exit-code-git" title="Recorded exit code 4 for an unknown diff ref" />
          <Recording name="exit-code-no-reports" title="Recorded exit code 6 for a missing reports directory" />
          <p>
            Errors print as <code>Error: ...</code>; the command&apos;s usage text follows only for
            flag and argument errors, not for runtime errors.
          </p>
          <p>
            Survivors change the exit code only when you set a{" "}
            <Link href="/docs/ci/quality-gates">threshold</Link>. How to let a low score pass
            in CI while errors still fail:{" "}
            <Link href="/docs/ci/github#exit-codes">GitHub Actions</Link>,{" "}
            <Link href="/docs/ci/gitlab#exit-codes">GitLab CI</Link>,{" "}
            <Link href="/docs/ci/cloud-build#exit-codes">Google Cloud Build</Link>.
          </p>
        </div>

        <div id="commands">
          <h2>Commands</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {commands.map((cmd) => (
              <Item key={cmd.title} variant="outline" asChild className="hover:border-[color:var(--gooze-teal)]">
                <Link href={cmd.href}>
                  <ItemContent>
                    <ItemTitle>{cmd.title}</ItemTitle>
                    <ItemDescription>{withCode(cmd.desc)}</ItemDescription>
                  </ItemContent>
                </Link>
              </Item>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
