import type * as React from "react"
import { DocsFaq, faqPageJsonLd, withCode } from "@/components/docs-faq"

import { docsMetadata } from "@/lib/docs-meta"
import { DOCS_FACTS_VERSION } from "@/lib/version"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Facts last checked against gooze DOCS_FACTS_VERSION and the competitors' own docs. Only
// mark a competitor "yes" when its docs say so; anything else is "unknown",
// never a guess. Update VERIFIED when re-checking.
const VERIFIED = "October 2026"

type Support = "yes" | "no" | "partial" | "unknown"

type Row = {
  feature: string
  gooze: [Support, string]
  gremlins: [Support, string]
  goMutesting: [Support, string]
  avito: [Support, string]
  goMutants: [Support, string]
}

const rows: Row[] = [
  {
    feature: "Config file in the repo",
    gooze: ["yes", "`gooze.yaml` + `GOOZE_*` env vars"],
    gremlins: ["yes", "`.gremlins.yaml`"],
    goMutesting: ["no", "flags only"],
    avito: ["yes", "YAML via `--config`"],
    goMutants: ["yes", "`.go-mutants.toml`"],
  },
  {
    feature: "Fail the build below a score",
    gooze: ["yes", "total, average and per-file (`--threshold-*`), plus diff-only ones and a survivor cap"],
    gremlins: ["yes", "`--threshold-efficacy`, `--threshold-mcover`"],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
    goMutants: ["yes", "`policy.minimum_score` + `--strict`"],
  },
  {
    feature: "Test only changed code",
    gooze: ["yes", "incremental execution per file (no git needed), or changed lines against a ref (`--diff`)"],
    gremlins: ["yes", "git diff against a ref (`--diff`)"],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
    goMutants: ["yes", "git diff against a ref (`--changed`)"],
  },
  {
    feature: "Mutate only some functions",
    gooze: ["yes", "`--run REGEX`, like `go test -run`"],
    gremlins: ["no", "file regex only (`--exclude-files`)"],
    goMutesting: ["unknown", ""],
    avito: ["partial", "skip one with `// mutator-disable-func`"],
    goMutants: ["no", "file globs only (`--include`, `--exclude`)"],
  },
  {
    feature: "Pick the mutators for one run",
    gooze: ["yes", "`--mutagens` or `run.mutagens`, including the opt-in `branch`, `statement`, `loop`"],
    gremlins: ["yes", "one flag per mutator, or `mutants.<name>.enabled`"],
    goMutesting: ["unknown", ""],
    avito: ["partial", "per-line comments only"],
    goMutants: ["yes", "`--operator`, `--profile`"],
  },
  {
    feature: "Incremental cache between runs",
    gooze: ["yes", "per-file, reused on any machine"],
    gremlins: ["unknown", ""],
    goMutesting: ["partial", "manual MD5 blacklist"],
    avito: ["partial", "manual MD5 blacklist"],
    goMutants: ["yes", "per-mutant outcome cache"],
  },
  {
    feature: "Whole-codebase score without re-running everything",
    gooze: ["yes", "cached results + re-tested changed files"],
    gremlins: ["partial", "`--diff` tests only changed code; otherwise a full run"],
    goMutesting: ["no", "full run every time"],
    avito: ["no", "full run every time"],
    goMutants: ["yes", "cached outcomes; `--changed` narrows to the diff"],
  },
  {
    feature: "Split one run across CI jobs",
    gooze: ["yes", "`-s INDEX/TOTAL` + `report merge`"],
    gremlins: ["unknown", ""],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
    goMutants: ["yes", "`--shard K/N` + `report merge`"],
  },
  {
    feature: "Shared baseline for CI and teammates",
    gooze: ["yes", "`report push`/`pull` to any OCI registry"],
    gremlins: ["unknown", ""],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
    goMutants: ["unknown", ""],
  },
  {
    feature: "Parallel workers",
    gooze: ["yes", "`-p/--parallel`"],
    gremlins: ["yes", "`--workers`"],
    goMutesting: ["partial", "via a custom `--exec` script"],
    avito: ["unknown", ""],
    goMutants: ["unknown", ""],
  },
  {
    feature: "Skip code tests never execute",
    gooze: ["yes", "`--coverage-profile`"],
    gremlins: ["yes", "`NOT COVERED` status"],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
    goMutants: ["yes", "`uncovered` status"],
  },
  {
    feature: "Ignore code with comments",
    gooze: ["yes", "`//gooze:ignore`, per file/func/line/mutator or single replacement"],
    gremlins: ["no", "file regex only (`--exclude-files`)"],
    goMutesting: ["partial", "checksum blacklist"],
    avito: ["yes", "`mutator-disable-*` directives"],
    goMutants: ["unknown", ""],
  },
  {
    feature: "Write your own mutators",
    gooze: ["partial", "one small function in the gooze source; no plugin API"],
    gremlins: ["partial", "toggle built-ins only"],
    goMutesting: ["yes", "`Mutator` interface + `Register`"],
    avito: ["unknown", ""],
    goMutants: ["unknown", ""],
  },
  {
    feature: "Custom test runner command",
    gooze: ["no", "on the roadmap"],
    gremlins: ["partial", "`--integration` runs the full suite"],
    goMutesting: ["yes", "`--exec`"],
    avito: ["yes", "`--exec`"],
    goMutants: ["yes", "`test.command`"],
  },
  {
    feature: "Machine-readable results",
    gooze: ["yes", "YAML report dir + `_index.yaml`; SARIF and Code Climate (`report view --format sarif|codeclimate`)"],
    gremlins: ["yes", "JSON (`-o`)"],
    goMutesting: ["partial", "stdout"],
    avito: ["yes", "JSON and HTML"],
    goMutants: ["yes", "JSON (Stryker-style) and HTML"],
  },
  {
    feature: "Interactive results viewer",
    gooze: ["yes", "TUI with diffs (`report view --all`)"],
    gremlins: ["unknown", ""],
    goMutesting: ["unknown", ""],
    avito: ["partial", "static HTML report"],
    goMutants: ["partial", "live dashboard during the run"],
  },
  {
    feature: "Results in your editor",
    gooze: ["yes", "goozels language server: survivor markers, run-function lens"],
    gremlins: ["unknown", ""],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
    goMutants: ["unknown", ""],
  },
  {
    feature: "AI coding agent plugin",
    gooze: ["yes", "Claude Code plugin (beta): setup, kill-survivors loop, results after every edit"],
    gremlins: ["unknown", ""],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
    goMutants: ["unknown", ""],
  },
  {
    feature: "Stable (1.x) CLI and config",
    gooze: ["yes", "`v1.x`"],
    gremlins: ["no", "`v0.x`; config may change between minors"],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
    goMutants: ["no", "pre-release"],
  },
]

