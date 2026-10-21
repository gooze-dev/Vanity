import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import { DocsFaq, faqPageJsonLd, withCode } from "@/components/docs-faq"
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

const simple = `name: Mutation testing

on: [push, pull_request]

jobs:
  gooze:
    runs-on: ubuntu-latest
    container: golang:1.27       # official Go image: go is already installed
    steps:
      - uses: actions/checkout@v4
      - run: go install gooze.dev/pkg/gooze@latest
      - run: gooze run ./...`

const sharded = `jobs:
  test:
    runs-on: ubuntu-latest
    container: golang:1.27
    strategy:
      matrix:
        shard: [0, 1, 2]
    steps:
      - uses: actions/checkout@v4
      - run: go install gooze.dev/pkg/gooze@latest

      # Each job tests one third of the mutations, in parallel.
      # Sharded runs write to .gooze-reports/shard_\${{ matrix.shard }}/.
      - name: Run shard \${{ matrix.shard }}
        run: gooze run -s \${{ matrix.shard }}/3 ./...

      - name: Upload shard reports
        uses: actions/upload-artifact@v4
        with:
          name: gooze-shard-\${{ matrix.shard }}
          path: .gooze-reports/

  merge:
    needs: test
    runs-on: ubuntu-latest
    container: golang:1.27
    steps:
      - run: go install gooze.dev/pkg/gooze@latest

      # Collect every shard's reports back into .gooze-reports/.
      - name: Download shard reports
        uses: actions/download-artifact@v4
        with:
          path: .gooze-reports
          pattern: gooze-shard-*
          merge-multiple: true

      # Merge shard_* subdirs into one combined report set.
      - name: Merge shard reports
        run: gooze report merge`

const cached = `permissions:
  contents: read
  packages: write          # push the merged baseline to GHCR

env:
  REPORTS_REF: ghcr.io/\${{ github.repository }}/gooze-reports:main
  GOOZE_REGISTRY_USERNAME: \${{ github.actor }}
  GOOZE_REGISTRY_PASSWORD: \${{ secrets.GITHUB_TOKEN }}

jobs:
  test:
    runs-on: ubuntu-latest
    container: golang:1.27
    strategy:
      matrix:
        shard: [0, 1, 2]
    steps:
      - uses: actions/checkout@v4
      - run: go install gooze.dev/pkg/gooze@latest

      # Reuse the main baseline so unchanged files are skipped (the cache).
      - name: Restore baseline from main
        run: gooze report pull "$REPORTS_REF" || echo "no baseline yet"

      - name: Run shard \${{ matrix.shard }}
        run: gooze run -s \${{ matrix.shard }}/3 ./...

      # Hand reports to the merge job via an artifact; no registry push here.
      - name: Upload shard reports
        uses: actions/upload-artifact@v4
        with:
          name: gooze-shard-\${{ matrix.shard }}
          path: .gooze-reports/

  merge:
    needs: test
    runs-on: ubuntu-latest
    container: golang:1.27
    steps:
      - run: go install gooze.dev/pkg/gooze@latest

      - name: Collect shard reports
        uses: actions/download-artifact@v4
        with:
          path: .gooze-reports
          pattern: gooze-shard-*
          merge-multiple: true

      - name: Merge shards
        run: gooze report merge

      # Only main publishes the merged baseline back to the registry.
      - name: Publish merged baseline (main only)
        if: \${{ github.ref == 'refs/heads/main' }}
        run: gooze report push "$REPORTS_REF"`

const diff = `on: [push, pull_request]

env:
  REPORTS_REF: ghcr.io/\${{ github.repository }}/gooze-reports:main
  GOOZE_REGISTRY_USERNAME: \${{ github.actor }}
  GOOZE_REGISTRY_PASSWORD: \${{ secrets.GITHUB_TOKEN }}

jobs:
  # Pull requests: one job that mutates only the changed lines.
  diff:
    if: \${{ github.event_name == 'pull_request' }}
    runs-on: ubuntu-latest
    container: golang:1.27
    steps:
      # Full history, so gooze finds the merge base with the target branch.
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: go install gooze.dev/pkg/gooze@latest

      # Reports go to .gooze-reports/run; nothing is pushed. Fails the job
      # (exit code 3) when the changed lines score below 80%.
      - name: Mutate the changed lines
        run: gooze run --diff "origin/\${{ github.base_ref }}" --threshold-diff-total 80 ./...

  # Pushes: the sharded full run from above, which publishes the baseline on main.
  test:
    if: \${{ github.event_name == 'push' }}
    # ...same matrix and steps as above

  merge:
    if: \${{ github.event_name == 'push' }}
    needs: test
    # ...same steps as above, then the score gate`

const gate = `      # Last step: fails the job (exit code 3) below 60%, after the
      # baseline is already pushed.
      - name: Mutation score gate
        run: gooze report view --threshold-total 60`

