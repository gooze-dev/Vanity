import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export default function CliReportPullPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">gooze report pull</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Pulls reports from an OCI registry and extracts them into the reports directory.
        Use this to restore a baseline before an incremental run.
      </p>

      <div className="space-y-12">
        <div id="usage" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <CodeBlock lang="bash" code="gooze report pull <reference>" />
          <p className="mt-3 text-muted-foreground">
            This pulls the artifact and extracts it into the reports dir (<code className="bg-muted px-1 py-0.5 rounded">-o/--output</code>, default{" "}
            <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>).
          </p>
        </div>

        <div id="example" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Example</h2>
          <CodeBlock lang="bash" code="gooze report pull ghcr.io/your-org/your-repo/gooze-reports:main" />
        </div>

        <div id="flags" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Flags</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">-o, --output &lt;dir&gt;</code>: reports directory to extract into (default <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>)
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">--plain-http</code>: use a non-TLS (HTTP) registry
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">--insecure</code>: skip TLS certificate verification
            </li>
          </ul>
        </div>

        <div id="auth" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Authentication</h2>
          <p className="mb-3 text-muted-foreground">
            For registries that require login, set{" "}
            <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_USERNAME</code> and{" "}
            <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_PASSWORD</code>. The
            password may be a token/PAT — for GHCR, use your GitHub username with a PAT (or{" "}
            <code className="bg-muted px-1 py-0.5 rounded">GITHUB_TOKEN</code> in CI).
          </p>
          <p className="text-muted-foreground">
            If unset, Gooze falls back to the Docker credential store (whatever{" "}
            <code className="bg-muted px-1 py-0.5 rounded">docker login</code> saved). See{" "}
            <Link href="/docs/ci" className="underline underline-offset-4">CI / GitHub Actions</Link>{" "}
            for a full workflow.
          </p>
        </div>
      </div>
    </section>
  )
}
