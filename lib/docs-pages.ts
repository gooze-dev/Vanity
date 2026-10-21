// Single source of truth for the documentation pages.
//
// Powers: the sidebar nav, breadcrumbs, prev/next pager, client-side search,
// per-page <title>/<meta description> (SEO), the sitemap, and breadcrumb
// structured data. Array order is reading order: it drives the sidebar and
// the pager.
//
// Grouping follows the user's journey; see .claude/rules/docs-structure.md. Each page has one job (a task, a concept, or
// reference facts); link to the canonical page instead of repeating content.

export const SITE_URL = "https://gooze.dev"

export const docsSections = [
  "Get started",
  "Guides",
  "CI/CD",
  "Editors & agents",
  "Reference",
  "Compare",
  "Help",
] as const

export type DocsSection = (typeof docsSections)[number]

export interface DocsPage {
  /** Route path, no trailing slash (e.g. "/docs/cli/run"). */
  href: string
  /** Page heading, used for the H1, sidebar/breadcrumb label, and search. */
  title: string
  /**
   * SEO <title>/OpenGraph title. Overrides the default `${title} · Gooze docs`
   * when a page wants keyword-tuned meta separate from its short nav heading.
   */
  seoTitle?: string
  /** Shorter label for the sidebar and breadcrumbs; defaults to title. */
  navTitle?: string
  /** Sidebar group the page belongs to. */
  section: DocsSection
  /** href of the page this one nests under in the sidebar (CLI subcommands). */
  parent?: string
  /** One-line summary used for search results and the meta description. */
  description: string
  /** Extra terms that should match in search but may not appear in the title. */
  keywords: string[]
}