const supportLabel: Record<Support, string> = {
  yes: "Yes",
  no: "No",
  partial: "Partly",
  unknown: "Not documented",
}

const supportBadge: Record<Support, React.ComponentProps<typeof Badge>> = {
  yes: {
    variant: "secondary",
    className: "bg-[color:var(--gooze-green)]/15 text-[color:var(--gooze-green)]",
  },
  no: { variant: "destructive" },
  partial: { variant: "secondary" },
  unknown: { variant: "outline", className: "text-muted-foreground" },
}

const tools: { key: Exclude<keyof Row, "feature">; name: string }[] = [
  { key: "gooze", name: "Gooze" },
  { key: "gremlins", name: "Gremlins" },
  { key: "goMutesting", name: "go-mutesting" },
  { key: "avito", name: "go-mutesting (avito-tech)" },
  { key: "goMutants", name: "go-mutants" },
]

function SupportValue({ value }: { value: [Support, string] }) {
  const [support, note] = value
  return (
    <>
      <Badge {...supportBadge[support]}>{supportLabel[support]}</Badge>
      {note && <div className="mt-1 text-xs text-muted-foreground">{withCode(note)}</div>}
    </>
  )
}

function Cell({ value }: { value: [Support, string] }) {
  return (
    <TableCell>
      <SupportValue value={value} />
    </TableCell>
  )
}

