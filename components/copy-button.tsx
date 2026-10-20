"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={() => navigator.clipboard.writeText(text).then(() => setCopied(true))}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md border sm:h-7 border-white/10 bg-white/5 px-2 text-xs text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100",
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[color:var(--gooze-green)]" /> : <Copy className="h-3.5 w-3.5" />}
      {copied && <span>Copied</span>}
    </button>
  )
}