export const docsPages: DocsPage[] = [
  {
    href: "/docs",
    title: "Documentation overview",
    seoTitle:
      "Gooze Documentation: Go Mutation Testing Framework",
    navTitle: "Overview",
    section: "Get started",
    description:
      "Official documentation for Gooze, an AST-based mutation testing tool for Go. Run it locally and in CI to measure test suite quality beyond code coverage.",
    keywords: ["gooze documentation","getting started","golang mutation testing","test suite quality","ast mutation","docs overview"],
  },
  {
    href: "/docs/install",
    title: "Installation",
    seoTitle:
      "Install the Gooze CLI · Gooze docs",
    section: "Get started",
    description:
      "Install Gooze with go install or a prebuilt release binary, then verify the installation and start measuring how well your Go tests catch bugs.",
    keywords: ["install gooze","download cli","prebuilt binaries","go install","setup framework","go module"],
  },
  {
    href: "/docs/quick-start",
    title: "Quick start",
    seoTitle:
      "Quick Start Guide for Go Mutation Testing · Gooze",
    section: "Get started",
    description:
      "Run your first Go mutation test in under 5 minutes: start a run, read your first mutation score, and find the code your tests don't really check.",
    keywords: ["quick start","tutorial","first mutation run","calculate score","go testing guide","beginner setup"],
  },
  {
    href: "/docs/mutation-testing",
    title: "Mutation testing basics",
    seoTitle:
      "What is Mutation Testing? Concepts Explained · Gooze",
    section: "Get started",
    description:
      "How mutation testing works, and why counting killed and survived mutants finds gaps in your tests that code coverage misses.",
    keywords: ["mutation testing concepts","what is mutation score","killed mutants","survived mutants","code coverage vs mutation","software reliability"],
  },
  {
    href: "/docs/usage/results",
    title: "Reading results",
    seoTitle:
      "Interpreting Statuses: Killed, Survived, Timeout · Gooze",
    section: "Guides",
    description:
      "What each Gooze status means (killed, survived, not_covered, timeout, error) and how to use the results to improve your mutation score.",
    keywords: ["test statuses","killed mutant","survived mutant","not_covered","timeout error","interpret score","fix gaps"],
  },
  {
    href: "/docs/usage/incremental-runs",
    title: "Incremental runs",
    seoTitle:
      "Re-test Only Changed Files with Incremental Runs · Gooze",
    section: "Guides",
    description:
      "Re-test only what changed. Gooze caches results per file by content hash and scores cached and tested results together, cutting CI time for large Go apps.",
    keywords: ["incremental testing","fast ci","cache results","git diff","modified code","no-cache flag","cached score"],
  },
  {
    href: "/docs/usage/diff-mode",
    title: "Changed lines only (git diff mode)",
    seoTitle:
      "Mutate Only Changed Lines with Git Diff Mode · Gooze",
    navTitle: "Git diff mode",
    section: "Guides",
    description:
      "Mutate only the Go lines a branch or pull request changed with gooze run --diff, gate CI on the score of the change, and keep a full run on main.",
    keywords: ["git diff","diff mode","changed lines","pull request","merge base","base branch","--diff","run.diff","fetch-depth"],
  },
  {
    href: "/docs/usage/ignoring-code",
    title: "Ignoring code",
    seoTitle:
      "Ignore Files, Functions and Lines · Gooze docs",
    section: "Guides",
    description:
      "Skip specific Go files, functions or lines during mutation testing with the -x flag and //gooze:ignore directives.",
    keywords: ["ignore files","skip functions","selective testing","exclude blocks","-x flag","gooze:ignore syntax"],
  },
  {
    href: "/docs/usage/ui-modes",
    title: "UI modes",
    seoTitle:
      "Output Modes: TUI vs Plain Text · Gooze docs",
    section: "Guides",
    description:
      "Gooze picks its output by TTY detection: the interactive terminal UI in a terminal, plain text logs in CI or when output is piped or redirected.",
    keywords: ["terminal ui","tui interface","plain text logs","stdout","tty detection","environment output"],
  },
  {
    href: "/docs/ci/github",
    title: "GitHub Actions",
    seoTitle:
      "GitHub Actions for Go Mutation Testing · Gooze",
    section: "CI/CD",
    description:
      "Run Gooze in GitHub Actions: shard Go mutation testing across jobs, cache results between runs, and fail pull requests below a minimum mutation score.",
    keywords: ["github actions","ci/cd","go mutation testing","pipeline","pull request","quality gate","threshold","shard","caching"],
  },
  {
    href: "/docs/ci/gitlab",
    title: "GitLab CI",
    seoTitle:
      "GitLab CI for Go Mutation Testing · Gooze",
    section: "CI/CD",
    description:
      "Run Gooze in GitLab CI pipelines: shard across parallel jobs and fail the pipeline below a minimum mutation score, so weak Go tests don't get merged.",
    keywords: ["gitlab ci","pipeline","parallel jobs","sharding","quality gate","minimum score","go testing"],
  },
  {
    href: "/docs/ci/cloud-build",
    title: "Google Cloud Build",
    navTitle: "Cloud Build",
    seoTitle:
      "Google Cloud Build for Go Mutation Testing · Gooze",
    section: "CI/CD",
    description:
      "Run Gooze in Google Cloud Build: add it to cloudbuild.yaml, keep a report baseline in Artifact Registry so pull requests re-test only changed files, and gate on a minimum mutation score.",
    keywords: ["google cloud build","cloudbuild.yaml","artifact registry","gcp","pipeline","pull request","quality gate","incremental cache","go mutation testing"],
  },
  {
    href: "/docs/ci/sharding",
    title: "Sharding and merging",
    seoTitle:
      "Sharding & Merging Mutation Tests · Gooze",
    section: "CI/CD",
    description:
      "Split Go mutation tests across parallel CI jobs with -s INDEX/TOTAL, then combine the shard reports into one score with gooze report merge.",
    keywords: ["test sharding","parallel execution","merge reports","split jobs","CI optimization","golang testing"],
  },
  {
    href: "/docs/ci/sharing-reports",
    title: "Report artifacts",
    seoTitle:
      "Mutation Report Artifacts in OCI Registries · Gooze",
    section: "CI/CD",
    description:
      "Share Gooze mutation reports through an OCI registry like GHCR, so CI and teammates start from one baseline. What OCI is, tags, digests, and why a registry.",
    keywords: ["oci registry","oci artifact","ghcr","gitlab container registry","push reports","pull reports","test baseline","ci artifacts","authentication","oras"],
  },
  {
    href: "/docs/editor-support",
    title: "Editor support (goozels)",
    seoTitle:
      "IDE & Editor Support via LSP (goozels) · Gooze",
    navTitle: "Editor support",
    section: "Editors & agents",
    description:
      "Mutation testing results in your editor and AI coding agents: the goozels language server for VS Code, Neovim and more, plus goozels check for agents.",
    keywords: ["editor support","goozels lsp","language server protocol","vscode extension","neovim integration","inline results","goozels check","claude code","claude plugin","codex","opencode","ai coding agents"],
  },
  {
    href: "/docs/claude-code",
    title: "Claude Code",
    seoTitle:
      "Go Mutation Testing in Claude Code (gooze plugin) · Gooze",
    section: "Editors & agents",
    description:
      "Install the gooze plugin for Claude Code: project setup with /gooze:init, the kill-survivors loop, CI setup, and mutation results after every edit.",
    keywords: ["claude code","claude plugin","ai coding agent","vibe coding","/gooze:init","mutation testing skill","post-edit hook","code review","ci setup"],
  },
  {
    href: "/docs/cli",
    title: "CLI reference",
    seoTitle:
      "CLI Command Reference · Gooze",
    section: "Reference",
    description:
      "Complete CLI reference for Gooze: every command, the global flags, and the exit codes for running Go mutation tests, viewing reports and generating config.",
    keywords: ["cli commands","terminal flags","exit codes","usage reference","gooze run","gooze report"],
  },
  {
    href: "/docs/cli/run",
    title: "gooze run",
    seoTitle:
      "Run Mutation Tests (gooze run) · Gooze",
    section: "Reference",
    parent: "/docs/cli",
    description:
      "Run Go mutation testing with gooze run: flags for parallelism, sharding, timeouts, the --estimate cache preview, and the --coverage-profile gate.",
    keywords: ["gooze run","execute tests","parallelism","timeout control","coverage-profile","unkilled mutants","estimate"],
  },
  {
    href: "/docs/cli/report",
    title: "gooze report",
    seoTitle:
      "Manage Mutation Reports (gooze report) · Gooze",
    section: "Reference",
    parent: "/docs/cli",
    description:
      "Work with Gooze mutation reports: view per-file scores and survivors, browse every mutant in the TUI, merge sharded runs, and push or pull OCI artifacts.",
    keywords: ["report view","survivors","per-file score","tui","oci artifacts","merge shards","report push","test results","golang mutation score"],
  },
  {
    href: "/docs/cli/config",
    title: "gooze config",
    seoTitle:
      "Gooze CLI Configuration (gooze config) · Gooze",
    section: "Reference",
    parent: "/docs/cli",
    description:
      "Manage Gooze mutation testing configuration from the CLI. The gooze config init command writes a starter gooze.yaml file.",
    keywords: ["gooze config","cli configuration","gooze.yaml","settings scaffold","test generation","golang config"],
  },
  {
    href: "/docs/cli/version",
    title: "gooze version",
    seoTitle:
      "Gooze Version Info (gooze version)",
    section: "Reference",
    parent: "/docs/cli",
    description:
      "Show the installed Gooze CLI version and the Go toolchain it was built with. Include it in bug reports and use it to pin the version in CI/CD.",
    keywords: ["gooze version","release build","go version","pin dependency","ci environment"],
  },
  {
    href: "/docs/config",
    title: "Configuration (gooze.yaml)",
    seoTitle:
      "Configuration Syntax & Rules (gooze.yaml) · Gooze",
    navTitle: "Configuration",
    section: "Reference",
    description:
      "Configure Gooze with the gooze.yaml file, GOOZE_* environment variables, and CLI flags: every key, its default and bounds, and which source takes precedence.",
    keywords: ["gooze.yaml","configuration syntax","environment variables","settings precedence","coverage_profile definition"],
  },
  {
    href: "/docs/reports",
    title: "Report format",
    seoTitle:
      "Understanding Output Report Formats · Gooze",
    section: "Reference",
    description:
      "The layout of the Gooze reports directory, the _index.yaml summary, and the YAML result files, and how to read them from your own tooling.",
    keywords: ["report format","_index.yaml","structured output","result schemas","custom tooling","test data extraction"],
  },
  {
    href: "/docs/mutations",
    title: "Mutation operators",
    seoTitle:
      "Supported Go Mutation Operators · Gooze docs",
    section: "Reference",
    description:
      "The full list of AST mutation operators Gooze applies, with examples of arithmetic, comparison, logical, boolean, numbers, and unary mutations in Go code.",
    keywords: ["mutation operators","ast mutagens","logical mutations","arithmetic swaps","boolean flip","mutation examples"],
  },
  {
    href: "/docs/comparison",
    title: "Gooze vs Gremlins vs go-mutesting vs go-mutants",
    seoTitle:
      "Gooze vs Gremlins vs go-mutesting vs go-mutants",
    navTitle: "Comparison",
    section: "Compare",
    description:
      "Compare Go mutation testing tools side by side on caching, sharding, CI, editor support and a Claude Code plugin, from tiny projects to large monorepos.",
    keywords: ["go mutation testing comparison","mutation testing tools","framework comparison","tdd monorepo","microservices mutation testing","monorepo mutation testing","golang test performance","claude code plugin","ai coding agent"],
  },
  {
    href: "/docs/best-go-mutation-testing-tool",
    title: "Best Go mutation testing tool",
    seoTitle: "Best Go Mutation Testing Tool · Gooze",
    navTitle: "Best tool",
    section: "Compare",
    description:
      "Why Gooze is the best Go mutation testing tool for most teams: it re-tests only changed files, keeps TDD loops short, and compares with other tools.",
    keywords: ["best go mutation testing tool","golang mutation testing","tdd feedback","go mutation testing comparison","fast mutation testing","go test quality"],
  },
  {
    href: "/docs/best-go-mutation-testing-tool-for-ci",
    title: "Best Go mutation testing tool for CI/CD",
    seoTitle: "Best Go Mutation Testing Tool for CI/CD · Gooze",
    navTitle: "Best for CI/CD",
    section: "Compare",
    description:
      "The best Go mutation testing tool for CI/CD: shard across parallel runners, cache incrementally, gate pull requests on mutation score, and share OCI baselines.",
    keywords: ["best go mutation testing ci","ci/cd mutation testing","sharding","mutation score gate","github actions","gitlab ci"],
  },
  {
    href: "/docs/troubleshooting",
    title: "Troubleshooting",
    seoTitle:
      "Troubleshoot Test Flakiness & Errors · Gooze docs",
    section: "Help",
    description:
      "Fix common Gooze problems: every mutant killed, 0 files or 0 mutations found, stale reports, a missing reports directory, and shards missing from report view.",
    keywords: ["troubleshoot gooze","debug errors","fix flaky tests","resolve timeouts","performance optimization","build failure"],
  },
  {
    href: "/docs/roadmap",
    title: "Roadmap",
    seoTitle:
      "Development Roadmap & Known Limitations · Gooze",
    section: "Help",
    description:
      "Planned Gooze features and current limitations (threshold flag, custom mutators, custom test runner, JSON reports), with workarounds you can use today.",
    keywords: ["project roadmap","future features","known limitations","workarounds","unsupported syntax","upcoming releases"],
  },
]

