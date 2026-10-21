import { docsMetadata } from "@/lib/docs-meta"
import { DocsFaq, faqPageJsonLd } from "@/components/docs-faq"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const OCI_SITE = "https://opencontainers.org/"
const DISTRIBUTION_SPEC = "https://github.com/opencontainers/distribution-spec"
const IMAGE_SPEC = "https://github.com/opencontainers/image-spec"
const ARTIFACTS_GUIDANCE = "https://github.com/opencontainers/image-spec/blob/main/artifacts-guidance.md"
const ARTIFACT_USAGE = "https://github.com/opencontainers/image-spec/blob/main/manifest.md#guidelines-for-artifact-usage"

const GHCR_DOCS =
  "https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry"

// Each link is the registry's own page stating it stores OCI artifacts or
// other OCI content besides container images (checked 2026-10-21).
const registries = [
  { name: "GitLab Container Registry", href: "https://docs.gitlab.com/user/packages/container_registry/" },
  { name: "Docker Hub", href: "https://docs.docker.com/docker-hub/repos/manage/hub-images/oci-artifacts/" },
  { name: "Amazon ECR", href: "https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html" },
  { name: "Google Artifact Registry", href: "https://cloud.google.com/artifact-registry/docs/supported-formats" },
  {
    name: "Azure Container Registry",
    href: "https://learn.microsoft.com/en-us/azure/container-registry/container-registry-manage-artifact",
  },
]

const alternatives = [
  {
    option: "CI cache (for example actions/cache)",
    tradeoff:
      "Simple, but tied to one CI provider and its cache rules. You can't pull it on your laptop or from another CI system.",
  },
  {
    option: "S3 or GCS bucket",
    tradeoff:
      "Works, but needs a bucket, its own credentials and an upload step, and the commands differ for every cloud.",
  },
  {
    option: "Git (commit the reports)",
    tradeoff:
      "Reports change on every run, so each run adds a commit and branches conflict on generated files.",
  },
  {
    option: "Database or custom server",
    tradeoff: "One more service to run, secure and back up, only for mutation reports.",
  },
]

const faqs = [
  {
    q: "Do I need Docker to use `gooze report push` or `gooze report pull`?",
    a: "No. Gooze talks to the registry over HTTPS itself. Docker is only one way to store credentials: if `GOOZE_REGISTRY_USERNAME` and `GOOZE_REGISTRY_PASSWORD` are unset, Gooze reads the credentials that `docker login` saved.",
  },
  {
    q: "Which registries work?",
    a: "Any registry that follows the OCI Distribution Spec and accepts OCI artifacts. GitLab Container Registry, Docker Hub, Amazon ECR, Google Artifact Registry and Azure Container Registry document OCI artifact support. GHCR documents OCI images, and Gooze's own CI pulls its baseline from GHCR. Gooze has no registry-specific code.",
  },
  {
    q: "Can I pull a fixed version of the baseline?",
    a: "Yes. `gooze report pull` accepts a tag (`:main`) or a digest (`@sha256:...`). A digest always points to the same content. `gooze report push` needs a tag, because it moves that tag to the new reports.",
  },
  {
    q: "Does Gooze delete old baselines?",
    a: "No. Each push to the same tag moves the tag, and the previous version usually stays in the registry without a tag. Cleaning those up is done with your registry's retention or cleanup settings.",
  },
  {
    q: "When is a CI cache the better choice?",
    a: "When everything runs on one CI provider and nobody needs the baseline outside it. Save and restore `.gooze-reports` with the cache, and you don't need registry credentials at all.",
  },
]

const faqJsonLd = faqPageJsonLd(faqs)

export const metadata = docsMetadata("/docs/ci/sharing-reports")

