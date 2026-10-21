"use client"

import * as React from "react"
import "asciinema-player/dist/bundle/asciinema-player.css"

// Number of lines an asciicast v2 recording prints.
function outputLines(cast: string) {
  const text = cast
    .split("\n")
    .slice(1)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as [number, string, string])
    .filter(([, type]) => type === "o")
    .map(([, , data]) => data)
    .join("")
  return text.replace(/\r/g, "").replace(/\n+$/, "").split("\n").length
}

// Plays a real terminal recording from public/casts/ (see
// .claude/rules/tool-output.md and scripts/record-casts.sh). Use it for output
// that changes over time, like the TUI; static output stays a CodeBlock copied
// from the same recording.
export function TerminalCast({
  src,
  poster = "npt:0:10",
  title,
}: {
  /** Path under public/, e.g. "/casts/calc-first-run-tui.cast". */
  src: string
  /** Frame shown before playback, in asciinema's npt: notation. */
  poster?: string
  /** Accessible name for the player. */
  title: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    let player: { dispose: () => void } | undefined
    let cancelled = false

    // The player touches window and document, so load it only in the browser.
    // Recordings are made in an 80x24 terminal; size the player to the lines
    // the command printed so a one-line result isn't a mostly empty box.
    Promise.all([import("asciinema-player"), fetch(src).then((r) => r.text())]).then(
      ([AsciinemaPlayer, cast]) => {
        if (cancelled) return
        player = AsciinemaPlayer.create(src, element, {
          rows: Math.min(24, Math.max(2, outputLines(cast) + 1)),
          poster,
          idleTimeLimit: 1,
          fit: "width",
          theme: "auto/asciinema",
        })
      },
    )

    return () => {
      cancelled = true
      player?.dispose()
    }
  }, [src, poster])

  return (
    <figure data-slot="terminal-cast" aria-label={title} className="overflow-hidden rounded-lg border">
      <div ref={ref} />
    </figure>
  )
}
