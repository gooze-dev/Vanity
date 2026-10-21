import Link from "next/link"

import { docsMetadata } from "@/lib/docs-meta"
import { CodeBlock } from "@/components/code-block"

const PLUGIN_REPO = "https://github.com/gooze-dev/claude-plugin"
const LINK = "text-[color:var(--gooze-teal)] hover:underline"

export const metadata = docsMetadata("/docs/claude-code")

export default function ClaudeCodePage() {
  return (
    <section>
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Claude Code</h1>
      <p className="text-lg text-muted-foreground mb-8">
        The{" "}
        <a href={PLUGIN_REPO} target="_blank" rel="noopener noreferrer" className={LINK}>
          gooze plugin
        </a>{" "}
        for Claude Code sets a Go project up for mutation testing, teaches Claude the
        run, read, kill-survivors loop, and shows Claude the mutation score and every
        surviving mutant right after it edits a file.
      </p>

      <div>
        <div id="features">
          <h2>What you get</h2>
          <ul>
            <li>
              <code>/gooze:init</code>: writes <code>gooze.yaml</code>, adds a short
              gooze guide to <code>CLAUDE.md</code> and/or <code>AGENTS.md</code>, and
              allows the gooze commands, asking before each change.
            </li>
            <li>
              <code>/gooze:mutation-testing</code>: runs gooze on the packages you work
              on, reads the surviving mutants, writes tests that kill them, and reruns to
              confirm the score went up. Claude also uses it on its own when you ask about
              mutation testing.
            </li>
            <li>
              <code>/gooze:ci-setup</code>: adds gooze to the <code>Makefile</code> or CI files your
              repo already has (GitHub Actions, GitLab CI, Taskfile, justfile, …), adapted
              to their conventions. It never creates new CI files.
            </li>
            <li>
              Results after every edit: when Claude edits a Go file or{" "}
              <code>gooze.yaml</code>, it gets that file&apos;s gooze results. Editing a
              test shows the surviving mutants of the code it tests.
            </li>
            <li>
              A session check that says once when gooze or goozels is missing or too old,
              or the guide in your project is outdated. Silent otherwise.
            </li>
          </ul>
          <p>
            It works alongside the official <code>gopls-lsp</code> plugin; keep that on
            for Go code intelligence.
          </p>
        </div>

        <div id="install">
          <h2>Install</h2>
          <p>In a Claude Code session:</p>
          <CodeBlock code="/plugin marketplace add gooze-dev/claude-plugin" lang="text" />
          <CodeBlock code="/plugin install gooze@gooze" lang="text" />
          <p>
            Then install the tools it uses, on the <code>PATH</code> of the shell you
            start <code>claude</code> from: gooze (<code>v1.2.0</code> or later) and, for the results
            after every edit,{" "}
            <Link href="/docs/editor-support" className={LINK}>
              goozels
            </Link>{" "}
            (<code>v0.2.0</code> or later).
          </p>
          <CodeBlock
            lang="bash"
            code={`go install gooze.dev/pkg/gooze@latest
go install gooze.dev/pkg/goozels/cmd/goozels@latest`}
          />
          <p>
            Both need Go <code>1.27.3</code> to build. On an older Go, prefix the commands with{" "}
            <code>GOTOOLCHAIN=auto</code>; your project keeps its own Go version.
          </p>
        </div>

        <div id="init">
          <h2>Set up a project</h2>
          <p>Run this once in your project:</p>
          <CodeBlock code="/gooze:init" lang="text" />
          <p>
            It creates <code>gooze.yaml</code> if there is none, adds a gooze section
            between <code>{"<!-- gooze:begin -->"}</code> and{" "}
            <code>{"<!-- gooze:end -->"}</code> markers to <code>CLAUDE.md</code> and/or{" "}
            <code>AGENTS.md</code>, and offers permission rules for{" "}
            <code>.claude/settings.json</code>. The section records its own version and
            the gooze version, so the session check can tell you when to run{" "}
            <code>/gooze:init</code> again; rerunning it updates the section in place.
          </p>
        </div>

        <div id="use">
          <h2>Use it</h2>
          <p>Ask in plain words, for example:</p>
          <ul>
            <li>
              &ldquo;Run gooze on <code>./internal/domain/...</code> and kill the surviving
              mutants in <code>ignore.go</code> without changing production code.&rdquo;
            </li>
            <li>&ldquo;Which files in this package have the lowest mutation score?&rdquo;</li>
            <li>
              &ldquo;Are any of the surviving mutants in <code>parser.go</code> equivalent?
              Suppress only those.&rdquo;
            </li>
            <li>&ldquo;Add mutation testing to our CI.&rdquo;</li>
          </ul>
        </div>

        <div id="after-edits">
          <h2>What Claude sees after an edit</h2>
          <p>
            With goozels installed, a hook adds the edited file&apos;s results to
            Claude&apos;s context, without blocking the edit:
          </p>
          <CodeBlock
            lang="text"
            code={`gooze results from the last run:
calc.go:1:1: warning: gooze: score 87.50% — 14 killed, 2 survived
calc.go:10:2: warning: gooze: surviving comparison mutant — tests still pass with \`if n < lo {\` → \`if n <= lo {\`
calc.go:13:2: warning: gooze: surviving comparison mutant — tests still pass with \`if n > hi {\` → \`if n >= hi {\``}
          />
          <p>
            When the file changed since gooze last ran, the results say so and give the
            rerun command instead of pointing at lines that moved. Later edits of the
            same file in a session get a one-line summary until the results change.
          </p>
        </div>

        <div id="ci">
          <h2>CI</h2>
          <p>
            <code>/gooze:ci-setup</code> looks for the build and CI files your repo
            already has and proposes a gooze target or job in their style, with an
            optional score gate. It applies the change only after you agree. See{" "}
            <Link href="/docs/ci" className={LINK}>
              CI
            </Link>{" "}
            for the full setups.
          </p>
        </div>

        <div id="code-review">
          <h2>Code review</h2>
          <p>
            Claude Code&apos;s built-in <code>/code-review</code> follows{" "}
            <code>CLAUDE.md</code>, so the guide from <code>/gooze:init</code> makes
            reviews run gooze on the changed packages and report surviving mutants as
            test gaps.
          </p>
          <ul>
            <li>
              Allow the gooze commands (<code>/gooze:init</code> offers the rules), or the
              review stops at a prompt for each one. Claude Code applies a project&apos;s
              allow rules only once you have trusted the folder.
            </li>
            <li>
              In a headless run, such as <code>claude -p &quot;/code-review&quot;</code> in
              CI, pass the rules on the command line:
            </li>
          </ul>
          <CodeBlock
            lang="bash"
            code={`claude -p "/code-review" --allowedTools "Read,Grep,Glob,Bash(gooze run *),Bash(goozels check *)"`}
          />
          <p>
            For pull requests, run gooze in CI and give the reviewer its report; the
            managed Code Review service doesn&apos;t run code.
          </p>
        </div>

        <div id="update">
          <h2>Update</h2>
          <p>
            To get new versions automatically, open <code>/plugin</code>, go to{" "}
            <strong>Marketplaces</strong>, select <code>gooze</code> and choose{" "}
            <strong>Enable auto-update</strong>. Otherwise:
          </p>
          <CodeBlock code="/plugin marketplace update gooze" lang="text" />
        </div>

        <div id="troubleshooting">
          <h2>Troubleshooting</h2>
          <ul>
            <li>
              <strong>No gooze results after an edit</strong>: run{" "}
              <code>goozels check &lt;file&gt;</code> yourself. If it says there are no
              results yet, run gooze first; if the command isn&apos;t found, install
              goozels on the <code>PATH</code> of the shell you start{" "}
              <code>claude</code> from.
            </li>
            <li>
              <strong>A notice at session start</strong>: it names what is missing or
              outdated and the command that fixes it.
            </li>
            <li>
              <strong>Plugin problems</strong>: open <code>/plugin</code> and check the{" "}
              <strong>Errors</strong> tab, or start <code>claude --debug</code>. Plugins
              don&apos;t run in cloud sessions or safe mode.
            </li>
          </ul>
          <p>
            Using Codex or opencode instead? See{" "}
            <Link href="/docs/editor-support#ai-agents" className={LINK}>
              AI coding agents
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
