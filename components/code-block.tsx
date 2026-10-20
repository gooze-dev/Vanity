import { cn } from "@/lib/utils"
import { codeToHtml } from "shiki"

import { CopyButton } from "@/components/copy-button"

type CodeBlockProps = {
  code: string
  lang: string
  className?: string
}

export async function CodeBlock({ code, lang, className }: CodeBlockProps) {
  const raw = code.trimEnd()
  const html = await codeToHtml(raw, {
    lang,
    theme: "github-dark",
  })

  // Let the app's theme tokens control the surface; keep Shiki's token colors.
  const cleaned = html.replace(/\sstyle="background-color:[^"]*"/g, "")

  const multiline = raw.includes("\n")

  return (
    <div className={cn("relative", className)}>
      <div
        className="overflow-x-auto [&>pre]:bg-[#0d1117] [&>pre]:p-4 [&>pre]:pr-14 [&>pre]:rounded-lg [&>pre]:overflow-x-auto"
        // Shiki returns trusted HTML for syntax highlighting.
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
      <CopyButton
        text={raw}
        className={cn("absolute right-3", multiline ? "top-3" : "top-1/2 -translate-y-1/2")}
      />
    </div>
  )
}
