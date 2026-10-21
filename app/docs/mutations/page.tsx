import { docsMetadata } from "@/lib/docs-meta"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Recording } from "@/components/recording"
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
  {
    name: "bitwise",
    ops: "`&` `|` `^` `&^` `<<` `>>`",
    desc: "Swaps a binary bitwise operator. Finds masks, flags and shifts whose exact bits no test checks.",
    rule: "`&` ↔ `|`, `^` → `&`, `&^` → `&`, `<<` ↔ `>>`; one mutant per operator. A type constraint such as `int | string` is never mutated.",
    example: `- mode := perm & 0o755
+ mode := perm | 0o755`,
    survives: "no test checks which bits this expression keeps or sets.",
  },
  {
    name: "increment",
    ops: "`++` `--`",
    desc: "Turns an increment into a decrement and back. Catches counters and indexes whose direction is never asserted.",
    rule: "`x++` ↔ `x--`, except in a `for` loop's post statement, where `i--` would only loop until the test times out",
    example: `- retries++
+ retries--`,
    survives: "no test checks the value this statement counts.",
  },
  {
    name: "assignment",
    ops: "`+=` `-=` `*=` `/=` `%=` `&=` `|=` `^=` `&^=` `<<=` `>>=`",
    desc: "Changes a compound assignment. Shows totals and accumulators whose result no test pins down.",
    rule: "the operator is swapped (`+=` ↔ `-=`, `*=` ↔ `/=`, `%=` → `*=`, `&=` ↔ `|=`, `^=` → `&=`, `&^=` → `&=`, `<<=` ↔ `>>=`) and `x op= y` becomes `x = y`. With a string literal on the right, only `x = y`. A `for` loop's post statement is left alone.",
    example: `- total += price
+ total -= price`,
    survives: "no test checks the accumulated value, or it only ever starts from zero.",
  },
]

// The mutagens that run only when selected, with what each one does.
const optInTypes = [
  {
    name: "branch",
    does: "Inverts an `if` condition and forces it `true` and `false`; removes an `if` block (such as `if err != nil { return err }`) and an `else` block; empties each `switch` case. A `for` condition is inverted and forced `false`, never `true`.",
  },
  {
    name: "statement",
    does: "Deletes an assignment, a call, a `defer`, a `go` statement or a channel send. A declaration with `:=` is kept, since its uses would not compile without it.",
  },
  {
    name: "loop",
    does: "Changes a loop boundary (`<` ↔ `<=`, `>` ↔ `>=`), empties a loop body, removes `break` and `continue`, and replaces a recursive call with `0`. A body is emptied only when a post statement or a `range` still ends the loop, `break` is removed only from a loop with a condition or a `range`, and a recursive call is replaced only in a function that returns one number.",
  },
]

// Every mutator, default status, and transformation, a compact matrix engines
// can extract. The nine defaults are detailed as cards below.
const referenceRows = [
  { name: "arithmetic", ops: "`+` `-` `*` `/` `%`", rule: "each becomes every other arithmetic operator", def: "Default" },
  { name: "comparison", ops: "`<` `>` `<=` `>=` `==` `!=`", rule: "each becomes every other comparison operator", def: "Default" },
  { name: "logical", ops: "`&&` `||`", rule: "`&&` ↔ `||`", def: "Default" },
  { name: "boolean", ops: "`true` `false`", rule: "`true` ↔ `false`", def: "Default" },
  { name: "numbers", ops: "int & float literals", rule: "literal → `0` and `1`", def: "Default" },
  { name: "unary", ops: "`-` `+` `!` `^`", rule: "`-x` ↔ `+x`; operator removed", def: "Default" },
  { name: "bitwise", ops: "`&` `|` `^` `&^` `<<` `>>`", rule: "`&` ↔ `|`, `^` `&^` → `&`, `<<` ↔ `>>`", def: "Default" },
  { name: "increment", ops: "`++` `--`", rule: "`x++` ↔ `x--`", def: "Default" },
  { name: "assignment", ops: "`+=` `-=` `&=` …", rule: "operator swapped; `x op= y` → `x = y`", def: "Default" },
  { name: "branch", ops: "`if` / `for` / `switch`", rule: "condition inverted or forced; block removed", def: "When selected" },
  { name: "statement", ops: "statements", rule: "delete a statement", def: "When selected" },
  { name: "loop", ops: "`for` / `range`", rule: "boundaries, body, `break` / `continue`", def: "When selected" },
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
            Nine types run by default, and three more run when you select them. Each one makes a single, mechanical change to
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

          <div id="example">
            <h3>Example: bits, counters and totals</h3>
            <p>
              A small package that clears permission bits and adds up file sizes gets a
              mutant from each of <code>bitwise</code>, <code>increment</code> and{" "}
              <code>assignment</code>, plus two from <code>numbers</code>:
            </p>
            <Recording name="perm-source" title="Recorded perm.go" />
            <p>Its tests check the mask and the total, but never the count:</p>
            <Recording name="perm-run" title="Recorded gooze run on perm" />
            <Recording name="perm-view" title="Recorded gooze report view on perm" />
          </div>

          <div id="opt-in">
            <h3>Mutagens you select</h3>
            <p>
              <code>branch</code>, <code>statement</code> and <code>loop</code> make larger
              changes: they remove blocks and statements instead of swapping one operator.
              Many of those changes don&apos;t compile in Go (a variable left unused, a function
              left without a <code>return</code>), and those mutants count as{" "}
              <code>error</code>, outside the score. Some make code wait forever, such as a
              deleted <code>defer mu.Unlock()</code>, and those count as <code>timeout</code>. So
              they run only when you name them:
            </p>
            <CodeBlock lang="bash" code="gooze run --mutagens branch,statement,loop ./..." />
            <Recording name="calc-opt-in-mutagens" title="Recorded gooze run --mutagens branch,statement,loop on calc" />
            <p>
              Like any <Link href="/docs/usage/single-function#mutagens"><code>--mutagens</code></Link>{" "}
              run, its reports go to <code>run/</code>, and <code>gooze report merge</code> folds
              them into the main reports. What each one changes:
            </p>
            <ul>
              {optInTypes.map((t) => (
                <li key={t.name} id={t.name}>
                  <code>{t.name}</code>: {withCode(t.does)}
                </li>
              ))}
            </ul>
          </div>

          <p>
            To run only some types, or to add the ones you select, pass{" "}
            <Link href="/docs/usage/single-function#mutagens"><code>--mutagens</code></Link>{" "}
            with every type to run, for example <code>gooze run --mutagens comparison ./...</code>.
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
