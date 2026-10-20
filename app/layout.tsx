import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Oxanium } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSoftwareVersion } from "@/lib/version";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
});

const siteDescription =
  "Gooze evaluates the true quality of your Go tests by introducing controlled mutations. Find hidden bugs, enforce CI gates, and eliminate coverage blind spots.";

export const metadata: Metadata = {
  metadataBase: new URL("https://gooze.dev"),
  title: {
    default: "Gooze: Advanced Mutation Testing for Golang",
    template: "%s · Gooze",
  },
  description: siteDescription,
  applicationName: "Gooze",
  category: "Developer Tools",
  keywords: [
    "go mutation testing",
    "golang testing framework",
    "mutation score",
    "test suite quality",
    "go mutesting alternative",
    "ast mutation",
  ],
  authors: [{ name: "Gooze" }],
  creator: "Gooze",
  publisher: "Gooze",
  // No default canonical here: a root canonical is inherited by every page that
  // doesn't set its own, which silently points pages like /pkg/* at the
  // homepage. Each page declares its own canonical instead (the home page below,
  // docs via docsMetadata, redirects via redirectMetadata).
  formatDetection: {
    telephone: false,
    email: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Gooze: Advanced Mutation Testing for Golang",
    description: siteDescription,
    url: "https://gooze.dev/",
    siteName: "Gooze",
    images: [
      {
        url: "https://gooze.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gooze - Mutation testing for Go",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gooze: Advanced Mutation Testing for Golang",
    description: siteDescription,
    site: "@gooze_dev",
    creator: "@gooze_dev",
    images: [
      {
        url: "https://gooze.dev/og-image.png",
        alt: "Gooze - Mutation testing for Go",
      },
    ],
  },
};

// Structured data so search engines can render a rich result for the tool and
// its publisher. Kept truthful: only fields we can stand behind.
const buildJsonLd = (softwareVersion: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Gooze",
      description: siteDescription,
      url: "https://gooze.dev/",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Linux, macOS, Windows",
      programmingLanguage: "Go",
      softwareVersion,
      license: "https://opensource.org/licenses/MIT",
      codeRepository: "https://github.com/gooze-dev/gooze",
      sameAs: ["https://github.com/gooze-dev/gooze"],
      featureList: [
        "gooze.yaml config file with environment variable overrides",
        "Incremental cache: re-tests only changed files",
        "Sharding across CI jobs with report merge",
        "Shared baselines via OCI registries",
        "Coverage-profile gate for uncovered lines",
        "//gooze:ignore directives",
        "Interactive TUI report viewer",
        "Editor integration via the goozels language server",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "WebSite",
      name: "Gooze",
      url: "https://gooze.dev/",
      description: siteDescription,
    },
  ],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = buildJsonLd(await getSoftwareVersion());

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${oxanium.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
