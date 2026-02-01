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

export const metadata: Metadata = {
  title: "Gooze",
  description: "Mutation testing for Go that helps you assess the quality of your test suite",
  openGraph: {
    title: "Gooze",
    description: "Mutation testing for Go that helps you assess the quality of your test suite",
    url: "https://gooze.dev/",
    siteName: "Gooze",
    images: [
      {
        url: "https://gooze.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gooze - Mutation testing for Go",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gooze",
    description: "Mutation testing for Go that helps you assess the quality of your test suite",
    site: "@gooze_dev",
    creator: "@gooze_dev",
    images: ["https://gooze.dev/og-image.png"],
  },
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
