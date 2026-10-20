"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type TocEntry = {
  id: string
  text: string
}

type DocsTocProps = {
  collapsible?: boolean
  className?: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function headingId(heading: HTMLHeadingElement, index: number) {
  if (heading.id) return heading.id
  const parentId = heading.parentElement?.id
  if (parentId) return parentId
  heading.id = slugify(heading.textContent ?? "") || `section-${index}`
  return heading.id
}

export function DocsToc({ collapsible = false, className }: DocsTocProps) {
  const pathname = usePathname()
  const [entries, setEntries] = React.useState<TocEntry[]>([])
  const [activeId, setActiveId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const article = document.getElementById("docs-content")
    if (!article) return

    const headings = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2"))
    const next = headings.map((heading, index) => ({
      id: headingId(heading, index),
      text: heading.textContent ?? "",
    }))
    const frame = window.requestAnimationFrame(() => {
      setEntries(next)
      setActiveId(next[0]?.id ?? null)
    })

    const visible = new Set<HTMLHeadingElement>()
    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          const target = entry.target as HTMLHeadingElement
          if (entry.isIntersecting) visible.add(target)
          else visible.delete(target)
        }
        const first = headings.findIndex((heading) => visible.has(heading))
        if (first !== -1) setActiveId(headingId(headings[first], first))
      },
      { rootMargin: "-80px 0px -60% 0px" },
    )
    headings.forEach((heading) => observer.observe(heading))

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [pathname])

  if (entries.length < 2) return null

  const list = (
    <ul className="space-y-2 border-l">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            className={cn(
              "-ml-px block border-l py-0.5 pl-3 leading-snug text-muted-foreground transition-colors hover:text-foreground",
              activeId === entry.id
                ? "border-[color:var(--gooze-teal)] text-foreground"
                : "border-transparent",
            )}
          >
            {entry.text}
          </a>
        </li>
      ))}
    </ul>
  )

  if (collapsible) {
    return (
      <details className={cn("group rounded-lg border px-4 py-3 text-sm", className)}>
        <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
          On this page
          <ChevronRight className="h-4 w-4 text-[color:var(--gooze-teal)] transition-transform group-open:rotate-90" />
        </summary>
        <div className="mt-3">{list}</div>
      </details>
    )
  }

  return (
    <nav aria-label="On this page" className={cn("text-sm", className)}>
      <p className="mb-3 font-medium">On this page</p>
      {list}
    </nav>
  )
}
