"use client"

import { usePathname } from "next/navigation"

import { getDocsPage, SITE_URL } from "@/lib/docs-pages"

// Emits structured data for the current docs page:
// - BreadcrumbList, so search engines can show breadcrumb trails in results.
// - TechArticle, so browser reader views (Firefox Reader View, Safari Reader)
//   and search engines pick up the clean page title and summary instead of
//   the "· Gooze docs" suffixed <title>.
// Derived from the URL segments and the docs registry, so it stays correct as
// pages are added. Pages missing from the registry (e.g. redirect stubs) get
// no TechArticle.
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

  const page = getDocsPage(clean)
  const url = `${SITE_URL}${clean}/`

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: items,
    },
  ]

  if (page) {
    graph.push({
      "@type": "TechArticle",
      headline: page.title,
      name: page.title,
      description: page.description,
      keywords: page.keywords.join(", "),
      url,
      mainEntityOfPage: url,
      inLanguage: "en",
      isPartOf: { "@type": "WebSite", name: "Gooze", url: `${SITE_URL}/` },
      publisher: { "@type": "Organization", name: "Gooze", url: `${SITE_URL}/` },
    })
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
