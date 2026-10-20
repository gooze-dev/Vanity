import { DocsRedirect, redirectMetadata } from "@/components/docs-redirect"

const TITLE = "gooze report push"
const TO = "/docs/cli/report/#push"

export const metadata = redirectMetadata(TITLE, TO)

export default function CliReportPushRedirect() {
  return <DocsRedirect title={TITLE} to={TO} />
}
