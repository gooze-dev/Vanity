import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import { DocsFaq, faqPageJsonLd } from "@/components/docs-faq"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"

const simple = `# cloudbuild.yaml
steps:
  - id: mutation
    name: golang:1.27        # official Go image: go is already installed
    script: |
      go install gooze.dev/pkg/gooze@latest
      gooze run -p 8 ./...

timeout: 7200s               # the default is 60 minutes
options:
  machineType: E2_HIGHCPU_8  # 8 vCPUs for -p 8`

const registrySetup = `REGION=us-central1
PROJECT_ID=$(gcloud config get-value project)

# A Docker-format repository stores OCI artifacts, including gooze reports.
gcloud artifacts repositories create gooze \\
  --repository-format=docker \\
  --location="$REGION" \\
  --description="gooze mutation reports"

# Let the service account your trigger runs as read and write it.
gcloud artifacts repositories add-iam-policy-binding gooze \\
  --location="$REGION" \\
  --member="serviceAccount:BUILD_SERVICE_ACCOUNT" \\
  --role=roles/artifactregistry.writer`

const cached = `# cloudbuild.yaml
steps:
  # A short-lived Artifact Registry token, written where the gooze steps read it.
  - id: token
    name: gcr.io/cloud-builders/gcloud
    script: gcloud auth print-access-token > /registry/token

  - id: mutation
    name: golang:1.27
    script: |
      set -e
      go install gooze.dev/pkg/gooze@latest
      export GOOZE_REGISTRY_USERNAME=oauth2accesstoken
      export GOOZE_REGISTRY_PASSWORD="$(cat /registry/token)"
      REPORTS_REF="\${_REGION}-docker.pkg.dev/\${PROJECT_ID}/gooze/reports:main"

      # Reuse the main baseline so unchanged files are skipped (the cache).
      gooze report pull "$REPORTS_REF" || echo "no baseline yet"
      gooze run -p 8 ./...
      gooze report view

  # The token lasts about an hour, so fetch a fresh one for the push.
  - id: push-token
    name: gcr.io/cloud-builders/gcloud
    script: gcloud auth print-access-token > /registry/token

  - id: push
    name: golang:1.27
    script: |
      set -e
      # Only builds of main publish the baseline; pull requests only read it.
      if [ -n "\${_PR_NUMBER:-}" ] || [ "$BRANCH_NAME" != main ]; then
        echo "not main: baseline not pushed"
        exit 0
      fi
      export GOOZE_REGISTRY_USERNAME=oauth2accesstoken
      export GOOZE_REGISTRY_PASSWORD="$(cat /registry/token)"
      gooze report push "\${_REGION}-docker.pkg.dev/\${PROJECT_ID}/gooze/reports:main"

substitutions:
  _REGION: us-central1       # where the gooze repository lives

timeout: 7200s
options:
  machineType: E2_HIGHCPU_8
  # Substitutions such as PROJECT_ID and BRANCH_NAME become environment
  # variables in script: steps.
  automapSubstitutions: true
  # Shared by every step: /go keeps the installed gooze binary and the Go
  # module cache, /registry holds the token.
  volumes:
    - name: go
      path: /go
    - name: registry
      path: /registry`

const triggers = `# Pull requests into main: read the baseline, test only what changed.
gcloud builds triggers create github \\
  --name=gooze-pr \\
  --repo-owner=OWNER --repo-name=REPO \\
  --pull-request-pattern='^main$' \\
  --build-config=cloudbuild.yaml

# Pushes to main: refresh the baseline.
gcloud builds triggers create github \\
  --name=gooze-main \\
  --repo-owner=OWNER --repo-name=REPO \\
  --branch-pattern='^main$' \\
  --build-config=cloudbuild.yaml`

