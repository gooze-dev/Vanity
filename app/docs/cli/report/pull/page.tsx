import { DocsRedirect, redirectMetadata } from "@/components/docs-redirect"

const TITLE = "gooze report pull"
const TO = "/docs/cli/report/#pull"

export const metadata = redirectMetadata(TITLE, TO)

export default function CliReportPullRedirect() {
  return <DocsRedirect title={TITLE} to={TO} />
}
