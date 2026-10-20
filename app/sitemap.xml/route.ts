import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { NextResponse } from "next/server";

import { docsPages, SITE_URL } from "@/lib/docs-pages";

export const dynamic = "force-static";

const APP_DIR = join(process.cwd(), "app");

// A page is kept out of the sitemap when its own source marks it noindex, so a
// crawler is never pointed at a page whose HTML says not to index it. This is
// derived from source rather than a hand-kept list so the check is fail-closed:
// a newly added redirect or noindex page is excluded automatically, even if
// nobody updates this file. Client-side redirects go through redirectMetadata();
// any page can also set robots.index: false directly.
function isNoindexPage(file: string): boolean {
  try {
    const src = readFileSync(file, "utf8");
    return src.includes("redirectMetadata") || /index:\s*false/.test(src);
  } catch {
    return false;
  }
}

// Walk app/ for page.tsx files and turn each into its route. Dynamic routes
// ([slug]) and route groups ((group)) aren't used here, so a plain path join is
// enough. Returns routes without a trailing slash (toLoc adds it).
function discoverPageRoutes(): string[] {
  const routes: string[] = [];
  const walk = (dir: string, segments: string[]) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full, [...segments, entry]);
      } else if (entry === "page.tsx") {
        routes.push("/" + segments.join("/"));
      }
    }
  };
  walk(APP_DIR, []);
  return routes;
}

// Source file backing a route, so we can read its git history.
function sourceForRoute(route: string): string {
  const rel = route === "/" ? "" : route;
  return join(APP_DIR, rel, "page.tsx");
}

// Last commit date (YYYY-MM-DD) that touched a file, or null if git/history is
// unavailable (e.g. a shallow CI checkout or an uncommitted new page). CI must
// checkout with fetch-depth: 0 for these to be meaningful.
function gitLastmod(file: string): string | null {
  if (!existsSync(file)) return null;
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return iso || null;
  } catch {
    return null;
  }
}

export async function GET() {
  const buildDate = new Date().toISOString().split("T")[0];

  // Docs routes come from the registry (reading order, always indexable).
  const docsRoutes = docsPages.map((page) => page.href);
  const docsRouteSet = new Set(docsRoutes);

  // Marketing / non-docs routes are discovered from the filesystem so a new
  // landing page can't be forgotten. Docs come from the registry below; any
  // remaining page is included unless its source marks it noindex.
  const discovered = discoverPageRoutes().filter(
    (route) =>
      !docsRouteSet.has(route) && !isNoindexPage(sourceForRoute(route))
  );

  const routes = [...discovered.sort(), ...docsRoutes];

  // trailingSlash is enabled in next.config, so canonical URLs end with "/".
  const toLoc = (route: string) =>
    `${SITE_URL}${route === "/" ? "/" : `${route}/`}`;

  const urls = routes
    .map((route) => {
      const lastmod = gitLastmod(sourceForRoute(route)) ?? buildDate;
      return `  <url><loc>${toLoc(route)}</loc><lastmod>${lastmod}</lastmod><priority>${route === "/" ? "1.0" : "0.8"}</priority></url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
