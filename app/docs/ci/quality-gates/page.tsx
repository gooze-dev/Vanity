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

export const metadata = docsMetadata("/docs/ci/quality-gates")

const config = `threshold:
  total: 80       # the score of all mutations
  average: 75     # the mean of the file scores
  file: 50        # the score every file must reach
  diff:           # --diff runs only, on the changed lines
    total: 100`

const faqs = [
  {
    q: "Can Gooze fail CI below a mutation score?",
    a: "Yes. Pass `--threshold-total`, `--threshold-average` or `--threshold-file` (or set `threshold.*` in `gooze.yaml`) to `gooze run`, `gooze report view` or `gooze report merge`. Below a threshold, Gooze prints the score, then the scores that are too low, and exits with code `3`.",
  },
  {
    q: "What is the difference between the total, average and file thresholds?",
    a: "`total` is the score of all mutations, so large files weigh more. `average` is the mean of the per-file scores, so every file weighs the same. `file` is a floor every file must reach on its own.",
  },
  {
    q: "Can pull requests have a stricter threshold than main?",
    a: "Yes. `threshold.diff.total`, `threshold.diff.average` and `threshold.diff.file` (flags `--threshold-diff-*`) apply only to `gooze run --diff` runs, which score the changed lines. They replace the plain thresholds there, so one `gooze.yaml` can ask for 80% on main and 100% on the changed lines.",
  },
  {
    q: "Does a sharded run check thresholds?",
    a: "No. A shard holds only part of the results, so it prints a note instead. Put the thresholds on `gooze report merge` in the job that merges the shards.",
  },
  {
    q: "Are the reports saved when a run is below a threshold?",
    a: "Yes. Gooze writes the reports and prints the score before it checks the thresholds, so the cache and the baseline stay current. Only the exit code changes.",
  },
  {
    q: "What do Gooze's exit codes mean?",
    a: "`0` completed, `1` unexpected failure, `2` bad flag, argument or config value, `3` score below a threshold, `4` git error in diff mode, `5` registry error, `6` no reports to view or merge, `130` interrupted.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

const exitCodes: { code: string; meaning: string; action: string }[] = [
  { code: "0", meaning: "Completed; every threshold set is met.", action: "Nothing." },
  { code: "1", meaning: "Unexpected failure, such as reading or writing reports.", action: "Read the error; rerun with -v for the log." },
  { code: "2", meaning: "Bad flag, argument or config value (an invalid --run pattern, a threshold above 100).", action: "Fix the command or gooze.yaml." },
  { code: "3", meaning: "Completed, but a score is below a threshold. Reports are written.", action: "Kill the survivors, or treat it as a warning." },
  { code: "4", meaning: "--diff can't compare against git: no git, not a repository, unknown ref.", action: "Install git, or fetch the base ref (fetch-depth: 0)." },
  { code: "5", meaning: "report push or pull failed at the registry.", action: "Check the reference and credentials." },
  { code: "6", meaning: "No reports to view or merge.", action: "Run gooze run first, or point -o at the reports." },
  { code: "130", meaning: "Interrupted (Ctrl-C, SIGINT or SIGTERM).", action: "Rerun the command." },
]

export default function QualityGatesPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Quality gates</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your CI runs Gooze on every push, but the job passes at any score, so tests can get
        weaker without anyone noticing. A threshold turns the score into a gate: below it, Gooze
        exits with code <code>3</code> and the job fails. This page shows the three kinds of
        threshold, a stricter one for pull requests, where sharded runs check them, and how
        to handle each exit code in your pipeline.
      </p>

      <div>
        <div id="thresholds">
          <h2>Three thresholds</h2>
          <p>
            Each threshold is a percent, decimals allowed, and <code>0</code> turns it off.
            Gooze compares the score as it prints it, rounded to two decimals:
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Threshold</TableHead>
                <TableHead>Checks</TableHead>
                <TableHead>Fits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow>
                <TableCell><code>--threshold-total</code></TableCell>
                <TableCell>The score of all mutations, the one in the score line.</TableCell>
                <TableCell>One number for the codebase. Large files weigh more.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>--threshold-average</code></TableCell>
                <TableCell>The mean of the per-file scores.</TableCell>
                <TableCell>Every file weighs the same, so a weak small file counts.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>--threshold-file</code></TableCell>
                <TableCell>The score of every file on its own.</TableCell>
                <TableCell>A floor no file may drop below. The strictest.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p>
            In the <code>calc</code> story from the{" "}
            <Link href="/docs/quick-start">quick start</Link>, the first run scores{" "}
            <code>84.62%</code>. With a total threshold of <code>90</code>, the same run fails:
          </p>
          <CodeBlock lang="bash" code="gooze run --threshold-total 90 ./..." />
          <Recording name="calc-threshold-total" title="Recorded gooze run below threshold.total" />
          <p>
            The score line comes first, then one line for each score that is too low, then
            exit code <code>3</code>. The reports are written either way, so the next run still
            uses the cache. At <code>80</code> the run passes:
          </p>
          <Recording name="calc-threshold-met" title="Recorded gooze run that meets threshold.total" />
          <p>
            A file threshold names each file below it:
          </p>
          <Recording name="calc-threshold-file" title="Recorded gooze report view below threshold.file" />
          <p className="text-sm text-muted-foreground">
            A file whose mutations all fail to compile has no score: it never fails the file
            threshold and doesn&apos;t count towards the average. A set without any scored
            mutation meets every threshold.
          </p>
        </div>

        <div id="config">
          <h2>Set them once in gooze.yaml</h2>
          <p>
            Flags are handy in a pipeline step. To give every run the same gate, locally and in
            CI, put the thresholds in <code>gooze.yaml</code>:
          </p>
          <CodeBlock lang="yaml" code={config} />
          <p>
            A flag overrides the file for one run (<code>--threshold-total 0</code> turns the
            total off), and so does an environment variable such as{" "}
            <code>GOOZE_THRESHOLD_TOTAL</code> or <code>GOOZE_THRESHOLD_DIFF_FILE</code>. A value
            outside <code>0</code> to <code>100</code> is a usage error:
          </p>
          <Recording name="threshold-out-of-range" title="Recorded threshold out of range" />
          <p className="text-sm text-muted-foreground">
            All keys: <Link href="/docs/config#threshold">configuration</Link>. goozels marks a
            bad threshold in <code>gooze.yaml</code> while you type, and an editor run below a
            threshold shows as a warning, with the markers refreshed.
          </p>
        </div>

        <div id="diff">
          <h2>Pull requests: a threshold for the changed lines</h2>
          <p>
            A pull request run with <Link href="/docs/usage/diff-mode">diff mode</Link> scores
            only the lines it changes. That score deserves its own bar: new code can be held to
            100% while the codebase as a whole sits lower. The <code>threshold.diff</code> keys
            (flags <code>--threshold-diff-total</code>, <code>--threshold-diff-average</code>,{" "}
            <code>--threshold-diff-file</code>) apply only to <code>gooze run --diff</code>, and
            they replace the plain thresholds there. Every other run, view and merge uses the
            plain ones.
          </p>
          <p>
            With this <code>gooze.yaml</code>, <code>main</code> needs 80% and a branch&apos;s
            changed lines need 100%:
          </p>
          <Recording name="calc-threshold-config" title="Recorded gooze.yaml with a diff threshold" />
          <p>
            The <code>boundary-tests</code> branch kills every mutant on its changed lines, so
            its diff run passes the stricter gate:
          </p>
          <CodeBlock lang="bash" code="gooze run --diff main ./..." />
          <Recording name="calc-threshold-diff" title="Recorded diff run that meets threshold.diff.total" />
        </div>

        <div id="shards">
          <h2>Sharded runs: gate at the merge</h2>
          <p>
            A shard tests only its slice, so its score says little about the codebase. A
            sharded run doesn&apos;t check the thresholds; it says so and exits{" "}
            <code>0</code>:
          </p>
          <Recording name="calc-threshold-shard" title="Recorded shard that skips the thresholds" />
          <p>
            Put the thresholds on <code>gooze report merge</code> in the job that collects the
            shards. It checks them on all the results:
          </p>
          <Recording name="calc-threshold-merge" title="Recorded gooze report merge below threshold.total" />
        </div>

        <div id="where">
          <h2>Which commands check them</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Command</TableHead>
                <TableHead>Thresholds checked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              <TableRow>
                <TableCell><code>gooze run</code></TableCell>
                <TableCell><code>threshold.*</code> on the run&apos;s score (a <code>--run</code> or <code>--mutagens</code> run: its selection)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>gooze run --diff REF</code></TableCell>
                <TableCell><code>threshold.diff.*</code> on the changed lines</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>gooze run -s INDEX/TOTAL</code></TableCell>
                <TableCell>None; the merge checks them</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>gooze report view</code>, <code>gooze report merge</code></TableCell>
                <TableCell><code>threshold.*</code> on the reports they show</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>gooze run --estimate</code></TableCell>
                <TableCell>None; nothing is tested</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div id="exit-codes">
          <h2>Exit codes</h2>
          <p>
            Every Gooze command exits with one of these codes, so a pipeline can tell a low
            score from a broken setup:
          </p>
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
                  <TableCell>{row.meaning}</TableCell>
                  <TableCell>{row.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p>Some of them, recorded:</p>
          <Recording name="exit-code-usage" title="Recorded exit code 2 for an invalid --run pattern" />
          <Recording name="exit-code-git" title="Recorded exit code 4 for an unknown diff ref" />
          <Recording name="exit-code-no-reports" title="Recorded exit code 6 for a missing reports directory" />
        </div>

        <div id="ci">
          <h2>Exit codes in your pipeline</h2>
          <p>
            Every code but <code>0</code> fails a CI step. That is right for errors. Code{" "}
            <code>3</code> is different, because the run finished and wrote its reports, so
            you choose what a low score does. Each CI guide shows how, for its own system:
          </p>
          <ul>
            <li>
              <Link href="/docs/ci/github#exit-codes">GitHub Actions</Link>: accept code{" "}
              <code>3</code> in the shell, and keep later steps running with{" "}
              <code>if: {"${{ !cancelled() }}"}</code>.
            </li>
            <li>
              <Link href="/docs/ci/gitlab#exit-codes">GitLab CI</Link>: show a low score as a
              warning with <code>allow_failure: exit_codes: [3]</code>, and keep the reports with{" "}
              <code>when: always</code>.
            </li>
            <li>
              <Link href="/docs/ci/cloud-build#exit-codes">Google Cloud Build</Link>: gate in the
              last step, or record a low score with <code>allowExitCodes: [3]</code>.
            </li>
          </ul>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
