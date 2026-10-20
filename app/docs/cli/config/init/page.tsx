import { DocsRedirect, redirectMetadata } from "@/components/docs-redirect"

const TITLE = "gooze config init"
const TO = "/docs/cli/config/#init"

export const metadata = redirectMetadata(TITLE, TO)

export default function CliConfigInitRedirect() {
  return <DocsRedirect title={TITLE} to={TO} />
}
