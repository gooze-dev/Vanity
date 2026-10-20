import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/ci/sharing-reports")

export default function SharingReportsPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Sharing reports (OCI)</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Store the reports directory as an OCI artifact (e.g. in GHCR) so CI and teammates start
        from the same baseline and only re-test what changed.
      </p>

      <div className="space-y-12">
        <div id="push-pull">
          <h2 className="text-2xl font-semibold mb-3">Push and pull</h2>
          <p className="mb-3 text-muted-foreground">
            Gooze does the packaging and transfer itself &mdash; no{" "}
            <code className="bg-muted px-1 py-0.5 rounded">tar</code> or external tooling required.
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
            <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>). Flags:{" "}
            <Link href="/docs/cli/report#push" className="underline underline-offset-4">gooze report push</Link>,{" "}
            <Link href="/docs/cli/report#pull" className="underline underline-offset-4">gooze report pull</Link>.
          </p>
        </div>

        <div id="flow">
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
            Publish only from your main branch so pull requests read the baseline but never
            overwrite it. With shards, every shard pulls, and only the merge job pushes. Full
            pipelines:{" "}
            <Link href="/docs/ci/github#cached" className="underline underline-offset-4">GitHub Actions</Link>,{" "}
            <Link href="/docs/ci/gitlab#cached" className="underline underline-offset-4">GitLab CI</Link>.
          </p>
        </div>

        <div id="auth">
          <h2 className="text-2xl font-semibold mb-3">Authentication</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_USERNAME</code> /{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_PASSWORD</code> &mdash; the
              password may be a token/PAT.
            </li>
            <li>
              If unset, Gooze falls back to the Docker credential store, so a prior{" "}
              <code className="bg-muted px-1 py-0.5 rounded">docker login</code> also works.
            </li>
            <li>
              For a non-TLS registry add <code className="bg-muted px-1 py-0.5 rounded">--plain-http</code>;
              to skip TLS verification (self-signed certs) add{" "}
              <code className="bg-muted px-1 py-0.5 rounded">--insecure</code>.
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Platform-specific credentials (<code className="bg-muted px-1 py-0.5 rounded">GITHUB_TOKEN</code>,{" "}
            <code className="bg-muted px-1 py-0.5 rounded">CI_JOB_TOKEN</code>) are covered on the{" "}
            <Link href="/docs/ci/github#auth" className="underline underline-offset-4">GitHub</Link> and{" "}
            <Link href="/docs/ci/gitlab#auth" className="underline underline-offset-4">GitLab</Link> pages.
          </p>
        </div>
      </div>
    </section>
  )
}
