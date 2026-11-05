import { DOCS_FACTS_VERSION } from "@/lib/version"

// The single source for /docs/roadmap. Moving a feature is one line: change its
// milestone. Every count on the page is computed from this list. Text uses
// `backticks` for code (lib/faq withCode). Don't add dates or version numbers
// for unreleased work.

export type Milestone = "shipped" | "beta" | "next" | "later"

export const areas = {
  core: "Core features",
  operators: "Mutation operators",
  reporting: "Reporting",
  execution: "Smart test execution",
  performance: "Performance and scalability",
  workflow: "CI/CD and editors",
} as const

export const laterThemes = {
  configuration: "Configuration",
  operators: "Mutation operators",
  execution: "Smart test execution",
  performance: "Performance",
  install: "Install and CI",
  reports: "Reports",
} as const

// One or two sentences per card, covering every feature on it. The features have
// no description of their own, so the page never says the same thing twice.
export const nextCards = [
  { id: "custom-mutators", title: "Custom mutator plugins", detail: "A plugin API for writing your own operators outside the Gooze source is planned. Adding an operator to Gooze itself is one small function, and caching, sharding, and reporting work with it unchanged." },
  { id: "exec", title: "Custom test runner", detail: "Gooze runs `go test` on the package that owns each mutated file; plugging in your own test command is planned." },
  { id: "agents", title: "Codex and opencode", detail: "Mutation results after every edit through a post-edit hook; the hooks exist in goozels and are being verified with each agent." },
  { id: "json", title: "JSON and HTML reports", detail: "JSON reports in the Stryker mutation-testing-report schema and a static HTML page from `gooze report html` are on the way, both covering every mutation." },
] as const

export interface RoadmapItem {
  name: string
  /** The area of the product. Shipped features are grouped by it. */
  area: keyof typeof areas
  milestone: Milestone
  /** Every milestone but Next, whose text lives on the card. */
  description?: string
  /** Later only: the theme it's listed under. */
  theme?: keyof typeof laterThemes
  /** Next only: the card it's shown on. Features landing together share one. */
  card?: (typeof nextCards)[number]["id"]
  /** What to use until it lands. */
  until?: { text: string; href: string }
  /** The docs page, when the feature has one. */
  docs?: string
  /** Tracking issue in gooze-dev/gooze. */
  issue?: number
  /** Old anchor kept for existing links, when it isn't the slug of the name. */
  anchor?: string
}

