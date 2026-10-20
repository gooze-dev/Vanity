// Single source of truth for the documentation pages.
//
// Powers: the sidebar nav, breadcrumbs, prev/next pager, client-side search,
// per-page <title>/<meta description> (SEO), the sitemap, and breadcrumb
// structured data. Array order is reading order: it drives the sidebar and
// the pager.
//
// Grouping follows the user's journey (start -> use locally -> CI and teams ->
// look up facts -> get help). Each page has one job (a task, a concept, or
// reference facts); link to the canonical page instead of repeating content.

export const SITE_URL = "https://gooze.dev"

export const docsSections = [
  "Get started",
  "Using gooze",
  "CI & teams",
  "Reference",
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
      "Official documentation for Gooze. Learn how to implement AST-based mutation testing in Go to accurately measure test suite quality beyond simple code coverage.",
    keywords: ["gooze documentation","getting started","golang mutation testing","test suite quality","ast mutation","docs overview"],
  },
  {
    href: "/docs/install",
    title: "Installation",
    seoTitle:
      "Install the Gooze CLI Framework · Gooze docs",
    section: "Get started",
    description:
      "Download and install Gooze using go install or via precompiled release binaries. Verify your installation to begin analyzing Go test effectiveness.",
    keywords: ["install gooze","download cli","prebuilt binaries","go install","setup framework","go module"],
  },
  {
    href: "/docs/quick-start",
    title: "Quick start",
    seoTitle:
      "Quick Start Guide for Go Mutation Testing · Gooze",
    section: "Get started",
    description:
      "Run your first Go mutation test in under 5 minutes. Learn the basics of execution, interpreting your initial mutation score, and spotting hidden bug risks.",
    keywords: ["quick start","tutorial","first mutation run","calculate score","go testing guide","beginner setup"],
  },
  {
    href: "/docs/mutation-testing",
    title: "Mutation testing basics",
    seoTitle:
      "What is Mutation Testing? Concepts Explained · Gooze",
    section: "Get started",
    description:
      "Understand the theory behind mutation testing. Learn why measuring killed vs. survived mutants reveals critical logic gaps that code coverage misses.",
    keywords: ["mutation testing concepts","what is mutation score","killed mutants","survived mutants","code coverage vs mutation","software reliability"],
  },
  {
    href: "/docs/comparison",
    title: "Gooze vs Gremlins vs go-mutesting vs go-mutants",
    seoTitle:
      "Gooze vs Gremlins vs go-mutesting vs go-mutants",
    navTitle: "Comparison",
    section: "Get started",
    description:
      "Compare Go mutation testing tools: Gooze vs Gremlins, go-mutesting and go-mutants on caching, sharding, CI, editor support and a Claude Code plugin.",
    keywords: ["gooze vs gremlins","go-mutesting alternative","go-mutants","framework comparison","tdd monorepo","golang test performance","claude code plugin","ai coding agent"],
  },
  {
    href: "/docs/best-go-mutation-testing-tool",
    title: "Best Go mutation testing tool",
    seoTitle: "Best Go Mutation Testing Tool · Gooze",
    navTitle: "Best tool",
    section: "Get started",
    description:
      "Why Gooze is the best Go mutation testing tool for most teams: fast incremental runs, tight TDD feedback, and an honest take on Gremlins and go-mutesting.",
    keywords: ["best go mutation testing tool","golang mutation testing","tdd feedback","gooze vs gremlins","fast mutation testing","go test quality"],
  },
  {
    href: "/docs/best-go-mutation-testing-tool-for-ci",
    title: "Best Go mutation testing tool for CI/CD",
    seoTitle: "Best Go Mutation Testing Tool for CI/CD · Gooze",
    navTitle: "Best for CI/CD",
    section: "Get started",
    description:
      "The best Go mutation testing tool for CI/CD: shard across parallel runners, cache incrementally, gate pull requests on mutation score, and share OCI baselines.",
    keywords: ["best go mutation testing ci","ci/cd mutation testing","sharding","mutation score gate","github actions","gitlab ci"],
  },
  {
    href: "/docs/usage/results",
    title: "Reading results",
    seoTitle:
      "Interpreting Statuses: Killed, Survived, Timeout · Gooze",
    section: "Using gooze",
    description:
      "Learn how to interpret Gooze outcomes. Understand the difference between killed, survived, and not_covered statuses to systematically improve your score.",
    keywords: ["test statuses","killed mutant","survived mutant","not_covered","timeout error","interpret score","fix gaps"],
  },
  {
    href: "/docs/usage/ignoring-code",
    title: "Ignoring code",
    seoTitle:
      "Exclude Files via Code Ignoral · Gooze docs",
    section: "Using gooze",
    description:
      "Master techniques to skip specific Go files, functions, or lines during mutation testing. Apply -x flags and //gooze:ignore directives effectively.",
    keywords: ["ignore files","skip functions","selective testing","exclude blocks","-x flag","gooze:ignore syntax"],
  },
  {
    href: "/docs/usage/incremental-runs",
    title: "Incremental runs",
    seoTitle:
      "Optimize Speed with Incremental Runs · Gooze",
    section: "Using gooze",
    description:
      "Re-test only what changed. Gooze caches results per file by content hash and scores cached and tested results together, cutting CI time for large Go apps.",
    keywords: ["incremental testing","fast ci","cache results","git diff","modified code","no-cache flag","cached score"],
  },
  {
    href: "/docs/usage/ui-modes",
    title: "UI modes",
    seoTitle:
      "Configure Output: TUI vs Plain Text · Gooze docs",
    section: "Using gooze",
    description:
      "Understand Gooze's TTY auto-detection. Force the interactive terminal UI for manual testing or fallback to plain text logs for automated CI environments.",
    keywords: ["terminal ui","tui interface","plain text logs","stdout","tty detection","environment output"],
  },
  {
    href: "/docs/editor-support",
    title: "Editor support (goozels)",
    seoTitle:
      "IDE & Editor Support via LSP (goozels) · Gooze",
    navTitle: "Editor support",
    section: "Using gooze",
    description:
      "Mutation testing results in your editor and AI coding agents: the goozels language server for VS Code, Neovim and more, plus goozels check for agents.",
    keywords: ["editor support","goozels lsp","language server protocol","vscode extension","neovim integration","inline results","goozels check","claude code","claude plugin","codex","opencode","ai coding agents"],
  },
  {
    href: "/docs/claude-code",
    title: "Claude Code",
    seoTitle:
      "Go Mutation Testing in Claude Code (gooze plugin) · Gooze",
    section: "Using gooze",
    description:
      "Install the gooze plugin for Claude Code: project setup with /gooze:init, the kill-survivors loop, CI setup, and mutation results after every edit.",
    keywords: ["claude code","claude plugin","ai coding agent","vibe coding","/gooze:init","mutation testing skill","post-edit hook","code review","ci setup"],
  },
  {
    href: "/docs/ci/github",
    title: "GitHub Actions",
    seoTitle:
      "GitHub Actions for Go Mutation Testing · Gooze",
    section: "CI & teams",
    description:
      "Integrate Gooze with GitHub Actions. Accelerate Golang mutation testing via sharding, cache results, and enforce quality gates with minimum score thresholds.",
    keywords: ["github actions","ci/cd","go mutation testing","pipeline","pull request","quality gate","threshold","shard","caching"],
  },
  {
    href: "/docs/ci/gitlab",
    title: "GitLab CI",
    seoTitle:
      "GitLab CI for Go Mutation Testing · Gooze",
    section: "CI & teams",
    description:
      "Automate Gooze in GitLab CI pipelines. Configure sharding across parallel jobs and enforce mutation score thresholds to prevent merging weak Go test suites.",
    keywords: ["gitlab ci","pipeline","parallel jobs","sharding","quality gate","minimum score","go testing"],
  },
  {
    href: "/docs/ci/sharding",
    title: "Sharding and merging",
    seoTitle:
      "Sharding & Merging Mutation Tests · Gooze",
    section: "CI & teams",
    description:
      "Optimize CI execution speed by splitting Go mutation tests across parallel jobs using -s INDEX/TOTAL. Combine results seamlessly with gooze report merge.",
    keywords: ["test sharding","parallel execution","merge reports","split jobs","CI optimization","golang testing"],
  },
  {
    href: "/docs/ci/sharing-reports",
    title: "Sharing reports (OCI)",
    seoTitle:
      "Sharing Reports via OCI Registries · Gooze",
    section: "CI & teams",
    description:
      "Push and pull Gooze mutation reports to OCI registries like GHCR. Establish a shared baseline for CI pipelines and distributed Go development teams.",
    keywords: ["oci registry","ghcr","push reports","pull reports","test baseline","ci artifacts","authentication"],
  },
  {
    href: "/docs/cli",
    title: "CLI reference",
    seoTitle:
      "CLI Command Reference · Gooze",
    section: "Reference",
    description:
      "Complete CLI reference for Gooze. Explore commands, global flags, and exit codes for running, reporting, configuring, and executing Go mutation tests.",
    keywords: ["cli commands","terminal flags","exit codes","usage reference","gooze run","gooze report"],
  },
  {
    href: "/docs/cli/run",
    title: "gooze run",
    seoTitle:
      "Execute Mutation Tests (gooze run) · Gooze",
    section: "Reference",
    parent: "/docs/cli",
    description:
      "Execute Go mutation testing. Master CLI arguments for parallelism, sharding, timeouts, the --estimate cache preview, and the --coverage-profile gate.",
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
      "Interact with Gooze mutation reports. View per-file scores and survivors, browse every mutant in the TUI, merge sharded runs, and manage OCI artifact uploads.",
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
      "Manage Gooze mutation testing configuration via CLI. Generate a starter gooze.yaml file automatically with the config init command.",
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
      "Verify your installed Gooze CLI version and the Go toolchain it was built with. Essential for accurate bug reporting and pinning CI/CD dependency versions.",
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
      "Learn how to configure Gooze using the gooze.yaml file, environment variables (GOOZE_*), and CLI flags. Understand precedence rules, value bounds, and schemas.",
    keywords: ["gooze.yaml","configuration syntax","environment variables","settings precedence","coverage_profile definition"],
  },
  {
    href: "/docs/reports",
    title: "Report format",
    seoTitle:
      "Understanding Output Report Formats · Gooze",
    section: "Reference",
    description:
      "Analyze Gooze's directory layout, index.yaml schemas, and per-mutation result files. Discover how to extract structured JSON/YAML insights for custom tooling.",
    keywords: ["report format","index.yaml","structured output","result schemas","custom tooling","test data extraction"],
  },
  {
    href: "/docs/mutations",
    title: "Mutation operators",
    seoTitle:
      "Supported Go Mutation Operators · Gooze docs",
    section: "Reference",
    description:
      "Review the full list of AST mutation operators applied by Gooze. See examples of arithmetic, logical, boolean, and comparison mutations injected into Go code.",
    keywords: ["mutation operators","ast mutagens","logical mutations","arithmetic swaps","boolean flip","code injection examples"],
  },
  {
    href: "/docs/troubleshooting",
    title: "Troubleshooting",
    seoTitle:
      "Troubleshoot Test Flakiness & Errors · Gooze docs",
    section: "Help",
    description:
      "Resolve common Gooze execution issues. Debug build failures, diagnose flaky tests, fix test timeouts, and optimize performance for excessively slow test suites.",
    keywords: ["troubleshoot gooze","debug errors","fix flaky tests","resolve timeouts","performance optimization","build failure"],
  },
  {
    href: "/docs/roadmap",
    title: "Roadmap",
    seoTitle:
      "Development Roadmap & Known Limitations · Gooze",
    section: "Help",
    description:
      "Explore planned features and current technical constraints within the Gooze framework. Find temporary workarounds for unsupported Go syntax mutations.",
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