export default function SharingReportsPage() {
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="mt-0 text-4xl font-bold tracking-tight mb-4">Report artifacts</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Store the reports directory as an OCI artifact (e.g. in GHCR) so CI and teammates start
        from the same baseline and only re-test what changed.
      </p>

      <div>
        <p>
          Locally, Gooze keeps its results in <code>.gooze-reports</code> and the next run only
          re-tests files whose source, test or mutators changed. In CI every job starts with an
          empty checkout, so that directory is gone and every run tests every mutant again.
        </p>
        <p>
          The fix is a shared baseline: the main branch pushes its reports to a registry, and
          every later job (and every teammate) pulls them before running. Then CI is incremental
          too.
        </p>

        <div id="oci">
          <h2>OCI in 30 seconds</h2>
          <p>
            OCI is the{" "}
            <a href={OCI_SITE} target="_blank" rel="noopener noreferrer">Open Container Initiative</a>,
            the open standard for storing and moving container images. The same format can hold
            other files, called artifacts. An OCI registry is the server that stores them: the
            place your Docker images already go, such as GHCR, GitLab Container Registry, Docker
            Hub or Amazon ECR.
          </p>
          <p>Each stored item has two kinds of names:</p>
          <ul>
            <li>
              A <strong>tag</strong> is a readable name you choose, like <code>:main</code>. You
              can move it to new content by pushing again.
            </li>
            <li>
              A <strong>digest</strong> is the hash of the content, like{" "}
              <code>@sha256:...</code>. It never changes; the same digest always means the same
              bytes.
            </li>
          </ul>
          <p>
            Gooze stores the whole reports directory as one artifact in a registry. You don&apos;t
            need Docker, containers or images to use it. The rules for how clients talk to a
            registry are in the{" "}
            <a href={DISTRIBUTION_SPEC} target="_blank" rel="noopener noreferrer">OCI Distribution Spec</a>,
            and the format of what is stored is in the{" "}
            <a href={IMAGE_SPEC} target="_blank" rel="noopener noreferrer">OCI Image Spec</a>{" "}
            (see its{" "}
            <a href={ARTIFACTS_GUIDANCE} target="_blank" rel="noopener noreferrer">guidance for artifacts</a>).
          </p>
        </div>

        <div id="push-pull">
          <h2>Push and pull</h2>
          <p>
            Gooze does the packaging and transfer itself; you don&apos;t need{" "}
            <code>tar</code> or other tools.
          </p>
          <CodeBlock
            lang="bash"
            code={`# package the reports dir and push it as an OCI artifact
gooze report push ghcr.io/your-org/your-repo/gooze-reports:main

# later: pull and extract into the reports dir
gooze report pull ghcr.io/your-org/your-repo/gooze-reports:main`}
          />
          <p className="text-sm text-muted-foreground">
            Both commands use the reports dir set by <code>-o/--output</code> (default{" "}
            <code>.gooze-reports</code>). Flags:{" "}
            <Link href="/docs/cli/report#push"><code>gooze report push</code></Link>,{" "}
            <Link href="/docs/cli/report#pull"><code>gooze report pull</code></Link>.
          </p>
          <p>
            <code>push</code> needs a tag and fails on an empty reports dir. <code>pull</code>{" "}
            takes a tag or a digest, so you can also restore one exact version:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze report pull ghcr.io/your-org/your-repo/gooze-reports@sha256:<digest>`}
          />
          <p className="text-sm text-muted-foreground">
            <code>&lt;digest&gt;</code> is the digest your registry shows for a pushed version.
          </p>
        </div>

        <div id="artifact">
          <h2>What Gooze stores</h2>
          <p>
            Gooze uses the <a href="https://oras.land/" target="_blank" rel="noopener noreferrer">ORAS</a>{" "}
            Go library (<code>oras.land/oras-go/v2</code>) to talk to the registry. On push it:
          </p>
          <ol>
            <li>Packs the reports directory into one <code>.tar.gz</code> file.</li>
            <li>
              Uploads it as a single layer (a stored file) with media type{" "}
              <code>application/gzip</code>.
            </li>
            <li>
              Writes an OCI image manifest (the small index that lists the layer) with artifact
              type <code>application/vnd.gooze.reports.v1+gzip</code>, following the Image
              Spec&apos;s{" "}
              <a href={ARTIFACT_USAGE} target="_blank" rel="noopener noreferrer">guidelines for artifact usage</a>.
            </li>
            <li>Points the tag at that manifest.</li>
          </ol>
          <p>
            On pull it downloads the manifest and layer and extracts the archive into the reports
            dir. If the reference points to something that isn&apos;t a Gooze reports artifact,
            the pull fails with an error instead of writing files.
          </p>
        </div>

        <div id="flow">
          <h2>Incremental CI flow</h2>
          <p>
            Restore the previous baseline, run incrementally, then publish the updated reports:
          </p>
          <CodeBlock
            lang="bash"
            code={`gooze report pull ghcr.io/org/repo/gooze-reports:main   # restore baseline
gooze run ./...                                          # incremental run
gooze report push ghcr.io/org/repo/gooze-reports:main   # publish updated`}
          />
          <p>
            Publish only from your main branch so pull requests read the baseline but never
            overwrite it. With shards, every shard pulls, and only the merge job pushes. Full
            pipelines:{" "}
            <Link href="/docs/ci/github#cached">GitHub Actions</Link>,{" "}
            <Link href="/docs/ci/gitlab#cached">GitLab CI</Link>.
          </p>
        </div>

        <div id="why">
          <h2>Why an OCI registry</h2>
          <p>
            The baseline has to live somewhere every CI job and every laptop can reach. Gooze
            uses an OCI registry because most teams already have one next to their CI:
          </p>
          <ul>
            <li>
              <strong>No new service.</strong> GitHub has GHCR and GitLab has a built-in
              container registry. Gooze needs nothing else running.
            </li>
            <li>
              <strong>Same credentials as your images.</strong> In GitHub Actions the built-in{" "}
              <code>GITHUB_TOKEN</code> can push to GHCR; in GitLab CI the{" "}
              <code>CI_JOB_TOKEN</code> can push to the project registry. Locally,{" "}
              <code>docker login</code> is enough.
            </li>
            <li>
              <strong>Tags and digests fit baselines.</strong> A tag like <code>:main</code> is
              always the latest baseline of a branch. A digest pins one exact version that never
              changes.
            </li>
            <li>
              <strong>Same command everywhere.</strong> <code>gooze report pull</code> works the
              same in any CI provider and on your laptop, because the registry protocol is a
              standard.
            </li>
          </ul>
          <p>Other places can hold the baseline too, each with its own cost:</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Option</TableHead>
                <TableHead>Trade-off</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alternatives.map((alt) => (
                <TableRow key={alt.option}>
                  <TableCell>{alt.option}</TableCell>
                  <TableCell>{alt.tradeoff}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p>
            Registries whose docs describe storing OCI artifacts:{" "}
            {registries.map((r, i) => (
              <span key={r.name}>
                <a href={r.href} target="_blank" rel="noopener noreferrer">{r.name}</a>
                {i < registries.length - 1 ? ", " : "."}
              </span>
            ))}{" "}
            <a href={GHCR_DOCS} target="_blank" rel="noopener noreferrer">GHCR&apos;s docs</a>{" "}
            describe Docker and OCI images; Gooze&apos;s own CI keeps its baseline there.
          </p>
        </div>

        <div id="auth">
          <h2>Authentication</h2>
          <ul>
            <li>
              <code>GOOZE_REGISTRY_USERNAME</code> /{" "}
              <code>GOOZE_REGISTRY_PASSWORD</code>. The
              password may be a token/PAT. If only the password is set, Gooze sends it as an
              access token; a username without a password is an error.
            </li>
            <li>
              If unset, Gooze falls back to the Docker credential store, so a prior{" "}
              <code>docker login</code> also works.
            </li>
            <li>
              For a non-TLS registry add <code>--plain-http</code>;
              to skip TLS verification (self-signed certs) add{" "}
              <code>--insecure</code>.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Platform-specific credentials (<code>GITHUB_TOKEN</code>,{" "}
            <code>CI_JOB_TOKEN</code>) are covered on the{" "}
            <Link href="/docs/ci/github#auth">GitHub</Link> and{" "}
            <Link href="/docs/ci/gitlab#auth">GitLab</Link> pages.
          </p>
        </div>

        <div id="limits">
          <h2>Limitations</h2>
          <ul>
            <li>
              Every job that pulls needs read access to the registry, and the job that pushes
              needs write access.
            </li>
            <li>
              Gooze doesn&apos;t delete old versions. Set up retention or cleanup in your
              registry if old baselines pile up.
            </li>
            <li>
              If you only use one CI provider and never need the baseline locally, a CI cache of{" "}
              <code>.gooze-reports</code> is simpler and needs no credentials.
            </li>
          </ul>
        </div>

        <DocsFaq faqs={faqs} />
      </div>
    </section>
  )
}