// Rendered both on the page and as FAQPage structured data, so search engines
// and AI answers quote the same wording people read.
const faqs = [
  {
    q: "Does Gooze have a config file?",
    a: "Yes. `gooze.yaml` in the project root holds output dir, excludes, parallelism, timeouts, and the coverage profile; `gooze config init` generates one. Every key can also be set with a `GOOZE_*` environment variable, and the common ones with a CLI flag.",
  },
  {
    q: "Does Gooze run the whole test suite for every mutant?",
    a: "No. Each mutant runs `go test` only for its own package, never the whole module. On top of that, the cache re-tests only changed files, `--diff` limits a pull or merge request run to the changed lines, and `--run` to one function, so a run can be as small as one function's mutants against one package's tests.",
  },
  {
    q: "Is Gooze only for large projects?",
    a: "No. Gooze uses the same three commands from a tiny project to microservices and large monorepos: `gooze run`, `gooze report view`, and, when you shard in CI, `gooze report merge`. Sharding and OCI baselines are opt-in for when a codebase outgrows a single job.",
  },
  {
    q: "Does Gooze work for microservices?",
    a: "Yes. Run Gooze in each service's own CI job; the per-file cache keeps every run short, and `gooze report push` and `pull` share each service's baseline through any OCI registry, so teammates and CI start from the same results.",
  },
  {
    q: "Is Gooze good for TDD?",
    a: "Yes. Results are cached per file, so after you edit a file or its test only that file is re-tested and the rest of the report is reused. The feedback loop stays short without losing the whole-codebase score. To test one function, `gooze run --run '^Name$'` mutates only that function, and the goozels code lens runs it from the editor.",
  },
  {
    q: "Can Gooze fail CI when the mutation score drops below a threshold?",
    a: "Yes. `--threshold-total`, `--threshold-average` and `--threshold-file` (or `threshold.*` in `gooze.yaml`) set minimums for the total score, the average file score and every file's score. Below one, Gooze exits with code `3`. `--threshold-diff-*` sets a separate bar for the changed lines of a `--diff` run.",
  },
  {
    q: "Does Gooze only test changed code?",
    a: "Yes. By default Gooze detects changes through incremental execution, without git: it hashes each file and its package's test files and re-tests only what changed since the stored reports. Results for the rest are reused, so the score covers the whole codebase. No base branch, commit, or git history is needed, and uncommitted edits count. Granularity is per file. Changes in other files don't invalidate cached results, so run `--no-cache` periodically. `gooze run --diff REF` mutates only the lines changed against a git ref, and its score describes the change.",
  },
  {
    q: "Can I write custom mutators for Gooze?",
    a: "Not as plugins. Gooze ships nine default operators (arithmetic, comparison, logical, boolean, numbers, unary, bitwise, increment, assignment) and three you turn on with `--mutagens` (branch, statement, loop). Adding an operator means one small function in the gooze source; caching, sharding, and reporting don't change. go-mutesting supports mutators outside the tool via its `Mutator` interface.",
  },
  {
    q: "Does Gooze work with Claude Code and other AI coding agents?",
    a: "Yes, with Claude Code through the gooze plugin (beta): `/plugin marketplace add gooze-dev/claude-plugin`, then `/plugin install gooze@gooze`. It sets a project up with `/gooze:init`, runs the kill-survivors loop, adds Gooze to existing CI, and shows Claude the score and surviving mutants after every edit. Codex and opencode support is on the way.",
  },
  {
    q: "How is the Gooze mutation score calculated?",
    a: "`killed / (all mutations - error)`. Mutants that do not compile (`error`) are left out; `survived`, `not_covered`, and `timeout` all lower the score.",
  },
  {
    q: "Can Gooze run across several CI machines?",
    a: "Yes. `gooze run -s INDEX/TOTAL` runs one shard per job, and `gooze report merge` combines them. Ready-made GitHub Actions and GitLab CI pipelines are in the docs.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

export const metadata = docsMetadata("/docs/comparison")

export default function ComparisonPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Gooze vs other Go mutation testing tools</h1>
      <p className="text-lg text-muted-foreground mb-4">
        You&apos;re choosing a Go mutation testing tool and want the facts side by side. This page compares
        Gooze, Gremlins, go-mutesting, and go-mutants feature by feature, including what Gooze does not do yet.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Last verified {VERIFIED} against Gooze <code>{DOCS_FACTS_VERSION}</code> and each tool&apos;s own documentation
        (<a href="https://gremlins.dev">gremlins.dev</a>,{" "}
        <a href="https://github.com/zimmski/go-mutesting">zimmski/go-mutesting</a>,{" "}
        <a href="https://github.com/avito-tech/go-mutesting">avito-tech/go-mutesting</a>,{" "}
        <a href="https://pkg.go.dev/github.com/P4suta/go-mutants">P4suta/go-mutants</a>).
        &ldquo;Not documented&rdquo; means we found no mention of it, not that it&apos;s impossible.
        Spotted a mistake? Open an issue.
      </p>

      <div>
        <div id="summary">
          <h2>In short</h2>
          <ul>
            <li>
              <strong>Gooze</strong> uses the same three commands
              (<code>run</code>,{" "}
              <code>report view</code>,{" "}
              <code>report merge</code>) from a tiny project to microservices and large
              monorepos. Its per-file cache re-tests only what you changed, so
              local TDD loops stay fast, and every run still reports a score for the whole
              codebase, not just the diff; a git diff mode narrows pull request runs
              to the changed lines, and <code>--run</code> and <code>--mutagens</code> narrow a
              run to some functions or mutation types. Sharding, a shared OCI baseline, a TUI
              viewer, editor integration, and a{" "}
              <Link href="/docs/claude-code">Claude Code plugin</Link> come built in.
            </li>
            <li>
              <strong>Gremlins</strong> has a built-in score threshold and a git-based diff mode, but
              describes itself as best for &ldquo;smallish&rdquo; modules and is still <code>0.x</code>.
            </li>
            <li>
              <strong>go-mutesting</strong> is a minimal framework: write your own mutators and
              plug in your own test runner with <code>--exec</code>,
              at the cost of building caching, parallelism, and reporting yourself. The avito-tech
              fork adds a config file, JSON/HTML reports, and ignore directives.
            </li>
            <li>
              <strong>go-mutants</strong> is feature-rich (threshold, git-based diff mode, sharding, outcome
              cache, JSON/HTML) but pre-release at the time of writing.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Why bother at all: Just et al. (FSE 2014) found a test suite&apos;s
            ability to{" "}
            <a
              href="https://dl.acm.org/doi/10.1145/2635868.2635929"
              target="_blank"
              rel="noopener noreferrer"
            >
              kill mutants correlates with catching real faults
            </a>
            , while Inozemtseva &amp; Holmes (ICSE 2014) found{" "}
            <a
              href="https://dl.acm.org/doi/10.1145/2568225.2568271"
              target="_blank"
              rel="noopener noreferrer"
            >
              code coverage alone is not strongly correlated with test-suite
              effectiveness
            </a>
            , which is the gap every tool here targets.
          </p>
        </div>

        <div id="matrix">
          <h2>Feature matrix</h2>
          {/* Six columns don't fit narrow screens without scrolling, so below lg
              each feature is a card with one line per tool. */}
          <ul data-slot="feature-cards" className="space-y-3 lg:hidden">
            {rows.map((row) => (
              <li key={row.feature} className="rounded-lg border p-4">
                <div className="font-medium">{row.feature}</div>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                  {tools.map((tool) => (
                    <div key={tool.key} className="contents">
                      <dt className="text-muted-foreground">{tool.name}</dt>
                      <dd>
                        <SupportValue value={row[tool.key]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
          <div className="hidden rounded-lg border lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Gooze</TableHead>
                  <TableHead>Gremlins</TableHead>
                  <TableHead>go-mutesting</TableHead>
                  <TableHead>go-mutesting (avito-tech)</TableHead>
                  <TableHead>go-mutants</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="align-top whitespace-normal font-medium">{row.feature}</TableCell>
                    <Cell value={row.gooze} />
                    <Cell value={row.gremlins} />
                    <Cell value={row.goMutesting} />
                    <Cell value={row.avito} />
                    <Cell value={row.goMutants} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div id="choose">
          <h2>Which one to pick</h2>
          <ul>
            <li>
              <strong>Pick Gooze</strong> if you want one tool that stays simple as the codebase
              grows: fast feedback while you write tests (only changed files re-run), a
              whole-codebase score on every PR, and CI that scales by adding shards. Start with
              the <Link href="/docs/quick-start">Quick start</Link>, or with the{" "}
              <Link href="/docs/claude-code">Claude Code plugin</Link> if an agent writes your code.
            </li>
            <li>
              <strong>Pick Gremlins</strong> if you want to gate on mutant coverage as well as
              efficacy (<code>--threshold-mcover</code>) and the module is small.
            </li>
            <li>
              <strong>Pick go-mutesting</strong> if you need a fully custom test runner or want to
              ship mutators outside the tool&apos;s source.
            </li>
          </ul>
        </div>

        <div id="incremental-vs-diff">
          <h2>Incremental execution vs git diff</h2>
          <p>
            Both approaches test only what changed. They differ in how they find it and what the
            score means afterwards.
          </p>
          <ul>
            <li>
              <strong>Git diff</strong> (Gremlins <code>--diff</code>,
              go-mutants <code>--changed</code>, Gooze <code>--diff</code>): compare
              against a base branch or commit and mutate only the changed lines. Needs git history
              and the right base ref, and the score describes the change, not the codebase.
            </li>
            <li>
              <strong>Incremental execution</strong> (Gooze by default): hash every file and its package's test files,
              re-test only what changed since the stored reports, and reuse the rest. No git, base
              ref, or fetch depth needed, uncommitted edits count, and the score after a one-file
              change is still the score for the whole project.
            </li>
          </ul>
          <p>
            The trade-off is granularity: incremental execution re-tests a whole changed file, a
            diff mode only the changed lines. Gooze combines them: a diff run writes its own
            reports and leaves the whole-codebase reports as they were, <code>gooze report merge</code>{" "}
            folds it in, and a later full run re-tests the files it tested only in part (see{" "}
            <Link href="/docs/usage/diff-mode#cache">diff mode and the cache</Link>).
          </p>
          <p>
            A file is re-tested when it, its <code>_test.go</code>,
            or the mutators change. Changes elsewhere (a helper in another file, a dependency) don&apos;t
            invalidate it, so run with <code>--no-cache</code>{" "}
            on a schedule, for example nightly. Details:{" "}
            <Link href="/docs/usage/incremental-runs#invalidation">Incremental runs</Link>.
          </p>
        </div>

        <div id="limitations">
          <h2>What Gooze doesn&apos;t do (yet)</h2>
          <p>
            Custom mutator plugins and a custom test runner are not supported in{" "}
            <code>{DOCS_FACTS_VERSION}</code>. Workarounds and status are on the{" "}
            <Link href="/docs/roadmap#limitations">Roadmap</Link>.
          </p>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
