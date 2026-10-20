import {
  CodeBlock as CodeBlockRoot,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { highlightCode } from "@/lib/highlighter"
import { cn } from "@/lib/utils"

type CodeBlockProps = {
  code: string
  lang: string
  /** File name or label shown in a header row, e.g. ".github/workflows/gooze.yml". */
  title?: string
  /** 1-based line numbers to call out. */
  highlight?: number[]
  lineNumbers?: boolean
  className?: string
}

// Diff examples mark lines with a leading "+" or "-"; show them as added and
// removed lines instead of plain text.
function lineVariant(line: string, lang: string, highlighted: boolean) {
  if (lang === "diff") {
    if (line.startsWith("+")) return "added"
    if (line.startsWith("-")) return "removed"
  }
  return highlighted ? "highlighted" : "default"
}

// Server-rendered: Shiki runs at build time, so pages ship highlighted HTML in
// both the light and dark themes and no highlighter JavaScript.
export async function CodeBlock({
  code,
  lang,
  title,
  highlight = [],
  lineNumbers = false,
  className,
}: CodeBlockProps) {
  const raw = code.trimEnd()
  const lines = raw.split("\n")
  const highlighted = (await highlightCode(raw, lang)) ?? lines

  // One-line commands: a compact row with the copy button always visible,
  // instead of a padded block whose button only shows on hover.
  if (lines.length === 1 && !title && !lineNumbers) {
    return (
      <CodeBlockRoot className={cn("flex-row items-center", className)}>
        <CodeBlockContent className="min-w-0 flex-auto py-3">
          <CodeBlockLine>{highlighted[0]}</CodeBlockLine>
        </CodeBlockContent>
        <CodeBlockCopyButton value={raw} className="me-2 shrink-0" />
      </CodeBlockRoot>
    )
  }

  return (
    <CodeBlockRoot className={className}>
      {title ? (
        <CodeBlockHeader>
          <CodeBlockTitle>{title}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={raw} />
          </CodeBlockActions>
        </CodeBlockHeader>
      ) : (
        <CodeBlockActions>
          <CodeBlockCopyButton value={raw} />
        </CodeBlockActions>
      )}
      <CodeBlockContent lineNumbers={lineNumbers}>
        {highlighted.map((content, index) => (
          <CodeBlockLine
            key={index}
            variant={lineVariant(lines[index] ?? "", lang, highlight.includes(index + 1))}
          >
            {content}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlockRoot>
  )
}
