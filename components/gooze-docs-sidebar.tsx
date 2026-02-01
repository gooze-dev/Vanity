"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Command,
  Home,
  FileText,
} from "lucide-react"

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
  const isGetStarted =
    pathname === "/docs" ||
    pathname.startsWith("/docs/quick-start")

  return [
    {
      title: "Get started",
      url: "#",
      icon: Home,
      isActive: isGetStarted && !isFeatures,
      items: [
        {
          title: "Overview",
          url: "/docs",
        },
        {
          title: "Quick start",
          url: "/docs/quick-start",
        },
        {
          title: "Installation",
          url: "/docs/quick-start#installation",
        },
      ],
    },
    {
      title: "Features",
      url: "#",
      icon: Command,
      isActive: isFeatures,
      items: [
        {
          title: "Bypass mutation",
          url: "/docs/features/bypass-mutation",
        },
        {
          title: "Incremental execution",
          url: "/docs/features/incremental-execution",
        },
        {
          title: "UI modes",
          url: "/docs/features/ui-modes",
        },
      ],
    },
    {
      title: "Roadmap",
      url: "#",
      icon: FileText,
      isActive: isRoadmap,
      items: [
        {
          title: "Roadmap",
          url: "/docs/roadmap",
        },
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
                          <span className="truncate font-semibold bg-gradient-to-r from-[color:var(--gooze-green)] to-[color:var(--gooze-teal)] bg-clip-text text-transparent">
                            Gooze
                          </span>
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
