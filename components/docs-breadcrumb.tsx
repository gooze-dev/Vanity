"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getDocsTrail, getSectionLanding, navTitle } from "@/lib/docs-pages"
import { cn } from "@/lib/utils"

type Crumb = {
  label: string
  href?: string
}

// Home > Documentation > Section > parents... > page, from the docs registry.
function buildCrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Documentation", href: "/docs" },
  ]

  const trail = getDocsTrail(pathname)
  if (trail.length && trail[trail.length - 1].href !== "/docs") {
    const section = trail[0].section
    const landing = getSectionLanding(section)?.href
    // Only link the section when its landing page isn't the next crumb anyway.
    crumbs.push({ label: section, href: landing !== trail[0].href ? landing : undefined })
    for (const page of trail) {
      crumbs.push({ label: navTitle(page), href: page.href })
    }
  }

  const last = crumbs[crumbs.length - 1]
  delete last.href
  return crumbs
}

export function DocsBreadcrumb() {
  const pathname = usePathname() || "/docs"
  const path = pathname.split("?")[0].split("#")[0].replace(/\/$/, "")

  if (!path.startsWith("/docs")) {
    return null
  }

  const crumbs = buildCrumbs(path)
  const firstVisible = Math.max(0, crumbs.length - 2)

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {crumbs.map((crumb, index) => {
          const collapsed = index < firstVisible
          return (
            <React.Fragment key={`${index}:${crumb.label}`}>
              {index > 0 && (
                <BreadcrumbSeparator className={cn(index <= firstVisible && "hidden md:inline-flex")} />
              )}
              <BreadcrumbItem
                className={cn(
                  index === crumbs.length - 1 ? "shrink-0" : "min-w-0",
                  collapsed && "hidden md:inline-flex",
                )}
              >
                {crumb.href ? (
                  <BreadcrumbLink asChild>
                    <Link
                      href={crumb.href}
                      className="truncate transition-colors hover:text-[color:var(--gooze-teal)]"
                    >
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
