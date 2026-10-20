// SEO audit harness. Parses the static export in out/ and asserts the SEO
// invariants we care about per page. Run after `npm run build`:
//
//   npm run seo:audit
//
// Exits non-zero if any indexable page violates a hard rule, so it can gate a
// merge locally (the site only deploys from main, there is no PR preview).

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

const OUT = "out";
const SITE = "https://gooze.dev";

// Description bounds for indexable pages. Below MIN the snippet is too thin to
// be useful; above MAX Google truncates it in the SERP.
const DESC_MIN = 70;
const DESC_MAX = 160;

if (!existsSync(OUT)) {
  console.error(`✖ ${OUT}/ not found — run \`npm run build\` first.`);
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (p.endsWith(".html")) acc.push(p);
  }
  return acc;
}

// Decode the handful of HTML entities Next emits in attribute values so length
// checks measure the text a search engine sees, not the encoded byte count.
const decodeEntities = (s) =>
  s
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");

const pick = (html, re) => {
  const m = html.match(re);
  return m ? decodeEntities(m[1].trim()) : null;
};
const metaName = (html, name) =>
  pick(html, new RegExp(`<meta name="${name}" content="([^"]*)"`, "i"));
const metaProp = (html, prop) =>
  pick(html, new RegExp(`<meta property="${prop}" content="([^"]*)"`, "i"));

function routeFor(file) {
  return file
    .replace(/^out/, "")
    .replace(/\/index\.html$/, "/")
    .replace(/\/404\.html$/, "/404.html");
}

function audit(file) {
  const html = readFileSync(file, "utf8");
  const route = routeFor(file);
  const robots = metaName(html, "robots") || "";
  return {
    route,
    self: `${SITE}${route}`,
    indexable: !/noindex/.test(robots),
    title: pick(html, /<title>([^<]*)<\/title>/i),
    desc: metaName(html, "description"),
    canonical: pick(html, /<link rel="canonical" href="([^"]*)"/i),
    ogImage: metaProp(html, "og:image"),
    twImage: metaName(html, "twitter:image"),
    twCard: metaName(html, "twitter:card"),
    h1: [...html.matchAll(/<h1[^>]*>/gi)].length,
  };
}

const rows = walk(OUT).sort().map(audit);
const failures = [];
const warnings = [];
const fail = (route, msg) => failures.push(`${route}: ${msg}`);
const warn = (route, msg) => warnings.push(`${route}: ${msg}`);

for (const r of rows) {
  // twitter:card=summary_large_image demands an image, indexable or not —
  // otherwise every share renders a blank card.
  if (r.twCard === "summary_large_image" && !r.twImage)
    fail(r.route, "twitter:card is summary_large_image but twitter:image is missing");

  if (!r.indexable) continue; // the rest of the rules only matter for indexable pages

  if (!r.canonical) fail(r.route, "indexable page has no canonical");
  else if (r.canonical !== r.self)
    fail(r.route, `canonical ${r.canonical} != self ${r.self}`);

  if (!r.ogImage) fail(r.route, "indexable page has no og:image");
  if (!r.title) fail(r.route, "missing <title>");
  if (r.h1 !== 1) fail(r.route, `expected exactly one <h1>, found ${r.h1}`);

  const len = r.desc ? r.desc.length : 0;
  if (!r.desc) fail(r.route, "indexable page has no meta description");
  else if (len < DESC_MIN || len > DESC_MAX)
    warn(r.route, `description length ${len} outside ${DESC_MIN}-${DESC_MAX}`);
}

// Report
const indexable = rows.filter((r) => r.indexable).length;
console.log(
  `Audited ${rows.length} pages (${indexable} indexable, ${rows.length - indexable} noindex).`
);

if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  - ${w}`);
}

if (failures.length) {
  console.log(`\n✖ ${failures.length} failure(s):`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}

console.log("\n✔ All hard SEO checks passed.");
