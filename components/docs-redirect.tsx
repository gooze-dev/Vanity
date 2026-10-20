import type { Metadata } from "next"
import Link from "next/link"

// A docs page that moved to a section of another page. The site is a static
// export, so there are no HTTP redirects: the old URL keeps rendering, sends
// the browser on with a meta refresh, and stays out of search indexes so only
// the consolidated page ranks.
export function redirectMetadata(title: string, to: string): Metadata {
  return {
    title: { absolute: `${title} · Gooze docs` },
    robots: { index: false, follow: true },
    alternates: { canonical: to.split("#")[0] },
  }
}

export function DocsRedirect({ title, to }: { title: string; to: string }) {
  return (
    <section>
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground">
        This page moved. If you are not redirected automatically, continue to{" "}
        <Link href={to} className="underline underline-offset-4">{title}</Link>.
      </p>
    </section>
  )
}
