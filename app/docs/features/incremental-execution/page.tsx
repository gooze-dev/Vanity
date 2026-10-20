import { DocsRedirect, redirectMetadata } from "@/components/docs-redirect"

const TITLE = "Incremental runs"
const TO = "/docs/usage/incremental-runs/"

export const metadata = redirectMetadata(TITLE, TO)

export default function IncrementalExecutionRedirect() {
  return <DocsRedirect title={TITLE} to={TO} />
}
