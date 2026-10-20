// Single source of truth for the Gooze version shown in structured data.
//
// Fetched at build time from the GitHub releases API so the JSON-LD
// softwareVersion stays in sync with the latest production release without a
// developer editing a hardcoded string. Falls back to FALLBACK_VERSION when the
// API is unreachable or rate-limited.
//
// The root layout renders once per statically-exported page, so this is invoked
// many times per build. The result is memoized at module scope (one fetch per
// build worker, not one per page) to keep the version consistent across pages
// and well under GitHub's unauthenticated rate limit (60/hour per IP). The
// request is also time-bounded so a stalled API can never hang the build.

const RELEASES_API =
  "https://api.github.com/repos/gooze-dev/gooze/releases/latest";

// Last known-good version; bump when the API is expected to be unavailable.
const FALLBACK_VERSION = "1.1.0";

const FETCH_TIMEOUT_MS = 4000;

let cached: Promise<string> | undefined;

export function getSoftwareVersion(): Promise<string> {
  // Reuse the in-flight/resolved promise so concurrent page renders share one
  // network request instead of each issuing their own.
  return (cached ??= fetchSoftwareVersion());
}

async function fetchSoftwareVersion(): Promise<string> {
  try {
    const res = await fetch(RELEASES_API, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return FALLBACK_VERSION;
    const data: unknown = await res.json();
    const tag =
      typeof data === "object" &&
      data !== null &&
      typeof (data as { tag_name?: unknown }).tag_name === "string"
        ? (data as { tag_name: string }).tag_name
        : "";
    // Releases are tagged like "v1.2.0"; schema.org wants a bare version.
    return tag.replace(/^v/, "") || FALLBACK_VERSION;
  } catch {
    // Non-ok, network error, or timeout abort all degrade to the fallback.
    return FALLBACK_VERSION;
  }
}
