import type { Metadata } from "next"

import { getDocsPage, SITE_URL } from "@/lib/docs-pages"

// docsMetadata builds the Next.js Metadata for a docs page from the central
// registry, giving every page a unique title, description, canonical URL, and
// Open Graph tags so search engines can index each one distinctly.
export function docsMetadata(href: string): Metadata {
  const page = getDocsPage(href)

  if (!page) {
    return {}
  }

  const canonical = `${href.replace(/\/$/, "")}/`
  const title = `${page.title} · Gooze docs`

  return {
    // absolute bypasses the root title template so we don't double-suffix.
    title: { absolute: title },
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title,
      description: page.description,
      url: `${SITE_URL}${canonical}`,
      siteName: "Gooze",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
    },
  }
}
