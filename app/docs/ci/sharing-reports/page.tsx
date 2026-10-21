import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

export const metadata = docsMetadata("/docs/ci/sharing-reports")

export default function SharingReportsPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Sharing reports (OCI)</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Store the reports directory as an OCI artifact (e.g. in GHCR) so CI and teammates start
        from the same baseline and only re-test what changed.
      </p>

      <div>
        <div id="push-pull">
          <h2>Push and pull</h2>
          <p>
            Gooze does the packaging and transfer itself; you don&apos;t need{" "}
            <code>tar</code> or other tools.
          </p>
          <CodeBlock
            lang="bash"
            code={`# package the reports dir and push it as an OCI artifact
gooze report push ghcr.io/your-org/your-repo/gooze-reports:main

# later: pull and extract into the reports dir
gooze report pull ghcr.io/your-org/your-repo/gooze-reports:main`}
          />
          <p className="text-sm text-muted-foreground">
            Both commands use the reports dir set by <code>-o/--output</code> (default{" "}
            <code>.gooze-reports</code>). Flags:{" "}
            <Link href="/docs/cli/report#push">gooze report push</Link>,{" "}
            <Link href="/docs/cli/report#pull">gooze report pull</Link>.
          </p>
        </div>

        <div id="flow">
          <h2>Incremental CI flow</h2>
          <p>
            Restore the previous baseline, run incrementally, then publish the updated reports:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze report pull ghcr.io/org/repo/gooze-reports:main   # restore baseline
gooze run ./...                                          # incremental run
gooze report push ghcr.io/org/repo/gooze-reports:main   # publish updated`}
          />
          <p>
            Publish only from your main branch so pull requests read the baseline but never
            overwrite it. With shards, every shard pulls, and only the merge job pushes. Full
            pipelines:{" "}
            <Link href="/docs/ci/github#cached">GitHub Actions</Link>,{" "}
            <Link href="/docs/ci/gitlab#cached">GitLab CI</Link>.
          </p>
        </div>

        <div id="auth">
          <h2>Authentication</h2>
          <ul>
            <li>
              <code>GOOZE_REGISTRY_USERNAME</code> /{" "}
              <code>GOOZE_REGISTRY_PASSWORD</code>. The
              password may be a token/PAT.
            </li>
            <li>
              If unset, Gooze falls back to the Docker credential store, so a prior{" "}
              <code>docker login</code> also works.
            </li>
            <li>
              For a non-TLS registry add <code>--plain-http</code>;
              to skip TLS verification (self-signed certs) add{" "}
              <code>--insecure</code>.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Platform-specific credentials (<code>GITHUB_TOKEN</code>,{" "}
            <code>CI_JOB_TOKEN</code>) are covered on the{" "}
            <Link href="/docs/ci/github#auth">GitHub</Link> and{" "}
            <Link href="/docs/ci/gitlab#auth">GitLab</Link> pages.
          </p>
        </div>
      </div>
    </section>
  )
}
