import { docsMetadata } from "@/lib/docs-meta"
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
    a: "In a golang:1.27 container, install the CLI with go install gooze.dev/pkg/gooze@latest and run gooze run ./... There is no dedicated action; the plain go install step is the supported approach.",
  },
  {
    q: "How do I shard Gooze across multiple GitHub Actions runners?",
    a: "Use a strategy.matrix of shard indexes (0-based) and pass them to gooze run -s INDEX/TOTAL, for example gooze run -s ${{ matrix.shard }}/3. A final job downloads every shard's reports and runs gooze report merge.",
  },
  {
    q: "How do I cache incremental Gooze reports in CI?",
    a: "Pull a baseline from an OCI registry with gooze report pull at the start of each shard so unchanged files are skipped, and push the merged baseline back from the main branch after gooze report merge.",
  },
  {
    q: "How do I fail a pull request when the mutation score is too low?",
    a: "Add a short shell step that reads 'Mutation score' from gooze report view and fails the job below your minimum. Gooze has no built-in threshold flag. When you shard, gate in the merge job.",
  },
  {
    q: "Does Gooze post results as a pull-request comment?",
    a: "No. Gooze does not post PR comments. Surface results by failing the job with the mutation-score gate, or by publishing the report as an artifact or OCI baseline.",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

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
        Three workflows, from a one-liner to a sharded, cached pipeline, plus a step that
        fails the build below a mutation score. Pick the one that matches how much you want
        to optimize.
      </p>

      <div>
        <div id="simple">
          <h2>1. Simplest: checkout and run</h2>
          <p>
            Install Gooze and run the whole suite. No registry, no caching. A good
            starting point.
          </p>
          <CodeBlock lang="yaml" code={simple} />
        </div>

        <div id="sharded">
          <h2>2. Sharded: run in parallel</h2>
          <p>
            Split the run across jobs with{" "}
            <code>-s INDEX/TOTAL</code> to cut wall-clock
            time. Each job tests its own slice and uploads its reports; a final{" "}
            <code>merge</code> job downloads them all and
            combines them with{" "}
            <Link href="/docs/cli/report#merge">gooze report merge</Link>.
          </p>
          <CodeBlock lang="yaml" code={sharded} />
        </div>

        <div id="cached">
          <h2>3. Sharded + cached baseline</h2>
          <p>
            Add an OCI baseline so each run only re-tests changed files
            (<Link href="/docs/usage/incremental-runs">incremental runs</Link>).
            Every shard pulls the <code>:main</code> baseline
            for the cache, then hands its reports to the merge job as an artifact; shards never push
            to the registry. The merge job combines them with{" "}
            <Link href="/docs/cli/report#merge">gooze report merge</Link>{" "}
            and, <strong>only on main</strong>, publishes the single merged baseline back to{" "}
            <code>:main</code>.
          </p>
          <CodeBlock lang="yaml" code={cached} />
        </div>

        <div id="gate">
          <h2>Fail the build below a score (quality gate)</h2>
          <p>
            Gooze has no threshold flag yet: survivors never change its exit code. Add this
            step after the gooze run (in the merge job, after <code>gooze report merge</code>, when you shard). It reads the{" "}
            <Link href="/docs/usage/results#score">mutation score</Link>{" "}
            from the <code>Mutation score: NN.NN% (...)</code> line of{" "}
            <code>gooze report view</code> and fails when it is below{" "}
            <code>MIN_SCORE</code>.
          </p>
          <CodeBlock lang="yaml" code={gate} />
          <p className="text-sm text-muted-foreground">
            With sharding, gate only in the merge job: a single shard&apos;s score covers only its slice.
            A missing score (no reports) also fails the step.
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
              <code>--insecure</code> to push/pull.
            </li>
          </ul>
        </div>

        <div id="faq">
          <h2>FAQ</h2>
          {faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
