import * as React from "react"

import { cn } from "@/lib/utils"

export type GoozeLogoVariant = "split" | "gradient"

export function GoozeLogo({
  className,
  variant = "split",
  letterSpacing = "-0.02em",
}: {
  className?: string
  variant?: GoozeLogoVariant
  letterSpacing?: string
}) {
  if (variant === "gradient") {
    return (
      <span
        className={cn(
          "inline-flex items-baseline font-extrabold bg-gradient-to-r from-[color:var(--gooze-green)] to-[color:var(--gooze-teal)] bg-clip-text text-transparent",
          className
        )}
        style={{ fontFamily: "var(--font-oxanium)", letterSpacing }}
      >
        Gooze
      </span>
    )
  }

  return (
    <span
      className={cn("inline-flex items-baseline font-extrabold", className)}
      style={{ fontFamily: "var(--font-oxanium)", letterSpacing }}
    >
      <span style={{ color: "var(--gooze-green)" }}>Go</span>
      <span style={{ color: "var(--gooze-teal)" }}>oze</span>
    </span>
  )
}
