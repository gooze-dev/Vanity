import { docsMetadata } from "@/lib/docs-meta"
import { DocsFaq, faqPageJsonLd } from "@/components/docs-faq"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

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
    a: "The `Mutation score` line, which covers only the changed lines. The existing gate step reads that line, so it checks the pull request's own code without changes. The `Total mutation score` line covers every file in scope.",
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

      {/* TODO(version): name the release once diff mode ships, and bump DOCS_FACTS_VERSION. */}
      <Alert>
        <Info />
        <AlertDescription>
          <p>
            Diff mode arrives in the next Gooze release. It is not in{" "}
            <code>v1.2.0</code>.
          </p>
        </AlertDescription>
      </Alert>

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
          {/* TODO(record): calc-diff-estimate: gooze run --estimate --diff main ./... | cat */}
          <p>
            The preview lists only the files in scope, each with the number of its changed lines.
            Unchanged files aren&apos;t listed. Then run it:
          </p>
          <CodeBlock lang="bash" code="gooze run --diff main ./..." />
          {/* TODO(record): calc-diff-run: gooze run --diff main ./... | cat */}
          <p>
            The run starts with a line that says how many files changed since <code>main</code>{" "}
            and names the merge base commit. It ends with two score lines: the{" "}
            <code>Mutation score</code> of the changed lines, then a{" "}
            <code>Total mutation score</code> (see <a href="#scores">Two scores</a>).
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
          <h2>Two scores</h2>
          <p>A diff run ends with two score lines:</p>
          <ol>
            <li>
              <code>Mutation score</code> covers the changed lines only. This is the score of
              your change.
            </li>
            <li>
              <code>Total mutation score</code> covers every file in scope. A changed file counts
              only its tested lines, and the line says how many files were partly tested.
            </li>
          </ol>
          <p>
            The <Link href="/docs/ci/github#gate">score gate</Link> step reads the line that
            starts with <code>Mutation score:</code> (the <code>Total mutation score</code> line
            doesn&apos;t match), so it gates the pull request&apos;s own code without any change. When the branch changes no Go lines, there is nothing to
            mutate: the score for the changed lines is <code>100%</code>, the run exits with{" "}
            <code>0</code>, and the gate passes.
          </p>
          <p>
            To read the same numbers from stored reports, for example after{" "}
            <code>gooze report merge</code>, pass the same ref to <code>gooze report view</code>.
            It prints the score and the survivors of the changed lines only:
          </p>
          <CodeBlock lang="bash" code="gooze report view --diff main" />
          {/* TODO(record): calc-diff-report-view: gooze report view --diff main | cat */}
        </div>

        <div id="cache">
          <h2>Diff mode and the cache</h2>
          <p>
            Diff mode uses the same reports directory and cache as every other run:
          </p>
          <ul>
            <li>Files you didn&apos;t change aren&apos;t re-tested; their stored results stay.</li>
            <li>A changed file is tested on its changed lines only.</li>
            <li>
              Its stored results remember that they cover only some lines. A later full{" "}
              <code>gooze run</code> re-tests such a <em>partly tested</em> file in full.
            </li>
            <li>
              A later diff run reuses the results when the file hashes are the same and it needs
              the same lines or fewer.
            </li>
            <li>
              <code>--no-cache</code> re-tests the changed lines anyway.
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
              <strong>Sharding.</strong> Every shard computes the same changes from git, and{" "}
              <code>gooze report merge</code> keeps the scope information. Gate after the merge
              with <code>gooze report view --diff REF</code>, which needs the checkout and the
              base ref too.
            </li>
            <li>
              <strong>Coverage profile.</strong> <code>--coverage-profile</code> still applies:
              changed lines that no test runs are reported as <code>not_covered</code>.
            </li>
            <li>
              <strong>Exit code.</strong> It doesn&apos;t change: survivors never fail a run, so
              fail the build with the score gate.
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
          {/* TODO(record): diff-unknown-ref: gooze run --diff no-such-branch ./... 2>&1 | cat */}
          {/* TODO(record): diff-no-repo: gooze run --diff main ./... 2>&1 | cat (in a directory outside any git repository) */}
          {/* TODO(record): diff-no-git: PATH="$(dirname "$(command -v gooze)")" gooze run --diff main ./... 2>&1 | cat (gooze's directory must not contain git) */}
        </div>

        <div id="limitations">
          <h2>Limitations</h2>
          <ul>
            <li>
              The score describes the change, not the codebase. Use a full run (on{" "}
              <code>main</code>, or the <code>Total mutation score</code>) for the whole picture.
            </li>
            <li>
              Deleted lines have no mutants. A pull request that only removes code tests nothing.
            </li>
            <li>A mutant that spans several lines is placed on its first changed line.</li>
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
