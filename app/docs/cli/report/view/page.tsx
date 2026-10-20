import { DocsRedirect, redirectMetadata } from "@/components/docs-redirect"

const TITLE = "gooze report view"
const TO = "/docs/cli/report/#view"

export const metadata = redirectMetadata(TITLE, TO)

export default function CliReportViewRedirect() {
  return <DocsRedirect title={TITLE} to={TO} />
}
