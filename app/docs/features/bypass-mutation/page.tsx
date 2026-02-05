import { CodeBlock } from "@/components/code-block"

export default function BypassMutationPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Bypass mutation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Skip mutations when you already know certain paths or regions shouldn&apos;t be touched.
      </p>

      <div className="rounded-lg border bg-card p-5 mb-10">
        <p className="text-muted-foreground">
          Tip: ignore as little as possible.
          If you ignore too much, mutation testing becomes less useful.
        </p>
      </div>

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Exclude files with <code className="bg-muted px-1 py-0.5 rounded">-x/--exclude</code>
          </h2>
          <p className="mb-3 text-muted-foreground">
            Skip files by regex. You can pass <code className="bg-muted px-1 py-0.5 rounded">-x</code> multiple times.
          </p>
          <CodeBlock lang="bash" code="gooze run -x '^vendor/' -x '^mock_' ./..." />
          <p className="mt-3 text-sm text-muted-foreground">
            The regex matches either the full path or the base filename.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Annotation skipping <code className="bg-muted px-1 py-0.5 rounded">{"//gooze:ignore"}</code>
          </h2>
          <p className="mb-3 text-muted-foreground">
            Place <code className="bg-muted px-1 py-0.5 rounded">{"//gooze:ignore"}</code> to skip generating mutations for a file,
            a function/method, or a single line.
          </p>
          <p className="mb-3 text-muted-foreground">
            Optionally target specific mutagens: <code className="bg-muted px-1 py-0.5 rounded">{"//gooze:ignore arithmetic,comparison"}</code>.
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
              <h3 className="text-lg font-semibold mb-2">Example: ignore the whole file</h3>
              <p className="mb-2 text-muted-foreground">
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
              <h3 className="text-lg font-semibold mb-2">Example: ignore one function</h3>
              <p className="mb-2 text-muted-foreground">
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
              <h3 className="text-lg font-semibold mb-2">Example: ignore one line</h3>
              <p className="mb-2 text-muted-foreground">
                Put it at the end of the line.
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
