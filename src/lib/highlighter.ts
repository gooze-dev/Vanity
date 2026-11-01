import {
  createHighlighterCore,
  type GrammarState,
  type HighlighterCore,
  type ThemeRegistration,
} from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

// Add the languages you need. Each one loads the first time it is used.
const languages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  go: () => import("shiki/langs/go.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
}

const aliases: Record<string, keyof typeof languages> = {
  golang: "go",
  js: "javascript",
  md: "markdown",
  py: "python",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

// The brand's syntax colours, as tokens. Code blocks are dark in both themes, so
// there is one theme. Shiki needs real colours while tokenizing; the placeholders
// are swapped for the CSS variables in its output.
const syntax = {
  fg: "#000001",
  keyword: "#000002",
  string: "#000003",
  number: "#000004",
  comment: "#000005",
  func: "#000006",
}

// Shiki's FontStyle flags.
const italic = 1
const bold = 2

const goozeTheme: ThemeRegistration = {
  name: "gooze",
  type: "dark",
  fg: syntax.fg,
  bg: "#000000",
  colorReplacements: {
    [syntax.fg]: "var(--code-fg)",
    [syntax.keyword]: "var(--syn-keyword)",
    [syntax.string]: "var(--syn-string)",
    [syntax.number]: "var(--syn-number)",
    [syntax.comment]: "var(--syn-comment)",
    [syntax.func]: "var(--syn-func)",
  },
  settings: [
    { settings: { foreground: syntax.fg, background: "#000000" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: syntax.comment, fontStyle: "italic" } },
    { scope: ["keyword", "storage", "entity.name.tag", "support.type.property-name"], settings: { foreground: syntax.keyword } },
    { scope: ["keyword.operator", "punctuation"], settings: { foreground: syntax.fg } },
    { scope: ["string", "punctuation.definition.string"], settings: { foreground: syntax.string } },
    { scope: ["constant", "support.constant"], settings: { foreground: syntax.number } },
    { scope: ["entity.name.function", "support.function"], settings: { foreground: syntax.func, fontStyle: "bold" } },
    // Shell commands are plain text: an argument is not a string literal.
    { scope: ["source.shell", "source.shell entity.name.command", "source.shell support.function", "source.shell constant", "string.unquoted.argument"], settings: { foreground: syntax.fg, fontStyle: "" } },
    { scope: ["source.shell string.quoted", "source.shell comment"], settings: { foreground: syntax.string } },
    { scope: ["source.shell comment"], settings: { foreground: syntax.comment, fontStyle: "italic" } },
  ],
}

let highlighter: Promise<HighlighterCore> | undefined

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [goozeTheme],
    langs: [],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  })

  return highlighter
}

function getLanguage(language: string) {
  const name = language.toLowerCase()

  if (name === "ansi") {
    return name
  }

  if (name in languages) {
    return name as keyof typeof languages
  }

  return aliases[name] ?? null
}

// Loads a language and returns a highlighter for it, or null for a language
// that is not listed.
export async function loadHighlighter(language: string) {
  const lang = getLanguage(language)

  if (!lang) {
    return null
  }

  const shiki = await getHighlighter()

  if (lang !== "ansi" && !shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(languages[lang])
  }

  return {
    // Returns one HTML string per line, and the grammar state after the last
    // line. Pass that state back to continue where the code left off.
    highlight(code: string, state?: GrammarState) {
      const tokenize = (text: string) =>
        shiki.codeToTokens(text, {
          lang,
          theme: "gooze",
          grammarState: state,
        }).tokens

      // ANSI has no grammar state, so each line is tokenized on its own and
      // gets the same colors whether it arrives in one piece or streams.
      const tokens =
        lang === "ansi"
          ? code.split("\n").flatMap((line) => tokenize(line))
          : tokenize(code)

      return {
        lines: tokens.map((line) =>
          line
            .map((token) => {
              const style = [
                token.color && `color:${token.color}`,
                (token.fontStyle ?? 0) & italic && "font-style:italic",
                (token.fontStyle ?? 0) & bold && "font-weight:600",
              ]
                .filter(Boolean)
                .join(";")
              // .sk lets diff lines override the color (src/styles/globals.css).
              return `<span style="${escapeHtml(style)}" class="sk">${escapeHtml(token.content)}</span>`
            })
            .join("")
        ),
        state: shiki.getLastGrammarState(tokens),
      }
    },
  }
}

// Returns one HTML string per line, or null for a language that is not listed.
export async function highlightCode(code: string, language: string) {
  const highlighter = await loadHighlighter(language)

  return highlighter ? highlighter.highlight(code).lines : null
}
