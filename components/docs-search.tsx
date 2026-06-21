"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { Search } from "lucide-react"

import { docsPages, docsFlags, type DocsPage, type DocsFlag } from "@/lib/docs-pages"
import { cn } from "@/lib/utils"

// A unified search result: either a documentation page or a CLI flag. The site
// is a static export, so there is no search server — we rank entries by
// substring matches client-side.
type SearchEntry =
  | { kind: "page"; href: string; title: string; meta: string; description: string }
  | { kind: "flag"; href: string; title: string; meta: string; description: string; alias?: string }

function pageEntry(page: DocsPage): SearchEntry {
  return {
    kind: "page",
    href: page.href,
    title: page.title,
    meta: page.section,
    description: page.description,
  }
}

function flagEntry(flag: DocsFlag): SearchEntry {
  return {
    kind: "flag",
    href: flag.href,
    title: flag.alias ? `${flag.flag}, ${flag.alias}` : flag.flag,
    meta: flag.command,
    description: flag.description,
    alias: flag.alias,
  }
}

const allEntries: SearchEntry[] = [
  ...docsPages.map(pageEntry),
  ...docsFlags.map(flagEntry),
]

function scorePage(page: DocsPage, q: string): number {
  const title = page.title.toLowerCase()
  if (title === q) return 100
  if (title.startsWith(q)) return 80
  if (title.includes(q)) return 60
  if (page.keywords.some((k) => k.toLowerCase().includes(q))) return 40
  if (page.section.toLowerCase().includes(q)) return 25
  if (page.description.toLowerCase().includes(q)) return 20
  return 0
}

function scoreFlag(flag: DocsFlag, q: string): number {
  const f = flag.flag.toLowerCase()
  const alias = flag.alias?.toLowerCase() ?? ""
  // Make flags easy to find whether or not the user types the leading dashes.
  const bare = q.replace(/^-+/, "")
  if (f === q || alias === q) return 100
  if (f.replace(/^-+/, "").startsWith(bare) && bare.length > 0) return 85
  if (f.includes(q) || (alias && alias === q)) return 65
  if (flag.command.toLowerCase().includes(q)) return 30
  if (flag.description.toLowerCase().includes(q)) return 20
  return 0
}

function search(query: string): SearchEntry[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return allEntries

  const pages = docsPages
    .map((page) => ({ entry: pageEntry(page), score: scorePage(page, trimmed) }))
    .filter(({ score }) => score > 0)

  const flags = docsFlags
    .map((flag) => ({ entry: flagEntry(flag), score: scoreFlag(flag, trimmed) }))
    .filter(({ score }) => score > 0)

  return [...pages, ...flags]
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry)
}

export function DocsSearch() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [active, setActive] = React.useState(0)

  const results = React.useMemo(() => search(query), [query])

  React.useEffect(() => {
    setActive(0)
  }, [query])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  React.useEffect(() => {
    if (!open) {
      setQuery("")
    }
  }, [open])

  function go(entry: SearchEntry) {
    setOpen(false)
    router.push(entry.href)
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter") {
      event.preventDefault()
      const entry = results[active]
      if (entry) go(entry)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Search documentation"
          className="inline-flex h-9 w-full max-w-56 items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Search docs…</span>
          <kbd className="pointer-events-none hidden items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-[15vh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Search documentation</Dialog.Title>

          <div className="flex items-center gap-2 border-b px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search docs and flags…"
              aria-label="Search the documentation"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <ul className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No results for “{query}”.
              </li>
            ) : (
              results.map((entry, index) => (
                <li key={`${entry.kind}:${entry.href}`}>
                  <Link
                    href={entry.href}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActive(index)}
                    className={cn(
                      "block rounded-md px-3 py-2 transition-colors",
                      index === active
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          entry.kind === "flag" && "font-mono"
                        )}
                      >
                        {entry.title}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {entry.kind === "flag" && (
                          <span className="rounded bg-[color:var(--gooze-teal)]/15 px-1 py-px font-medium text-[color:var(--gooze-teal)]">
                            flag
                          </span>
                        )}
                        {entry.meta}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {entry.description}
                    </p>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
