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
  /** Page heading, used as the search title and the <title> tag. */
  title: string
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
  // Get started
  {
    href: "/docs",
    title: "Documentation overview",
    navTitle: "Overview",
    section: "Get started",
    description:
      "Gooze is a mutation testing tool for Go that measures how good your tests really are by mutating your code and checking whether tests catch it.",
    keywords: ["overview", "introduction", "getting started", "go", "mutation testing"],
  },
  {
    href: "/docs/install",
    title: "Installation",
    section: "Get started",
    description:
      "Install the gooze CLI with go install or a prebuilt binary, and verify the version.",
    keywords: ["install", "go install", "binary", "setup", "download"],
  },
  {
    href: "/docs/quick-start",
    title: "Quick start",
    section: "Get started",
    description:
      "Install gooze, run mutation testing across your packages, and read your first mutation score in a few minutes.",
    keywords: ["quickstart", "first run", "tutorial", "gooze run", "getting started"],
  },
  {
    href: "/docs/mutation-testing",
    title: "Mutation testing basics",
    section: "Get started",
    description:
      "Learn how mutation testing works, what a mutation score means, and why it reveals gaps that code coverage misses.",
    keywords: ["concept", "mutation score", "killed", "survived", "coverage", "theory"],
  },
  {
    href: "/docs/comparison",
    title: "Gooze vs Gremlins vs go-mutesting",
    navTitle: "Comparison",
    section: "Get started",
    description:
      "Feature-by-feature comparison of Go mutation testing tools: config files, CI score thresholds, git-diff mode, caching, sharding, custom mutators, and what Gooze doesn't do yet.",
    keywords: ["comparison", "vs", "alternatives", "gremlins", "go-mutesting", "avito", "threshold", "diff", "custom mutators", "faq"],
  },

  // Using gooze
  {
    href: "/docs/usage/results",
    title: "Reading results",
    section: "Using gooze",
    description:
      "What killed, survived, not covered, timeout, and error mean, how the mutation score is calculated, and what to do about a survivor.",
    keywords: ["results", "status", "statuses", "killed", "survived", "not_covered", "timeout", "error", "score", "survivor"],
  },
  {
    href: "/docs/usage/ignoring-code",
    title: "Ignoring code",
    section: "Using gooze",
    description:
      "Skip specific files, functions, or lines from mutation with -x/--exclude and the //gooze:ignore directive.",
    keywords: ["bypass", "ignore", "skip", "exclude", "gooze:ignore", "-x"],
  },
  {
    href: "/docs/usage/incremental-runs",
    title: "Incremental runs",
    section: "Using gooze",
    description:
      "Gooze caches results per file and re-tests only files that changed since the last run; force a full re-run with --no-cache.",
    keywords: ["incremental", "cache", "no-cache", "changed files", "only changed", "diff", "speed", "performance", "baseline"],
  },
  {
    href: "/docs/usage/ui-modes",
    title: "UI modes",
    section: "Using gooze",
    description:
      "Choose between the interactive TUI and plain output for local runs and CI.",
    keywords: ["ui", "tui", "interactive", "plain", "output", "terminal", "tty"],
  },
  {
    href: "/docs/editor-support",
    title: "Editor support (goozels)",
    navTitle: "Editor support",
    section: "Using gooze",
    description: "Use the goozels language server to surface mutation results inside your editor.",
    keywords: ["editor", "lsp", "goozels", "language server", "vscode", "neovim"],
  },

  // CI & teams
  {
    href: "/docs/ci/github",
    title: "GitHub Actions",
    section: "CI & teams",
    description:
      "Run gooze in GitHub Actions, shard and cache it, and fail the build when the mutation score drops below a threshold.",
    keywords: ["github actions", "ci", "workflow", "pipeline", "pull request", "quality gate", "threshold", "min score", "fail build"],
  },
  {
    href: "/docs/ci/gitlab",
    title: "GitLab CI",
    section: "CI & teams",
    description:
      "Run gooze in GitLab CI pipelines, shard across parallel jobs, and fail the pipeline below a mutation score threshold.",
    keywords: ["gitlab", "ci", "pipeline", "shard", "jobs", "quality gate", "threshold", "min score"],
  },
  {
    href: "/docs/ci/sharding",
    title: "Sharding and merging",
    section: "CI & teams",
    description:
      "Split a mutation run across parallel jobs with -s INDEX/TOTAL and combine the results with gooze report merge.",
    keywords: ["shard", "sharding", "parallel", "merge", "split", "jobs", "-s"],
  },
  {
    href: "/docs/ci/sharing-reports",
    title: "Sharing reports (OCI)",
    section: "CI & teams",
    description:
      "Push and pull the reports directory to an OCI registry such as GHCR so CI and teammates reuse one baseline.",
    keywords: ["oci", "registry", "ghcr", "push", "pull", "baseline", "artifact", "auth"],
  },

  // Reference
  {
    href: "/docs/cli",
    title: "CLI reference",
    section: "Reference",
    description:
      "Reference for every gooze command, its global flags, and exit codes: run, report, config, and version.",
    keywords: ["commands", "flags", "options", "terminal", "usage", "exit code", "exit status"],
  },
  {
    href: "/docs/cli/run",
    title: "gooze run",
    section: "Reference",
    parent: "/docs/cli",
    description:
      "Run mutation testing and write reports. Covers paths, parallelism, sharding, timeouts, and the --coverage-profile gate.",
    keywords: ["run", "mutate", "parallel", "shard", "estimate", "coverage-profile", "not_covered"],
  },
  {
    href: "/docs/cli/report",
    title: "gooze report",
    section: "Reference",
    parent: "/docs/cli",
    description:
      "Work with mutation reports: view them in the terminal, push and pull them as OCI artifacts, and merge sharded results.",
    keywords: [
      "report",
      "results",
      "artifacts",
      "report view",
      "inspect",
      "tui",
      "report push",
      "report pull",
      "oci",
      "registry",
      "upload",
      "download",
      "report merge",
      "shard",
      "combine",
      "aggregate",
    ],
  },
  {
    href: "/docs/cli/config",
    title: "gooze config",
    section: "Reference",
    parent: "/docs/cli",
    description:
      "Manage gooze configuration from the command line, including config init to generate a starter gooze.yaml.",
    keywords: ["config", "config init", "settings", "gooze.yaml", "scaffold", "generate"],
  },
  {
    href: "/docs/cli/version",
    title: "gooze version",
    section: "Reference",
    parent: "/docs/cli",
    description: "Print the installed gooze version and build information.",
    keywords: ["version", "build", "release"],
  },
  {
    href: "/docs/config",
    title: "Configuration (gooze.yaml)",
    navTitle: "Configuration",
    section: "Reference",
    description:
      "Configure gooze with a gooze.yaml config file checked into your repo, environment variables, and CLI flags, including precedence rules and every supported key.",
    keywords: ["config", "config file", "gooze.yaml", "yaml", "environment variables", "GOOZE_", "settings", "coverage_profile"],
  },
  {
    href: "/docs/reports",
    title: "Report format",
    section: "Reference",
    description:
      "The report directory layout, the _index.yaml summary, and the per-mutation result files gooze produces.",
    keywords: ["reports", "_index.yaml", "output", "results", "not_covered_mutations", "format"],
  },
  {
    href: "/docs/mutations",
    title: "Mutation operators",
    section: "Reference",
    description:
      "The mutation operators gooze applies by default (arithmetic, comparison, logical, boolean, numbers, unary), with examples.",
    keywords: ["mutations", "operators", "mutagens", "arithmetic", "comparison", "boolean", "logical", "numbers", "unary"],
  },

  // Help
  {
    href: "/docs/troubleshooting",
    title: "Troubleshooting",
    section: "Help",
    description: "Fix common gooze problems: build failures, flaky tests, timeouts, and slow runs.",
    keywords: ["troubleshooting", "errors", "problems", "timeout", "flaky", "debug", "help"],
  },
  {
    href: "/docs/roadmap",
    title: "Roadmap",
    section: "Help",
    description: "Known limitations of gooze with workarounds, and what is planned next.",
    keywords: ["roadmap", "planned", "future", "upcoming", "limitations", "not supported", "missing"],
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
    description: "Preview files and applicable mutation counts without running tests.",
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
    command: "gooze run",
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
