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
import { cn } from "@/lib/utils"

const featureTitles: Record<string, string> = {
  "bypass-mutation": "Bypass mutation",
  "incremental-execution": "Incremental execution",
  "ui-modes": "UI modes",
}

const sectionTitles: Record<string, string> = {
  "quick-start": "Quick start",
  install: "Installation",
  "mutation-testing": "Mutation testing",
  cli: "CLI",
  config: "Configuration",
  reports: "Reports",
  mutations: "Mutations",
  "editor-support": "Editor support",
  troubleshooting: "Troubleshooting",
  ci: "GitHub Actions",
  gitlab: "GitLab CI",
}

const cliCommandTitles: Record<string, string> = {
  run: "run",
  report: "report",
  config: "config",
  version: "version",
}

type Crumb = {
  label: string
  href?: string
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function buildCrumbs(parts: string[]): Crumb[] {
  const section = parts[1]
  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Documentation", href: "/docs" },
  ]

  if (section === "features" && parts[2]) {
    crumbs.push(
      { label: "Features", href: "/docs#features" },
      { label: featureTitles[parts[2]] ?? titleFromSlug(parts[2]) },
    )
  } else if (section && parts.length >= 3) {
    crumbs.push(
      { label: sectionTitles[section] ?? titleFromSlug(section), href: `/docs/${section}` },
      {
        label:
          section === "cli"
            ? cliCommandTitles[parts[2]] ?? titleFromSlug(parts[2])
            : titleFromSlug(parts[2]),
      },
    )
  } else if (section) {
    crumbs.push({ label: sectionTitles[section] ?? titleFromSlug(section) })
  }

  const last = crumbs[crumbs.length - 1]
  delete last.href
  return crumbs
}

export function DocsBreadcrumb() {
  const pathname = usePathname() || "/docs"
  const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean)

  if (parts[0] !== "docs") {
    return null
  }

  const crumbs = buildCrumbs(parts)
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