export interface DocsFlag {
  /** Primary flag, e.g. "--coverage-profile". */
  flag: string
  /** Short alias, e.g. "-p". */
  alias?: string
  /** Command the flag belongs to, shown as context in search. */
  command: string
  /** Link to the documenting section (page path + anchor). */
  href: string
  /** One-line description of what the flag does. */
  description: string
}

export const docsFlags: DocsFlag[] = [
  // gooze run
  {
    flag: "--estimate",
    command: "gooze run",
    href: "/docs/cli/run#estimate",
    description: "Preview files, applicable mutation counts and cached files without running tests.",
  },
  {
    flag: "--diff",
    command: "gooze run",
    href: "/docs/cli/run#diff",
    description: "Mutate only lines changed against a git ref (merge base with HEAD, compared with the working tree).",
  },
  {
    flag: "--parallel",
    alias: "-p",
    command: "gooze run",
    href: "/docs/cli/run#parallel",
    description: "Number of parallel workers used for mutation testing.",
  },
  {
    flag: "--mutation-timeout",
    command: "gooze run",
    href: "/docs/cli/run#timeout",
    description: "Per-mutation timeout, in seconds, before a mutation is marked timed out.",
  },
  {
    flag: "--no-cache",
    command: "global",
    href: "/docs/cli/run#cache",
    description: "Disable the incremental cache and re-test every mutation.",
  },
  {
    flag: "--coverage-profile",
    command: "gooze run",
    href: "/docs/cli/run#coverage-profile",
    description:
      "Skip mutations on lines a Go coverage profile shows as uncovered, reporting them as not_covered.",
  },
  {
    flag: "--shard",
    alias: "-s",
    command: "gooze run",
    href: "/docs/cli/run#shard",
    description: "Run a shard of mutations in the form INDEX/TOTAL for distributed runs.",
  },
  // gooze report view
  {
    flag: "--all",
    command: "gooze report view",
    href: "/docs/cli/report#view",
    description: "List every mutation with its status and diff instead of the per-file summary.",
  },
  {
    flag: "--diff",
    command: "gooze report view",
    href: "/docs/cli/report#view-diff",
    description: "Show the score and survivors of the lines changed against a git ref only.",
  },
  // global flags
  {
    flag: "--output",
    alias: "-o",
    command: "global",
    href: "/docs/cli#global-flags",
    description: "Directory where mutation reports are written.",
  },
  {
    flag: "--exclude",
    alias: "-x",
    command: "global",
    href: "/docs/cli#global-flags",
    description: "Exclude files matching a regular expression from mutation.",
  },
  {
    flag: "--verbose",
    alias: "-v",
    command: "global",
    href: "/docs/cli#global-flags",
    description: "Enable verbose (debug) logging.",
  },
  {
    flag: "--log-output",
    command: "global",
    href: "/docs/cli#global-flags",
    description: "Path to the gooze log file.",
  },
]

const docsByHref = new Map(docsPages.map((page) => [page.href, page]))

export function getDocsPage(href: string): DocsPage | undefined {
  return docsByHref.get(href.replace(/\/$/, "") || "/")
}

export function navTitle(page: DocsPage): string {
  return page.navTitle ?? page.title
}

/** The page plus its parents (outermost first), e.g. CLI > report > view. */
export function getDocsTrail(href: string): DocsPage[] {
  const trail: DocsPage[] = []
  for (let page = getDocsPage(href); page; page = page.parent ? getDocsPage(page.parent) : undefined) {
    trail.unshift(page)
  }
  return trail
}

/** First page of a section, used as the section's landing link. */
export function getSectionLanding(section: DocsSection): DocsPage | undefined {
  return docsPages.find((page) => page.section === section)
}
