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

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function DocsBreadcrumb() {
  const pathname = usePathname() || "/docs"
  const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean)

  // Expected:
  // /docs
  // /docs/quick-start
  // /docs/features/<slug>
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
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="hidden md:block" />

        <BreadcrumbItem>
          {onDocsHome ? (
            <BreadcrumbPage>Documentation</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href="/docs">Documentation</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {section === "features" && featureSlug ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/docs#features">Features</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{featureTitles[featureSlug] ?? titleFromSlug(featureSlug)}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : section ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{titleFromSlug(section)}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
