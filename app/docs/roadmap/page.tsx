import type * as React from "react"
import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"
import { ArrowRight, CircleCheck, CircleDashed, FlaskConical } from "lucide-react"

// Stated plainly so readers (and search/AI summaries) don't have to guess.
// Keep in sync with the comparison page when a limitation is lifted.
const limitations = [
  {
    id: "threshold",
    title: "Score threshold flag",
    detail: "A built-in flag to fail CI below a minimum mutation score is on the way.",
    workaround: { text: "a three-line score gate step", href: "/docs/ci/github#gate" },
  },
  {
    id: "git-diff",
    title: "Git diff mode",
    detail: "Gooze already re-tests only the files that changed; narrowing a run to the lines a pull request touched is coming next.",
    workaround: { text: "incremental runs", href: "/docs/usage/incremental-runs" },
  },
  {
    id: "custom-mutators",
    title: "Custom mutator plugins",
    detail: "Adding an operator to Gooze itself is one small function, and caching, sharding, and reporting work with it unchanged. A plugin API for your own operators is planned.",
    workaround: { text: "the built-in operators", href: "/docs/mutations" },
  },
  {
    id: "mutator-selection",
    title: "Mutator selection",
    detail: "The six default operators run on every file; switching operators on and off, including branch, statement, and loop, is planned.",
    workaround: { text: "per-mutagen ignore directives", href: "/docs/usage/ignoring-code" },
  },
  {
    id: "build-tags",
    title: "Build tags",
    detail: "Passing -tags through to go test is planned, so files behind build constraints get mutated too.",
  },
  {
    id: "exec",
    title: "Custom test runner",
    detail: "Gooze runs go test on the package that owns each mutated file; plugging in your own test command is planned.",
  },
  {
    id: "agents",
    title: "Codex and opencode",
    detail: "Support for Codex and opencode is on the way: their setups exist and are being verified with each agent.",
    workaround: { text: "the Claude Code plugin", href: "/docs/claude-code" },
  },
  {
    id: "json",
    title: "JSON and HTML reports",
    detail: "Results are YAML files plus _index.yaml; JSON and HTML output are on the way.",
    workaround: { text: "the report format", href: "/docs/reports" },
  },
]

type Item = {
  title: string
  detail: React.ReactNode
  shipped?: boolean
  /** Shipped but still changing; shows a Beta badge. */
  beta?: boolean
  href?: string
}

type Theme = {
  id: string
  title: string
  items: Item[]
}

