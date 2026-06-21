"use client"

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
  init: "init",
  view: "view",
  merge: "merge",
  push: "push",
  pull: "pull",
  version: "version",
}

// CLI commands that are groups with their own subcommand pages.
const cliGroups = new Set(["report", "config"])

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function DocsBreadcrumb() {
  const pathname = usePathname() || "/docs"
  const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean)

  // Common:
  // /docs
  // /docs/<section>
  // /docs/features/<slug>
  // /docs/cli/<command>
  const isDocs = parts[0] === "docs"
  const section = parts[1]
  const featureSlug = parts[2]

  if (!isDocs) {
    return null
  }

  const onDocsHome = parts.length === 1

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href="/" className="transition-colors hover:text-[color:var(--gooze-teal)]">
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="hidden md:block" />

        <BreadcrumbItem>
          {onDocsHome ? (
            <BreadcrumbPage>Documentation</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href="/docs" className="transition-colors hover:text-[color:var(--gooze-teal)]">
                Documentation
              </Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {section === "features" && featureSlug ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/docs#features" className="transition-colors hover:text-[color:var(--gooze-teal)]">
                  Features
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{featureTitles[featureSlug] ?? titleFromSlug(featureSlug)}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : section === "cli" && parts.length >= 4 && cliGroups.has(parts[2]) ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/docs/cli"
                  className="transition-colors hover:text-[color:var(--gooze-teal)]"
                >
                  {sectionTitles.cli}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/docs/cli/${parts[2]}`}
                  className="transition-colors hover:text-[color:var(--gooze-teal)]"
                >
                  {cliCommandTitles[parts[2]] ?? titleFromSlug(parts[2])}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {cliCommandTitles[parts[3]] ?? titleFromSlug(parts[3])}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : section && parts.length >= 3 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/docs/${section}`}
                  className="transition-colors hover:text-[color:var(--gooze-teal)]"
                >
                  {sectionTitles[section] ?? titleFromSlug(section)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {section === "cli" && parts[2]
                  ? cliCommandTitles[parts[2]] ?? titleFromSlug(parts[2])
                  : titleFromSlug(parts[2])}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : section ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{sectionTitles[section] ?? titleFromSlug(section)}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
