import { slugify } from "@/lib/heading-id"

export interface Faq {
  q: string
  a: string
}

const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

// Plain text with [label](https://…) links rendered as external links.
function withLinks(text: string) {
  let html = ""
  let last = 0
  for (const match of text.matchAll(LINK)) {
    html += escapeHtml(text.slice(last, match.index))
    html += `<a href="${escapeHtml(match[2])}" target="_blank" rel="noopener noreferrer" class="underline underline-offset-4 hover:text-foreground">${escapeHtml(match[1])}</a>`
    last = match.index + match[0].length
  }
  return html + escapeHtml(text.slice(last))
}

// Answers use `backticks` for commands and flags (shown as code) and
// [label](https://…) for external links. Returns HTML, for set:html.
export function withCode(text: string) {
  return text
    .split("`")
    .map((part, i) =>
      i % 2
        ? `<code class="rounded bg-background px-1 py-0.5 font-mono text-[0.9em]">${escapeHtml(part)}</code>`
        : withLinks(part),
    )
    .join("")
}

export function faqId(q: string) {
  return `faq-${slugify(q)}`
}

// The same text without markup, for structured data.
function plain(text: string) {
  return text.replaceAll("`", "").replace(LINK, "$1")
}

// FAQPage structured data from the same array the page renders. Backticks and
// links are display markup, so strip them from the plain-text answer.
export function faqPageJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: plain(faq.q),
      acceptedAnswer: { "@type": "Answer", text: plain(faq.a) },
    })),
  }
}