const themes: Theme[] = [
  {
    id: "core",
    title: "Core features",
    items: [
      {
        title: "Score threshold",
        detail: "A built-in flag that fails the run below a minimum mutation score, with distinct exit codes for each outcome.",
      },
      {
        title: "Git diff mode",
        detail: "Mutate only the lines changed against a base ref, for fast pull request checks.",
      },
      {
        title: "Custom exec hook",
        detail: (
          <>
            Run your own test command instead of <code>go test</code>.
          </>
        ),
      },
      {
        title: "Function selection",
        detail: "Target specific functions or methods, for example by regex.",
      },
      {
        title: "Custom mutator plugins",
        detail: "A plugin API for writing your own mutation operators outside the Gooze source.",
      },
      {
        title: "Mutator selection",
        detail: "Turn mutators on or off in the config file or by flag, including the branch, statement, and loop mutators.",
      },
      {
        title: "Config path",
        detail: (
          <>
            A <code>--config</code> flag to load a config file other than <code>./gooze.yaml</code>.
          </>
        ),
      },
      {
        title: "JSON Schema for gooze.yaml",
        detail: "A published schema, registered in SchemaStore, so any YAML-aware editor validates and completes the config.",
      },
      {
        title: "Config show",
        detail: (
          <>
            <code>gooze config show</code> prints every key with its effective value, where it came from, and its env var.
          </>
        ),
      },
      {
        title: "Consistent config keys",
        detail: "One naming style for every key and flag, with the old names kept as deprecated aliases for a release.",
      },
      {
        title: "Annotation skipping",
        detail: (
          <>
            <code>{"//gooze:ignore"}</code> at file, function, or line scope, optionally per mutagen.
          </>
        ),
        shipped: true,
        href: "/docs/usage/ignoring-code",
      },
      {
        title: "Timeouts",
        detail: (
          <>
            Per-mutation execution budgets with <code>--mutation-timeout</code>.
          </>
        ),
        shipped: true,
        href: "/docs/cli/run#timeout",
      },
      {
        title: "Config file",
        detail: (
          <>
            <code>gooze.yaml</code> in the repo, generated by <code>gooze config init</code>.
          </>
        ),
        shipped: true,
        href: "/docs/config",
      },
    ],
  },
  {
    id: "reporting",
    title: "Reporting",
    items: [
      {
        title: "JSON report",
        detail: "Machine-readable output in the Stryker mutation-testing-report schema, for dashboards and other tools.",
      },
      {
        title: "HTML report",
        detail: (
          <>
            Extend the <code>report</code> command with <code>gooze report html</code>, which renders
            the report directory as a static page you can open locally or publish from CI.
          </>
        ),
      },
      {
        title: "SARIF report",
        detail: "Surface surviving mutants in GitHub code scanning and other SARIF tools.",
      },
      {
        title: "Code Climate report",
        detail: "Surviving mutants in the Code Climate JSON format, which GitLab's Code Quality merge request widget reads.",
      },
      {
        title: "LLM training dataset",
        detail: (
          <>
            Export mutants and the tests that kill them as chat-format JSONL (<code>messages</code>, with{" "}
            <code>rejected_response</code> for preference pairs), the format Qwen&apos;s fine-tuning tools
            such as ms-swift, LLaMA-Factory, Axolotl and Unsloth read, to train models that write stronger
            tests.
          </>
        ),
      },
      {
        title: "Status filter",
        detail: "Choose which mutant statuses appear in the output, for example only survivors.",
      },
      {
        title: "Incremental testing",
        detail: "Cache and reuse results for unchanged files.",
        shipped: true,
        href: "/docs/usage/incremental-runs",
      },
      {
        title: "Per-file reports",
        detail: "One report per source file for granular analysis.",
        shipped: true,
        href: "/docs/reports",
      },
      {
        title: "Summary index",
        detail: (
          <>
            An <code>_index.yaml</code> with the score and totals.
          </>
        ),
        shipped: true,
        href: "/docs/reports",
      },
      {
        title: "OCI artifacts",
        detail: (
          <>
            Share reports through any OCI registry with <code>gooze report push</code> and{" "}
            <code>pull</code>.
          </>
        ),
        shipped: true,
        href: "/docs/ci/sharing-reports",
      },
    ],
  },
  {
    id: "execution",
    title: "Smart test execution",
    items: [
      {
        title: "Build tags",
        detail: (
          <>
            Pass <code>-tags</code> through to go test so files behind build constraints get tested.
          </>
        ),
      },
      {
        title: "Cross-package coverage",
        detail: (
          <>
            A <code>--coverpkg</code>-style option that counts coverage from tests in other packages.
          </>
        ),
      },
      {
        title: "Automatic coverage",
        detail: (
          <>
            Generate the coverage profile during the run instead of requiring your own{" "}
            <code>--coverage-profile</code>.
          </>
        ),
      },
      {
        title: "Package-owned tests",
        detail: "Run the tests of the package that owns each mutated source file.",
        shipped: true,
      },
      {
        title: "Relevant tests only",
        detail: "Cut test execution time by running only the tests that matter.",
        shipped: true,
      },
    ],
  },
  {
    id: "performance",
    title: "Performance & scalability",
    items: [
      {
        title: "CPU-based parallelism",
        detail: (
          <>
            Default <code>--parallel</code> to the number of CPU cores instead of 1.
          </>
        ),
      },
      {
        title: "Parallel workers",
        detail: (
          <>
            Concurrent mutation testing with <code>--parallel</code>.
          </>
        ),
        shipped: true,
        href: "/docs/cli/run#parallel",
      },
      {
        title: "Sharding",
        detail: "Distribute one run across multiple machines, with parallel workers inside each shard.",
        shipped: true,
        href: "/docs/ci/sharding",
      },
      {
        title: "Report merging",
        detail: (
          <>
            Combine shard results with <code>gooze report merge</code>.
          </>
        ),
        shipped: true,
        href: "/docs/cli/report",
      },
    ],
  },
  {
    id: "workflow",
    title: "CI/CD & editors",
    items: [
      {
        title: "Official GitHub Action",
        detail: "A published action that installs and runs Gooze in one step.",
      },
      {
        title: "Docker image",
        detail: "An official container image for running Gooze in any CI system.",
      },
      {
        title: "GitHub Actions",
        detail: "Ready-made workflow templates, including sharding and a score gate.",
        shipped: true,
        href: "/docs/ci/github",
      },
      {
        title: "GitLab CI",
        detail: "Ready-made pipeline configuration.",
        shipped: true,
        href: "/docs/ci/gitlab",
      },
      {
        title: "Interactive viewer",
        detail: (
          <>
            A TUI with diffs for every mutant, via <code>gooze report view --all</code>.
          </>
        ),
        shipped: true,
        href: "/docs/usage/ui-modes",
      },
      {
        title: "Editor integration",
        detail: "Surviving mutants as diagnostics in your editor through the goozels language server.",
        shipped: true,
        href: "/docs/editor-support",
      },
      {
        title: "Claude Code",
        detail: "A plugin that sets a project up, runs the kill-survivors loop, adds gooze to existing CI, and shows mutation results after every edit.",
        shipped: true,
        beta: true,
        href: "/docs/claude-code",
      },
      {
        title: "Codex",
        detail: "Mutation results after every Codex edit through a post-edit hook. The hook exists in goozels; support lands once it's verified with Codex.",
      },
      {
        title: "opencode",
        detail: "Mutation results after every opencode edit through a plugin for opencode 1.x and 2.x. The plugins exist in goozels; support lands once they're verified with opencode.",
      },
    ],
  },
]

