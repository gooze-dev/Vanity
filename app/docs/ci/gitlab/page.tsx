import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import { DocsFaq, faqPageJsonLd, withCode } from "@/components/docs-faq"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  script:
    # The target branch may not be fetched yet.
    - git fetch origin "+refs/heads/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME:refs/remotes/origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME"
    # Reports go to .gooze-reports/run; nothing is pushed. Fails the job
    # (exit code 3) when the changed lines score below 80%.
    - gooze run --diff "origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME" --threshold-diff-total 80 ./...

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
  script:
    - gooze report merge
    - gooze report push "$REPORTS_REF"
    # Last: fails the job (exit code 3) below 60%, after the baseline push.
    - gooze report view --threshold-total 60`

const gate = `merge:
  # ...or in the single job, as the last line of the script.
  script:
    - go install gooze.dev/pkg/gooze@latest
    - gooze report merge
    # Fails the job (exit code 3) below 60%.
    - gooze report view --threshold-total 60`

const allowLowScore = `merge:
  script:
    - gooze report merge
    - gooze report push "$REPORTS_REF"
    - gooze report view --threshold-total 90
  # A low score marks the job with a warning instead of failing the
  # pipeline. Any other exit code still fails it.
  allow_failure:
    exit_codes: [3]`

const keepCache = `test:
  cache:
    key: gooze
    paths: [.gooze-reports/]
    when: always        # also save the reports of a job that failed
  artifacts:
    when: always
    paths: [.gooze-reports/]`

// What each Gooze exit code means in a GitLab CI job.
const exitCodes = [
  { code: "0", what: "The job passes." },
  { code: "1", what: "Unexpected failure. Add `-v` and keep `.gooze.log` as an artifact to read it." },
  { code: "2", what: "A bad flag or `gooze.yaml` value: fix `.gitlab-ci.yml` or the config." },
  { code: "3", what: "A score below a threshold. The job fails, or shows a warning with `allow_failure: exit_codes: [3]`. The reports are written." },
  { code: "4", what: "`--diff` can't find the base: set `GIT_DEPTH: 0` and fetch the target branch." },
  { code: "5", what: "The registry refused `report push` or `pull`: check `GOOZE_REGISTRY_*` and the job token's registry access." },
  { code: "6", what: "No reports: the merge job has no `dependencies` on the shard jobs, or `-o` points elsewhere." },
  { code: "130", what: "The job was cancelled or hit its `timeout`." },
]

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
    a: "End the job's script with `gooze report view --threshold-total 60` (or set `threshold.total` in `gooze.yaml`). Below it, Gooze exits with code `3` and the job fails. To show a low score as a warning instead, add `allow_failure: exit_codes: [3]`. When you shard, gate in the merge job.",
  },
  {
    q: "How do I test only the lines a merge request changed in GitLab CI?",
    a: "In a merge request pipeline, set `GIT_DEPTH: 0`, fetch the target branch, and run `gooze run --diff \"origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME\" --threshold-diff-total 80 ./...`. Keep a full run on `main`, which pushes the baseline.",
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
            with the line you saw locally, and the job passes, because no threshold is set:
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

        <div id="diff">
          <h2>4. Merge requests: only the changed lines</h2>
          <p>
            A merge request that changes three lines of a large file still re-tests that whole
            file. With <Link href="/docs/usage/diff-mode">diff mode</Link>,
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
              The <code>diff</code> job runs without shards. A diff run is small, and a shard
              doesn&apos;t check thresholds.
            </li>
            <li>
              A diff run writes its reports to <code>.gooze-reports/run/</code>, and its score
              covers the changed lines only. <code>--threshold-diff-total</code> checks that
              score, so the gate holds the merge request&apos;s own code to its bar (see{" "}
              <Link href="/docs/ci/quality-gates#diff">diff thresholds</Link>). Only the default
              branch pushes the baseline.
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
            End the script with a threshold: in the merge job, after{" "}
            <code>gooze report merge</code> and the baseline push, when you shard. Below the{" "}
            <Link href="/docs/usage/results#score">mutation score</Link> you set, Gooze exits
            with code <code>3</code> and the job fails:
          </p>
          <CodeBlock lang="yaml" code={gate} />
          <p>
            The <code>calc</code> run at <code>84.62%</code> passes a minimum of{" "}
            <code>60</code> and fails a minimum of <code>90</code>, until the two boundary
            tests bring it to <code>100.00%</code>.
          </p>
          <p className="text-sm text-muted-foreground">
            A shard doesn&apos;t check thresholds, so gate only in the merge job. To show a low
            score as a warning instead of failing the pipeline, add{" "}
            <code>allow_failure: exit_codes: [3]</code>; every other code still fails it. More
            in <a href="#exit-codes">exit codes</a>.
          </p>
        </div>

        <div id="exit-codes">
          <h2>Exit codes</h2>
          <p>
            Every Gooze exit code but <code>0</code> fails the job. That is right for errors. A
            low score (code <code>3</code>) is different: the run finished and wrote its reports,
            so you choose what it does.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>In GitLab CI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              {exitCodes.map((row) => (
                <TableRow key={row.code}>
                  <TableCell><code>{row.code}</code></TableCell>
                  <TableCell>{withCode(row.what)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p>
            <code>allow_failure: exit_codes</code> turns a low score into a warning on the job,
            while every other code still fails the pipeline. Leave it out to block the merge
            request on a low score:
          </p>
          <CodeBlock lang="yaml" code={allowLowScore} />

          <h3>Warning: a low score</h3>
          <p>
            With <code>allow_failure: exit_codes: [3]</code>, the <code>calc</code> merge job at{" "}
            <code>84.62%</code> against a <code>90</code> threshold ends its log like this:
          </p>
          <Recording name="calc-threshold-merge" title="Recorded gooze report merge below threshold.total, exit code 3" />
          <p>
            Code <code>3</code> is in <code>exit_codes</code>, so GitLab marks the job as passed
            with warnings (an orange <strong>!</strong> instead of a red cross) and runs the
            next stages. The merge request shows the warning, and the reports are written.
          </p>

          <h3>Error: anything else</h3>
          <p>
            A threshold above <code>100</code> is a usage error:
          </p>
          <Recording name="threshold-out-of-range" title="Recorded threshold out of range, exit code 2" />
          <p>
            Code <code>2</code> is not in <code>exit_codes</code>, so GitLab fails the job and
            the pipeline, the same as without <code>allow_failure</code>. So do a missing base
            ref (<code>4</code>), a registry error (<code>5</code>) and missing reports{" "}
            (<code>6</code>).
          </p>

          <p>
            GitLab saves caches and artifacts only for jobs that pass, unless you say{" "}
            <code>when: always</code>. Set it so a run below a threshold still keeps its
            reports:
          </p>
          <CodeBlock lang="yaml" code={keepCache} />
          <p className="text-sm text-muted-foreground">
            What every code means, whatever runs Gooze:{" "}
            <Link href="/docs/ci/quality-gates#exit-codes">Quality gates</Link>.
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