const tolerate = `      # A low score (exit code 3) doesn't fail this step; errors still do.
      - name: Mutation testing
        run: gooze run --threshold-total 80 ./... || [ $? -eq 3 ]`

const keepReports = `      # Runs even when the gate step before it failed, but not when the
      # job was cancelled.
      - name: Upload reports
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: gooze-reports
          path: .gooze-reports/`

// What each Gooze exit code means in a GitHub Actions job.
const exitCodes = [
  { code: "0", what: "The step passes." },
  { code: "1", what: "Unexpected failure. Add `-v` and upload `.gooze.log` to read it." },
  { code: "2", what: "A bad flag or `gooze.yaml` value: fix the workflow or the config." },
  { code: "3", what: "A score below a threshold. The step fails, but the reports are written: later steps with `if: ${{ !cancelled() }}` still see them." },
  { code: "4", what: "`--diff` can't find the base: check out with `fetch-depth: 0`, and keep git in the image." },
  { code: "5", what: "The registry refused `report push` or `pull`: check `GOOZE_REGISTRY_*` and `packages: write`." },
  { code: "6", what: "No reports: the merge job ran before the shard artifacts were downloaded, or `-o` points elsewhere." },
  { code: "130", what: "The job was cancelled or hit `timeout-minutes`." },
]

