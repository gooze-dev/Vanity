"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Command,
  Home,
  FileText,
  BookOpen,
  GraduationCap,
  Map,
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

// Gooze documentation data
function getNavMain(pathname: string) {
  const isFeatures = pathname.startsWith("/docs/features/")
  const isRoadmap = pathname.startsWith("/docs/roadmap")
  const isGuides =
    pathname.startsWith("/docs/ci") ||
    pathname.startsWith("/docs/gitlab") ||
    pathname.startsWith("/docs/editor-support") ||
    pathname.startsWith("/docs/troubleshooting")
  const isReference =
    pathname.startsWith("/docs/cli") ||
    pathname.startsWith("/docs/config") ||
    pathname.startsWith("/docs/reports") ||
    pathname.startsWith("/docs/mutations")
  const isGetStarted =
    pathname === "/docs" ||
    pathname.startsWith("/docs/quick-start") ||
    pathname.startsWith("/docs/install") ||
    pathname.startsWith("/docs/mutation-testing")

  return [
    {
      title: "Get started",
      url: "#",
      icon: Home,
      isActive: isGetStarted,
      items: [
        { title: "Overview", url: "/docs" },
        { title: "Quick start", url: "/docs/quick-start" },
        { title: "Installation", url: "/docs/install" },
        { title: "What is mutation testing?", url: "/docs/mutation-testing" },
      ],
    },
    {
      title: "Reference",
      url: "#",
      icon: BookOpen,
      isActive: isReference,
      items: [
        { title: "CLI reference", url: "/docs/cli" },
        { title: "Configuration", url: "/docs/config" },
        { title: "Reports", url: "/docs/reports" },
        { title: "Mutations", url: "/docs/mutations" },
      ],
    },
    {
      title: "Features",
      url: "#",
      icon: Command,
      isActive: isFeatures,
      items: [
        { title: "Bypass mutation", url: "/docs/features/bypass-mutation" },
        { title: "Incremental execution", url: "/docs/features/incremental-execution" },
        { title: "UI modes", url: "/docs/features/ui-modes" },
      ],
    },
    {
      title: "Guides",
      url: "#",
      icon: GraduationCap,
      isActive: isGuides,
      items: [
        { title: "GitHub Actions", url: "/docs/ci" },
        { title: "GitLab CI", url: "/docs/gitlab" },
        { title: "Editor support (LSP)", url: "/docs/editor-support" },
        { title: "Troubleshooting", url: "/docs/troubleshooting" },
      ],
    },
    {
      title: "Roadmap",
      url: "#",
      icon: Map,
      isActive: isRoadmap,
      items: [
        { title: "Roadmap", url: "/docs/roadmap" },
      ],
    },
  ]
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
        <NavMain items={navMain} />
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  )
}
