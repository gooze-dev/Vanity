import { Metadata } from "next";
import Link from "next/link";
import {
  GoozeOutlineCtaButton,
  GoozePrimaryCtaButton,
} from "@/components/gooze-cta-button";
import { GoozeLogo } from "@/components/gooze-logo";
import { ArrowRight, Github, Terminal } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const GITHUB_REPO = "https://github.com/gooze-dev/goozels";
const IMPORT_PREFIX = "gooze.dev/pkg/goozels";
const INSTALL_PATH = "gooze.dev/pkg/goozels/cmd/goozels";

const TITLE = "pkg/goozels: Mutation Testing LSP for Editors";
const DESCRIPTION =
  "Install goozels, the language server for Gooze. It shows Gooze mutation results as inline diagnostics in editors such as VS Code, Neovim and GoLand.";
const KEYWORDS = [
  "pkg/goozels",
  "language server protocol",
  "lsp module",
  "editor integration",
  "inline diagnostics",
  "inline mutation results",
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    // absolute: this page supplies its own full title, no "· Gooze" suffix.
    title: { absolute: TITLE },
    description: DESCRIPTION,
    keywords: KEYWORDS,
    alternates: { canonical: "/pkg/goozels/" },
    openGraph: {
      type: "website",
      title: TITLE,
      description: DESCRIPTION,
      url: "https://gooze.dev/pkg/goozels/",
      siteName: "Gooze",
      images: [
        { url: "/og-image.png", width: 1200, height: 630, alt: "Goozels", type: "image/png" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: "/og-image.png", alt: "Goozels" }],
    },
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
        <div className="w-full min-w-0 max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold">
              <GoozeLogo className="text-inherit" />
              <span
                className="font-extrabold"
                style={{ color: "var(--gooze-teal)", fontFamily: "var(--font-oxanium)", letterSpacing: "-0.02em" }}
              >
                ls
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Editor support (LSP) for Gooze
            </p>
          </div>

          {/* Import Path */}
          <div className="rounded-lg border bg-card p-6 space-y-4 min-w-0">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Terminal className="h-5 w-5 text-[color:var(--gooze-teal)]" />
              <span className="font-semibold">Installation</span>
            </div>
            <CodeBlock code={`go install ${INSTALL_PATH}@latest`} lang="bash" />
            <p className="text-sm text-muted-foreground">
              This vanity import path points to the official Git repository.
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
