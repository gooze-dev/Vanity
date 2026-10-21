---
paths:
  - "app/docs/**"
  - "lib/docs-pages.ts"
  - "components/gooze-docs-sidebar.tsx"
  - "components/docs-pager.tsx"
  - "components/docs-breadcrumb.tsx"
---

# Docs structure

`lib/docs-pages.ts` is the single source for the docs structure. The sidebar, breadcrumbs,
prev/next pager, search, sitemap and `llms-full.txt` all read it. Array order is reading order.

## Sections

Sections follow the reader's path: learn the tool, use it locally, automate it, connect it to
editors and agents, look up facts, evaluate it, get help. Keep them in this order.

| Section | What goes in | Page type |
| --- | --- | --- |
| Get started | Overview, Installation, Quick start, Mutation testing basics. Only what a new user needs for the first run. | Tutorial, concept |
| Guides | One task when using Gooze locally: reading results, incremental runs, ignoring code, UI modes. | Guide |
| CI/CD | Running Gooze in pipelines: one page per CI provider, then sharding and sharing reports. | Guide |
| Editors & agents | goozels in editors, and one page per AI coding agent (Claude Code, later Codex, opencode). | Guide |
| Reference | Facts to look up: CLI commands (nested under `/docs/cli`), configuration, report format, mutation operators. | Reference |
| Compare | Pages for people choosing a tool: the comparison and the "best tool" pages. | Comparison |
| Help | Troubleshooting and the roadmap (what isn't supported yet). | Reference |

Rules:

- Pages of one section are contiguous in `docsPages`, and sections appear in the order of
  `docsSections`. Otherwise the pager jumps between sections.
- The first page of a section is its landing page (breadcrumbs link to it), so put the most
  general page first.
- Inside a section, order pages by when a reader needs them, not alphabetically. A CI provider
  page comes before sharding, because sharding builds on it.
- `sectionIcons` in `components/gooze-docs-sidebar.tsx` must change together with
  `docsSections`.
- The overview page (`app/docs/page.tsx`) never lists pages by hand; the sidebar already does.
  It keeps the intro, the beginner pointer and Get started, and builds its section links from
  `docsSections` and `getSectionLanding`.

## One job per page

Each page is one type. Don't mix a tutorial with reference tables, or a guide with a comparison.
Link to the page that owns a topic instead of repeating it.

- **Tutorial / quick start:** prerequisites, numbered steps, the expected output, next steps.
- **Guide:** what the task is and when you need it (one or two sentences), steps or examples,
  options that matter for this task, limitations, FAQ.
- **Concept:** the idea, a small concrete example, how Gooze applies it, FAQ.
- **Reference:** usage line, flags or keys in a table (default, env var, config key), examples,
  exit codes or output format. No tutorials here.
- **Comparison:** last verified version and date, the summary, the table, when to pick each tool,
  FAQ. Cover every tool the same way (see `writing.md`).

Section order inside a page: intro, prerequisites, main content, examples, limitations, FAQ,
next steps. The FAQ is always the last `h2` before next steps. Render it with
`<DocsFaq faqs={faqs} />` (`components/docs-faq.tsx`), the same `faqs` array that feeds the
page's FAQPage JSON-LD; never hand-write FAQ markup. The landing page uses the same
`FaqList` and `faqPageJsonLd`, plus `<HeadingAnchors rootId="faq" />` for its copy links. Wrap commands and flags in answers in
backticks, and the component shows them as code. `h2` headings form the page's
table of contents, so keep them short and unique on the page.

## Every heading can be linked

Like GitHub, every `h2` and `h3` in a docs page and every FAQ question has a stable `#id` and
a copy-link button that shows on hover or keyboard focus (always visible, dimmed, on touch
screens). `components/heading-anchors.tsx` adds the buttons for the whole article, so pages
don't add them by hand.

- Ids must be stable, because people share these links. A section's id comes from its wrapper
  (`<div id="matrix"><h2>…</h2>`); other headings get a slug of their text
  (`lib/heading-id.ts`). Give a section an explicit wrapper id when its heading text may change.
- Don't rename an existing id. If you must, keep the old id on an element nearby so old links
  still land.
- FAQ ids are `faq-` plus the slug of the question (`DocsFaq`). Opening a `#faq-…` link opens
  that answer. Changing a question changes its id, so reword questions only when needed.
- Headings inside components (anything with `data-slot`, such as cards) get no anchor. If a
  heading should be linkable, put it in the page, not inside a component.

## Tables never scroll

A table must fit the content column at every width (check 375, 768, 1024 and 1280px). No
horizontal scrolling inside a table and no page overflow.

- `components/ui/table.tsx` has no `overflow-x-auto` container, and cells wrap
  (`[overflow-wrap:anywhere]`, top-aligned). Don't add `overflow-x-auto`, `whitespace-nowrap` or
  `min-w-*` back on a table, its wrapper or its cells.
- Keep tables to about four columns with short cell text. Put long explanations under the
  table, not in a cell.
- When a table can't fit a narrow screen (many columns, like the comparison matrix or the
  `gooze run` flags), render a card list below `lg` and the table from `lg` up (`lg:hidden` /
  `hidden lg:block`). Both read from the same data array. Give the card list a `data-slot` so
  typeset doesn't style it as prose.
- If a table still doesn't fit, split it into two tables or turn it into a list.

## Adding or moving pages

- Add the page to `docsPages` in the right section and position. That's enough for the sidebar,
  pager, search and sitemap.
- Never change a published URL just because a page moves to another section. The URL stays and
  only `section` changes. If a URL must change, keep a redirect stub at the old path (see
  `app/docs/features/*` and `app/docs/gitlab`).
- Don't create a section for a single page. Put it in the closest existing section.
- Nest pages with `parent` only for real sub-pages (CLI subcommands). Keep nesting one level deep.
- When a section grows past about eight pages, split it by reader task (for example "CI/CD" into
  providers and scaling) instead of making the list longer.
- A new CI provider gets a page in CI/CD, placed with the other providers. A new agent or editor
  integration gets its own page in Editors & agents once it needs more than a short section on
  Editor support.
- `navTitle` is short and in sentence case. `title` is the H1. `seoTitle` is only for search
  engines and can be longer.
