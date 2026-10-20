import { DocsRedirect, redirectMetadata } from "@/components/docs-redirect"

const TITLE = "Ignoring code"
const TO = "/docs/usage/ignoring-code/"

export const metadata = redirectMetadata(TITLE, TO)

export default function BypassMutationRedirect() {
  return <DocsRedirect title={TITLE} to={TO} />
}
