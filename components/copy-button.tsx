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
        "inline-flex h-7 min-w-7 items-center justify-center gap-1 rounded-md border border-white/10 bg-[#161b22] px-1.5 text-xs text-zinc-400 shadow-[-8px_0_8px_-4px_#0d1117] transition-colors hover:bg-[#21262d] hover:text-zinc-100",
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[color:var(--gooze-green)]" /> : <Copy className="h-3.5 w-3.5" />}
      {copied && <span className="pr-0.5">Copied</span>}
    </button>
  )
}
