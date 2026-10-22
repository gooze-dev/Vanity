import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb } from "lucide-react"

export const metadata = docsMetadata("/docs/usage/ignoring-code")

export default function IgnoringCodePage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Ignoring code</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Sometimes a run reports mutants in code you don&apos;t want to test: vendored or generated
        files, mocks, debug helpers. Skip those paths or regions, so the survivors that remain point
        to tests you should write.
      </p>

      <Alert>
        <Lightbulb />
        <AlertTitle>Ignore as little as possible</AlertTitle>
        <AlertDescription>
          Every ignored line is a line your tests are never checked against.
          If you ignore too much, mutation testing becomes less useful.
        </AlertDescription>
      </Alert>

      <div>
        <div>
          <h2>
            Exclude files with <code>-x/--exclude</code>
          </h2>
          <p>
            Skip files by regex. You can pass <code>-x</code> multiple times.
          </p>
          <CodeBlock lang="bash" code="gooze run -x mocks/ -x '^mock_' ./..." />
          <p className="text-sm text-muted-foreground">
            The regex matches the path relative to the working directory (so{" "}
            <code>^vendor/</code> works), the absolute path, or the base filename.{" "}
            <code>vendor/</code>, <code>testdata/</code>, directories starting with{" "}
            <code>.</code> or <code>_</code>, and nested modules are skipped automatically.
          </p>
        </div>

        <div>
          <h2>
            Skip code with <code>{"//gooze:ignore"}</code>
          </h2>
          <p>
            Place <code>{"//gooze:ignore"}</code> to skip generating mutations for a file,
            a function or method, or a single line.
          </p>
          <p>
            Optionally target specific mutagens: <code>{"//gooze:ignore arithmetic,comparison"}</code>.
            Names may be separated by commas or spaces. The keyword must be exactly{" "}
            <code>gooze:ignore</code> followed by whitespace or the end of the comment
            (<code>gooze:ignored</code> is not a directive).
          </p>
          <CodeBlock
            lang="go"
            code={`//gooze:ignore arithmetic,comparison
package main

func main() {
  x := 1 + 2 //gooze:ignore numbers
  _ = x
}`}
          />

          <div className="mt-8 space-y-6">
            <div>
              <h3>Example: ignore the whole file</h3>
              <p>
                Put the directive above the <code>package</code> clause.
              </p>
              <CodeBlock
                lang="go"
                code={`//gooze:ignore
package main

// Whole file is ignored
`}
              />
            </div>

            <div>
              <h3>Example: ignore one function</h3>
              <p>
                Put it on the function you want to ignore.
              </p>
              <CodeBlock
                lang="go"
                code={`package main

//gooze:ignore comparison
func isOk(x int) bool {
  return x > 0
}
`}
              />
            </div>

            <div>
              <h3>Example: ignore one line</h3>
              <p>
                Put it at the end of the line, or on its own comment line directly above it.
                A directive on its own line applies to the first code line after its comment
                group, even if more comment lines follow.
              </p>
              <CodeBlock
                lang="go"
                code={`package main

func f() int {
  x := 1 + 2 //gooze:ignore numbers
  return x
}
`}
              />
            </div>
          </div>
        </div>

        <div id="generated">
          <h2>Generated files</h2>
          <p>
            Generated code such as mocks, protobuf and <code>stringer</code> output has no tests of
            its own, so its mutants survive and lower your score. Gooze doesn&apos;t skip files by their{" "}
            <code>{"// Code generated ... DO NOT EDIT."}</code> header, so exclude them in a way
            that survives regeneration.
          </p>
          <p>
            If the generator can add a header, have it write <code>{"//gooze:ignore"}</code>. With
            mockery, put the directive in a file and point <code>boilerplate-file</code> at it:
          </p>
          <CodeBlock lang="bash" code={`echo '//gooze:ignore' > .mockery-boilerplate.txt`} />
          <CodeBlock
            lang="yaml"
            code={`# .mockery.yaml
with-expecter: true
boilerplate-file: .mockery-boilerplate.txt`}
          />
          <p>
            Every mock mockery writes then starts with <code>{"//gooze:ignore"}</code>, including
            mocks that live next to your code instead of in a <code>mocks/</code> folder.
          </p>
          <p>
            For other generators, exclude them by path in <code>gooze.yaml</code>, so every run
            skips them without a flag:
          </p>
          <CodeBlock
            lang="yaml"
            code={`paths:
  exclude: ['^mock_', 'mocks/', '\\.pb\\.go$', '_string\\.go$']`}
          />
        </div>
      </div>
    </section>
  )
}
