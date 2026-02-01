"use client"

import * as React from "react"
import Link from "next/link"
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
const data = {
  navMain: [
    {
      title: "Get started",
      url: "#",
      icon: Home,
      isActive: true,
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
  ],
}

export function GoozeDocsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Gooze</span>
                  <span className="truncate text-xs">Documentation</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  )
}
