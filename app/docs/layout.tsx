import * as React from "react"

import { GoozeDocsSidebar } from "@/components/gooze-docs-sidebar"
import { DocsBreadcrumb } from "@/components/docs-breadcrumb"
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
      <SidebarProvider defaultOpen={true}>
        <GoozeDocsSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 flex-1">
              <SidebarTrigger className="-ml-1 text-[color:var(--gooze-teal)] hover:text-[color:var(--gooze-green)]" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DocsBreadcrumb />
            </div>
            <div className="pr-4">
              <ThemeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="mx-auto w-full max-w-4xl space-y-8">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
