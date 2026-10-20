import { DocsRedirect, redirectMetadata } from "@/components/docs-redirect"

const TITLE = "GitHub Actions"
const TO = "/docs/ci/github/"

export const metadata = redirectMetadata(TITLE, TO)

export default function CiRedirect() {
  return <DocsRedirect title={TITLE} to={TO} />
}
