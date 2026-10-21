---
paths:
  - "app/**"
  - "components/**"
  - "lib/docs-pages.ts"
  - "README.md"
---

# Writing site and docs text

These rules apply to every text a reader can see on gooze.dev: page copy, docs, FAQ questions and
answers, `lib/docs-pages.ts` titles, descriptions and keywords, `app/llms.txt`, alt text and
code comments in examples. The readers are Go engineers, many of them using English
as a second language, and AI answer engines that quote the docs.

Write like an experienced engineer explaining gooze to another engineer. Explain the system, don't
try to impress the reader.

## Priorities

When rules conflict, follow this order:

1. Technical accuracy. Never invent, change or drop real behavior.
2. Clarity.
3. Natural, simple English that sounds right when read aloud.
4. Short text, but keep every useful detail.
5. Consistency with the words the docs already use.
6. Structure that helps the reader find things.

## Style

- Use simple, common words when they say the same thing. Keep the correct technical term when
  there is one.
- Prefer direct statements and active voice: component, action, result. "gooze re-tests only
  files whose source, test or mutators changed."
- Keep sentences short, but vary their length. Split a long sentence when two short ones are
  clearer, and join choppy ones when they describe one step.
- Use contractions in prose when they sound natural.
- Say what happens, when it happens, and what the reader needs to do. Add a concrete example
  (a command, its output, a config snippet) when it helps.
- Don't explain things the name or the example already makes clear.
- Don't add an intro or a conclusion just so a section feels complete.
- Correct grammar always. Don't imitate broken English, an accent or slang.

## Never

- **Em dashes or en dashes (`—`, `–`) in prose.** Use a period, comma, colon, semicolon,
  parentheses or a new sentence. Normal hyphens in compound words, flags and identifiers are fine.
- **Singling out a competitor.** No "an alternative to Gremlins", "outperforms go-mutesting" or
  `gooze vs gremlins` keywords. Point to the comparison of all Go mutation testing tools
  (`/docs/comparison/`). The comparison page itself covers every tool the same way, and its
  title may name all of them.
- **Marketing words** without evidence: powerful, seamless, robust, cutting-edge, best-in-class,
  revolutionary. Describe the actual behavior instead.
- **Corporate or academic phrasing:** utilize, leverage, facilitate, in order to, prior to, due to
  the fact that, it should be noted that, plays a crucial role, a wide range of.
- **AI-style openers and filler:** "In this section we will explore", "Let's dive in", "It is
  important to note", "This document aims to provide a comprehensive overview", "In conclusion",
  "Furthermore", "Moreover", "Additionally" when the link between ideas is already clear.
- **Enthusiasm:** "Great question", "Absolutely".

| Instead of | Write |
| --- | --- |
| The service is responsible for handling X | The service handles X |
| It is important to note that X is not supported | X is not supported |
| provides the ability to | can, lets, supports |
| in the event that | if |

## Accuracy

- Every fact about gooze (flags, defaults, config keys, output, exit codes, limits) must match the
  gooze CLI at `DOCS_FACTS_VERSION` in `lib/version.ts`. Check the CLI source or run it. Don't
  guess from a flag or function name.
- Facts about other tools come from their own docs. If you can't confirm one, write "unknown"
  instead of guessing.
- Separate what works today from what is planned. Planned work goes on the roadmap, not in
  feature text.
- Don't claim gooze is fast, scalable or reliable without the mechanism behind it (per-file
  cache, sharding, OCI baselines, coverage profile).
- Don't invent command output, URLs, env vars or config keys. Use `<placeholder>` values and
  explain them when they aren't obvious.
- Keep real tool output verbatim, even when it contains characters these rules ban in prose
  (goozels prints `—` in its diagnostics).
- If the source material is missing or contradicts itself, ask or flag it. Don't pick one side
  silently.

## Terms

Use one name per concept and keep it: Gooze in prose, `gooze` in code and commands, goozels
(the language server), mutation score, mutant, killed, survived,
not_covered, timeout, shard, baseline, `.gooze-reports`, `gooze.yaml`. Don't swap in synonyms to
avoid repetition. Keep identifiers, flags, file names, error messages and paths exactly as they
are.

## Structure

- Most important information first. Prerequisites before steps.
- Numbered lists for ordered steps, bullets for independent items, tables for lookups and
  comparisons, code blocks for commands, config and output.
- Headings say what the section contains. No decorative headings, no "Overview" or "Key
  benefits" unless they help.
- One main idea per paragraph. Don't repeat the same point in several sections.
- No emojis.

## Code in text

Anything a reader could type, copy or find in code or output is highlighted as code, never
plain text:

- **Inline code** for commands (`gooze run ./...`), flags (`--coverage-profile`), env vars
  (`GOOZE_*`), config keys (`run.parallel`), file names and paths (`gooze.yaml`,
  `.gooze-reports`), directives (`//gooze:ignore`), statuses and values (`survived`,
  `not_covered`, `120`), identifiers, versions (`v1.2.0`) and short snippets (`if n <= lo {`).
  In JSX use `<code>`. In FAQ strings and other plain strings use backticks; `DocsFaq` renders
  them as code and `faqPageJsonLd` strips them from the structured data.
- **Code blocks** (`CodeBlock` with the right `lang`: `bash`, `yaml`, `go`, `text`) for anything
  the reader runs or copies as a whole: a command line to run, a config file or fragment, a Go
  example, real output. One command per line; comments only when they add information.
- Product names in prose stay plain text: Gooze, goozels, Go, GitHub Actions. Use code only
  when you mean the command or package (`gooze`, `goozels check`, `gooze.dev/pkg/gooze`).
- Don't put a long sentence inside `<code>`; keep inline code to the token itself.

## FAQs and SEO text

- FAQ answers are shown on the page and emitted as FAQPage JSON-LD from the same array. Write
  them so they read well both on the page and when quoted alone: start with the direct answer
  ("Yes.", "No.", or the fact), then the detail.
- Titles, descriptions and keywords in `lib/docs-pages.ts` follow the same
  rules: plain, accurate, no competitor targeting, no dashes.

## Editing existing text

- Keep the meaning, technical details, examples and the author's direct voice.
- Change wording only when it's unclear, unnatural, too formal, repetitive or wrong. Leave clear
  and correct sentences alone.
- A minimal edit means only the needed changes. A review means listing the real problems and
  why they matter, not a full rewrite.

## Before finishing

Check the changed text for: unsupported claims, `—` or `–` in prose, competitor targeting,
marketing or corporate words, filler intros and conclusions, terms that drifted from the list
above, and examples that don't match the described behavior.
