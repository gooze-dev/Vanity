import { cn } from "@/lib/utils"
import { codeToHtml } from "shiki"

type CodeBlockProps = {
  code: string
  lang: string
  className?: string
}

export async function CodeBlock({ code, lang, className }: CodeBlockProps) {
  const html = await codeToHtml(code.trimEnd(), {
    lang,
    theme: "github-dark",
  })

  // Let the app's theme tokens control the surface; keep Shiki's token colors.
  const cleaned = html.replace(/\sstyle="background-color:[^"]*"/g, "")

  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-x-auto [&>pre]:min-w-max [&>pre]:bg-[#0d1117] [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto",
        className,
      )}
      // Shiki returns trusted HTML for syntax highlighting.
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  )
}
