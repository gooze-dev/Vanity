import * as React from "react"

import { GoozeDocsSidebar } from "@/components/gooze-docs-sidebar"
import { DocsBreadcrumb } from "@/components/docs-breadcrumb"
import { DocsPager } from "@/components/docs-pager"
import { DocsSearch } from "@/components/docs-search"
import { DocsStructuredData } from "@/components/docs-structured-data"
import { DocsToc } from "@/components/docs-toc"
import { HeadingAnchors } from "@/components/heading-anchors"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="gooze-docs">
      <DocsStructuredData />
      <SidebarProvider defaultOpen={true}>
        <GoozeDocsSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex min-w-0 flex-1 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 text-[color:var(--gooze-teal)] hover:text-[color:var(--gooze-green)]" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DocsBreadcrumb />
            </div>
            <div className="flex items-center gap-2 pr-4">
              <DocsSearch />
              <ThemeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
            <div className="mx-auto flex w-full max-w-4xl gap-10 xl:max-w-6xl">
              <div className="min-w-0 flex-1 space-y-8">
                <DocsToc collapsible className="xl:hidden" />
                <article id="docs-content" className="typeset typeset-docs">
                  {children}
                </article>
                <HeadingAnchors />
                <DocsPager />
              </div>
              <aside className="hidden w-52 shrink-0 xl:block">
                <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                  <DocsToc />
                </div>
              </aside>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
