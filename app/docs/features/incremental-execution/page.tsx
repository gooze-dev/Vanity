import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export default function IncrementalExecutionPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Incremental execution</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze caches mutation results and skips unchanged files on subsequent runs. Use{" "}
        <code className="bg-muted px-1 py-0.5 rounded">--no-cache</code> to force a full re-test.
      </p>

      <div className="rounded-lg border bg-card p-5 mb-10">
        <p className="text-muted-foreground">
          Related pages: <Link href="/docs/reports" className="underline underline-offset-4">Reports</Link> and{" "}
          <Link href="/docs/cli/run" className="underline underline-offset-4">gooze run</Link>.
        </p>
      </div>

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Output directory <code className="bg-muted px-1 py-0.5 rounded">-o/--output</code>
          </h2>
          <p className="mb-3 text-muted-foreground">
            Choose where reports are written. This is also where the incremental cache lives.
          </p>
          <CodeBlock lang="bash" code="gooze run -o .gooze-reports ./..." />
          <p className="mt-3 text-sm text-muted-foreground">
            Reports are written as one YAML per run (<code className="bg-muted px-1 py-0.5 rounded">&lt;hash&gt;.yaml</code>) plus an index (<code className="bg-muted px-1 py-0.5 rounded">_index.yaml</code>).
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">OCI reports (push / pull)</h2>
          <p className="mb-3 text-muted-foreground">
            Store and retrieve reports as OCI artifacts (e.g. in GHCR) so CI and teammates can reuse baseline results.
            Gooze does the packaging and transfer for you with{" "}
            <Link href="/docs/cli/report/push" className="underline underline-offset-4">gooze report push</Link> and{" "}
            <Link href="/docs/cli/report/pull" className="underline underline-offset-4">gooze report pull</Link> &mdash;
            no <code className="bg-muted px-1 py-0.5 rounded">tar</code> or external tooling required.
          </p>
          <CodeBlock
            lang="bash"
            code={`# package the reports dir and push it as an OCI artifact
gooze report push ghcr.io/your-org/your-repo/gooze-reports:main

# later: pull and extract into the reports dir
gooze report pull ghcr.io/your-org/your-repo/gooze-reports:main`}
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Both commands use the reports dir set by <code className="bg-muted px-1 py-0.5 rounded">-o/--output</code> (default{" "}
            <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>). Add{" "}
            <code className="bg-muted px-1 py-0.5 rounded">--plain-http</code> for a non-TLS registry or{" "}
            <code className="bg-muted px-1 py-0.5 rounded">--insecure</code> to skip TLS verification. Auth comes from the
            Docker credential store, or the <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_USERNAME</code> /{" "}
            <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_PASSWORD</code> environment variables.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Incremental CI flow</h2>
          <p className="mb-3 text-muted-foreground">
            Restore the previous baseline, run incrementally, then publish the updated reports:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze report pull ghcr.io/org/repo/gooze-reports:main   # restore baseline
gooze run ./...                                          # incremental run
gooze report push ghcr.io/org/repo/gooze-reports:main   # publish updated`}
          />
          <p className="mt-3 text-muted-foreground">
            For a complete GitHub Actions workflow (GHCR auth, sharding, PRs vs. main), see{" "}
            <Link href="/docs/ci" className="underline underline-offset-4">CI / GitHub Actions</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
