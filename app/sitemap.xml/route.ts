import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const baseUrl = "https://gooze.dev";
  const routes = [
    "/",
    "/docs",
    "/docs/features/bypass-mutation",
    "/docs/features/incremental-execution",
    "/docs/features/ui-modes",
    "/docs/quick-start",
    "/docs/roadmap",
    "/pkg/gooze",
  ];

  const today = new Date().toISOString().split("T")[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map(
      (route) => `  <url><loc>${baseUrl}${route}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`
    )
    .join("\n")}\n</urlset>\n`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
