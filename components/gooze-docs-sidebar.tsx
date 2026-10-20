"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  BookOpen,
  LifeBuoy,
  Terminal,
  Workflow,
  type LucideIcon,
} from "lucide-react"

import { GoozeLogo } from "@/components/gooze-logo"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  docsPages,
  docsSections,
  getDocsPage,
  navTitle,
  type DocsPage,
  type DocsSection,
} from "@/lib/docs-pages"

const sectionIcons: Record<DocsSection, LucideIcon> = {
  "Get started": Home,
  "Using gooze": Terminal,
  "CI & teams": Workflow,
  Reference: BookOpen,
  Help: LifeBuoy,
}

// Top-level page of the nesting chain (e.g. /docs/cli for /docs/cli/report#view).
function rootOf(page: DocsPage): DocsPage {
  let root = page
  while (root.parent) {
    const parent = getDocsPage(root.parent)
    if (!parent) break
    root = parent
  }
  return root
}

// Built from the docs registry, so adding a page there is enough to list it.
// Nested pages (CLI subcommands) are flattened under their top-level page,
// which is listed first as its "Overview".
function getNavMain(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/docs"
  const current = getDocsPage(path)
  const currentRoot = current ? rootOf(current) : undefined

  return docsSections.map((section) => {
    const pages = docsPages.filter((page) => page.section === section)
    const roots = pages.filter((page) => !page.parent)

    return {
      title: section,
      url: "#",
      icon: sectionIcons[section],
      isActive: current?.section === section,
      items: roots.map((root) => {
        const children = pages.filter((page) => page.parent && rootOf(page) === root)
        return {
          title: navTitle(root),
          url: root.href,
          isActive: currentRoot === root,
          items: children.length
            ? [root, ...children].map((page) => ({
                title: page === root ? "Overview" : navTitle(page),
                url: page.href,
                isActive: page.href === path,
              }))
            : undefined,
        }
      }),
    }
  })
}

export function GoozeDocsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() || "/docs"
  const navMain = React.useMemo(() => getNavMain(pathname), [pathname])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-[color:var(--gooze-green)] to-[color:var(--gooze-teal)] text-white">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <GoozeLogo variant="gradient" className="truncate font-semibold" />
                  <span className="truncate text-xs">Documentation</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain key={pathname} items={navMain} />
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  )
}
