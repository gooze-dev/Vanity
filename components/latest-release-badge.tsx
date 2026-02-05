"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type LatestReleaseBadgeProps = {
  owner?: string
  repo?: string
  className?: string
}

type GithubLatestReleaseResponse = {
  tag_name?: string
}

const STORAGE_KEY = "gooze.latestRelease"
const STORAGE_TTL_MS = 60 * 60 * 1000

export function LatestReleaseBadge({
  owner = "gooze-dev",
  repo = "gooze",
  className,
}: LatestReleaseBadgeProps) {
  const [tagName, setTagName] = React.useState<string | null>(null)

  React.useEffect(() => {
    const now = Date.now()

    try {
      const cachedRaw = window.localStorage.getItem(STORAGE_KEY)
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw) as {
          tagName?: string
          ts?: number
        }

        if (cached.tagName && cached.ts && now - cached.ts < STORAGE_TTL_MS) {
          setTagName(cached.tagName)
          return
        }
      }
    } catch {
      // ignore cache errors
    }

    const abortController = new AbortController()

    ;(async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
          {
            signal: abortController.signal,
            headers: {
              Accept: "application/vnd.github+json",
            },
          }
        )

        if (!response.ok) return

        const data = (await response.json()) as GithubLatestReleaseResponse
        if (!data.tag_name) return

        setTagName(data.tag_name)

        try {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ tagName: data.tag_name, ts: now })
          )
        } catch {
          // ignore cache errors
        }
      } catch {
        // ignore network errors
      }
    })()

    return () => abortController.abort()
  }, [owner, repo])

  if (!tagName) return null

  return (
    <span
      className={cn(
        "inline-flex cursor-default select-none items-center rounded-full border bg-background/80 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur",
        className
      )}
    >
      {tagName}
    </span>
  )
}
