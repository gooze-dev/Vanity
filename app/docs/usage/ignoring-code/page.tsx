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
        Skip mutations when you already know certain paths or regions shouldn&apos;t be touched.
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
          <CodeBlock lang="bash" code="gooze run -x '^vendor/' -x '^mock_' ./..." />
          <p className="text-sm text-muted-foreground">
            The regex matches the path relative to the working directory (so{" "}
            <code>^vendor/</code> works), the absolute path, or the base filename.{" "}
            <code>vendor/</code>, <code>testdata/</code>, directories starting with{" "}
            <code>.</code> or <code>_</code>, and nested modules are skipped automatically.
          </p>
        </div>

        <div>
          <h2>
            Annotation skipping <code>{"//gooze:ignore"}</code>
          </h2>
          <p>
            Place <code>{"//gooze:ignore"}</code> to skip generating mutations for a file,
            a function/method, or a single line.
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
                Put the directive near the top of the file.
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
      </div>
    </section>
  )
}
