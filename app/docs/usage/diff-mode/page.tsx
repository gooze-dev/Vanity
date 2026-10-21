import { docsMetadata } from "@/lib/docs-meta"
import { DocsFaq, faqPageJsonLd } from "@/components/docs-faq"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Recording } from "@/components/recording"

export const metadata = docsMetadata("/docs/usage/diff-mode")

const faqs = [
  {
    q: "How do I run Gooze only on the lines a pull request changed?",
    a: "Run `gooze run --diff REF ./...` with the branch the pull request targets as `REF`, for example `gooze run --diff origin/main ./...`. Gooze compares the working tree with the merge base of `REF` and `HEAD` and mutates only the added or modified lines.",
  },
  {
    q: "Does `--diff` need git?",
    a: "Yes. git must be installed and on `PATH`, and the project must be inside a git repository. Without git, or outside a repository, `gooze run --diff` exits with code 1 and says that `--diff` needs git or a git repository.",
  },
  {
    q: "Are uncommitted changes included in diff mode?",
    a: "Yes. Gooze compares the merge base with the working tree, so committed, staged and unstaged changes count, and so do untracked `.go` files that git doesn't ignore.",
  },
  {
    q: "Why did a test change put a whole source file in scope?",
    a: "A changed or new `_test.go` file can kill mutants anywhere in the source file it tests, so Gooze tests that source file in full. It pairs test and source files the same way its cache does.",
  },
  {
    q: "Which score should a CI gate read in diff mode?",
    a: "The score of the diff run, which covers only the changed lines. A diff run prints one `Mutation score` line, and `gooze report view -o .gooze-reports/run` prints the same score from its reports, so the existing gate step works with either.",
  },
  {
    q: "Does a diff run change my main reports?",
    a: "No. A diff run writes its reports to `.gooze-reports/run/` and leaves the main reports as they were. For the score of the whole codebase, run `gooze report merge` and then `gooze report view`.",
  },
  {
    q: "Why does `--diff` fail in CI with an unknown ref or no merge base?",
    a: "The CI checkout is usually shallow, so the base branch or the merge base is missing. Fetch full history (`fetch-depth: 0` in `actions/checkout`, `GIT_DEPTH: 0` in GitLab) or fetch the base branch, for example `git fetch origin main`.",
  },
  {
    q: "What happens when a pull request changes no Go code?",
    a: "The run has nothing to mutate. The score for the changed lines is 100% and `gooze run` exits with code 0, so a score gate passes.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

export default function DiffModePage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">
        Changed lines only (git diff mode)
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your pull request changes three lines of a large file. An{" "}
        <Link href="/docs/usage/incremental-runs">incremental run</Link> re-tests that whole file,
        and every mutant in it runs the package tests again. With <code>--diff</code>, Gooze
        mutates only the lines your branch changed, and the score tells you how well the tests
        check that change.
      </p>

      <div>
        <div id="prerequisites">
          <h2>Before you start</h2>
          <ul>
            <li>
              git is installed and on <code>PATH</code>. Gooze checks for it first: without git,{" "}
              <code>gooze run --diff</code> exits with code <code>1</code> and says that{" "}
              <code>--diff</code> needs git and git was not found on <code>PATH</code>.
            </li>
            <li>The project is inside a git repository.</li>
            <li>
              The base ref exists in your clone, with enough history to find the commit your
              branch started from. Locally that&apos;s usually true; in CI see{" "}
              <a href="#ci">Run it in CI</a>.
            </li>
          </ul>
        </div>

        <div id="run">
          <h2>Run it on your branch</h2>
          <p>
            Take the <Link href="/docs/quick-start"><code>calc</code></Link> package from the
            quick start. <code>main</code> has <code>calc.go</code> and the first tests, which
            leave two survivors on lines 10 and 13. On your branch you add the two boundary
            tests. Preview what diff mode will test:
          </p>
          <CodeBlock lang="bash" code="gooze run --estimate --diff main ./..." />
          <Recording name="calc-diff-estimate" title="Recorded gooze run --estimate --diff main on the calc branch" />
          <p>
            The first line says how many files changed since <code>main</code> and names the
            merge base commit. The table lists only the files in scope, and its counts cover
            the changed lines only. Unchanged files aren&apos;t listed. Here all 13 mutations of{" "}
            <code>calc.go</code> are in scope, because the branch changed its test file (see{" "}
            <a href="#tests">below</a>). Then run it:
          </p>
          <CodeBlock lang="bash" code="gooze run --diff main ./..." />
          <Recording name="calc-diff-run" title="Recorded last lines of gooze run --diff main on the calc branch" />
          <p>
            The run ends with one score line. It covers the changed lines only and says so at
            the end (<code>changed lines since main</code>). The next line says where the
            reports of this run are: a diff run doesn&apos;t change the main reports (see{" "}
            <a href="#scores">The score of the change</a>).
          </p>
          <p>
            <code>REF</code> is anything <code>git rev-parse</code> accepts: a branch (
            <code>origin/main</code>), a tag (<code>v1.2.0</code>), a commit SHA or{" "}
            <code>HEAD~3</code>. Path arguments and <code>-x/--exclude</code> (or{" "}
            <code>paths.exclude</code>) still apply, and diff mode narrows the result further:
          </p>
          <CodeBlock lang="bash" code="gooze run --diff origin/main -x '^mocks/' ./internal/..." />
          <p>
            To use diff mode on every run, set <code>run.diff</code> in <code>gooze.yaml</code>{" "}
            or <code>GOOZE_RUN_DIFF</code> in the environment. The flag overrides both, and{" "}
            <code>--diff=&quot;&quot;</code> turns a configured value off for one run:
          </p>
          <CodeBlock
            lang="yaml"
            code={`# gooze.yaml
run:
  diff: origin/main`}
          />
          <CodeBlock lang="bash" code={`gooze run --diff="" ./...`} />
        </div>

        <div id="changed">
          <h2>What counts as changed</h2>
          <p>
            Gooze diffs from <code>git merge-base REF HEAD</code>, the commit your branch
            started from, so it sees the same changes a pull request shows. It compares that
            commit with your <strong>working tree</strong>:
          </p>
          <ul>
            <li>Committed, staged and unstaged changes all count.</li>
            <li>Untracked <code>.go</code> files count, unless git ignores them.</li>
            <li>The changed lines of a source file are its added or modified lines.</li>
            <li>A new file counts in full.</li>
            <li>Deleted lines have no mutants.</li>
            <li>
              Renames are followed: a file that moved without changes is not changed.
            </li>
            <li>
              Non-Go files are ignored, so a change in <code>testdata</code> or{" "}
              <code>go.mod</code> puts nothing in scope.
            </li>
          </ul>
        </div>

        <div id="tests">
          <h2>Test changes test the whole file</h2>
          <p>
            A changed or new <code>_test.go</code> file puts the source files it tests in scope{" "}
            <strong>in full</strong>. New tests can kill survivors anywhere in that file, not
            only next to the lines you touched. Gooze pairs test and source files the same way
            its <Link href="/docs/usage/incremental-runs#invalidation">cache</Link> does.
          </p>
          <p>
            That is what happens on the <code>calc</code> branch above: the branch changes only{" "}
            <code>calc_test.go</code>, so all of <code>calc.go</code> is tested, including the
            two bound checks the new tests kill.
          </p>
        </div>

        <div id="scores">
          <h2>The score of the change</h2>
          <p>
            The <code>Mutation score</code> line of a diff run covers the changed lines only. It
            is the score of your change, not of the codebase. The run writes its reports to{" "}
            <code>.gooze-reports/run/</code>, so you can read them again, survivors included:
          </p>
          <CodeBlock lang="bash" code="gooze report view -o .gooze-reports/run" />
          <Recording name="calc-diff-run-view" title="Recorded gooze report view -o .gooze-reports/run after the diff run" />
          <p>
            A <Link href="/docs/ci/quality-gates#diff">diff threshold</Link> such as{" "}
            <code>--threshold-diff-total 80</code> checks this score, so it gates the pull
            request&apos;s own code. When the branch changes no Go lines, there is nothing to
            mutate: the score is <code>100.00%</code>, the run exits with <code>0</code>, and the
            gate passes.
          </p>
          <Recording name="calc-diff-no-changes" title="Recorded last lines of gooze run --diff main with no changes" />
          <p>
            The main reports still hold the last full run, the one on <code>main</code> with the
            two survivors:
          </p>
          <CodeBlock lang="bash" code="gooze report view" />
          <Recording name="calc-diff-main-view" title="Recorded score line of gooze report view after the diff run" />
          <p>
            For the score of the whole codebase with your change, fold the diff run into the
            main reports, then view them:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze report merge
gooze report view`}
          />
          <Recording name="calc-diff-merge" title="Recorded gooze report merge after the diff run" />
          <Recording name="calc-diff-merged-view" title="Recorded score line of gooze report view after the merge" />
        </div>

        <div id="cache">
          <h2>Diff mode and the cache</h2>
          <p>
            A diff run is a narrowed run, like a run with <code>--run</code> or{" "}
            <code>--mutagens</code>, and follows the same rules (see{" "}
            <Link href="/docs/usage/single-function#run-dir">the run directory</Link>):
          </p>
          <ul>
            <li>
              Its reports go to a fresh <code>.gooze-reports/run/</code> (
              <code>run/shard_N</code> when sharded). The main reports don&apos;t change.
            </li>
            <li>
              It uses the main reports as its cache: a file unchanged since them is skipped and
              isn&apos;t in the score. <code>--no-cache</code> tests the changed lines anyway.
            </li>
            <li>
              <code>gooze report merge</code> folds <code>run/</code> into the main reports and
              removes it. A file that changed since the main reports gets the diff run&apos;s
              results in place of its own. If the run tested only some of its lines, the file is
              marked partial, and the next full <code>gooze run</code> re-tests it in full. On
              the <code>calc</code> branch the whole file was in scope, so the merge leaves it
              complete.
            </li>
          </ul>
        </div>

        <div id="ci">
          <h2>Run it in CI</h2>
          <p>
            On a pull request, pass the target branch as <code>REF</code>. On{" "}
            <code>main</code>, keep a full run and push its reports as the{" "}
            <Link href="/docs/ci/sharing-reports">baseline</Link>, so the cache stays complete.
            Each provider page has the pull request setup:{" "}
            <Link href="/docs/ci/github#diff">GitHub Actions</Link>,{" "}
            <Link href="/docs/ci/gitlab#diff">GitLab CI</Link> and{" "}
            <Link href="/docs/ci/cloud-build#diff">Cloud Build</Link>.
          </p>
          <CodeBlock lang="bash" code="gooze run --diff origin/main ./..." />
          <ul>
            <li>
              <strong>git in the image.</strong> The official <code>golang</code> images
              include git. Minimal images may not; install git there, or diff mode fails.
            </li>
            <li>
              <strong>History.</strong> CI checkouts are often shallow, so the base branch or the
              merge base is missing. Fetch full history or the base branch (see{" "}
              <a href="#errors">Errors</a>).
            </li>
            <li>
              <strong>One job.</strong> A diff run is small, so run it in one job and gate in
              that job. Gating a sharded diff run on the score of the changed lines isn&apos;t
              supported yet: <code>gooze report merge</code> folds the shards into the main
              reports, whose score covers the whole codebase. Keep sharding for the full run on{" "}
              <code>main</code>.
            </li>
            <li>
              <strong>Baseline.</strong> Don&apos;t push a diff run&apos;s reports as the
              baseline. Push from the full run on <code>main</code>.
            </li>
            <li>
              <strong>Coverage profile.</strong> <code>--coverage-profile</code> still applies:
              changed lines that no test runs are reported as <code>not_covered</code>.
            </li>
            <li>
              <strong>Thresholds.</strong> A diff run checks the{" "}
              <Link href="/docs/ci/quality-gates#diff"><code>threshold.diff</code></Link> keys
              (<code>--threshold-diff-total</code> and the others) on the changed lines, not the
              plain thresholds, and exits with code <code>3</code> below one.
            </li>
          </ul>
        </div>

        <div id="errors">
          <h2>Errors</h2>
          <ul>
            <li>
              <strong>git missing or not a repository.</strong> <code>gooze run --diff</code>{" "}
              exits with code <code>1</code> and says that <code>--diff</code> needs git, or a
              git repository.
            </li>
            <li>
              <strong>Unknown ref or no merge base.</strong> Gooze exits with code{" "}
              <code>1</code> and suggests fetching the ref. This is common with shallow CI clones.
              Use <code>actions/checkout</code> with <code>fetch-depth: 0</code>, or fetch the
              branch yourself:
            </li>
          </ul>
          <CodeBlock lang="bash" code="git fetch origin main" />
          <p>An unknown ref:</p>
          <Recording name="diff-unknown-ref" title="Recorded gooze run --diff with an unknown ref" />
          <p>Outside a git repository:</p>
          <Recording name="diff-no-repo" title="Recorded gooze run --diff outside a git repository" />
          <p>Without git on <code>PATH</code>:</p>
          <Recording name="diff-no-git" title="Recorded gooze run --diff without git on PATH" />
        </div>

        <div id="limitations">
          <h2>Limitations</h2>
          <ul>
            <li>
              The score describes the change, not the codebase. Use a full run on{" "}
              <code>main</code>, or <code>gooze report merge</code> and{" "}
              <code>gooze report view</code>, for the whole picture.
            </li>
            <li>
              Deleted lines have no mutants. A pull request that only removes code tests nothing.
            </li>
            <li>A mutant that spans several lines is placed on its first changed line.</li>
            <li>
              A sharded diff run can&apos;t be gated on the score of the changed lines yet (see{" "}
              <a href="#ci">Run it in CI</a>).
            </li>
            <li>
              Unchanged code isn&apos;t re-tested even when its behavior depends on a line you
              changed in another file.
            </li>
          </ul>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
