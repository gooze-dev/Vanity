import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import { DocsFaq, faqPageJsonLd } from "@/components/docs-faq"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

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

const diff = `env:
  REPORTS_REF: ghcr.io/\${{ github.repository }}/gooze-reports:main
  GOOZE_REGISTRY_USERNAME: \${{ github.actor }}
  GOOZE_REGISTRY_PASSWORD: \${{ secrets.GITHUB_TOKEN }}
  # The pull request's target branch; empty on pushes, so main keeps a full run.
  BASE: \${{ github.base_ref && format('origin/{0}', github.base_ref) || '' }}

jobs:
  test:
    # ...same matrix as above
    steps:
      # Full history, so gooze finds the merge base with the target branch.
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: go install gooze.dev/pkg/gooze@latest

      - name: Restore baseline from main
        run: gooze report pull "$REPORTS_REF" || echo "no baseline yet"

      # --diff="" turns diff mode off, so pushes to main test everything.
      - name: Run shard \${{ matrix.shard }}
        run: gooze run --diff="$BASE" -s \${{ matrix.shard }}/3 ./...

      # ...upload shard reports as above

  merge:
    needs: test
    runs-on: ubuntu-latest
    container: golang:1.27
    steps:
      # gooze report view --diff reads the changes from git, so it needs the checkout too.
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: go install gooze.dev/pkg/gooze@latest

      # ...download shard reports, gooze report merge, push from main (as above)

      - name: Mutation score gate
        env:
          MIN_SCORE: "60"
        run: |
          score=$(gooze report view \${BASE:+--diff "$BASE"} | sed -n 's/^Mutation score: \\([0-9.]*\\)%.*$/\\1/p' | tail -1)
          echo "Mutation score: \${score}% (minimum \${MIN_SCORE}%)"
          awk -v s="$score" -v m="$MIN_SCORE" 'BEGIN { exit !(s != "" && s >= m) }'`

const gate = `      # Fail the job when the mutation score is below MIN_SCORE (percent).
      - name: Mutation score gate
        env:
          MIN_SCORE: "60"
        run: |
          score=$(gooze report view | sed -n 's/^Mutation score: \\([0-9.]*\\)%.*$/\\1/p' | tail -1)
          echo "Mutation score: \${score}% (minimum \${MIN_SCORE}%)"
          awk -v s="$score" -v m="$MIN_SCORE" 'BEGIN { exit !(s != "" && s >= m) }'`

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
    a: "Add a short shell step that reads `Mutation score` from `gooze report view` and fails the job below your minimum. Gooze has no built-in threshold flag. When you shard, gate in the merge job.",
  },
  {
    q: "How do I test only the lines a pull request changed in GitHub Actions?",
    a: "Check out with `fetch-depth: 0` and run `gooze run --diff origin/${{ github.base_ref }} ./...` on pull requests. Keep a full run on `main`, which pushes the baseline.",
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
            The job passes even with those two survivors, because survivors don&apos;t change
            Gooze&apos;s exit code. The <a href="#gate">quality gate</a> below fixes that. First,
            a bigger module needs the run split up.
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

        {/* TODO(version): --diff arrives in the next gooze release. */}
        <div id="diff">
          <h2>4. Pull requests: only the changed lines</h2>
          <p>
            A pull request that changes three lines of a large file still re-tests that whole
            file. With <Link href="/docs/usage/diff-mode">diff mode</Link> (next Gooze release),
            pull requests mutate only the lines they change against the target branch, while
            pushes to <code>main</code> keep a full run and publish the baseline. These are the
            changes to the cached workflow:
          </p>
          <CodeBlock lang="yaml" code={diff} />
          <ul>
            <li>
              <code>github.base_ref</code> is the pull request&apos;s target branch and is set
              only for pull request events. On a push, <code>BASE</code> is empty and{" "}
              <code>--diff=&quot;&quot;</code> runs everything.
            </li>
            <li>
              <code>fetch-depth: 0</code> fetches all history, branches and tags. The default
              checkout has one commit and no <code>origin/main</code>, so <code>--diff</code>{" "}
              would stop with an unknown ref or no merge base.
            </li>
            <li>
              Every shard computes the same changes, and the merge keeps them. In the merge job,{" "}
              <code>gooze report view --diff</code> prints the score of the changed lines, so the
              gate checks the pull request&apos;s own code. On <code>main</code> it gates the full
              score.
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
            Gooze has no threshold flag yet: survivors never change its exit code. Add this
            step after the <code>gooze run</code> (in the merge job, after <code>gooze report merge</code>, when you shard). It reads the{" "}
            <Link href="/docs/usage/results#score">mutation score</Link>{" "}
            from the <code>Mutation score: NN.NN% (...)</code> line of{" "}
            <code>gooze report view</code> and fails when it is below{" "}
            <code>MIN_SCORE</code>.
          </p>
          <CodeBlock lang="yaml" code={gate} />
          <p>
            With <code>MIN_SCORE: &quot;60&quot;</code>, the <code>calc</code> run at{" "}
            <code>84.62%</code> passes. Raise the minimum to <code>90</code> and the same run
            fails until you add the two boundary tests that bring it to{" "}
            <code>100.00%</code>.
          </p>
          <p className="text-sm text-muted-foreground">
            With sharding, gate only in the merge job: a single shard&apos;s score covers only its slice.
            A missing score (no reports) also fails the step. In a{" "}
            <a href="#diff">diff mode</a> run, the <code>Mutation score</code> line covers the
            changed lines (the <code>Total mutation score</code> line doesn&apos;t match the
            pattern), so the same step gates the change.
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
