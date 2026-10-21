"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { headingId } from "@/lib/heading-id"

const LINK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
const CHECK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'

// Opens a FAQ answer when the URL points at it (#faq-…), like GitHub opens a
// linked heading.
function openTarget() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (!id) return
  const target = document.getElementById(id)
  if (target instanceof HTMLDetailsElement) {
    target.open = true
    target.scrollIntoView({ block: "start" })
  }
}

// Adds a "copy link" button to every h2/h3 under rootId (the docs article, or
// the landing page FAQ) and to each FAQ question. It shows on hover or keyboard
// focus, copies the full URL with the heading's #id and puts the #id in the
// address bar.
export function HeadingAnchors({ rootId = "docs-content" }: { rootId?: string }) {
  const pathname = usePathname()

  React.useEffect(() => {
    const article = document.getElementById(rootId)
    if (!article) return

    const headings = Array.from(article.querySelectorAll<HTMLElement>("h2, h3")).filter(
      // Skip headings inside components (cards, the feature matrix), except
      // FAQ questions, which link to their <details>. The layout around the
      // article has data-slots too, so only look inside it.
      (heading) => {
        const slot = heading.closest("[data-slot]")
        return !slot || !article.contains(slot) || slot.getAttribute("data-slot") === "faq"
      },
    )

    const buttons = headings.map((heading, index) => {
      const details = heading.closest("details")
      const id = details?.id || headingId(heading, index)

      const button = document.createElement("button")
      button.type = "button"
      button.dataset.slot = "heading-anchor"
      button.setAttribute("aria-label", "Copy link to this section")
      button.title = "Copy link"
      button.className =
        "ml-2 inline-flex size-6 shrink-0 translate-y-[-0.1em] items-center justify-center rounded align-middle text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover/heading:opacity-100 group-hover/faq:opacity-100 [@media(hover:none)]:opacity-60"
      button.innerHTML = LINK_ICON
      button.addEventListener("click", (event) => {
        // Inside <summary> a click would also toggle the answer.
        event.preventDefault()
        event.stopPropagation()
        const url = `${window.location.origin}${window.location.pathname}#${id}`
        window.history.replaceState(null, "", `#${id}`)
        navigator.clipboard?.writeText(url).then(() => {
          button.innerHTML = CHECK_ICON
          window.setTimeout(() => (button.innerHTML = LINK_ICON), 1500)
        })
      })

      heading.classList.add("group/heading")
      heading.append(button)
      return button
    })

    openTarget()
    window.addEventListener("hashchange", openTarget)
    return () => {
      window.removeEventListener("hashchange", openTarget)
      buttons.forEach((button) => button.remove())
    }
  }, [pathname, rootId])

  return null
}
