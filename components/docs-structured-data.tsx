"use client"

import { usePathname } from "next/navigation"

import { getDocsPage, SITE_URL } from "@/lib/docs-pages"

// Emits BreadcrumbList structured data for the current docs page so search
// engines can show breadcrumb trails in results. Derived from the URL segments
// and the docs registry, so it stays correct as pages are added.
export function DocsStructuredData() {
  const pathname = usePathname() || "/docs"
  const clean = pathname.replace(/\/$/, "") || "/docs"

  const segments = clean.split("/").filter(Boolean) // e.g. ["docs", "cli", "run"]

  const items = segments.map((_, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const page = getDocsPage(href)
    const name =
      page?.title ?? (href === "/docs" ? "Documentation" : segments[index])

    return {
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${SITE_URL}${href}/`,
    }
  })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
