import { defineMiddleware } from "astro:middleware"

const base = import.meta.env.BASE_URL.replace(/\/$/, "")

// Project-site builds (BASE_PATH) serve the site under a subpath. Pages write
// root-relative links, so prefix them here instead of in every page.
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next()
  if (!base || !response.headers.get("content-type")?.includes("text/html")) return response
  // Asset URLs already carry the base; "//" is protocol-relative.
  const rootRelative = new RegExp(`\\b(href|data-src)="/(?!/|${base.slice(1)}/)`, "g")
  const html = (await response.text()).replace(rootRelative, `$1="${base}/`)
  return new Response(html, response)
})
