// Single source of truth for the documentation pages.
//
// Powers: client-side search, per-page <title>/<meta description> (SEO),
// the sitemap, and breadcrumb structured data. Keep this in sync with the
// sidebar nav in components/gooze-docs-sidebar.tsx when pages are added.

export const SITE_URL = "https://gooze.dev"

export type DocsSection =
  | "Get started"
  | "Reference"
  | "Features"
  | "Guides"
  | "Roadmap"

export interface DocsPage {
  /** Route path, no trailing slash (e.g. "/docs/cli/run"). */
  href: string
  /** Page heading, used as the search title and the <title> tag. */
  title: string
  /** Sidebar group the page belongs to. */
  section: DocsSection
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
    section: "Get started",
    description:
      "Gooze is a mutation testing tool for Go that measures how good your tests really are by mutating your code and checking whether tests catch it.",
    keywords: ["overview", "introduction", "getting started", "go", "mutation testing"],
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
    href: "/docs/install",
    title: "Installation",
    section: "Get started",
    description:
      "Install the gooze CLI with go install or a prebuilt binary, and verify the version.",
    keywords: ["install", "go install", "binary", "setup", "download"],
  },
  {
    href: "/docs/mutation-testing",
    title: "What is mutation testing?",
    section: "Get started",
    description:
      "Learn how mutation testing works, what a mutation score means, and why it reveals gaps that code coverage misses.",
    keywords: ["concept", "mutation score", "killed", "survived", "coverage", "theory"],
  },

  // Reference
  {
    href: "/docs/cli",
    title: "CLI reference",
    section: "Reference",
    description:
      "Reference for every gooze command and its global flags: run, report, config, and version.",
    keywords: ["commands", "flags", "options", "terminal", "usage"],
  },
  {
    href: "/docs/cli/run",
    title: "gooze run",
    section: "Reference",
    description:
      "Run mutation testing and write reports. Covers paths, parallelism, sharding, timeouts, and the --coverage-profile gate.",
    keywords: ["run", "mutate", "parallel", "shard", "estimate", "coverage-profile", "not_covered"],
  },
  {
    href: "/docs/cli/version",
    title: "gooze version",
    section: "Reference",
    description: "Print the installed gooze version and build information.",
    keywords: ["version", "build", "release"],
  },
  {
    href: "/docs/cli/config",
    title: "gooze config",
    section: "Reference",
    description: "Manage gooze configuration from the command line.",
    keywords: ["config", "settings", "gooze.yaml"],
  },
  {
    href: "/docs/cli/config/init",
    title: "gooze config init",
    section: "Reference",
    description: "Generate a default gooze.yaml configuration file in your project.",
    keywords: ["config init", "scaffold", "gooze.yaml", "generate"],
  },
  {
    href: "/docs/cli/report",
    title: "gooze report",
    section: "Reference",
    description: "Work with mutation reports: view, merge, push, and pull.",
    keywords: ["report", "results", "artifacts"],
  },
  {
    href: "/docs/cli/report/view",
    title: "gooze report view",
    section: "Reference",
    description: "View previously generated mutation reports in the terminal.",
    keywords: ["report view", "inspect", "results", "tui"],
  },
  {
    href: "/docs/cli/report/push",
    title: "gooze report push",
    section: "Reference",
    description: "Push mutation reports to an OCI registry as an artifact.",
    keywords: ["report push", "oci", "registry", "artifact", "upload"],
  },
  {
    href: "/docs/cli/report/pull",
    title: "gooze report pull",
    section: "Reference",
    description: "Pull mutation reports from an OCI registry.",
    keywords: ["report pull", "oci", "registry", "artifact", "download"],
  },
  {
    href: "/docs/cli/report/merge",
    title: "gooze report merge",
    section: "Reference",
    description: "Merge sharded mutation reports into a single directory.",
    keywords: ["report merge", "shard", "combine", "aggregate"],
  },
  {
    href: "/docs/config",
    title: "Configuration",
    section: "Reference",
    description:
      "Configure gooze with gooze.yaml, environment variables, and CLI flags, including precedence rules and every supported key.",
    keywords: ["config", "gooze.yaml", "environment variables", "GOOZE_", "settings", "coverage_profile"],
  },
  {
    href: "/docs/reports",
    title: "Reports",
    section: "Reference",
    description:
      "Understand the report directory layout, the _index.yaml summary, and the per-mutation result files gooze produces.",
    keywords: ["reports", "_index.yaml", "output", "results", "not_covered_mutations"],
  },
  {
    href: "/docs/mutations",
    title: "Mutations",
    section: "Reference",
    description:
      "The mutation operators gooze applies and the result statuses (killed, survived, not covered, timeout, error) each mutation can have.",
    keywords: ["mutations", "operators", "killed", "survived", "not covered", "status", "arithmetic", "boolean"],
  },

  // Features
  {
    href: "/docs/features/bypass-mutation",
    title: "Bypass mutation",
    section: "Features",
    description:
      "Skip specific lines, functions, or files from mutation with -x and the //gooze:ignore directive.",
    keywords: ["bypass", "ignore", "skip", "exclude", "gooze:ignore", "-x"],
  },
  {
    href: "/docs/features/incremental-execution",
    title: "Incremental execution",
    section: "Features",
    description:
      "Reuse the cache to re-test only what changed and cut mutation testing time on large projects.",
    keywords: ["incremental", "cache", "no-cache", "changed", "speed", "performance"],
  },
  {
    href: "/docs/features/ui-modes",
    title: "UI modes",
    section: "Features",
    description:
      "Choose between the interactive TUI and plain output for local runs and CI.",
    keywords: ["ui", "tui", "interactive", "plain", "output", "terminal"],
  },

  // Guides
  {
    href: "/docs/ci",
    title: "GitHub Actions",
    section: "Guides",
    description: "Run gooze in GitHub Actions and gate pull requests on your mutation score.",
    keywords: ["github actions", "ci", "workflow", "pipeline", "pull request"],
  },
  {
    href: "/docs/gitlab",
    title: "GitLab CI",
    section: "Guides",
    description: "Run gooze in GitLab CI pipelines, including sharding across parallel jobs.",
    keywords: ["gitlab", "ci", "pipeline", "shard", "jobs"],
  },
  {
    href: "/docs/editor-support",
    title: "Editor support (goozels)",
    section: "Guides",
    description: "Use the goozels language server to surface mutation results inside your editor.",
    keywords: ["editor", "lsp", "goozels", "language server", "vscode", "neovim"],
  },
  {
    href: "/docs/troubleshooting",
    title: "Troubleshooting",
    section: "Guides",
    description: "Fix common gooze problems: build failures, flaky tests, timeouts, and slow runs.",
    keywords: ["troubleshooting", "errors", "problems", "timeout", "flaky", "debug", "help"],
  },

  // Roadmap
  {
    href: "/docs/roadmap",
    title: "Roadmap",
    section: "Roadmap",
    description: "What is planned next for gooze and the ideas under consideration.",
    keywords: ["roadmap", "planned", "future", "upcoming"],
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
