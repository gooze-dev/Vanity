import { CodeBlock } from "@/components/code-block"

export default function TroubleshootingPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Troubleshooting</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Common problems and simple things to try.
      </p>

      <div className="space-y-12">
        <div id="everything-killed" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">“Everything is killed” (or killed looks suspicious)</h2>
          <p className="text-muted-foreground">
            <strong>Killed</strong> means <code className="bg-muted px-1 py-0.5 rounded">go test</code> returned an error for that mutation.
            Sometimes this is good (your tests catch the bug).
            Sometimes it is not (timeouts, flaky tests, setup problems).
          </p>
          <p className="mt-4 text-muted-foreground">
            Gooze versions can report timeouts differently.
            If you suspect timeouts, run verbose and check logs:
          </p>
          <div className="mt-3">
            <CodeBlock lang="bash" code="gooze run --verbose ./..." />
          </div>
        </div>

        <div id="zero" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Gooze finds 0 files / 0 mutations</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Run from the module root (where <code className="bg-muted px-1 py-0.5 rounded">go.mod</code> is).</li>
            <li>Try <code className="bg-muted px-1 py-0.5 rounded">gooze list ./...</code> and verify paths.</li>
            <li>Check your exclude regex rules. You can exclude everything by mistake.</li>
          </ul>
          <div className="mt-3">
            <CodeBlock lang="bash" code="gooze list ./..." />
          </div>
        </div>

        <div id="skipped" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">“Skipped” mutations</h2>
          <p className="text-muted-foreground">
            <strong>Skipped</strong> usually means Gooze did not run the mutation.
            A common reason: it could not find a matching test file for the source.
          </p>
        </div>

        <div id="stale" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Reports look stale</h2>
          <p className="mb-3 text-muted-foreground">
            If you suspect cached results are reused, force a full re-run:
          </p>
          <CodeBlock lang="bash" code="gooze run --no-cache ./..." />
        </div>

        <div id="shards" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Shards not showing up in view</h2>
          <p className="mb-3 text-muted-foreground">
            If you ran with <code className="bg-muted px-1 py-0.5 rounded">-s INDEX/TOTAL</code>, you need to merge before viewing:
          </p>
          <CodeBlock lang="bash" code="gooze merge" />
          <div className="mt-2">
            <CodeBlock lang="bash" code="gooze view" />
          </div>
        </div>
      </div>
    </section>
  )
}
