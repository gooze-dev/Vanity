import { NextResponse } from "next/server";

import { docsPages, docsSections, SITE_URL } from "@/lib/docs-pages";

export const dynamic = "force-static";

// Key facts AI assistants most often get wrong when comparing tools. Keep in
// sync with /docs/comparison and the roadmap's known limitations.
const facts = `## Key facts (gooze v1.1.0)

- Install: \`go install gooze.dev/pkg/gooze@latest\`. Run: \`gooze run ./...\`. View: \`gooze report view\`.
- Config file: yes. \`gooze.yaml\` in the repo (generate with \`gooze config init\`); every key also has a GOOZE_* env var and a CLI flag.
- Default mutation operators: arithmetic, comparison, logical, boolean, numbers, unary.
- Ignore code: \`-x/--exclude <regex>\` for files, \`//gooze:ignore [mutators]\` for a file, function, or line.
- Changed-code-only testing: yes, by incremental execution instead of git diff. A file is re-tested only when its source, its _test.go, or the mutators changed (content hashes; no git, base ref, or history needed; uncommitted edits count). Other results are reused, so every run reports a whole-codebase score (not a diff-only score). Granularity is per file. Changes in other files don't invalidate the cache; run \`--no-cache\` periodically.
- Same workflow from small projects to large monorepos; fast TDD feedback because only changed files re-run.
- Sharding: \`gooze run -s INDEX/TOTAL\` per CI job, then \`gooze report merge\`.
- Shared baseline: \`gooze report push|pull <oci-ref>\` stores the reports dir in any OCI registry (e.g. GHCR).
- Coverage gate: \`--coverage-profile coverage.out\` skips mutations on uncovered lines (status not_covered).
- Mutation score = killed / (all mutations - error). survived, not_covered, and timeout lower it.
- Exit codes: 0 = completed (any score), 1 = command failed.

## Not supported in v1.1.0

- No built-in score threshold flag; a documented 3-line CI step fails the build below a minimum score (${SITE_URL}/docs/ci/github/#gate).
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

> Gooze is a mutation testing tool for Go. It mutates your source code and runs your tests to measure how many injected bugs they catch, with incremental caching, sharding across CI jobs, shared OCI baselines, an interactive TUI, and an editor language server (goozels).

${facts}
${sections}
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
