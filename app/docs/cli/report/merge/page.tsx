import { DocsRedirect, redirectMetadata } from "@/components/docs-redirect"

const TITLE = "gooze report merge"
const TO = "/docs/cli/report/#merge"

export const metadata = redirectMetadata(TITLE, TO)

export default function CliReportMergeRedirect() {
  return <DocsRedirect title={TITLE} to={TO} />
}
