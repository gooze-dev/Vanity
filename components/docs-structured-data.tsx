"use client"

import { usePathname } from "next/navigation"

import { getDocsPage, getDocsTrail, SITE_URL } from "@/lib/docs-pages"

// Emits structured data for the current docs page:
// - BreadcrumbList, so search engines can show breadcrumb trails in results.
// - TechArticle, so browser reader views (Firefox Reader View, Safari Reader)
//   and search engines pick up the clean page title and summary instead of
//   the "· Gooze docs" suffixed <title>.
// Derived from the docs registry's parent chain, so it matches the visible
// breadcrumb. Pages missing from the registry (e.g. redirect stubs) emit
// nothing.
export function DocsStructuredData() {
  const pathname = usePathname() || "/docs"
  const clean = pathname.replace(/\/$/, "") || "/docs"

  const trail = getDocsTrail(clean)
  const page = trail[trail.length - 1]
  if (!page) return null

  const pages = trail[0].href === "/docs" ? trail : [getDocsPage("/docs")!, ...trail]
  const items = pages.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.href === "/docs" ? "Documentation" : crumb.title,
    item: `${SITE_URL}${crumb.href}/`,
  }))

  const url = `${SITE_URL}${clean}/`

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: items,
      },
      {
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
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
