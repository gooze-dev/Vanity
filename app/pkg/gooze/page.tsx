import { Metadata } from "next";
import Link from "next/link";
import {
  GoozeOutlineCtaButton,
  GoozePrimaryCtaButton,
} from "@/components/gooze-cta-button";
import { GoozeLogo } from "@/components/gooze-logo";
import { ArrowRight, Github, Terminal } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const GITHUB_REPO = "https://github.com/gooze-dev/gooze";
const IMPORT_PREFIX = "gooze.dev/pkg/gooze";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gooze - Go Mutation Testing",
    description: "Import path for Gooze - Mutation testing for Go",
    other: {
      "go-import": `${IMPORT_PREFIX} git ${GITHUB_REPO}`,
      "go-source": `${IMPORT_PREFIX} ${GITHUB_REPO} ${GITHUB_REPO}/tree/main{/dir} ${GITHUB_REPO}/blob/main{/dir}/{file}#L{line}`,
    },
  };
}

export default async function VanityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold">
              <GoozeLogo className="text-inherit" />
            </h1>
            <p className="text-xl text-muted-foreground">
              Mutation testing for Go
            </p>
          </div>

          {/* Import Path */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Terminal className="h-5 w-5 text-[color:var(--gooze-teal)]" />
              <span className="font-semibold">Installation</span>
            </div>
            <CodeBlock code={`go install ${IMPORT_PREFIX}@latest`} lang="bash" />
            <p className="text-sm text-muted-foreground">
              This vanity import path redirects to the official Git repository
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GoozePrimaryCtaButton
              asChild
              size="lg"
            >
              <Link href="/" className="flex items-center gap-2">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </GoozePrimaryCtaButton>
            <GoozeOutlineCtaButton
              asChild
              variant="outline"
              size="lg"
            >
              <Link
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </Link>
            </GoozeOutlineCtaButton>
          </div>
        </div>
      </main>
    </div>
  );
}