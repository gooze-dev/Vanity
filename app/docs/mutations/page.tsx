import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { withCode } from "@/components/docs-faq"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Default mutation types and their before -> after transformations.
const mutationTypes = [
  {
    name: "arithmetic",
    ops: "`+` `-` `*` `/` `%`",
    desc: "Swaps a binary math operator. Catches off-by-operator bugs and results that are computed but never asserted.",
    rule: "each operator becomes every other arithmetic operator (`-` shown; also `*`, `/`, `%`)",
    example: `- sum := a + b
+ sum := a - b`,
    survives: "no test checks the numeric result of this expression.",
  },
  {
    name: "comparison",
    ops: "`<` `>` `<=` `>=` `==` `!=`",
    desc: "Swaps a relational operator. Exposes untested boundaries (off-by-one) and branches that are never taken in tests.",
    rule: "each operator becomes every other comparison operator (`>=` shown; also `>`, `<=`, `==`, `!=`), except the one equivalent mutant when an operand is `\"\"` or `0` compared with `len(...)` or `cap(...)`: `len(s) == 0` never becomes `len(s) <= 0`, which behaves the same. This is version 2 of the mutator (since `v1.2.0`); reports from version 1 are re-tested on upgrade.",
    example: `- if a < b {
+ if a >= b {`,
    survives: "a boundary or the two branches of this condition aren't both exercised.",
  },
  {
    name: "logical",
    ops: "`&&` `||`",
    desc: "Flips AND/OR. Reveals conditions where one operand never actually decides the outcome in your tests.",
    rule: "`&&` becomes `||`, and `||` becomes `&&`",
    example: `- if a && b {
+ if a || b {`,
    survives: "one side of the condition is never the deciding factor in any test.",
  },
  {
    name: "boolean",
    ops: "`true` `false`",
    desc: "Inverts a boolean literal. Surfaces feature flags and defaults whose effect is never asserted.",
    rule: "`true` becomes `false`, and `false` becomes `true`",
    example: `- enabled := true
+ enabled := false`,
    survives: "the value of this flag doesn't change any tested behavior.",
  },
  {
    name: "numbers",
    ops: "int & float literals",
    desc: "Replaces a numeric constant with `0` and `1`. Finds magic numbers (limits, sizes, rates) that no test pins down.",
    rule: "a numeric literal becomes `0` and `1` (`0` shown)",
    example: `- limit := 5
+ limit := 0`,
    survives: "the exact value of this constant doesn't matter to any test.",
  },
  {
    name: "unary",
    ops: "`-` `+` `!` `^`",
    desc: "Flips a sign or drops a negation. Catches missing checks on negation, sign, and bitwise complement.",
    rule: "`-x` becomes `+x` (and vice versa); each unary operator (`-`, `+`, `!`, `^`) is also removed",
    example: `- ok := !flag
+ ok := flag`,
    survives: "no test checks the negation or sign here.",
  },
]

// Every mutator, default status, and transformation — a compact matrix engines
// can extract. The six defaults are detailed as cards below.
const referenceRows = [
  { name: "arithmetic", ops: "`+` `-` `*` `/` `%`", rule: "each becomes every other arithmetic operator", def: "Default" },
  { name: "comparison", ops: "`<` `>` `<=` `>=` `==` `!=`", rule: "each becomes every other comparison operator", def: "Default" },
  { name: "logical", ops: "`&&` `||`", rule: "`&&` ↔ `||`", def: "Default" },
  { name: "boolean", ops: "`true` `false`", rule: "`true` ↔ `false`", def: "Default" },
  { name: "numbers", ops: "int & float literals", rule: "literal → `0` and `1`", def: "Default" },
  { name: "unary", ops: "`-` `+` `!` `^`", rule: "`-x` ↔ `+x`; operator removed", def: "Default" },
  { name: "branch", ops: "`if` / `switch` conditions", rule: "condition → `true` / `false`", def: "Off by default" },
  { name: "statement", ops: "statements", rule: "delete a statement", def: "Off by default" },
  { name: "loop", ops: "`for` / `range`", rule: "loop boundaries and body removal", def: "Off by default" },
]

export const metadata = docsMetadata("/docs/mutations")

export default function MutationsPage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Mutation operators</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A report says a <code>comparison</code> mutant survived, and you want to know what
        exactly Gooze changed. A mutation is a tiny change in your code. Gooze applies one
        mutation and runs your tests to see if they notice.
        For what each result status means, see{" "}
        <Link href="/docs/usage/results">Reading results</Link>.
      </p>

      <div>
        <div id="types">
          <h2>Mutation types</h2>
          <p>
            These six types run by default. Each one makes a single, mechanical change to
            one spot in your code, then your tests run against it. If the tests still pass,
            the mutation <strong>survived</strong>, which shows a gap in your tests. Each example below is
            shown as a diff: the <code>-</code> line is
            your code, the <code>+</code> line is what
            Gooze runs instead.
          </p>
          <p>Quick reference (all operators):</p>
          <div className="rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operator</TableHead>
                  <TableHead>Affects</TableHead>
                  <TableHead>Transformation</TableHead>
                  <TableHead>Default</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-muted-foreground">
                {referenceRows.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="font-medium"><code>{r.name}</code></TableCell>
                    <TableCell>{withCode(r.ops)}</TableCell>
                    <TableCell>{withCode(r.rule)}</TableCell>
                    <TableCell>{r.def}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 space-y-8">
            {mutationTypes.map((t) => (
              <div key={t.name} id={t.name}>
                <h3>
                  <code>{t.name}</code>{" "}
                  <span className="text-sm font-normal text-muted-foreground">{withCode(t.ops)}</span>
                </h3>
                <p className="mt-1 mb-1 text-muted-foreground">{withCode(t.desc)}</p>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-medium">Rule:</span> {withCode(t.rule)}
                </p>
                <CodeBlock lang="diff" code={t.example} />
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">If it survives:</span> {t.survives}
                </p>
              </div>
            ))}
          </div>

          <p>
            The engine also contains <code>branch</code>{" "}
            (replace a condition with <code>true</code>/<code>false</code>),{" "}
            <code>statement</code> (delete a statement), and{" "}
            <code>loop</code> (loop boundaries and body
            removal) mutators; these are not part of the default set.
          </p>

          {/* TODO(version): --mutagens arrives in the next gooze release. */}
          <p>
            To run only some of the six types, pass{" "}
            <Link href="/docs/usage/single-function#mutagens"><code>--mutagens</code></Link>{" "}
            (next Gooze release), for example <code>gooze run --mutagens comparison ./...</code>.
          </p>

          <p>
            Skip a line or block with the{" "}
            <Link href="/docs/usage/ignoring-code"><code>{"//gooze:ignore"}</code> directive</Link>.
          </p>
        </div>

        <div id="learn">
          <h2>Next pages</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/docs/mutation-testing">Mutation testing basics</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/usage/results">Reading results</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/troubleshooting">Troubleshooting</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
