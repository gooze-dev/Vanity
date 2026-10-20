import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Facts last checked against gooze v1.1.0 and the competitors' own docs. Only
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
}

const rows: Row[] = [
  {
    feature: "Config file in the repo",
    gooze: ["yes", "gooze.yaml + GOOZE_* env vars"],
    gremlins: ["yes", ".gremlins.yaml"],
    goMutesting: ["no", "flags only"],
    avito: ["yes", "YAML via --config"],
  },
  {
    feature: "Fail the build below a score",
    gooze: ["partial", "no flag yet; 3-line script gate"],
    gremlins: ["yes", "--threshold-efficacy, --threshold-mcover"],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
  },
  {
    feature: "Mutate only changed code (git diff)",
    gooze: ["no", "unchanged files are skipped by the cache instead"],
    gremlins: ["yes", "--diff <branch|commit>"],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
  },
  {
    feature: "Incremental cache between runs",
    gooze: ["yes", "per-file, reused on any machine"],
    gremlins: ["unknown", ""],
    goMutesting: ["partial", "manual MD5 blacklist"],
    avito: ["partial", "manual MD5 blacklist"],
  },
  {
    feature: "Split one run across CI jobs",
    gooze: ["yes", "-s INDEX/TOTAL + report merge"],
    gremlins: ["unknown", ""],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
  },
  {
    feature: "Shared baseline for CI and teammates",
    gooze: ["yes", "report push/pull to any OCI registry"],
    gremlins: ["unknown", ""],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
  },
  {
    feature: "Parallel workers",
    gooze: ["yes", "-p/--parallel"],
    gremlins: ["yes", "--workers"],
    goMutesting: ["partial", "via a custom --exec script"],
    avito: ["unknown", ""],
  },
  {
    feature: "Skip code tests never execute",
    gooze: ["yes", "--coverage-profile"],
    gremlins: ["yes", "NOT COVERED status"],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
  },
  {
    feature: "Ignore code with comments",
    gooze: ["yes", "//gooze:ignore, per file/func/line/mutator"],
    gremlins: ["partial", "file regex only (--exclude-files)"],
    goMutesting: ["partial", "checksum blacklist"],
    avito: ["yes", "mutator-disable-* directives"],
  },
  {
    feature: "Write your own mutators",
    gooze: ["no", "built-in operators only"],
    gremlins: ["partial", "toggle built-ins only"],
    goMutesting: ["yes", "Mutator interface + Register"],
    avito: ["unknown", ""],
  },
  {
    feature: "Custom test runner command",
    gooze: ["no", "on the roadmap"],
    gremlins: ["partial", "--integration runs the full suite"],
    goMutesting: ["yes", "--exec"],
    avito: ["yes", "--exec"],
  },
  {
    feature: "Machine-readable results",
    gooze: ["yes", "YAML report dir + _index.yaml"],
    gremlins: ["yes", "JSON (-o)"],
    goMutesting: ["partial", "stdout"],
    avito: ["yes", "JSON and HTML"],
  },
  {
    feature: "Interactive results viewer",
    gooze: ["yes", "TUI with diffs (report view)"],
    gremlins: ["unknown", ""],
    goMutesting: ["unknown", ""],
    avito: ["partial", "static HTML report"],
  },
  {
    feature: "Results in your editor",
    gooze: ["yes", "goozels language server"],
    gremlins: ["unknown", ""],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
  },
  {
    feature: "Stable (1.x) CLI and config",
    gooze: ["yes", "v1.x"],
    gremlins: ["no", "v0.x; config may change between minors"],
    goMutesting: ["unknown", ""],
    avito: ["unknown", ""],
  },
]

const supportLabel: Record<Support, string> = {
  yes: "Yes",
  no: "No",
  partial: "Partly",
  unknown: "Not documented",
}

const supportClass: Record<Support, string> = {
  yes: "text-[color:var(--gooze-green)] font-medium",
  no: "text-destructive font-medium",
  partial: "font-medium",
  unknown: "text-muted-foreground",
}

function Cell({ value }: { value: [Support, string] }) {
  const [support, note] = value
  return (
    <TableCell className="align-top whitespace-normal">
      <div className={supportClass[support]}>{supportLabel[support]}</div>
      {note && <div className="text-xs text-muted-foreground">{note}</div>}
    </TableCell>
  )
}

