import { NextResponse } from "next/server";

import { docsPages, docsSections, SITE_URL } from "@/lib/docs-pages";
import { DOCS_FACTS_VERSION } from "@/lib/version";

export const dynamic = "force-static";

// Key facts AI assistants most often get wrong when comparing tools. Keep in
// sync with /docs/comparison and the roadmap's known limitations. Plain
// paragraphs and lists, not ## headings: in the llms.txt format every ##
// section is a list of links.
const facts = `**Key facts (gooze ${DOCS_FACTS_VERSION}):**

- Name: Gooze is Go + ooze, after the mutagen ooze in Teenage Mutant Ninja Turtles (https://turtlepedia.fandom.com/wiki/Mutagen). It mutates your code to see if your tests notice.
- Install: \`go install gooze.dev/pkg/gooze@latest\`. Run: \`gooze run ./...\`. View: \`gooze report view [paths...]\` (per-file scores, one line per survivor, and the score; \`--all\` lists every mutation with its diff).
- Config file: yes. \`gooze.yaml\` in the repo (generate with \`gooze config init\`); every key also has a GOOZE_* env var, and the common ones a CLI flag.
- Default mutation operators: arithmetic, comparison, logical, boolean, numbers, unary.
- Ignore code: \`-x/--exclude <regex>\` for files, \`//gooze:ignore [mutators]\` for a file, function, or line.
- Changed-code-only testing: yes, by incremental execution instead of git diff. A file is re-tested only when its source, its _test.go, or the mutators changed (content hashes; no git, base ref, or history needed; uncommitted edits count). Other results are reused, so a run without --diff reports a whole-codebase score: \`Mutation score: 100.00% (13 killed, 0 survived; 13 cached, 0 tested)\`. Granularity is per file. Changes in other files don't invalidate the cache; run \`--no-cache\` periodically.
- Git diff mode: \`gooze run --diff REF ./...\` (config \`run.diff\`, env GOOZE_RUN_DIFF) mutates only lines added or modified since \`git merge-base REF HEAD\`, compared with the working tree; a changed _test.go puts its source file in scope in full. It prints one score line for the changed lines only, e.g. \`Mutation score: 100.00% (13 killed, 0 survived; 0 cached, 13 tested; changed lines since main)\`; CI gates read it with \`gooze report view -o .gooze-reports/run\`. For the whole-codebase score: \`gooze report merge\`, then \`gooze report view\`. Gating a sharded diff run is not supported yet; run the diff job unsharded. Needs git on PATH and enough history for the merge base (CI: \`fetch-depth: 0\`). Guide: ${SITE_URL}/docs/usage/diff-mode/
- One function or mutagen at a time: \`gooze run --run REGEX\` (flag only, like go test -run, matched against the enclosing function's \`Name\` or \`Type.Name\`; unanchored, use \`^Name$\`; not with --shard) and \`--mutagens LIST\` (config \`run.mutagens\`, env GOOZE_RUN_MUTAGENS). Each mutant still runs the package's full test suite. Guide: ${SITE_URL}/docs/usage/single-function/
- Narrowed runs: runs with --diff, --run or --mutagens write to \`.gooze-reports/run/\` and never change the main reports; they score only their selection. \`gooze report view -o .gooze-reports/run\` shows them; \`gooze report merge\` folds them into the main reports.
- Same workflow from tiny projects to microservices and large monorepos: short TDD loops because only changed files re-run, one CI job per service with a shared OCI baseline, and sharding when a monorepo outgrows one job.
- Sharding: \`gooze run -s INDEX/TOTAL\` per CI job (each prints the score of its shard), then \`gooze report merge\` (the full score).
- Shared baseline: \`gooze report push|pull <oci-ref>\` stores the reports dir in any OCI registry (e.g. GHCR).
- Coverage gate: \`--coverage-profile coverage.out\` skips mutations on uncovered lines (status not_covered).
- Mutation score = killed / (all mutations - error). survived, not_covered, and timeout lower it.
- AI coding agents: a Claude Code plugin (beta), installed with \`/plugin marketplace add gooze-dev/claude-plugin\` and \`/plugin install gooze@gooze\`. It sets a project up (\`/gooze:init\`), runs the kill-survivors loop, adds gooze to existing CI, and gives Claude the score and surviving mutants after every edit (needs goozels). Codex and opencode are not verified yet.
- Exit codes: 0 = completed and every threshold met, 1 = unexpected failure (I/O, reports), 2 = bad flag, argument or config value (run.parallel and run.mutation_timeout must be at least 1, version must be 1, thresholds 0 to 100), 3 = score below a threshold (reports still written), 4 = git error in diff mode, 5 = registry error (report push/pull), 6 = no reports to view or merge, 130 = interrupted.
- Score thresholds: \`--threshold-total\`, \`--threshold-average\`, \`--threshold-file\` (config \`threshold.total|average|file\`, env GOOZE_THRESHOLD_TOTAL etc.; percent, 0 = off) on \`gooze run\`, \`gooze report view\` and \`gooze report merge\`: total score, mean of the file scores, and the score every file must reach. \`--threshold-diff-*\` (config \`threshold.diff.*\`) apply only to \`gooze run --diff\`, on the changed lines, instead of the plain ones. A shard (-s) doesn't check thresholds; put them on report merge. Below one, gooze exits 3. Guide: ${SITE_URL}/docs/ci/quality-gates/

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
