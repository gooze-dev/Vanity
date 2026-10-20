import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

const simple = `# .gitlab-ci.yml
image: golang:1.27          # official Go image: go is already installed

mutation-testing:
  script:
    - go install gooze.dev/pkg/gooze@latest
    - gooze run ./...`

const sharded = `image: golang:1.27

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

const cached = `image: golang:1.27

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

const gate = `merge:
  # ...after gooze report merge (or in the single job, after gooze run):
  variables:
    MIN_SCORE: "60"          # fail below this percent
  script:
    - go install gooze.dev/pkg/gooze@latest
    - gooze report merge
    - |
      score=$(gooze report view | sed -n 's/^Mutation score: \\([0-9.]*\\)%.*$/\\1/p' | tail -1)
      echo "Mutation score: \${score}% (minimum \${MIN_SCORE}%)"
      awk -v s="$score" -v m="$MIN_SCORE" 'BEGIN { exit !(s != "" && s >= m) }'`

const faqs = [
  {
    q: "How do I run Gooze mutation tests in GitLab CI?",
    a: "Use a golang:1.27 image, install the CLI with go install gooze.dev/pkg/gooze@latest, and run gooze run ./... in the job script.",
  },
  {
    q: "How do I shard Gooze across parallel GitLab runners?",
    a: "Set parallel: N and map GitLab's 1-based CI_NODE_INDEX to gooze's 0-based shards: gooze run -s \"$((CI_NODE_INDEX - 1))/$CI_NODE_TOTAL\" ./... Then merge the artifacts with gooze report merge.",
  },
  {
    q: "How do I cache incremental Gooze reports in GitLab CI?",
    a: "Pull a baseline from your container registry with gooze report pull before the run so unchanged files are skipped, and push the merged baseline back from the main branch.",
  },
  {
    q: "How do I fail a merge request when the mutation score is too low?",
    a: "Gooze has no threshold flag; add a short script step that reads 'Mutation score' from gooze report view and fails the job below your minimum. Gate in the merge job when sharding.",
  },
  {
    q: "Does Gooze post results as a GitLab merge-request note?",
    a: "No. Gooze does not post MR notes. Surface results by failing the job with the mutation-score gate, or by storing the report as an artifact or OCI baseline.",
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

export const metadata = docsMetadata("/docs/ci/gitlab")

export default function GitlabPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">GitLab CI</h1>
      <p className="text-lg text-muted-foreground mb-8">
        The same three setups as the{" "}
        <Link href="/docs/ci/github">GitHub Actions</Link> guide,
        written for <code>.gitlab-ci.yml</code>.
      </p>

      <div>
        <div id="simple">
          <h2>1. Simplest: run</h2>
          <p>
            Install Gooze and run the whole suite. No registry, no caching.
          </p>
          <CodeBlock lang="yaml" code={simple} />
        </div>

        <div id="sharded">
          <h2>2. Sharded: run in parallel</h2>
          <p>
            <code>parallel: 3</code> fans the job out;
            each instance tests its slice with{" "}
            <code>-s INDEX/TOTAL</code> and saves its
            reports as an artifact. The <code>merge</code>{" "}
            job collects them all and runs{" "}
            <Link href="/docs/cli/report#merge">gooze report merge</Link>.
          </p>
          <CodeBlock lang="yaml" code={sharded} />
        </div>

        <div id="cached">
          <h2>3. Sharded + cached baseline</h2>
          <p>
            Each shard pulls the <code>:main</code> baseline
            for the cache (<Link href="/docs/usage/incremental-runs">incremental runs</Link>),
            then hands its reports to the merge job as an artifact — shards never push to the
            registry. The merge job combines them and, <strong>only on main</strong>, publishes the
            single merged baseline back to <code>:main</code>.
          </p>
          <CodeBlock lang="yaml" code={cached} />
        </div>

        <div id="gate">
          <h2>Fail the build below a score (quality gate)</h2>
          <p>
            Gooze has no threshold flag yet: survivors never change its exit code. Add this
            step to the job that runs gooze. It reads the{" "}
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
              For the project&apos;s own container registry, use{" "}
              <code>gitlab-ci-token</code> with{" "}
              <code>$CI_JOB_TOKEN</code> (shown above), or{" "}
              <code>$CI_REGISTRY_USER</code> /{" "}
              <code>$CI_REGISTRY_PASSWORD</code>.
            </li>
            <li>
              For another registry, set{" "}
              <code>GOOZE_REGISTRY_USERNAME</code> /{" "}
              <code>GOOZE_REGISTRY_PASSWORD</code> (the
              password may be a token/PAT), or rely on the Docker credential store.
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