const diff = `steps:
  # ...token step as above

  # Builds clone one commit. Pull requests fetch history and the target
  # branch, so gooze finds the merge base.
  - id: history
    name: gcr.io/cloud-builders/git
    script: |
      if [ -n "\${_PR_NUMBER:-}" ]; then
        git fetch --unshallow origin "+refs/heads/\${_BASE_BRANCH}:refs/remotes/origin/\${_BASE_BRANCH}"
      fi

  - id: mutation
    name: golang:1.27
    script: |
      set -e
      # ...install and login, pull the baseline as above
      # Pull requests test only their changed lines; main keeps a full run.
      # A diff run writes its reports to .gooze-reports/run.
      BASE=""
      REPORTS=.gooze-reports
      if [ -n "\${_PR_NUMBER:-}" ]; then
        BASE="origin/\${_BASE_BRANCH}"
        REPORTS=.gooze-reports/run
      fi
      gooze run -p 8 --diff="$BASE" ./...
      gooze report view -o "$REPORTS"

  # ...push-token and push steps as above`

const gate = `  - id: mutation
    name: golang:1.27
    script: |
      set -e
      # ...after gooze run:
      score=$(gooze report view | sed -n 's/^Mutation score: \\([0-9.]*\\)%.*$/\\1/p' | tail -1)
      echo "Mutation score: \${score}% (minimum \${_MIN_SCORE}%)"
      awk -v s="$score" -v m="$_MIN_SCORE" 'BEGIN { exit !(s != "" && s >= m) }'

substitutions:
  _REGION: us-central1
  _MIN_SCORE: "60"           # fail below this percent`

