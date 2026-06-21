import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Oxanium } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
  "Mutation testing for Go that helps you assess the quality of your test suite";

export const metadata: Metadata = {
  metadataBase: new URL("https://gooze.dev"),
  title: {
    default: "Gooze — Mutation testing for Go",
    template: "%s · Gooze",
  },
  description: siteDescription,
  applicationName: "Gooze",
  category: "Developer Tools",
  keywords: [
    "mutation testing",
    "Go",
    "golang",
    "test quality",
    "test coverage",
    "mutation score",
    "testing tool",
    "gooze",
  ],
  authors: [{ name: "Gooze" }],
  creator: "Gooze",
  publisher: "Gooze",
  alternates: {
    canonical: "/",
  },
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
    title: "Gooze — Mutation testing for Go",
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
    title: "Gooze — Mutation testing for Go",
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
const jsonLd = {
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
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "WebSite",
      name: "Gooze",
      url: "https://gooze.dev/",
      description: siteDescription,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
