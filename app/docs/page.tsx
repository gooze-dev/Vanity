import { GoozeDocsSidebar } from "@/components/gooze-docs-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"

export default function DocsPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <GoozeDocsSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Documentation</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="pr-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mx-auto w-full max-w-4xl space-y-8">
            <section id="introduction">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Gooze Documentation</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Gooze is a mutation testing tool for Go that helps you assess the quality
                of your test suite by introducing small changes (mutations) to your code
                and verifying that your tests catch them.
              </p>
            </section>

            <section id="quick-start">
              <h2 className="text-3xl font-bold tracking-tight mb-4 border-b pb-2">Quick Start</h2>
              
              <div className="space-y-4">
                <div id="installation">
                  <h3 className="text-2xl font-semibold mb-3">Installation</h3>
                  <p className="mb-3 text-muted-foreground">
                    Install the latest <code className="bg-muted px-1 py-0.5 rounded">gooze</code> binary to your Go bin directory:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>go install github.com/mouse-blink/gooze@latest</code>
                  </pre>
                </div>

                <div id="list">
                  <h3 className="text-2xl font-semibold mb-3 mt-6">List Files and Mutations</h3>
                  <p className="mb-3 text-muted-foreground">
                    Preview which files will be mutated and how many mutations apply:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>gooze list ./...</code>
                  </pre>
                </div>

                <div id="run">
                  <h3 className="text-2xl font-semibold mb-3 mt-6">Run Mutation Testing</h3>
                  <p className="mb-3 text-muted-foreground">
                    Execute mutation testing across the target paths:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>gooze run ./...</code>
                  </pre>
                </div>

                <div id="view">
                  <h3 className="text-2xl font-semibold mb-3 mt-6">View Reports</h3>
                  <p className="mb-3 text-muted-foreground">
                    By default, Gooze writes mutation reports to <code className="bg-muted px-1 py-0.5 rounded">.gooze-reports</code>. 
                    View the last run:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>gooze view</code>
                  </pre>
                  <p className="mt-3 text-muted-foreground">
                    Or point <code className="bg-muted px-1 py-0.5 rounded">view</code> at an explicit directory:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>gooze view -o .gooze-reports</code>
                  </pre>
                </div>
              </div>
            </section>

            <section id="mutation-testing">
              <h2 className="text-3xl font-bold tracking-tight mb-4 border-b pb-2">Understanding Mutation Testing</h2>
              <p className="mb-4 text-muted-foreground">
                Mutation testing is a technique to evaluate the quality of your test suite by introducing
                small, deliberate changes (mutations) to your source code. The goal is to verify that your
                tests can detect these changes.
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-950 p-4 rounded">
                  <strong className="text-green-700 dark:text-green-300">Killed:</strong> 
                  <span className="ml-2 text-muted-foreground">The mutation caused tests to fail - your tests caught the bug!</span>
                </div>
                <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-950 p-4 rounded">
                  <strong className="text-red-700 dark:text-red-300">Survived:</strong> 
                  <span className="ml-2 text-muted-foreground">Tests still passed - indicating a gap in test coverage.</span>
                </div>
                <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 p-4 rounded">
                  <strong className="text-yellow-700 dark:text-yellow-300">Timeout:</strong> 
                  <span className="ml-2 text-muted-foreground">Tests took too long - possible infinite loop.</span>
                </div>
              </div>
            </section>

            <section id="mutation-types">
              <h2 className="text-3xl font-bold tracking-tight mb-4 border-b pb-2">Mutation Types</h2>
              <p className="mb-4 text-muted-foreground">Gooze supports several types of mutations:</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Arithmetic</h4>
                  <p className="text-sm text-muted-foreground">
                    Changes operators like <code className="bg-muted px-1 py-0.5 rounded">+</code> to <code className="bg-muted px-1 py-0.5 rounded">-</code>, 
                    <code className="bg-muted px-1 py-0.5 rounded">*</code> to <code className="bg-muted px-1 py-0.5 rounded">/</code>
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Boolean</h4>
                  <p className="text-sm text-muted-foreground">
                    Flips <code className="bg-muted px-1 py-0.5 rounded">true</code> to <code className="bg-muted px-1 py-0.5 rounded">false</code> and vice versa
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Comparison</h4>
                  <p className="text-sm text-muted-foreground">
                    Swaps operators like <code className="bg-muted px-1 py-0.5 rounded">&gt;</code> to <code className="bg-muted px-1 py-0.5 rounded">&lt;</code>, 
                    <code className="bg-muted px-1 py-0.5 rounded">==</code> to <code className="bg-muted px-1 py-0.5 rounded">!=</code>
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Logical</h4>
                  <p className="text-sm text-muted-foreground">
                    Changes <code className="bg-muted px-1 py-0.5 rounded">&amp;&amp;</code> to <code className="bg-muted px-1 py-0.5 rounded">||</code> and similar
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Numbers</h4>
                  <p className="text-sm text-muted-foreground">
                    Mutates numeric literals to 0 or 1
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Branch</h4>
                  <p className="text-sm text-muted-foreground">
                    Removes or modifies conditional branches
                  </p>
                </div>
              </div>
            </section>

            <section id="ignore-directives">
              <h2 className="text-3xl font-bold tracking-tight mb-4 border-b pb-2">Ignore Directives</h2>
              <p className="mb-4 text-muted-foreground">
                You can exclude specific code from mutation testing using special comments:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">File-level ignore</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{`//gooze:ignore arithmetic
package main

func Calculate(a int) int {
    return a + 1  // This won't be mutated
}`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Function-level ignore</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{`//gooze:ignore
func ignoredFunc(a int) int {
    return a + 1  // This function is completely ignored
}`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Line-level ignore</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{`func calculate(a int) int {
    _ = a + 1  //gooze:ignore arithmetic
    return a + 2  // Only this line will be mutated
}`}</code>
                  </pre>
                </div>
              </div>
            </section>

            <section id="sharding">
              <h2 className="text-3xl font-bold tracking-tight mb-4 border-b pb-2">Sharding for CI/CD</h2>
              <p className="mb-4 text-muted-foreground">
                Split mutation testing across multiple CI jobs for faster execution:
              </p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`# Job 1
gooze run --shard 0/3 ./...

# Job 2
gooze run --shard 1/3 ./...

# Job 3
gooze run --shard 2/3 ./...`}</code>
              </pre>
            </section>

            <section id="reports" className="pb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-4 border-b pb-2">Reports</h2>
              <p className="mb-4 text-muted-foreground">
                Gooze generates YAML reports with detailed information about each mutation:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>One YAML file per report: <code className="bg-muted px-1 py-0.5 rounded">&lt;hash&gt;.yaml</code></li>
                <li>An index file: <code className="bg-muted px-1 py-0.5 rounded">_index.yaml</code></li>
                <li>Mutation score and detailed status for each mutation</li>
                <li>Diffs showing what changed in each mutation</li>
              </ul>
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
