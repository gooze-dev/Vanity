"use client"

import * as React from "react"
import "asciinema-player/dist/bundle/asciinema-player.css"

// Client half of <Recording>: mounts asciinema-player on a recording from
// public/casts/. Until the player loads (and without JavaScript) it shows the
// recording's text, which <Recording> reads at build time.
export function TerminalCast({
  src,
  title,
  rows,
  poster,
  children,
}: {
  /** Path under public/, e.g. "/casts/calc-report-view.cast". */
  src: string
  /** Accessible name for the player. */
  title: string
  /** Terminal height in lines; sized to the output so short results stay small. */
  rows: number
  /** Frame shown before playback, in asciinema's npt: notation. */
  poster: string
  /** The recording's plain text, shown before the player loads. */
  children?: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    let player: { dispose: () => void } | undefined
    let cancelled = false

    // The player touches window and document, so load it only in the browser.
    import("asciinema-player").then((AsciinemaPlayer) => {
      if (cancelled) return
      player = AsciinemaPlayer.create(src, element, {
        rows,
        poster,
        idleTimeLimit: 1,
        fit: "width",
        theme: "auto/asciinema",
      })
      setReady(true)
    })

    return () => {
      cancelled = true
      player?.dispose()
    }
  }, [src, rows, poster])

  return (
    <figure data-slot="terminal-cast" aria-label={title} className="my-6 overflow-hidden rounded-lg border">
      <div ref={ref} />
      {children ? (
        <pre className={ready ? "sr-only" : "m-0 overflow-hidden whitespace-pre-wrap p-4 font-mono text-xs"}>
          {children}
        </pre>
      ) : null}
    </figure>
  )
}
