import { NextResponse } from "next/server";

import { docsPages, SITE_URL } from "@/lib/docs-pages";

export const dynamic = "force-static";

export async function GET() {
  // Non-docs routes plus every documentation page from the central registry,
  // so newly added docs are crawlable without hand-editing this file.
  const staticRoutes = ["/", "/pkg/gooze", "/pkg/goozels"];
  const routes = [...staticRoutes, ...docsPages.map((page) => page.href)];

  // trailingSlash is enabled in next.config, so canonical URLs end with "/".
  const toLoc = (route: string) =>
    `${SITE_URL}${route === "/" ? "/" : `${route}/`}`;

  const today = new Date().toISOString().split("T")[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map(
      (route) =>
        `  <url><loc>${toLoc(route)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${route === "/" ? "1.0" : "0.8"}</priority></url>`
    )
    .join("\n")}\n</urlset>\n`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
