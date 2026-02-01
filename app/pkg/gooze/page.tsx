import { headers } from 'next/headers';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Terminal, ArrowRight } from 'lucide-react';

const GITHUB_REPO = 'https://github.com/gooze-dev/gooze';
const IMPORT_PREFIX = 'gooze.dev/pkg/gooze';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'GOOZE - Go Mutation Testing',
    description: 'Import path for Gooze - Mutation testing for Go',
    other: {
      'go-import': `${IMPORT_PREFIX} git ${GITHUB_REPO}`,
      'go-source': `${IMPORT_PREFIX} ${GITHUB_REPO} ${GITHUB_REPO}/tree/main{/dir} ${GITHUB_REPO}/blob/main{/dir}/{file}#L{line}`,
    },
  };
}

export default async function VanityPage() {
  // Check if this is a go-get request
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isGoGet = userAgent.includes('Go-http-client') || 
                   headersList.get('user-agent')?.includes('go/') ||
                   false;

  // For go-get requests, return minimal HTML with meta tags
  if (isGoGet) {
    return (
      <html>
        <head>
          <meta name="go-import" content={`${IMPORT_PREFIX} git ${GITHUB_REPO}`} />
          <meta name="go-source" content={`${IMPORT_PREFIX} ${GITHUB_REPO} ${GITHUB_REPO}/tree/main{/dir} ${GITHUB_REPO}/blob/main{/dir}/{file}#L{line}`} />
        </head>
        <body>
          <p>go get {IMPORT_PREFIX}</p>
        </body>
      </html>
    );
  }

  // For browsers, show a nice page
  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#7DBC23' }}>GO</span>
              <span style={{ color: '#4CB8B8' }}>OZE</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Mutation testing for Go
            </p>
          </div>

          {/* Import Path */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Terminal className="h-5 w-5" />
              <span className="font-semibold">Installation</span>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <code className="text-sm font-mono">
                go install {IMPORT_PREFIX}@latest
              </code>
            </div>
            <p className="text-sm text-muted-foreground">
              This vanity import path redirects to the official Git repository
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/" className="flex items-center gap-2">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}