import { DocsRedirect, redirectMetadata } from "@/components/docs-redirect"

const TITLE = "GitLab CI"
const TO = "/docs/ci/gitlab/"

export const metadata = redirectMetadata(TITLE, TO)

export default function GitlabRedirect() {
  return <DocsRedirect title={TITLE} to={TO} />
}