const faqs = [
  {
    q: "How do I run Gooze mutation tests in Google Cloud Build?",
    a: "Add a `cloudbuild.yaml` step on the `golang:1.27` image that runs `go install gooze.dev/pkg/gooze@latest` and then `gooze run ./...`. Raise the build `timeout` if a full run takes longer than the 60 minute default.",
  },
  {
    q: "Can Gooze store its reports in Google Container Registry?",
    a: "Container Registry has been shut down; its successor is Artifact Registry, which also serves `gcr.io` addresses. Create a Docker-format repository and use `gooze report push` and `gooze report pull` with a `REGION-docker.pkg.dev/PROJECT/REPOSITORY/NAME:TAG` reference.",
  },
  {
    q: "How does Gooze authenticate to Artifact Registry in Cloud Build?",
    a: "Set `GOOZE_REGISTRY_USERNAME=oauth2accesstoken` and `GOOZE_REGISTRY_PASSWORD` to a token from `gcloud auth print-access-token`, fetched in a `gcr.io/cloud-builders/gcloud` step. The build's service account needs `roles/artifactregistry.writer` on the repository.",
  },
  {
    q: "Should I shard Gooze in Cloud Build?",
    a: "Not within one build: every step of a build runs on the same machine, so parallel shards compete for the same CPUs. Use `-p N` with a larger `machineType` instead.",
  },
  {
    q: "How do I fail a Cloud Build when the mutation score is too low?",
    a: "Add a few lines to the script that read `Mutation score` from `gooze report view` and exit non-zero below a `_MIN_SCORE` substitution. Gooze has no built-in threshold flag.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

export const metadata = docsMetadata("/docs/ci/cloud-build")

export default function CloudBuildPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Google Cloud Build</h1>
      <p className="text-lg text-muted-foreground mb-8">
        You want every pull request built by Cloud Build to keep your mutation score. This
        page adds Gooze to a <code>cloudbuild.yaml</code>: one step first, then a baseline in
        Artifact Registry so pull requests test only what changed, then triggers and a gate.
        The setups mirror the <Link href="/docs/ci/github">GitHub Actions</Link> and{" "}
        <Link href="/docs/ci/gitlab">GitLab CI</Link> guides.
      </p>

      <div>
        <div id="simple">
          <h2>1. Simplest: run</h2>
          <p>
            Install Gooze and run the whole suite in one step. No registry, no caching. A
            mutation run starts one <code>go test</code> per mutant, so give{" "}
            <code>-p</code> as many workers as the machine has vCPUs, and raise the build{" "}
            <code>timeout</code> (60 minutes by default) if a full run needs longer. For the{" "}
            <Link href="/docs/quick-start"><code>calc</code></Link> package, the build log ends
            with the line you saw locally, and the build passes, because survivors don&apos;t
            change the exit code:
          </p>
          <CodeBlock lang="yaml" code={simple} />
          <Recording name="calc-first-run" title="Recorded last line of the first gooze run on calc" />
          <p className="text-sm text-muted-foreground">
            The <code>script</code> field runs the lines as a shell script; it needs no{" "}
            <code>entrypoint</code> or <code>args</code>. Pin a release (
            <code>gooze@vX.Y.Z</code>) instead of <code>@latest</code> once the pipeline
            works, so a new Gooze release can&apos;t change results unannounced.
          </p>
        </div>

        <div id="registry">
          <h2>2. Create a registry for the reports</h2>
          <p>
            Gooze stores its reports as an OCI artifact (see{" "}
            <Link href="/docs/ci/sharing-reports">Report artifacts</Link>), and Artifact
            Registry stores OCI artifacts in Docker-format repositories. Google Container
            Registry has been shut down; Artifact Registry replaces it and also serves{" "}
            <code>gcr.io</code> addresses, so a <code>gcr.io/PROJECT/...</code> reference
            in an Artifact Registry gcr.io repository works the same way. Create the
            repository once and let your build&apos;s service account write to it:
          </p>
          <CodeBlock lang="bash" code={registrySetup} />
          <p className="text-sm text-muted-foreground">
            <code>BUILD_SERVICE_ACCOUNT</code> is the service account shown on your trigger.
            Projects whose first build ran after mid-2024 use the Compute Engine default
            service account (<code>PROJECT_NUMBER-compute@developer.gserviceaccount.com</code>);
            earlier projects keep{" "}
            <code>PROJECT_NUMBER@cloudbuild.gserviceaccount.com</code>.
          </p>
        </div>

        <div id="cached">
          <h2>3. Cached baseline in Artifact Registry</h2>
          <p>
            Every build pulls the <code>:main</code> baseline for the cache (
            <Link href="/docs/usage/incremental-runs">incremental runs</Link>), so files that
            didn&apos;t change, such as an untouched <code>calc.go</code>, are not re-tested.
            <strong> Only builds of <code>main</code></strong> push the new baseline back;
            pull request builds only read it.
          </p>
          <CodeBlock lang="yaml" code={cached} />
          <ul>
            <li>
              <strong>Login.</strong> Artifact Registry accepts the username{" "}
              <code>oauth2accesstoken</code> with an access token as the password. The{" "}
              <code>gcloud</code> builder prints one for the build&apos;s service account, and
              Gooze reads it from <code>GOOZE_REGISTRY_USERNAME</code> and{" "}
              <code>GOOZE_REGISTRY_PASSWORD</code>.
            </li>
            <li>
              <strong>Volumes.</strong> Steps share only <code>/workspace</code> by default.
              The <code>go</code> volume keeps <code>/go</code>, where{" "}
              <code>go install</code> puts <code>gooze</code>, so the push step can call it
              without reinstalling. The token lives in its own volume, outside your source.
            </li>
            <li>
              <strong>Pull requests.</strong> PR builds set <code>_PR_NUMBER</code>; the push
              step skips them and any branch other than <code>main</code>.
            </li>
          </ul>
        </div>

        <div id="diff">
          <h2>4. Pull requests: only the changed lines</h2>
          <p>
            A pull request that changes three lines of a large file still re-tests that whole
            file. With <Link href="/docs/usage/diff-mode">diff mode</Link>,
            pull request builds mutate only the lines they change against the target branch,
            while builds of <code>main</code> keep a full run and push the baseline. These are
            the changes to the cached build:
          </p>
          <CodeBlock lang="yaml" code={diff} />
          <ul>
            <li>
              Cloud Build clones only the commit that started the build, so there is no merge
              base and no <code>origin/main</code>. The <code>history</code> step fetches them,
              the way Cloud Build&apos;s docs unshallow a clone. For a private repository, git
              needs credentials for that fetch (Cloud Build&apos;s docs keep them in Secret
              Manager).
            </li>
            <li>
              Pull request triggers set <code>_PR_NUMBER</code> and <code>_BASE_BRANCH</code>,
              the target branch. On <code>main</code>, <code>BASE</code> stays empty and{" "}
              <code>--diff=&quot;&quot;</code> runs everything.
            </li>
            <li>
              Both <code>gcr.io/cloud-builders/git</code> and the <code>golang</code> image
              include git, which diff mode needs; a minimal image may not.
            </li>
            <li>
              A diff run writes its reports to <code>.gooze-reports/run/</code> and leaves the
              pulled baseline as it was. In a pull request,{" "}
              <code>gooze report view -o .gooze-reports/run</code> prints the score of the
              changed lines. Read it the same way in the <a href="#gate">gate</a> (
              <code>gooze report view -o &quot;$REPORTS&quot;</code>), so a pull request is gated
              on its own code.
            </li>
            <li>
              The build runs in one step, without shards, which suits a diff run: gating a
              sharded diff run on the score of the changed lines isn&apos;t supported yet.
            </li>
          </ul>
        </div>

        <div id="triggers">
          <h2>Triggers</h2>
          <p>
            Connect the repository to Cloud Build, then create one trigger for pull requests
            and one for pushes to <code>main</code>, both using the same{" "}
            <code>cloudbuild.yaml</code>. You can do this in the console or with{" "}
            <code>gcloud</code>:
          </p>
          <CodeBlock lang="bash" code={triggers} />
          <p className="text-sm text-muted-foreground">
            These commands are for a GitHub repository connected through the Cloud Build
            GitHub app. For a 2nd gen repository connection, pass{" "}
            <code>--repository=projects/PROJECT/locations/REGION/connections/CONNECTION/repositories/REPO</code>{" "}
            and <code>--region=REGION</code> instead of <code>--repo-owner</code> and{" "}
            <code>--repo-name</code>. A trigger that
            runs as a user-managed service account also needs{" "}
            <code>options.logging</code> set, for example to{" "}
            <code>CLOUD_LOGGING_ONLY</code>.
          </p>
        </div>

        <div id="gate">
          <h2>Fail the build below a score (quality gate)</h2>
          <p>
            Gooze has no threshold flag yet: survivors never change its exit code. Add these
            lines after <code>gooze run</code>. They read the{" "}
            <Link href="/docs/usage/results#score">mutation score</Link> from the{" "}
            <code>Mutation score: NN.NN% (...)</code> line of <code>gooze report view</code>{" "}
            and fail the step below <code>_MIN_SCORE</code>:
          </p>
          <CodeBlock lang="yaml" code={gate} />
          <p>
            The <code>calc</code> run at <code>84.62%</code> passes a minimum of{" "}
            <code>60</code> and fails a minimum of <code>90</code>, until the two boundary
            tests bring it to <code>100.00%</code>.
          </p>
          <p className="text-sm text-muted-foreground">
            In the cached setup, put the gate in the <code>mutation</code> step. A failed
            step stops the build, so a <code>main</code> build below the minimum does not
            push its baseline. A missing score (no reports) also fails the step.
          </p>
        </div>

        <div id="speed">
          <h2>Bigger runs</h2>
          <ul>
            <li>
              <strong>More CPUs, not shards.</strong> All steps of a build run on one machine,
              so splitting the run into parallel steps with <code>-s INDEX/TOTAL</code> only
              makes them share its CPUs. Raise <code>machineType</code> (for example{" "}
              <code>E2_HIGHCPU_32</code>) and <code>-p</code> together instead.{" "}
              <Link href="/docs/ci/sharding">Sharding</Link> pays off on CI systems that
              spread jobs across machines.
            </li>
            <li>
              <strong>Scope and exclude.</strong> Run on the packages that matter and skip
              generated code with <code>-x</code>, for example{" "}
              <code>gooze run -p 8 -x mocks/ ./internal/...</code>.
            </li>
            <li>
              <strong>Coverage first.</strong> With{" "}
              <code>go test -coverprofile=coverage.out ./...</code> and{" "}
              <code>gooze run --coverage-profile=coverage.out</code>, mutants on lines no
              test runs are reported as not covered without running any tests.
            </li>
          </ul>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
