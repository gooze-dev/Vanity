import { DocsRedirect, redirectMetadata } from "@/components/docs-redirect"

const TITLE = "UI modes"
const TO = "/docs/usage/ui-modes/"

export const metadata = redirectMetadata(TITLE, TO)

export default function UiModesRedirect() {
  return <DocsRedirect title={TITLE} to={TO} />
}