const allItems = themes.flatMap((theme) => theme.items)
const shippedCount = allItems.filter((item) => item.shipped).length
const plannedCount = allItems.length - shippedCount
const percent = Math.round((shippedCount / allItems.length) * 100)

function Status({ shipped, beta }: { shipped?: boolean; beta?: boolean }) {
  if (beta) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
        <FlaskConical className="size-3" aria-hidden />
        Beta
      </span>
    )
  }

  return shipped ? (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[color:var(--gooze-green)]/15 px-2 py-0.5 text-xs font-medium text-[color:var(--gooze-green)]">
      <CircleCheck className="size-3" aria-hidden />
      Shipped
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[color:var(--gooze-teal)]/40 px-2 py-0.5 text-xs font-medium text-[color:var(--gooze-teal)]">
      <CircleDashed className="size-3" aria-hidden />
      Planned
    </span>
  )
}

function Card({ item }: { item: Item }) {
  return (
    <li
      className={
        item.shipped
          ? "flex flex-col gap-2 rounded-xl border bg-card p-4"
          : "flex flex-col gap-2 rounded-xl border border-dashed border-[color:var(--gooze-teal)]/40 bg-[color:var(--gooze-teal)]/5 p-4"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-foreground">{item.title}</h3>
        <Status shipped={item.shipped} beta={item.beta} />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem] [&_code]:text-foreground">
        {item.detail}
      </p>
      {item.href && (
        <Link
          href={item.href}
          className="mt-auto inline-flex w-fit items-center gap-1 text-sm font-medium text-[color:var(--gooze-teal)] hover:text-[color:var(--gooze-green)]"
        >
          Docs
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      )}
    </li>
  )
}

export const metadata = docsMetadata("/docs/roadmap")

export default function RoadmapPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Roadmap</h1>
      <p className="text-lg text-muted-foreground mb-8">
        What&apos;s shipped, what&apos;s coming next, and what to use in the meantime.
      </p>

      <div className="not-typeset rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="text-3xl font-bold tracking-tight text-foreground">{percent}%</div>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[color:var(--gooze-green)]" />
              <span className="font-semibold text-foreground">{shippedCount}</span>
              <span className="text-muted-foreground">shipped</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full border-2 border-[color:var(--gooze-teal)]" />
              <span className="font-semibold text-foreground">{plannedCount}</span>
              <span className="text-muted-foreground">planned</span>
            </div>
          </div>
        </div>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Roadmap progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--gooze-green)] to-[color:var(--gooze-teal)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {themes.map((theme) => {
        const done = theme.items.filter((item) => item.shipped).length
        return (
          <div key={theme.id} id={theme.id}>
            <h2>{theme.title}</h2>
            <p className="text-sm text-muted-foreground">
              {done} of {theme.items.length} shipped
            </p>
            <ul className="not-typeset mt-4 grid gap-3 sm:grid-cols-2">
              {theme.items.map((item) => (
                <Card key={item.title} item={item} />
              ))}
            </ul>
          </div>
        )
      })}

      <div id="limitations">
        <h2>Coming next</h2>
        <p className="text-sm text-muted-foreground">
          Features on the way, and what to use until they land.
        </p>
        <ul className="not-typeset mt-4 divide-y rounded-xl border bg-card">
          {limitations.map((item) => (
            <li key={item.id} id={item.id} className="p-4">
              <div className="font-medium text-foreground">{item.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
                {item.workaround && (
                  <>
                    {" "}Until then, use{" "}
                    <Link
                      href={item.workaround.href}
                      className="font-medium text-[color:var(--gooze-teal)] underline-offset-4 hover:text-[color:var(--gooze-green)] hover:underline"
                    >
                      {item.workaround.text}
                    </Link>
                    .
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          How this compares with other tools:{" "}
          <Link href="/docs/comparison">Gooze vs other Go mutation testing tools</Link>.
        </p>
      </div>
    </section>
  )
}
