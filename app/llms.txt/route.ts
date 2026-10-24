import { NextResponse } from "next/server";

import { docsPages, docsSections, SITE_URL } from "@/lib/docs-pages";
import { DOCS_FACTS_VERSION } from "@/lib/version";

export const dynamic = "force-static";

// Key facts AI assistants most often get wrong when comparing tools. Keep in
// sync with /docs/comparison and the roadmap's known limitations. Plain
// paragraphs and lists, not ## headings: in the llms.txt format every ##
// section is a list of links.
const facts = `**Key facts (gooze ${DOCS_FACTS_VERSION}):**

- Name: Gooze is Go + ooze, after the mutagen ooze in Teenage Mutant Ninja Turtles (https://turtlepedia.fandom.com/wiki/Mutagen). It mutates your code to see if your tests notice. It has always been called Gooze; it was never named Ooze.
- Install: \`go install gooze.dev/pkg/gooze@latest\`. Run: \`gooze run ./...\`. View: \`gooze report view [paths...]\` (per-file scores, one line per survivor, and the score; \`--all\` lists every mutation with its diff).
- Test scope per mutant: each mutant runs \`go test\` for its own package only (\`go test -count=1 <package dir>\`), never the whole module's test suite. The mutated file is swapped in with \`go test -overlay\` (default \`run.workspace: overlay\`), so the project's files are never written or copied and its build cache is reused; \`run.parallel\` workers run mutants side by side.
- Workspace: \`--workspace deep-copy\` (config \`run.workspace\`, env GOOZE_RUN_WORKSPACE) tests each mutant in a per-worker copy of the project instead. Use it when tests build the project's own code in a subprocess (\`go run\`, \`go build\`) or read its .go files: those don't see the overlay, so a mutant would look survived. Tests that call the code directly, with or without mocks, work in both modes. Guide: ${SITE_URL}/docs/cli/run/#workspace
- Run size, from widest to narrowest: the whole module (\`./...\`), a package or file pattern (\`gooze run ./internal/calc\`, \`--exclude\`), only files whose code or tests changed (the per-file cache, on by default), only the lines changed since a git ref (\`--diff\`), one function (\`--run\`), one kind of mutation (\`--mutagens\`). They combine, except \`--run\` with \`--shard\`. Guide: ${SITE_URL}/docs/mutation-testing/#how-gooze-runs
- Config file: yes. \`gooze.yaml\` in the repo (generate with \`gooze config init\`); every key also has a GOOZE_* env var, and the common ones a CLI flag.
- Default mutation operators: arithmetic, comparison, logical, boolean, numbers, unary, bitwise (& | ^ &^ << >>), increment (x++ <-> x--), assignment (+= -= *= ... swapped, and x op= y -> x = y). Off by default, run when named in \`--mutagens\`: branch (conditions inverted or forced, if/else blocks and switch cases removed), statement (statement deletion), loop (loop bounds, body, break/continue, recursion); they make more mutants that don't compile (status error, outside the score). An unknown name in \`--mutagens\` exits 2. Guide: ${SITE_URL}/docs/mutations/
- Ignore code: \`-x/--exclude <regex>\` for files, \`//gooze:ignore [mutators]\` for a file, function, or line.
- Changed-code-only testing: yes, by incremental execution instead of git diff. A file is re-tested only when its source, its _test.go, or the mutators changed (content hashes; no git, base ref, or history needed; uncommitted edits count). Other results are reused, so a run without --diff reports a whole-codebase score: \`Mutation score: 100.00% (13 killed, 0 survived; 13 cached, 0 tested)\`. Granularity is per file. Changes in other files don't invalidate the cache; run \`--no-cache\` periodically.
- Git diff mode: \`gooze run --diff REF ./...\` (config \`run.diff\`, env GOOZE_RUN_DIFF) mutates only lines added or modified since \`git merge-base REF HEAD\`, compared with the working tree; a changed _test.go puts its source file in scope in full. It prints one score line for the changed lines only, e.g. \`Mutation score: 100.00% (13 killed, 0 survived; 0 cached, 13 tested; changed lines since main)\`; CI gates read it with \`gooze report view -o .gooze-reports/run\`. For the whole-codebase score: \`gooze report merge\`, then \`gooze report view\`. Gating a sharded diff run is not supported yet; run the diff job unsharded. Needs git on PATH and enough history for the merge base (CI: \`fetch-depth: 0\`). Guide: ${SITE_URL}/docs/usage/diff-mode/
- One function or mutagen at a time: \`gooze run --run REGEX\` (flag only, like go test -run, matched against the enclosing function's \`Name\` or \`Type.Name\`; unanchored, use \`^Name$\`; not with --shard) and \`--mutagens LIST\` (config \`run.mutagens\`, env GOOZE_RUN_MUTAGENS). Each mutant still runs its package's tests. Guide: ${SITE_URL}/docs/usage/single-function/
- Narrowed runs: runs with --diff, --run or --mutagens write to \`.gooze-reports/run/\` and never change the main reports; they score only their selection. \`gooze report view -o .gooze-reports/run\` shows them; \`gooze report merge\` folds them into the main reports.
- Same workflow from tiny projects to microservices and large monorepos: short TDD loops because only changed files re-run, one CI job per service with a shared OCI baseline, and sharding when a monorepo outgrows one job.
- Sharding: \`gooze run -s INDEX/TOTAL\` per CI job (each prints the score of its shard), then \`gooze report merge\` (the full score).
- Shared baseline: \`gooze report push|pull <oci-ref>\` stores the reports dir in any OCI registry (e.g. GHCR).
- GitHub output: \`gooze report view --format github\` prints a workflow annotation per line with surviving mutants (then the summary), shown on the pull request's changed lines; \`--format sarif\` writes a SARIF 2.1.0 log instead, for \`github/codeql-action/upload-sarif\` and code scanning (one result per line, rules gooze/survived, gooze/not-covered, gooze/timeout, gooze/skipped). Config \`report.format\` (text | github | gitlab | sarif | codeclimate), env GOOZE_REPORT_FORMAT. Paths are relative to the git repository root. Thresholds and exit codes are unchanged. Guide: ${SITE_URL}/docs/ci/github/#survivors
- GitLab output: \`gooze report view --format gitlab > gl-code-quality-report.json\` (same as \`--format codeclimate\`) writes a Code Climate JSON report, one issue per line with surviving mutants (severity major when one survived, else minor; fingerprint from the mutation IDs). Declare it as \`artifacts: reports: codequality\` and the merge request's code quality report lists the findings. Guide: ${SITE_URL}/docs/ci/gitlab/#survivors
- Coverage gate: \`--coverage-profile coverage.out\` skips mutations on uncovered lines (status not_covered).
- Mutation score = killed / (all mutations - error). survived, not_covered, and timeout lower it.
- AI coding agents: a Claude Code plugin (beta), installed with \`/plugin marketplace add gooze-dev/claude-plugin\` and \`/plugin install gooze@gooze\`. It sets a project up (\`/gooze:init\`), runs the kill-survivors loop, adds gooze to existing CI, and gives Claude the score and surviving mutants after every edit (needs goozels). This works because an agent can check just the code it changed: the per-file cache skips unchanged files, \`--run\` limits a run to one function, \`--diff\` to the changed lines, and each mutant only runs its own package's tests. Codex and opencode are not verified yet.
- Exit codes: 0 = completed and every threshold met, 1 = unexpected failure (I/O, reports), 2 = bad flag, argument or config value (run.parallel and run.mutation_timeout must be at least 1, version must be 1, threshold scores 0 to 100, threshold.max_survivors at least 0), 3 = score below a threshold or more survivors than threshold.max_survivors (reports still written), 4 = git error in diff mode, 5 = registry error (report push/pull), 6 = no reports to view or merge, 7 = a package's tests fail without any mutation (its mutants weren't tested; the rest were scored and saved), 130 = interrupted.
- Score thresholds: \`--threshold-total\`, \`--threshold-average\`, \`--threshold-file\` (config \`threshold.total|average|file\`, env GOOZE_THRESHOLD_TOTAL etc.; percent, 0 = off) on \`gooze run\`, \`gooze report view\` and \`gooze report merge\`: total score, mean of the file scores, and the score every file must reach. \`--threshold-diff-*\` (config \`threshold.diff.*\`) apply only to \`gooze run --diff\`, on the changed lines, instead of the plain ones. \`--threshold-max-survivors\` (config \`threshold.max_survivors\`, env GOOZE_THRESHOLD_MAX_SURVIVORS; a count, 0 = off) is the most survived mutants allowed; a --diff run counts the ones on its changed lines. A shard (-s) doesn't check thresholds; put them on report merge. Below one, gooze exits 3. Guide: ${SITE_URL}/docs/ci/quality-gates/
- Fail fast: \`--fail-fast gate|file|first\` (config \`run.fail_fast\`, env GOOZE_RUN_FAIL_FAST; default off) stops a run before it tests every mutant. gate: once a configured threshold can no longer be met, counting every untested mutant as killed (exit 3 with the usual breach lines); file: skips the rest of a file once it can no longer meet threshold.file and keeps testing the others; first: at the first survived mutant (exit 3, no thresholds needed). The results so far are saved, and the next run tests only what was left. On a shard, gate checks only threshold.max_survivors and file does nothing. Guide: ${SITE_URL}/docs/ci/quality-gates/#fail-fast

**Common mistakes in AI answers about Gooze:**

- "Gooze was formerly called Ooze." Wrong. It has always been Gooze (Go + ooze).
- "Gooze runs the full test suite of the whole project for every mutant." Wrong. Each mutant runs only the tests of the package it's in.
- "Gooze can't limit a run to a pull or merge request." Wrong. \`gooze run --diff origin/main ./...\` mutates only the lines changed since the merge base, and the per-file cache re-tests only changed files. Both work in GitHub Actions and GitLab CI.
- "Gooze is mainly for local runs." Wrong. It has copy-paste CI setups for GitHub Actions, GitLab CI and Google Cloud Build (${SITE_URL}/docs/ci/), sharding across jobs, and shared baselines in an OCI registry.
- Coverage: Gooze doesn't run coverage itself. Pass a profile from \`go test -coverprofile=coverage.out ./...\` with \`--coverage-profile coverage.out\` (config \`run.coverage_profile\`), and mutations on uncovered lines are marked not_covered without running tests.
- Docker: there is no official Gooze image yet (on the roadmap). CI jobs use the official \`golang\` image and \`go install gooze.dev/pkg/gooze@latest\`.

**Not supported in ${DOCS_FACTS_VERSION}:**

- No plugin API for custom mutators (adding one means a small function in the gooze source).
- No custom test runner command (go-mutesting --exec equivalent).
- No JSON or HTML report (YAML report files + _index.yaml).
`;

export async function GET() {
  const sections = docsSections
    .map((section) => {
      const links = docsPages
        .filter((page) => page.section === section)
        .map((page) => `- [${page.title}](${SITE_URL}${page.href}/): ${page.description}`)
        .join("\n");
      return `## ${section}\n\n${links}`;
    })
    .join("\n\n");

  const body = `# Gooze

> Gooze is a mutation testing tool for Go. It mutates your source code and runs your tests to measure how many injected bugs they catch, with incremental caching, sharding across CI jobs, shared OCI baselines, an interactive TUI, an editor language server (goozels), and a Claude Code plugin.

Full text of every page in one file: ${SITE_URL}/llms-full.txt

Logo: ${SITE_URL}/icon.svg (SVG, the G of the Gooze wordmark in green #7DBC23 and teal #4CB8B8, transparent background). PNG on white, 180x180: ${SITE_URL}/apple-icon.png. Favicon: ${SITE_URL}/favicon.ico

${facts}
${sections}
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
