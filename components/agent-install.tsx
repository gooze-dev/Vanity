import Link from "next/link"
import { ArrowRight, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"

// Clawd, the Claude Code mascot, from https://thesvg.org/icon/claude-code
// (glincker/thesvg, MIT; color variant, unmodified). Claude and Claude Code
// marks are Anthropic trademarks: https://www.anthropic.com/legal/trademark-guidelines
function ClaudeCodeMark({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        clipRule="evenodd"
        d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z"
        fill="#D97757"
        fillRule="evenodd"
      />
    </svg>
  )
}

// Launch-style pill above the hero logo announcing the Claude Code plugin. The
// whole pill links to the Claude Code docs page, which has the install
// commands; phones get a shorter label so it stays on one line.
export function ClaudeCodeAnnouncement({ className }: { className?: string }) {
  return (
    <Link
      href="/docs/claude-code"
      className={cn(
        "group inline-flex max-w-full items-center gap-2 rounded-full border border-[#D97757]/40 bg-[#D97757]/10 py-1 pl-1.5 pr-3 text-sm text-foreground transition-colors hover:border-[#D97757]/70 hover:bg-[#D97757]/15",
        className,
      )}
    >
      <ClaudeCodeMark className="size-6 shrink-0" />
      <span className="rounded-full bg-[#D97757] px-2 py-0.5 text-xs font-semibold text-white">New</span>
      <span className="truncate">
        <span className="hidden sm:inline">Protect your vibe coding with the </span>
        Claude Code plugin<span className="hidden sm:inline"> for Gooze</span>
      </span>
      {/* The roadmap's Beta pill, on the page background: a red tint alone
          blends into the orange pill in light mode. */}
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-destructive/40 bg-background px-2 py-0.5 text-xs font-medium text-destructive">
        <FlaskConical className="size-3" aria-hidden />
        Beta
      </span>
      <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  )
}
