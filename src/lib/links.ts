// Internal links carry the trailing slash of the built directory URLs, so a
// click doesn't take a redirect. External links, fragments and files such as
// /llms.txt stay as they are.
export function withSlash(href: string) {
  if (!href.startsWith("/")) return href
  const match = /^([^?#]*)(.*)$/.exec(href)
  if (!match) return href
  const [, path, rest] = match
  if (path.endsWith("/") || /\.[^/]+$/.test(path)) return href
  return `${path}/${rest}`
}