const faqs = [
  {
    q: "How do I run Gooze mutation tests in GitHub Actions?",
    a: "In a `golang:1.27` container, install the CLI with `go install gooze.dev/pkg/gooze@latest` and run `gooze run ./...`. There is no dedicated action; the plain `go install` step is the supported approach.",
  },
  {
    q: "How do I shard Gooze across multiple GitHub Actions runners?",
    a: "Use a `strategy.matrix` of shard indexes (0-based) and pass them to `gooze run -s INDEX/TOTAL`, for example `gooze run -s ${{ matrix.shard }}/3`. A final job downloads every shard's reports and runs `gooze report merge`.",
  },
  {
    q: "How do I cache incremental Gooze reports in CI?",
    a: "Pull a baseline from an OCI registry with `gooze report pull` at the start of each shard so unchanged files are skipped, and push the merged baseline back from the main branch after `gooze report merge`.",
  },
  {
    q: "How do I fail a pull request when the mutation score is too low?",
    a: "Add `--threshold-total 60` (or `threshold.total` in `gooze.yaml`) to the last Gooze step, for example `gooze report view --threshold-total 60`. Below it, Gooze exits with code `3` and the job fails. When you shard, gate in the merge job.",
  },
  {
    q: "How do I test only the lines a pull request changed in GitHub Actions?",
    a: "In one job on pull requests, check out with `fetch-depth: 0` and run `gooze run --diff origin/${{ github.base_ref }} --threshold-diff-total 80 ./...`. The diff threshold checks the score of the changed lines. Keep the full run on pushes to `main`, which pushes the baseline.",
  },
  {
    q: "Does Gooze post results as a pull-request comment?",
    a: "No. Gooze does not post PR comments. Surface results by failing the job with the mutation-score gate, or by publishing the report as an artifact or OCI baseline.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

export const metadata = docsMetadata("/docs/ci/github")

export default function CiPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">GitHub Actions</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your mutation score is good on your machine, and you want every push to keep it
        that way. Start with the one-job workflow, then add shards when the run gets slow, a
        shared baseline so unchanged files are skipped, and a gate that fails the build
        below a score.
      </p>

      <div>
        <div id="simple">
          <h2>1. Simplest: checkout and run</h2>
          <p>
            Install Gooze and run the whole suite. No registry, no caching. For the{" "}
            <Link href="/docs/quick-start"><code>calc</code></Link> package from the quick
            start, the job log ends with the same line you saw locally:
          </p>
          <CodeBlock lang="yaml" code={simple} />
          <Recording name="calc-first-run" title="Recorded last line of the first gooze run on calc" />
          <p>
            The job passes even with those two survivors, because no threshold is set. The{" "}
            <a href="#gate">quality gate</a> below fixes that. First, a bigger module needs the
            run split up.
          </p>
        </div>

        <div id="sharded">
          <h2>2. Sharded: run in parallel</h2>
          <p>
            When one job takes too long, split the run across jobs with{" "}
            <code>-s INDEX/TOTAL</code>. Each job tests its own slice and uploads its reports; a final{" "}
            <code>merge</code> job downloads them all and
            combines them with{" "}
            <Link href="/docs/cli/report#merge"><code>gooze report merge</code></Link>.
          </p>
          <CodeBlock lang="yaml" code={sharded} />
          <p>
            Every push still re-tests every file, even the ones nobody touched. A shared
            baseline removes that work.
          </p>
        </div>

        <div id="cached">
          <h2>3. Sharded + cached baseline</h2>
          <p>
            Add an OCI baseline so each run only re-tests changed files
            (<Link href="/docs/usage/incremental-runs">incremental runs</Link>).
            If a push doesn&apos;t touch <code>calc.go</code> or its tests, its 13 mutations
            come from the cache instead of being tested again.
            Every shard pulls the <code>:main</code> baseline
            for the cache, then hands its reports to the merge job as an artifact; shards never push
            to the registry. The merge job combines them with{" "}
            <Link href="/docs/cli/report#merge"><code>gooze report merge</code></Link>{" "}
            and, <strong>only on <code>main</code></strong>, publishes the single merged baseline back to{" "}
            <code>:main</code>.
          </p>
          <CodeBlock lang="yaml" code={cached} />
        </div>

        <div id="diff">
          <h2>4. Pull requests: only the changed lines</h2>
          <p>
            A pull request that changes three lines of a large file still re-tests that whole
            file. With <Link href="/docs/usage/diff-mode">diff mode</Link>,
            pull requests mutate only the lines they change against the target branch, while
            pushes keep the sharded full run that publishes the baseline on <code>main</code>:
          </p>
          <CodeBlock lang="yaml" code={diff} />
          <ul>
            <li>
              <code>github.base_ref</code> is the pull request&apos;s target branch and is set
              only for pull request events.
            </li>
            <li>
              <code>fetch-depth: 0</code> fetches all history, branches and tags. The default
              checkout has one commit and no <code>origin/main</code>, so <code>--diff</code>{" "}
              would stop with an unknown ref or no merge base.
            </li>
            <li>
              The diff job runs in one job, without shards. A diff run is small, and a shard
              doesn&apos;t check thresholds.
            </li>
            <li>
              A diff run writes its reports to <code>.gooze-reports/run/</code>, and its score
              covers the changed lines only. <code>--threshold-diff-total</code> checks that
              score, so the gate holds the pull request&apos;s own code to its bar (see{" "}
              <Link href="/docs/ci/quality-gates#diff">diff thresholds</Link>). The job
              doesn&apos;t push: the baseline comes only from the full run on <code>main</code>.
            </li>
            <li>
              Diff mode needs git. The <code>golang</code> image includes it; a minimal image
              may not.
            </li>
          </ul>
        </div>

        <div id="gate">
          <h2>Fail the build below a score (quality gate)</h2>
          <p>
            Add a threshold to the last Gooze step: in the merge job, after{" "}
            <code>gooze report merge</code> and the baseline push, when you shard. Below the{" "}
            <Link href="/docs/usage/results#score">mutation score</Link> you set, Gooze exits
            with code <code>3</code> and the job fails:
          </p>
          <CodeBlock lang="yaml" code={gate} />
          <p>
            With <code>60</code>, the <code>calc</code> run at <code>84.62%</code> passes. Raise
            it to <code>90</code> and the same run fails until you add the two boundary tests
            that bring it to <code>100.00%</code>.
          </p>
          <p className="text-sm text-muted-foreground">
            A shard doesn&apos;t check thresholds, so gate only in the merge job. The average and
            per-file thresholds and <code>gooze.yaml</code> settings are in{" "}
            <Link href="/docs/ci/quality-gates">Quality gates</Link>; how to let a low score
            pass while errors still fail is in <a href="#exit-codes">exit codes</a>.
          </p>
        </div>

        <div id="exit-codes">
          <h2>Exit codes</h2>
          <p>
            Every Gooze exit code but <code>0</code> fails the step, and GitHub skips the steps
            after it. That is right for errors. A low score (code <code>3</code>) is different:
            the run finished and wrote its reports, so you choose what it does.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>In GitHub Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              {exitCodes.map((row) => (
                <TableRow key={row.code}>
                  <TableCell><code>{row.code}</code></TableCell>
                  <TableCell>{withCode(row.what)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p>
            To let a step pass on a low score but still fail on errors, accept code{" "}
            <code>3</code> in the shell, and gate in a later step:
          </p>
          <CodeBlock lang="yaml" code={tolerate} />
          <p>
            Steps that must run after a failed gate, such as uploading reports, take{" "}
            <code>if: {"${{ !cancelled() }}"}</code>:
          </p>
          <CodeBlock lang="yaml" code={keepReports} />
          <p className="text-sm text-muted-foreground">
            What every code means, whatever runs Gooze:{" "}
            <Link href="/docs/ci/quality-gates#exit-codes">Quality gates</Link>.
          </p>
        </div>

        <div id="auth">
          <h2>Authentication</h2>
          <ul>
            <li>
              <code>GOOZE_REGISTRY_USERNAME</code> /{" "}
              <code>GOOZE_REGISTRY_PASSWORD</code>. The
              password may be a token/PAT (for GHCR use{" "}
              <code>GITHUB_TOKEN</code>).
            </li>
            <li>
              If unset, Gooze falls back to the Docker credential store, so a prior{" "}
              <code>docker/login-action</code> step also works.
            </li>
            <li>
              For a non-TLS or self-signed registry add{" "}
              <code>--plain-http</code> or{" "}
              <code>--insecure</code> to <code>push</code>/<code>pull</code>.
            </li>
          </ul>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
