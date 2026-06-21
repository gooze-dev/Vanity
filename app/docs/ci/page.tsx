import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

const simple = `name: Mutation testing

on: [push, pull_request]

jobs:
  gooze:
    runs-on: ubuntu-latest
    container: golang:1.26       # official Go image: go is already installed
    steps:
      - uses: actions/checkout@v4
      - run: go install gooze.dev/pkg/gooze@latest
      - run: gooze run ./...`

const sharded = `jobs:
  test:
    runs-on: ubuntu-latest
    container: golang:1.26
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
    container: golang:1.26
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
    container: golang:1.26
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

      # Hand reports to the merge job via an artifact — no registry push here.
      - name: Upload shard reports
        uses: actions/upload-artifact@v4
        with:
          name: gooze-shard-\${{ matrix.shard }}
          path: .gooze-reports/

  merge:
    needs: test
    runs-on: ubuntu-latest
    container: golang:1.26
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

export const metadata = docsMetadata("/docs/ci")

export default function CiPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">GitHub Actions</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Three workflows, from a one-liner to a sharded, cached pipeline. Pick the one
        that matches how much you want to optimize.
      </p>

      <div className="space-y-12">
        <div id="simple" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">1. Simplest: checkout and run</h2>
          <p className="mb-3 text-muted-foreground">
            Install Gooze and run the whole suite. No registry, no caching — a good
            starting point.
          </p>
          <CodeBlock lang="yaml" code={simple} />
        </div>

        <div id="sharded" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">2. Sharded: run in parallel</h2>
          <p className="mb-3 text-muted-foreground">
            Split the run across jobs with{" "}
            <code className="bg-muted px-1 py-0.5 rounded">-s INDEX/TOTAL</code> to cut wall-clock
            time. Each job tests its own slice and uploads its reports; a final{" "}
            <code className="bg-muted px-1 py-0.5 rounded">merge</code> job downloads them all and
            combines them with{" "}
            <Link href="/docs/cli/report/merge" className="underline underline-offset-4">gooze report merge</Link>.
          </p>
          <CodeBlock lang="yaml" code={sharded} />
        </div>

        <div id="cached" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">3. Sharded + cached baseline</h2>
          <p className="mb-3 text-muted-foreground">
            Add an OCI baseline so each run only re-tests changed files
            (<Link href="/docs/features/incremental-execution" className="underline underline-offset-4">incremental execution</Link>).
            Every shard pulls the <code className="bg-muted px-1 py-0.5 rounded">:main</code> baseline
            for the cache, then hands its reports to the merge job as an artifact — shards never push
            to the registry. The merge job combines them with{" "}
            <Link href="/docs/cli/report/merge" className="underline underline-offset-4">gooze report merge</Link>{" "}
            and, <strong>only on main</strong>, publishes the single merged baseline back to{" "}
            <code className="bg-muted px-1 py-0.5 rounded">:main</code>.
          </p>
          <CodeBlock lang="yaml" code={cached} />
        </div>

        <div id="auth" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Authentication</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_USERNAME</code> /{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_PASSWORD</code> — the
              password may be a token/PAT (for GHCR use{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GITHUB_TOKEN</code>).
            </li>
            <li>
              If unset, Gooze falls back to the Docker credential store, so a prior{" "}
              <code className="bg-muted px-1 py-0.5 rounded">docker/login-action</code> step also works.
            </li>
            <li>
              For a non-TLS or self-signed registry add{" "}
              <code className="bg-muted px-1 py-0.5 rounded">--plain-http</code> or{" "}
              <code className="bg-muted px-1 py-0.5 rounded">--insecure</code> to push/pull.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
