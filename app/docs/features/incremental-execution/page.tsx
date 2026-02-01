import { CodeBlock } from "@/components/code-block"

export default function IncrementalExecutionPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Incremental execution</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Gooze caches mutation results and skips unchanged files on subsequent runs. Use{" "}
        <code className="bg-muted px-1 py-0.5 rounded">--no-cache</code> to force a full re-test.
      </p>

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
          <h2 className="text-2xl font-semibold mb-3">OCI reports (ORAS)</h2>
          <p className="mb-3 text-muted-foreground">
            Store and retrieve reports as OCI artifacts (e.g. in GHCR) so CI and teammates can reuse baseline results.
          </p>
          <CodeBlock
            lang="bash"
            code={`# create/update local reports
gooze run -o .gooze-reports ./...

# package and push
tar -C .gooze-reports -czf gooze-reports.tgz .
oras push ghcr.io/your-org/your-repo/gooze-reports:main \\
  gooze-reports.tgz:application/gzip

# later: pull and restore
rm -rf /tmp/gooze-reports-oci && mkdir -p /tmp/gooze-reports-oci
oras pull ghcr.io/your-org/your-repo/gooze-reports:main -o /tmp/gooze-reports-oci
rm -rf .gooze-reports && mkdir -p .gooze-reports
tar -C .gooze-reports -xzf /tmp/gooze-reports-oci/gooze-reports.tgz

# incremental run uses restored cache
gooze run -o .gooze-reports ./...`}
          />
        </div>
      </div>
    </section>
  )
}
