import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type GoozeCtaButtonProps = React.ComponentProps<typeof Button>

export function GoozePrimaryCtaButton({
  className,
  ...props
}: GoozeCtaButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "bg-gradient-to-r from-[color:var(--gooze-green)] to-[color:var(--gooze-teal)] text-white hover:opacity-90",
        className
      )}
    />
  )
}

export function GoozeOutlineCtaButton({
  className,
  ...props
}: GoozeCtaButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "border-[color:var(--gooze-teal)] text-[color:var(--gooze-teal)] hover:text-[color:var(--gooze-teal)]",
        className
      )}
    />
  )
}
