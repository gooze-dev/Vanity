import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

const simple = `# .gitlab-ci.yml
image: golang:1.26          # official Go image: go is already installed

mutation-testing:
  script:
    - go install gooze.dev/pkg/gooze@latest
    - gooze run ./...`

const sharded = `image: golang:1.26

stages: [test, merge]

test:
  stage: test
  parallel: 3
  script:
    - go install gooze.dev/pkg/gooze@latest
    # CI_NODE_INDEX is 1-based; gooze shards are 0-based.
    - gooze run -s "$((CI_NODE_INDEX - 1))/$CI_NODE_TOTAL" ./...
  artifacts:
    paths:
      - .gooze-reports/

merge:
  stage: merge
  dependencies: [test]       # pulls every parallel shard's artifacts
  script:
    - go install gooze.dev/pkg/gooze@latest
    - gooze report merge`

const cached = `image: golang:1.26

stages: [test, merge]

variables:
  REPORTS_REF: "$CI_REGISTRY_IMAGE/gooze-reports:main"
  # CI_JOB_TOKEN can read/write this project's container registry.
  GOOZE_REGISTRY_USERNAME: "gitlab-ci-token"
  GOOZE_REGISTRY_PASSWORD: "$CI_JOB_TOKEN"

test:
  stage: test
  parallel: 3
  script:
    - go install gooze.dev/pkg/gooze@latest
    # Reuse the main baseline so unchanged files are skipped (the cache).
    - gooze report pull "$REPORTS_REF" || echo "no baseline yet"
    - gooze run -s "$((CI_NODE_INDEX - 1))/$CI_NODE_TOTAL" ./...
  artifacts:
    paths:
      - .gooze-reports/        # handed to the merge job; no registry push here

merge:
  stage: merge
  dependencies: [test]
  script:
    - go install gooze.dev/pkg/gooze@latest
    - gooze report merge
    # Only main publishes the merged baseline back to the registry.
    - |
      if [ "$CI_COMMIT_BRANCH" = "main" ]; then
        gooze report push "$REPORTS_REF"
      fi`

export default function GitlabPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">GitLab CI</h1>
      <p className="text-lg text-muted-foreground mb-8">
        The same three setups as the{" "}
        <Link href="/docs/ci" className="underline underline-offset-4">GitHub Actions</Link> guide,
        written for <code className="bg-muted px-1 py-0.5 rounded">.gitlab-ci.yml</code>.
      </p>

      <div className="space-y-12">
        <div id="simple" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">1. Simplest: run</h2>
          <p className="mb-3 text-muted-foreground">
            Install Gooze and run the whole suite. No registry, no caching.
          </p>
          <CodeBlock lang="yaml" code={simple} />
        </div>

        <div id="sharded" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">2. Sharded: run in parallel</h2>
          <p className="mb-3 text-muted-foreground">
            <code className="bg-muted px-1 py-0.5 rounded">parallel: 3</code> fans the job out;
            each instance tests its slice with{" "}
            <code className="bg-muted px-1 py-0.5 rounded">-s INDEX/TOTAL</code> and saves its
            reports as an artifact. The <code className="bg-muted px-1 py-0.5 rounded">merge</code>{" "}
            job collects them all and runs{" "}
            <Link href="/docs/cli/report/merge" className="underline underline-offset-4">gooze report merge</Link>.
          </p>
          <CodeBlock lang="yaml" code={sharded} />
        </div>

        <div id="cached" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">3. Sharded + cached baseline</h2>
          <p className="mb-3 text-muted-foreground">
            Each shard pulls the <code className="bg-muted px-1 py-0.5 rounded">:main</code> baseline
            for the cache (<Link href="/docs/features/incremental-execution" className="underline underline-offset-4">incremental execution</Link>),
            then hands its reports to the merge job as an artifact — shards never push to the
            registry. The merge job combines them and, <strong>only on main</strong>, publishes the
            single merged baseline back to <code className="bg-muted px-1 py-0.5 rounded">:main</code>.
          </p>
          <CodeBlock lang="yaml" code={cached} />
        </div>

        <div id="auth" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Authentication</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              For the project&apos;s own container registry, use{" "}
              <code className="bg-muted px-1 py-0.5 rounded">gitlab-ci-token</code> with{" "}
              <code className="bg-muted px-1 py-0.5 rounded">$CI_JOB_TOKEN</code> (shown above), or{" "}
              <code className="bg-muted px-1 py-0.5 rounded">$CI_REGISTRY_USER</code> /{" "}
              <code className="bg-muted px-1 py-0.5 rounded">$CI_REGISTRY_PASSWORD</code>.
            </li>
            <li>
              For another registry, set{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_USERNAME</code> /{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GOOZE_REGISTRY_PASSWORD</code> (the
              password may be a token/PAT), or rely on the Docker credential store.
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
