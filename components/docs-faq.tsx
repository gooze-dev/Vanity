import type * as React from "react"
import { ChevronDown } from "lucide-react"

import { slugify } from "@/lib/heading-id"

export interface Faq {
  q: string
  a: string
}

const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

// Plain text with [label](https://…) links rendered as external links.
function withLinks(text: string, key: number) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(LINK)) {
    parts.push(text.slice(last, match.index))
    parts.push(
      <a
        key={`${key}-${match.index}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:text-foreground"
      >
        {match[1]}
      </a>,
    )
    last = match.index + match[0].length
  }
  parts.push(text.slice(last))
  return parts
}

// Answers use `backticks` for commands and flags (shown as code) and
// [label](https://…) for external links.
export function withCode(text: string) {
  return text.split("`").map((part, i) =>
    i % 2 ? (
      <code key={i} className="rounded bg-background px-1 py-0.5 font-mono text-[0.9em]">
        {part}
      </code>
    ) : (
      withLinks(part, i)
    ),
  )
}

// The same text without markup, for structured data.
function plain(text: string) {
  return text.replaceAll("`", "").replace(LINK, "$1")
}

// FAQ block at the end of a docs page. Native <details> keeps every answer in
// the HTML (search engines, AI crawlers and find-in-page still see it) and
// needs no client JS; name="faq" keeps one answer open at a time. data-slot
// makes typeset leave it alone, so it gets its own card style.
export function DocsFaq({ faqs }: { faqs: Faq[] }) {
  return (
    <div id="faq">
      <h2>FAQ</h2>
      <FaqList faqs={faqs} />
    </div>
  )
}

// The card list itself, shared by docs pages and the landing page.
export function FaqList({ faqs, className = "bg-muted/40" }: { faqs: Faq[]; className?: string }) {
  return (
    <div data-slot="faq" className={`divide-y rounded-lg border ${className}`}>
      {faqs.map((faq) => (
        <details key={faq.q} id={`faq-${slugify(faq.q)}`} name="faq" className="group group/faq scroll-mt-20 px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
            <h3 className="m-0 flex-1 text-base font-medium leading-snug">{withCode(faq.q)}</h3>
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="m-0 pb-4 leading-relaxed text-muted-foreground">{withCode(faq.a)}</p>
        </details>
      ))}
    </div>
  )
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
