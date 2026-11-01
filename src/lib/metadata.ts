// Page metadata: the site-wide defaults, plus the types pages use to override
// them. A page's fields replace the defaults field by field (a shallow merge),
// so a page that sets openGraph has to set all of it.

const SITE_URL = "https://gooze.dev"

export const siteDescription =
  "Gooze is a mutation testing tool for Go. It injects small bugs into your code and checks whether your tests catch them, to find weak tests coverage misses."

const DEFAULT_TITLE = "Gooze: Mutation Testing for Go (Golang)"

type Image = { url: string; width?: number; height?: number; alt?: string; type?: string }

export type Metadata = {
  title?: { absolute: string }
  description?: string
  keywords?: string[]
  robots?: {
    index: boolean
    follow: boolean
    googleBot?: Record<string, boolean | number | string>
  }
  alternates?: { canonical: string }
  openGraph?: {
    type: string
    title: string
    description: string
    url: string
    siteName: string
    locale?: string
    images: Image[]
  }
  twitter?: {
    card: string
    title: string
    description: string
    images: Image[]
  }
  /** Extra <meta name> tags, such as go-import. Written self-closed and unescaped. */
  other?: Record<string, string>
  /** Sends the browser to this URL with a meta refresh. */
  refresh?: string
}

export const siteMetadata: Metadata = {
  title: { absolute: DEFAULT_TITLE },
  description: siteDescription,
  keywords: [
    "go mutation testing",
    "golang mutation testing",
    "mutation score",
    "test suite quality",
    "ast mutation",
    "claude code plugin",
  ],
  // No default canonical here: a site-wide canonical is inherited by every page
  // that doesn't set its own, which silently points pages like /pkg/* at the
  // homepage. Each page declares its own canonical instead (the home page, docs
  // via docsMetadata, redirects via redirectMetadata).
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: siteDescription,
    url: `${SITE_URL}/`,
    siteName: "Gooze",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Gooze: Test your tests. Mutation testing for Go.",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    // No twitter:site/creator: there is no @gooze_dev X account to attribute
    // to. The large-image card still renders from the title/description/image.
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: siteDescription,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        alt: "Gooze: Test your tests. Mutation testing for Go.",
      },
    ],
  },
}

export function absoluteUrl(url: string) {
  return new URL(url, SITE_URL).href
}

export function robotsContent(robots: NonNullable<Metadata["robots"]>) {
  return `${robots.index ? "index" : "noindex"}, ${robots.follow ? "follow" : "nofollow"}`
}

export function googleBotContent(googleBot: NonNullable<NonNullable<Metadata["robots"]>["googleBot"]>) {
  const { index, follow, ...rest } = googleBot
  return [
    `${index ? "index" : "noindex"}, ${follow ? "follow" : "nofollow"}`,
    ...Object.entries(rest).map(([key, value]) => `${key}:${value}`),
  ].join(", ")
}

// A docs page that moved to a section of another page. The site is static, so
// there are no HTTP redirects: the old URL keeps rendering, sends the browser
// on with a meta refresh, and stays out of search indexes so only the
// consolidated page ranks.
export function redirectMetadata(title: string, to: string): Metadata {
  return {
    title: { absolute: `${title} · Gooze docs` },
    robots: { index: false, follow: true },
    alternates: { canonical: to.split("#")[0] },
    refresh: to,
  }
}
