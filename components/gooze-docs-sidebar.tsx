"use client"

import * as React from "react"
import {
  BookOpen,
  Command,
  FileText,
  Home,
  Play,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

// Gooze documentation data
const data = {
  user: {
    name: "Gooze User",
    email: "user@example.com",
    avatar: "", // No avatar image
  },
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Introduction",
          url: "#introduction",
        },
        {
          title: "Quick Start",
          url: "#quick-start",
        },
        {
          title: "Installation",
          url: "#installation",
        },
      ],
    },
    {
      title: "Commands",
      url: "#",
      icon: Command,
      items: [
        {
          title: "gooze list",
          url: "#list",
        },
        {
          title: "gooze run",
          url: "#run",
        },
        {
          title: "gooze view",
          url: "#view",
        },
      ],
    },
    {
      title: "Concepts",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Mutation Testing",
          url: "#mutation-testing",
        },
        {
          title: "Mutation Types",
          url: "#mutation-types",
        },
        {
          title: "Test Status",
          url: "#test-status",
        },
      ],
    },
    {
      title: "Advanced",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Configuration",
          url: "#configuration",
        },
        {
          title: "Ignore Directives",
          url: "#ignore-directives",
        },
        {
          title: "Sharding",
          url: "#sharding",
        },
      ],
    },
    {
      title: "Examples",
      url: "#",
      icon: Play,
      items: [
        {
          title: "Basic Usage",
          url: "#basic",
        },
        {
          title: "CI/CD Integration",
          url: "#cicd",
        },
        {
          title: "Reports",
          url: "#reports",
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
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Gooze</span>
                  <span className="truncate text-xs">Documentation</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
