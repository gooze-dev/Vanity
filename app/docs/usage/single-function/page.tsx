import { docsMetadata } from "@/lib/docs-meta"
import { Recording } from "@/components/recording"
import { DocsFaq, faqPageJsonLd } from "@/components/docs-faq"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export const metadata = docsMetadata("/docs/usage/single-function")

const percent = `// Percent returns part as a whole percentage of total, rounded down.
// It expects total > 0.
func Percent(part, total int) int {
	return part * 100 / total
}`

const percentTest = `func TestPercent(t *testing.T) {
	if got := Percent(1, 4); got != 25 {
		t.Errorf("Percent(1, 4) = %d, want 25", got)
	}
	if got := Percent(3, 3); got != 100 {
		t.Errorf("Percent(3, 3) = %d, want 100", got)
	}
}`

const faqs = [
  {
    q: "How do I run Gooze on one function only?",
    a: "Run `gooze run --run '^InRange$' ./...` with the function's name. The pattern is a Go regular expression, like `go test -run`, matched against the name of the function each mutation is in (`Name`, and `Type.Name` for methods). It is not anchored, so write `^Name$` for an exact match.",
  },
  {
    q: "Does `--run` make each mutant faster to test?",
    a: "No. Every mutant still runs the full test suite of its package. `--run` only generates fewer mutants, so the run is shorter because there is less to test.",
  },
  {
    q: "Does a `--run` or `--mutagens` run change my project reports?",
    a: "No. It writes its reports to `.gooze-reports/run/` and leaves the main reports as they were. `gooze report merge` adds them to the main reports and removes `run/`.",
  },
  {
    q: "Why does a `--run` run print `no mutations`?",
    a: "The file has stored results in the main reports and neither it nor its test file changed, so the run skips it. Change the test file, or pass `--no-cache` to test the function anyway.",
  },
  {
    q: "Which names does `--mutagens` accept?",
    a: "The six mutagens Gooze runs: `arithmetic`, `boolean`, `numbers`, `comparison`, `logical` and `unary`, in any case. Separate them with commas or repeat the flag. Any other name exits with code `1`.",
  },
  {
    q: "Can I combine `--run` with `--shard`?",
    a: "No. Gooze exits with `--run can't be combined with --shard: a function-level run is small, so run it in one job`. `--mutagens` and `--diff` work with `--shard`.",
  },
  {
    q: "Should CI gate on the score of a `--run` or `--mutagens` run?",
    a: "No. That score covers only the selected functions or mutagens, so it says nothing about the rest of the code. Gate on a full run, or on a diff run for pull requests.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

export default function SingleFunctionPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">
        One function at a time (--run and --mutagens)
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        You, or an agent, are killing the survivors of one function. Each try means a new test
        and another run, and a full run tests every mutant in the file and rewrites the project
        report each time. <code>--run</code> mutates only the functions you name,{" "}
        <code>--mutagens</code> only the mutagens you pick, and the results go to a separate
        directory, so the project report stays as it was until you merge them.
      </p>

      {/* TODO(version): name the release that ships --run, --mutagens and the run/ directory, and bump DOCS_FACTS_VERSION. */}
      <Alert>
        <Info />
        <AlertDescription>
          <p>
            <code>--run</code>, <code>--mutagens</code> and the <code>run/</code> directory arrive
            in the next Gooze release. They are not in <code>v1.2.0</code>.
          </p>
        </AlertDescription>
      </Alert>

      <div>
        <div id="start">
          <h2>Where you start</h2>
          <p>
            Take the <Link href="/docs/quick-start"><code>calc</code></Link> package from the
            quick start, with one more function below <code>InRange</code> in{" "}
            <code>calc.go</code>, and its test in <code>calc_test.go</code>:
          </p>
          <CodeBlock lang="go" code={percent} />
          <CodeBlock lang="go" code={percentTest} />
          <p>
            A full run now tests 23 mutations, 13 in <code>InRange</code> and 10 in{" "}
            <code>Percent</code>:
          </p>
          <CodeBlock lang="bash" code="gooze run ./..." />
          <Recording name="calc-func-first-run" title="Recorded last line of a full gooze run on calc with Percent" />
          <p>
            The report shows that both survivors are in <code>InRange</code>, on lines 10 and 13.{" "}
            <code>Percent</code> has none:
          </p>
          <Recording name="calc-func-report-view" title="Recorded gooze report view of calc with Percent" />
          <p>
            You want to work on <code>InRange</code> alone, without testing{" "}
            <code>Percent</code>&apos;s mutants on every try.
          </p>
        </div>

        <div id="estimate">
          <h2>Preview the function</h2>
          <p>
            Add the first boundary case to the table in <code>TestInRange</code>:
          </p>
          <CodeBlock lang="go" code={`		{0, 0, 10, true},  // lower bound is inside`} />
          <p>
            Then check what a run limited to <code>InRange</code> would test:
          </p>
          <CodeBlock lang="bash" code="gooze run --estimate --run '^InRange$' ./..." />
          <Recording name="calc-func-estimate" title="Recorded gooze run --estimate --run '^InRange$'" />
          <p>
            The first line names the selection. The count is 13: the mutations of{" "}
            <code>InRange</code> only. The 10 in <code>Percent</code> are left out.
          </p>
        </div>

        <div id="run">
          <h2>Run it</h2>
          <CodeBlock lang="bash" code="gooze run --run '^InRange$' ./..." />
          <Recording name="calc-func-run" title="Recorded last lines of gooze run --run '^InRange$'" />
          <p>
            The score covers only the 13 mutations of <code>InRange</code>, and the end of the
            line says so (<code>functions matching ^InRange$</code>). The new case killed the
            survivor on line 10. The next line says where the reports of this run are.
          </p>
        </div>

        <div id="survivors">
          <h2>See what still survives</h2>
          <p>
            Point <code>gooze report view</code> at the run&apos;s directory with{" "}
            <code>-o</code>:
          </p>
          <CodeBlock lang="bash" code="gooze report view -o .gooze-reports/run" />
          <Recording name="calc-func-run-view" title="Recorded gooze report view -o .gooze-reports/run after the first new case" />
          <p>
            One survivor is left, on line 13. The project report hasn&apos;t changed; without{" "}
            <code>-o</code>, <code>gooze report view</code> still shows the full run:
          </p>
          <CodeBlock lang="bash" code="gooze report view" />
          <Recording name="calc-func-main-view" title="Recorded score line of gooze report view after the --run run" />
        </div>

        <div id="loop">
          <h2>Write the next test, run again</h2>
          <p>
            Add the second boundary case and run the same command:
          </p>
          <CodeBlock lang="go" code={`		{10, 0, 10, true}, // upper bound is inside`} />
          <CodeBlock lang="bash" code="gooze run --run '^InRange$' ./..." />
          <Recording name="calc-func-rerun" title="Recorded last lines of gooze run --run '^InRange$' after both new cases" />
          <p>
            Every narrowed run empties <code>.gooze-reports/run/</code> first, so it holds only
            the latest run. Repeat this loop (write a test, run, read the survivors) until the
            function has no survivors you can kill.
          </p>
        </div>

        <div id="merge">
          <h2>Add the results to the project report</h2>
          <p>
            When you&apos;re done, fold the run into the main reports:
          </p>
          <CodeBlock lang="bash" code="gooze report merge" />
          <Recording name="calc-func-merge" title="Recorded gooze report merge after the --run runs" />
          <p>
            <code>merge</code> removes <code>run/</code>. What it keeps of the main reports
            depends on whether the file changed since they were written:
          </p>
          <ul>
            <li>
              <strong>Unchanged file</strong> (same source and test file hashes): the run&apos;s
              results replace only the matching mutations, and the file stays complete.
            </li>
            <li>
              <strong>Changed or new file:</strong> the run&apos;s results replace all of the
              file&apos;s results. If the run tested only part of the file, the file is marked
              partial, and the next full <code>gooze run</code> re-tests it in full.
            </li>
          </ul>
          <p>
            Here <code>calc_test.go</code> changed, so <code>calc.go</code> is now partial: the
            report has the 13 results of <code>InRange</code>, and <code>Percent</code>&apos;s
            10 are gone until the next full run:
          </p>
          <Recording name="calc-func-merged-view" title="Recorded gooze report view after gooze report merge" />
          <p>
            The next full run re-tests the whole file and gives the project score:
          </p>
          <CodeBlock lang="bash" code="gooze run ./..." />
          <Recording name="calc-func-full-run" title="Recorded last line of the full gooze run after the merge" />
        </div>

        <div id="cache">
          <h2>Unchanged files are skipped</h2>
          <p>
            A narrowed run uses the main reports as its cache. A file whose source and test file
            haven&apos;t changed since the main reports is skipped, and it isn&apos;t in the
            run&apos;s score. Run <code>--run &apos;^InRange$&apos;</code> again right after
            that full run, and there is nothing to test:
          </p>
          <Recording name="calc-func-cached-run" title="Recorded last lines of gooze run --run '^InRange$' with nothing changed" />
          <p>
            That&apos;s why the loop starts with a new test: changing the test file is what puts
            the function back in the run. To test it without a change, add{" "}
            <code>--no-cache</code>.
          </p>
        </div>

        <div id="matching">
          <h2>How --run matches functions</h2>
          <p>
            <code>--run</code> works like <code>go test -run</code>, but on the functions being
            mutated instead of the tests:
          </p>
          <ul>
            <li>
              The pattern is a Go regular expression and isn&apos;t anchored:{" "}
              <code>Range</code> matches <code>InRange</code>. Write <code>^InRange$</code> for
              an exact match.
            </li>
            <li>
              It is matched against the function each mutation is in: its name, and for a
              method also <code>Type.Name</code>. Pointer, value and generic receivers all count
              as the type name, so a method <code>Push</code> on <code>Stack[T]</code> matches{" "}
              <code>Push</code> and <code>Stack.Push</code>.
            </li>
            <li>Code in a closure belongs to the function that contains it.</li>
            <li>
              Package-level code (<code>var</code> and <code>const</code> declarations) matches
              no pattern, so a <code>--run</code> run never mutates it.
            </li>
            <li>
              Each mutant still runs the full test suite of its package.
            </li>
            <li>
              <code>--run</code> is a flag only; there is no config key or environment variable.
              It works with <code>--estimate</code>, path arguments, <code>-x/--exclude</code>,{" "}
              <code>--mutagens</code> and <code>--diff</code>.
            </li>
          </ul>
          <p>A pattern that doesn&apos;t compile exits with code <code>1</code>:</p>
          <Recording name="run-invalid-pattern" title="Recorded gooze run --run with an invalid pattern" />
          <p>
            <code>--run</code> with <code>--shard</code> is rejected: a run of a few functions
            is small enough for one job.
          </p>
          <Recording name="run-run-with-shard" title="Recorded gooze run --run with --shard" />
        </div>

        <div id="mutagens">
          <h2>Only some mutagens (--mutagens)</h2>
          <p>
            <code>--mutagens</code> generates only the{" "}
            <Link href="/docs/mutations">mutagens</Link> you list. The names are the six Gooze
            runs (<code>arithmetic</code>, <code>boolean</code>, <code>numbers</code>,{" "}
            <code>comparison</code>, <code>logical</code>, <code>unary</code>), in any case,
            comma-separated or with the flag repeated. Only the arithmetic and numbers mutants of{" "}
            <code>calc</code>, all of them in <code>Percent</code>:
          </p>
          <CodeBlock lang="bash" code="gooze run --estimate --mutagens arithmetic,numbers ./..." />
          <Recording name="calc-func-mutagens-estimate" title="Recorded gooze run --estimate --mutagens arithmetic,numbers" />
          <p>
            Nothing changed since the full run, so the 10 mutations are cached. Combine it with{" "}
            <code>--run</code> to narrow both ways, for example{" "}
            <code>--run &apos;^InRange$&apos; --mutagens comparison</code>. An unknown name exits
            with code <code>1</code> and lists the valid ones:
          </p>
          <Recording name="run-unknown-mutagen" title="Recorded gooze run --mutagens with an unknown name" />
          <p>
            Unlike <code>--run</code>, <code>--mutagens</code> also has a config key,{" "}
            <code>run.mutagens</code> (a list, empty by default, which means all six), and the
            environment variable <code>GOOZE_RUN_MUTAGENS</code>. A value there narrows every
            run, so every run writes to <code>run/</code> and none updates the main reports.
            Prefer the flag for one-off runs.
          </p>
        </div>

        <div id="run-dir">
          <h2>The run directory</h2>
          <p>
            Every run with <code>--diff</code>, <code>--run</code> or <code>--mutagens</code> is a
            narrowed run, and they all follow the same rules:
          </p>
          <ul>
            <li>
              Its reports go to a fresh <code>&lt;output&gt;/run/</code> (by default{" "}
              <code>.gooze-reports/run/</code>), or <code>run/shard_N</code> when sharded. It
              never changes the main reports.
            </li>
            <li>
              It uses the main reports as its cache: an unchanged file is skipped,{" "}
              <code>--no-cache</code> tests it anyway, and editing its test file makes it re-test.
            </li>
            <li>
              Its score covers only the selection and names it at the end of the line, followed
              by a line that points to <code>run/</code> and <code>gooze report merge</code>.
            </li>
            <li>
              <code>gooze report view -o .gooze-reports/run</code> shows its results and
              survivors.
            </li>
            <li>
              The main reports, the cache, <code>gooze report view</code> without{" "}
              <code>-o</code>, and goozels ignore <code>run/</code>: they don&apos;t read
              subdirectories of the reports directory.
            </li>
            <li>
              <Link href="/docs/cli/report#merge"><code>gooze report merge</code></Link> folds{" "}
              <code>run/</code> and <code>run/shard_*</code> into the main reports (see{" "}
              <a href="#merge">above</a>) and removes <code>run/</code>.
            </li>
          </ul>
          <p>
            Each report file in <code>run/</code> records what the run selected in a{" "}
            <code>scope</code> field (see <Link href="/docs/reports#fields">Report format</Link>).
          </p>
        </div>

        <div id="not-for">
          <h2>When not to use them</h2>
          <ul>
            <li>
              <strong>Don&apos;t gate CI on a <code>--run</code> or <code>--mutagens</code>{" "}
              score.</strong> It covers only the selection. Gate on a full run, or on a{" "}
              <Link href="/docs/usage/diff-mode">diff run</Link> for pull requests.
            </li>
            <li>
              <strong>Don&apos;t use <code>--mutagens</code> to hide a mutagen whose survivors you
              don&apos;t like.</strong> If a survivor is an equivalent mutant that no test can
              kill, mark it with <code>{"//gooze:ignore"}</code> and a reason (see{" "}
              <Link href="/docs/usage/ignoring-code">Ignoring code</Link>).
            </li>
            <li>
              <strong>Don&apos;t push a narrowed run&apos;s reports as the{" "}
              <Link href="/docs/ci/sharing-reports">OCI baseline</Link>.</strong> Push after a
              full run, or after <code>gooze report merge</code>.
            </li>
            <li>
              <strong>Merge before you read the project score.</strong> Until you run{" "}
              <code>gooze report merge</code>, <code>gooze report view</code> shows the main
              reports without the narrowed run.
            </li>
            <li>
              <strong>Don&apos;t expect faster tests per mutant.</strong> <code>--run</code>{" "}
              selects fewer mutants; each one still runs the whole package suite.
            </li>
          </ul>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