// Rendered both on the page and as FAQPage structured data, so search engines
// and AI answers quote the same wording people read.
const faqs = [
  {
    q: "Does gooze have a config file?",
    a: "Yes. gooze.yaml in the project root holds output dir, excludes, parallelism, timeouts, and the coverage profile; `gooze config init` generates one. Every key can also be set with a GOOZE_* environment variable or a CLI flag.",
  },
  {
    q: "Can gooze fail CI when the mutation score drops below a threshold?",
    a: "Not with a built-in flag yet (as of v1.1.0). gooze prints `Mutation score: NN.NN%` in non-interactive output, and a three-line shell step compares it to a minimum and fails the job. The GitHub Actions and GitLab CI guides include it.",
  },
  {
    q: "Does gooze only test changed code?",
    a: "gooze caches results per file and re-tests only files whose content changed; with a baseline pulled from an OCI registry this also works on fresh CI runners. There is no git-diff mode that limits mutations to changed lines inside a file.",
  },
  {
    q: "Can I write custom mutators for gooze?",
    a: "No. gooze ships six default operators (arithmetic, comparison, logical, boolean, numbers, unary) and has no plugin API for custom ones. go-mutesting supports custom mutators via its Mutator interface.",
  },
  {
    q: "How is the gooze mutation score calculated?",
    a: "killed / (all mutations - error). Mutants that do not compile (error) are left out; survived, not_covered, and timeout all lower the score.",
  },
  {
    q: "Can gooze run across several CI machines?",
    a: "Yes. `gooze run -s INDEX/TOTAL` runs one shard per job, and `gooze report merge` combines them. Ready-made GitHub Actions and GitLab CI pipelines are in the docs.",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a.replaceAll("`", "") },
  })),
}

export const metadata = docsMetadata("/docs/comparison")

export default function ComparisonPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="text-4xl font-bold tracking-tight mb-4">Gooze vs other Go mutation testing tools</h1>
      <p className="text-lg text-muted-foreground mb-4">
        How Gooze compares with Gremlins and go-mutesting, including what Gooze does not do yet.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Last verified {VERIFIED} against Gooze v1.1.0 and each tool&apos;s own documentation
        (<a href="https://gremlins.dev" className="underline underline-offset-4">gremlins.dev</a>,{" "}
        <a href="https://github.com/zimmski/go-mutesting" className="underline underline-offset-4">zimmski/go-mutesting</a>,{" "}
        <a href="https://github.com/avito-tech/go-mutesting" className="underline underline-offset-4">avito-tech/go-mutesting</a>).
        &ldquo;Not documented&rdquo; means we found no mention of it, not that it&apos;s impossible.
        Spotted a mistake? Open an issue.
      </p>

      <div className="space-y-12">
        <div id="summary">
          <h2 className="text-2xl font-semibold mb-3">In short</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong>Gooze</strong> is built for large codebases and CI: an incremental cache,
              sharding across jobs, a shared OCI baseline, a TUI viewer, and editor integration.
            </li>
            <li>
              <strong>Gremlins</strong> has a built-in score threshold and a git-diff mode, but
              describes itself as best for &ldquo;smallish&rdquo; modules and is still 0.x.
            </li>
            <li>
              <strong>go-mutesting</strong> is a minimal framework: write your own mutators and
              plug in your own test runner with <code className="bg-muted px-1 py-0.5 rounded">--exec</code>.
              The avito-tech fork adds a config file, JSON/HTML reports, and ignore directives.
            </li>
          </ul>
        </div>

        <div id="matrix">
          <h2 className="text-2xl font-semibold mb-3">Feature matrix</h2>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Gooze</TableHead>
                  <TableHead>Gremlins</TableHead>
                  <TableHead>go-mutesting</TableHead>
                  <TableHead>go-mutesting (avito-tech)</TableHead>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div id="choose">
          <h2 className="text-2xl font-semibold mb-3">Which one to pick</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong>Pick Gooze</strong> if runs are slow or the codebase is large: unchanged files
              are never re-tested, a run can be split across CI jobs, and the whole team reuses one
              baseline. Start with the <Link href="/docs/quick-start" className="underline underline-offset-4">Quick start</Link>.
            </li>
            <li>
              <strong>Pick Gremlins</strong> if you need a built-in score threshold flag or
              mutations limited to the lines a PR changed, and the module is small.
            </li>
            <li>
              <strong>Pick go-mutesting</strong> if you need domain-specific mutators or a fully
              custom test runner.
            </li>
          </ul>
        </div>

        <div id="limitations">
          <h2 className="text-2xl font-semibold mb-3">What Gooze doesn&apos;t do (yet)</h2>
          <p className="text-muted-foreground">
            Threshold flag, git-diff mode, custom mutators, and a custom test runner are not
            supported in v1.1.0. Workarounds and status are on the{" "}
            <Link href="/docs/roadmap#limitations" className="underline underline-offset-4">Roadmap</Link>.
          </p>
        </div>

        <div id="faq">
          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-lg font-semibold mb-1">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a.replaceAll("`", "")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
