"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { docsPages } from "@/lib/docs-pages"

export function DocsPager() {
  const pathname = (usePathname() || "/docs").replace(/\/$/, "") || "/"
  const index = docsPages.findIndex((page) => page.href === pathname)
  if (index === -1) return null

  const previous = docsPages[index - 1]
  const next = docsPages[index + 1]

  return (
    <nav aria-label="Pagination" className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">
      {previous ? (
        <Link
          href={previous.href}
          className="group flex flex-1 flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-[color:var(--gooze-teal)]"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </span>
          <span className="font-medium group-hover:text-[color:var(--gooze-teal)]">{previous.title}</span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-1 flex-col gap-1 rounded-lg border p-4 text-right transition-colors hover:border-[color:var(--gooze-teal)]"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium group-hover:text-[color:var(--gooze-teal)]">{next.title}</span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  )
}
