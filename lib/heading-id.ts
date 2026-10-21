// Stable ids for docs headings, shared by the table of contents and the
// copy-link anchors so both point at the same #fragment.

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Pages wrap each section in <div id="..."><h2>…</h2>, so the wrapper's id is
// the section's anchor. Headings without one get a slug of their text.
export function headingId(heading: HTMLElement, index: number) {
  if (heading.id) return heading.id
  const parent = heading.parentElement
  if (parent?.id && parent.firstElementChild === heading) return parent.id
  heading.id = slugify(heading.textContent ?? "") || `section-${index}`
  return heading.id
}