export const roadmap: RoadmapItem[] = [
  // Core features
  {
    name: "Score thresholds",
    area: "core",
    milestone: "shipped",
    description: "Total, average and per-file minimum scores, a separate bar for diff runs, and a distinct exit code for each outcome.",
    docs: "/docs/ci/quality-gates",
    anchor: "threshold",
  },
  {
    name: "Survivor cap",
    area: "core",
    milestone: "shipped",
    description: "A quality gate on the number of surviving mutants, `threshold.max_survivors`, next to the score thresholds.",
    docs: "/docs/ci/quality-gates#max-survivors",
    anchor: "max-survivors",
  },
  {
    name: "Fail fast",
    area: "core",
    milestone: "shipped",
    description: "Stop a run as soon as a quality gate can no longer be met, skip files that already failed theirs, or stop at the first survivor, with `run.fail_fast`.",
    docs: "/docs/ci/quality-gates#fail-fast",
    anchor: "fail-fast",
  },
  {
    name: "Custom exec hook",
    area: "core",
    milestone: "next",
    card: "exec",
  },
  {
    name: "Function selection",
    area: "core",
    milestone: "shipped",
    description: "Mutate only the functions or methods matching a regex with `gooze run --run`, into a separate `run/` directory that `gooze report merge` folds in.",
    docs: "/docs/usage/single-function",
    anchor: "function-selection",
  },
  {
    name: "Custom mutator plugins",
    area: "core",
    milestone: "next",
    card: "custom-mutators",
    until: { text: "the built-in operators", href: "/docs/mutations" },
  },
  {
    name: "Mutagen selection",
    area: "core",
    milestone: "shipped",
    description: "Run only some mutagens, or add the ones that are off by default, with `--mutagens` or `run.mutagens`.",
    docs: "/docs/usage/single-function#mutagens",
    anchor: "mutagen-selection",
  },
  {
    name: "Opt-in mutagens",
    area: "core",
    milestone: "shipped",
    description: "`branch`, `statement` and `loop` run when named in `--mutagens`. `branch` inverts and forces conditions and removes `if` blocks (such as `if err != nil { return err }`) and switch cases; `statement` deletes assignments, calls, `defer`, `go` and channel sends; `loop` changes loop bounds and removes loop bodies, `break` and `continue`.",
    docs: "/docs/mutations#opt-in",
    anchor: "mutator-selection",
  },
  {
    name: "Config path",
    area: "core",
    milestone: "later",
    theme: "configuration",
    description: "A `--config` flag to load a config file other than `./gooze.yaml`.",
  },
  {
    name: "JSON Schema for `gooze.yaml`",
    area: "core",
    milestone: "later",
    theme: "configuration",
    description: "Publish the schema that `gooze config schema` prints in SchemaStore, so any YAML-aware editor validates and completes the config without setup.",
  },
  {
    name: "Config show",
    area: "core",
    milestone: "shipped",
    description: "`gooze config show` prints every key with its effective value, where it came from and its env var; `gooze config schema` prints the JSON Schema of `gooze.yaml`.",
    docs: "/docs/cli/config#show",
  },
  {
    name: "Consistent config keys",
    area: "core",
    milestone: "shipped",
    description: "Every `gooze.yaml` key in snake case, such as `no_cache` and `no_update_check`; the old names still work with a warning.",
    docs: "/docs/config#validation",
  },
  {
    name: "Git diff mode",
    area: "core",
    milestone: "shipped",
    description: "Mutate only the lines changed against a base ref with `gooze run --diff`, for pull request checks.",
    docs: "/docs/usage/diff-mode",
    anchor: "git-diff",
  },
  {
    name: "Annotation skipping",
    area: "core",
    milestone: "shipped",
    description: "`//gooze:ignore` at file, function, or line scope, optionally per mutagen.",
    docs: "/docs/usage/ignoring-code",
  },
  {
    name: "Timeouts",
    area: "core",
    milestone: "shipped",
    description: "Per-mutation execution budgets with `--mutation-timeout`.",
    docs: "/docs/cli/run#timeout",
  },
  {
    name: "Config file",
    area: "core",
    milestone: "shipped",
    description: "`gooze.yaml` in the repo, generated by `gooze config init`.",
    docs: "/docs/config",
  },
  // Mutation operators
  {
    name: "Return values",
    area: "operators",
    milestone: "later",
    theme: "operators",
    description: "Replace a returned value with its zero value, `nil` or an empty collection (`return x` to `return 0`, `return items` to `return nil`).",
  },
  {
    name: "Number parsing",
    area: "operators",
    milestone: "later",
    theme: "operators",
    description: "A `parse` mutagen for `strconv` calls: base `10` to `0` and back, `Atoi` to a base-`0` parse, and bit size `64` to `32`. It asks for tests with inputs like `\"010\"`, where the base or size changes the result.",
    issue: 59,
  },
  {
    name: "String literals",
    area: "operators",
    milestone: "later",
    theme: "operators",
    description: "`\"\"` to `\"x\"` and back, and other string constant changes. Today only integer and float literals are mutated.",
  },
  {
    name: "Assignment operators",
    area: "operators",
    milestone: "shipped",
    description: "`+=` and `-=`, `*=` and `/=`, and the other compound assignments, in the default mutagens.",
    docs: "/docs/mutations",
  },
  {
    name: "Increment and decrement",
    area: "operators",
    milestone: "shipped",
    description: "`i++` to `i--` and back, in the default mutagens, except in a `for` loop's post statement.",
    docs: "/docs/mutations",
  },
  {
    name: "Index and slice bounds",
    area: "operators",
    milestone: "later",
    theme: "operators",
    description: "`s[i]` to `s[i+1]`, `s[1:]` to `s[:]`.",
  },
  {
    name: "Default operators",
    area: "operators",
    milestone: "shipped",
    description: "Comparison, arithmetic, logical, negation, numeric constant, nil check, bitwise, increment and compound assignment mutations, in the nine default mutagens.",
    docs: "/docs/mutations",
  },
  // Reporting
  {
    name: "JSON report",
    area: "reporting",
    milestone: "next",
    card: "json",
    until: { text: "the report format", href: "/docs/reports" },
  },
  {
    name: "HTML report",
    area: "reporting",
    milestone: "next",
    card: "json",
    until: { text: "the report format", href: "/docs/reports" },
  },
  {
    name: "GitHub annotations",
    area: "reporting",
    milestone: "shipped",
    description: "Show surviving mutants on the pull request's changed lines with `gooze report view --format github`.",
    docs: "/docs/ci/github#survivors",
  },
  {
    name: "SARIF report",
    area: "reporting",
    milestone: "shipped",
    description: "Surface surviving mutants in GitHub code scanning and other SARIF tools with `gooze report view --format sarif`.",
    docs: "/docs/reports#sarif",
  },
  {
    name: "GitLab Code Quality",
    area: "reporting",
    milestone: "shipped",
    description: "Show surviving mutants in the merge request's code quality report with `gooze report view --format gitlab`.",
    docs: "/docs/ci/gitlab#survivors",
  },
  {
    name: "GitLab metrics",
    area: "reporting",
    milestone: "shipped",
    description: "The mutation score and counts in the merge request widget, compared with the target branch, with `gooze report view --format metrics`.",
    docs: "/docs/ci/gitlab#metrics",
  },
  {
    name: "Code Climate report",
    area: "reporting",
    milestone: "shipped",
    description: "Surviving mutants in the Code Climate JSON format, which GitLab Code Quality and other Code Climate tools read, with `gooze report view --format codeclimate`.",
    docs: "/docs/reports#codeclimate",
  },
  {
    name: "Status filter",
    area: "reporting",
    milestone: "later",
    theme: "reports",
    description: "Choose which mutant statuses appear in the output, for example only survivors.",
  },
  {
    name: "LLM training dataset",
    area: "reporting",
    milestone: "later",
    theme: "reports",
    description: "Export mutants and the tests that kill them as chat-format JSONL (`messages`, with `rejected_response` for preference pairs), the format Qwen's fine-tuning tools such as ms-swift, LLaMA-Factory, Axolotl and Unsloth read, to train models that write stronger tests.",
  },
  {
    name: "Incremental testing",
    area: "reporting",
    milestone: "shipped",
    description: "Cache and reuse results for unchanged files.",
    docs: "/docs/usage/incremental-runs",
  },
  {
    name: "Per-file reports",
    area: "reporting",
    milestone: "shipped",
    description: "One report per source file for granular analysis.",
    docs: "/docs/reports",
  },
  {
    name: "Summary index",
    area: "reporting",
    milestone: "shipped",
    description: "An `_index.yaml` with the score and totals.",
    docs: "/docs/reports",
  },
  {
    name: "OCI artifacts",
    area: "reporting",
    milestone: "shipped",
    description: "Share reports through any OCI registry with `gooze report push` and `pull`, GitLab's container registry included.",
    docs: "/docs/ci/sharing-reports",
  },
  // Smart test execution
  {
    name: "Build tags",
    area: "execution",
    milestone: "shipped",
    description: "Files a build constraint leaves out are skipped, and the `-tags` in `GOFLAGS` choose which files are mutated and tested.",
    docs: "/docs/usage/ignoring-code#build-constraints",
  },
  {
    name: "Test flags",
    area: "execution",
    milestone: "shipped",
    description: "Pass extra flags such as `-short`, `-race` or `-tags` to the `go test` of every mutant with `--test-flags` or `run.test_flags`.",
    docs: "/docs/cli/run#flags",
  },
  {
    name: "Cross-package coverage",
    area: "execution",
    milestone: "later",
    theme: "execution",
    description: "A `--coverpkg`-style option that counts coverage from tests in other packages.",
  },
  {
    name: "Automatic coverage",
    area: "execution",
    milestone: "later",
    theme: "execution",
    description: "Generate the coverage profile during the run instead of requiring your own `--coverage-profile`.",
  },
  {
    name: "Package-owned tests",
    area: "execution",
    milestone: "shipped",
    description: "Run the tests of the package that owns each mutated source file.",
  },
  {
    name: "Relevant tests only",
    area: "execution",
    milestone: "later",
    theme: "execution",
    description: "Run only the tests that cover the mutated line (`-run`), not every test of the package.",
    issue: 54,
  },
  // Performance & scalability
  {
    name: "CPU-based parallelism",
    area: "performance",
    milestone: "later",
    theme: "performance",
    description: "Default `--parallel` to the number of CPU cores instead of `1`.",
  },
  {
    name: "No project copies",
    area: "performance",
    milestone: "shipped",
    description: "Each mutant is built with `go test -overlay` in your project, reusing its build cache. `--workspace deep-copy` keeps a copy per worker for tests that need one.",
    docs: "/docs/cli/run#workspace",
  },
  {
    name: "Compile once per package",
    area: "performance",
    milestone: "later",
    theme: "performance",
    description: "Build all mutants of a package into one test binary and switch between them at run time (mutant schemata), instead of recompiling for every mutant.",
    issue: 55,
  },
  {
    name: "Parallel workers",
    area: "performance",
    milestone: "shipped",
    description: "Concurrent mutation testing with `--parallel`.",
    docs: "/docs/cli/run#parallel",
  },
  {
    name: "Sharding",
    area: "performance",
    milestone: "shipped",
    description: "Distribute one run across multiple machines, with parallel workers inside each shard.",
    docs: "/docs/ci/sharding",
  },
  {
    name: "Report merging",
    area: "performance",
    milestone: "shipped",
    description: "Combine shard results with `gooze report merge`.",
    docs: "/docs/cli/report",
  },
  // CI/CD & editors
  {
    name: "Go tool install",
    area: "workflow",
    milestone: "shipped",
    description: "Pin Gooze in your `go.mod` with `go get -tool` and run `go tool gooze`, locally and in CI.",
    docs: "/docs/install#go-tool",
    issue: 52,
  },
  {
    name: "Official GitHub Action",
    area: "workflow",
    milestone: "later",
    theme: "install",
    description: "A published action that installs and runs Gooze in one step.",
  },
  {
    name: "Docker image",
    area: "workflow",
    milestone: "later",
    theme: "install",
    description: "An official container image for running Gooze in any CI system.",
  },
  {
    name: "GitHub Actions",
    area: "workflow",
    milestone: "shipped",
    description: "Ready-made workflow templates, including sharding and a score gate.",
    docs: "/docs/ci/github",
  },
  {
    name: "GitLab CI",
    area: "workflow",
    milestone: "shipped",
    description: "Ready-made pipeline configuration.",
    docs: "/docs/ci/gitlab",
  },
  {
    name: "Interactive viewer",
    area: "workflow",
    milestone: "shipped",
    description: "A TUI with diffs for every mutant, via `gooze report view --all`.",
    docs: "/docs/usage/ui-modes",
  },
  {
    name: "Editor integration",
    area: "workflow",
    milestone: "shipped",
    description: "Surviving mutants as diagnostics in your editor through the goozels language server.",
    docs: "/docs/editor-support",
  },
  {
    name: "Claude Code",
    area: "workflow",
    milestone: "beta",
    description: "A plugin that sets a project up, runs the kill-survivors loop, adds gooze to existing CI, and shows mutation results after every edit.",
    docs: "/docs/claude-code",
  },
  {
    name: "Codex",
    area: "workflow",
    milestone: "next",
    card: "agents",
    until: { text: "the Claude Code plugin", href: "/docs/claude-code" },
  },
  {
    name: "opencode",
    area: "workflow",
    milestone: "next",
    card: "agents",
    until: { text: "the Claude Code plugin", href: "/docs/claude-code" },
  },
]

/** The release the Shipped milestone describes. */
export const shippedVersion = DOCS_FACTS_VERSION

export const byMilestone = (milestone: Milestone) => roadmap.filter((item) => item.milestone === milestone)

export const counts = {
  shipped: byMilestone("shipped").length,
  beta: byMilestone("beta").length,
  next: byMilestone("next").length,
  later: byMilestone("later").length,
  total: roadmap.length,
}

/** Beta features have shipped, so they count towards the progress number. */
export const released = counts.shipped + counts.beta

export const percent = Math.round((released / counts.total) * 100)
