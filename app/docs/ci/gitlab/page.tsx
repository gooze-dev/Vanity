import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import { DocsFaq, faqPageJsonLd } from "@/components/docs-faq"
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

const diff = `image: golang:1.27

stages: [test, merge]

# Run merge request pipelines and pipelines for the default branch.
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

variables:
  REPORTS_REF: "$CI_REGISTRY_IMAGE/gooze-reports:main"
  GOOZE_REGISTRY_USERNAME: "gitlab-ci-token"
  GOOZE_REGISTRY_PASSWORD: "$CI_JOB_TOKEN"

default:
  before_script:
    - go install gooze.dev/pkg/gooze@latest

# Merge requests: one job that mutates only the changed lines.
diff:
  stage: test
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
  variables:
    GIT_DEPTH: 0             # full history, so gooze finds the merge base
    MIN_SCORE: "60"
  script:
    # The target branch may not be fetched yet.
    - git fetch origin "+refs/heads/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME:refs/remotes/origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME"
    # Reports go to .gooze-reports/run; nothing is pushed.
    - gooze run --diff "origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME" ./...
    - |
      score=$(gooze report view -o .gooze-reports/run | sed -n 's/^Mutation score: \\([0-9.]*\\)%.*$/\\1/p' | tail -1)
      echo "Mutation score: \${score}% (minimum \${MIN_SCORE}%)"
      awk -v s="$score" -v m="$MIN_SCORE" 'BEGIN { exit !(s != "" && s >= m) }'

# The default branch: the sharded full run, which publishes the baseline.
test:
  stage: test
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  parallel: 3
  script:
    - gooze report pull "$REPORTS_REF" || echo "no baseline yet"
    - gooze run -s "$((CI_NODE_INDEX - 1))/$CI_NODE_TOTAL" ./...
  artifacts:
    paths:
      - .gooze-reports/

merge:
  stage: merge
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  dependencies: [test]
  variables:
    MIN_SCORE: "60"
  script:
    - gooze report merge
    - gooze report push "$REPORTS_REF"
    - |
      score=$(gooze report view | sed -n 's/^Mutation score: \\([0-9.]*\\)%.*$/\\1/p' | tail -1)
      echo "Mutation score: \${score}% (minimum \${MIN_SCORE}%)"
      awk -v s="$score" -v m="$MIN_SCORE" 'BEGIN { exit !(s != "" && s >= m) }'`

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
    a: "Use a `golang:1.27` image, install the CLI with `go install gooze.dev/pkg/gooze@latest`, and run `gooze run ./...` in the job script.",
  },
  {
    q: "How do I shard Gooze across parallel GitLab runners?",
    a: "Set `parallel: N` and map GitLab's 1-based `CI_NODE_INDEX` to gooze's 0-based shards: `gooze run -s \"$((CI_NODE_INDEX - 1))/$CI_NODE_TOTAL\" ./...`. Then merge the artifacts with `gooze report merge`.",
  },
  {
    q: "How do I cache incremental Gooze reports in GitLab CI?",
    a: "Pull a baseline from your container registry with `gooze report pull` before the run so unchanged files are skipped, and push the merged baseline back from the main branch.",
  },
  {
    q: "How do I fail a merge request when the mutation score is too low?",
    a: "Add a short script step that reads `Mutation score` from `gooze report view` and fails the job below your minimum. Gooze has no built-in threshold flag. When you shard, gate in the merge job.",
  },
  {
    q: "How do I test only the lines a merge request changed in GitLab CI?",
    a: "In a merge request pipeline, set `GIT_DEPTH: 0`, fetch the target branch, and run `gooze run --diff \"origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME\" ./...`. Keep a full run on `main`, which pushes the baseline.",
  },
  {
    q: "Does Gooze post results as a GitLab merge-request note?",
    a: "No. Gooze does not post MR notes. Surface results by failing the job with the mutation-score gate, or by storing the report as an artifact or OCI baseline.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

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
        You want every merge request to keep your mutation score. These are the same three
        setups as the{" "}
        <Link href="/docs/ci/github">GitHub Actions</Link> guide, written for{" "}
        <code>.gitlab-ci.yml</code>: one job, then shards, then a shared baseline, plus a gate.
      </p>

      <div>
        <div id="simple">
          <h2>1. Simplest: run</h2>
          <p>
            Install Gooze and run the whole suite. No registry, no caching. For the{" "}
            <Link href="/docs/quick-start"><code>calc</code></Link> package, the job log ends
            with the line you saw locally, and the job passes, because survivors don&apos;t
            change the exit code:
          </p>
          <CodeBlock lang="yaml" code={simple} />
          <Recording name="calc-first-run" title="Recorded last line of the first gooze run on calc" />
        </div>

        <div id="sharded">
          <h2>2. Sharded: run in parallel</h2>
          <p>
            When one job takes too long, <code>parallel: 3</code> fans it out;
            each instance tests its slice with{" "}
            <code>-s INDEX/TOTAL</code> and saves its
            reports as an artifact. The <code>merge</code>{" "}
            job collects them all and runs{" "}
            <Link href="/docs/cli/report#merge"><code>gooze report merge</code></Link>.
          </p>
          <CodeBlock lang="yaml" code={sharded} />
        </div>

        <div id="cached">
          <h2>3. Sharded + cached baseline</h2>
          <p>
            Each shard pulls the <code>:main</code> baseline
            for the cache (<Link href="/docs/usage/incremental-runs">incremental runs</Link>),
            then hands its reports to the merge job as an artifact; shards never push to the
            registry. The merge job combines them and, <strong>only on <code>main</code></strong>, publishes the
            single merged baseline back to <code>:main</code>. Files that didn&apos;t change,
            such as an untouched <code>calc.go</code>, come from the cache.
          </p>
          <CodeBlock lang="yaml" code={cached} />
        </div>

        {/* TODO(version): --diff arrives in the next gooze release. */}
        <div id="diff">
          <h2>4. Merge requests: only the changed lines</h2>
          <p>
            A merge request that changes three lines of a large file still re-tests that whole
            file. With <Link href="/docs/usage/diff-mode">diff mode</Link> (next Gooze release),
            merge requests mutate only the lines they change against the target branch, while{" "}
            <code>main</code> keeps the sharded full run and publishes the baseline. This is the
            cached pipeline with a diff job and the gate:
          </p>
          <CodeBlock lang="yaml" code={diff} />
          <ul>
            <li>
              The <code>workflow</code> rules run merge request pipelines instead of branch
              pipelines, plus pipelines for the default branch. The job rules pick the{" "}
              <code>diff</code> job for merge requests and the sharded full run for the default
              branch.
            </li>
            <li>
              New GitLab projects fetch a shallow clone (<code>20</code> commits), and the target
              branch may not be fetched.{" "}
              <code>GIT_DEPTH: 0</code> and the <code>git fetch</code> line give Gooze the merge
              base and <code>origin/main</code>; without them <code>--diff</code> stops with an
              unknown ref or no merge base.
            </li>
            <li>
              The <code>diff</code> job runs without shards. A diff run is small, and gating a
              sharded diff run on the score of the changed lines isn&apos;t supported yet.
            </li>
            <li>
              A diff run writes its reports to <code>.gooze-reports/run/</code>, and its score
              covers the changed lines only. The gate reads that score with{" "}
              <code>gooze report view -o .gooze-reports/run</code>, so it checks the merge
              request&apos;s own code. Only the default branch pushes the baseline.
            </li>
            <li>
              Diff mode needs git. The <code>golang</code> image includes it; a minimal image
              may not.
            </li>
          </ul>
        </div>

        <div id="gate">
          <h2>Fail the build below a score (quality gate)</h2>
          <p>
            Gooze has no threshold flag yet: survivors never change its exit code. Add this
            step after the <code>gooze run</code> (in the merge job, after <code>gooze report merge</code>, when you shard). It reads the{" "}
            <Link href="/docs/usage/results#score">mutation score</Link>{" "}
            from the <code>Mutation score: NN.NN% (...)</code> line of{" "}
            <code>gooze report view</code> and fails when it is below{" "}
            <code>MIN_SCORE</code>.
          </p>
          <CodeBlock lang="yaml" code={gate} />
          <p>
            The <code>calc</code> run at <code>84.62%</code> passes a minimum of{" "}
            <code>60</code> and fails a minimum of <code>90</code>, until the two boundary
            tests bring it to <code>100.00%</code>.
          </p>
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
              <code>--insecure</code> to <code>push</code>/<code>pull</code>.
            </li>
          </ul>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
