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
  isActive?: boolean
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

// Only the current page is highlighted, in the gooze accent. Sections and
// groups just start expanded when they contain it.
const pageLinkClass =
  "data-active:bg-transparent data-active:font-medium data-active:text-[color:var(--gooze-teal)]"

// A second-level entry that may itself expand into a third level (e.g. the CLI
// reference expanding into its individual commands).
function NavSub({ item }: { item: NavSubItem }) {
  if (!item.items?.length) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={item.isActive} className={pageLinkClass}>
          <a href={item.url} aria-current={item.isActive ? "page" : undefined}>
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
          <SidebarMenuSubButton className="cursor-pointer">
            <span>{item.title}</span>
            <ChevronRight className="ml-auto text-muted-foreground transition-transform duration-200 group-data-[state=open]/sub:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((leaf) => (
              <SidebarMenuSubItem key={leaf.title}>
                <SidebarMenuSubButton asChild isActive={leaf.isActive} className={pageLinkClass}>
                  <a href={leaf.url} aria-current={leaf.isActive ? "page" : undefined}>
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
                <SidebarMenuButton tooltip={item.title} className={cn(item.isActive && "font-medium")}>
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
                  <ChevronRight className="ml-auto text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
