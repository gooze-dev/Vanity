"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type NavLeaf = {
  title: string
  url: string
}

type NavSubItem = NavLeaf & {
  isActive?: boolean
  items?: NavLeaf[]
}

type NavGroup = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavSubItem[]
}

// A second-level entry that may itself expand into a third level (e.g. the CLI
// reference expanding into its individual commands).
function NavSub({ item }: { item: NavSubItem }) {
  if (!item.items?.length) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={item.isActive}>
          <a href={item.url}>
            <span>{item.title}</span>
          </a>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Collapsible asChild defaultOpen={item.isActive} className="group/sub">
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton className="cursor-pointer" isActive={item.isActive}>
            <span>{item.title}</span>
            <ChevronRight className="ml-auto text-[color:var(--gooze-teal)] transition-transform duration-200 group-data-[state=open]/sub:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((leaf) => (
              <SidebarMenuSubItem key={leaf.title}>
                <SidebarMenuSubButton asChild size="sm">
                  <a href={leaf.url}>
                    <span>{leaf.title}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  )
}

export function NavMain({ items }: { items: NavGroup[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "transition-colors",
                        item.isActive
                          ? "text-[color:var(--gooze-green)]"
                          : "text-[color:var(--gooze-teal)]"
                      )}
                    />
                  )}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto text-[color:var(--gooze-teal)] transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <NavSub key={subItem.title} item={subItem} />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
