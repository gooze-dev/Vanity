#!/usr/bin/env node
// Generate 1200x630 Open Graph cards for docs pages, at build time.
//
// Reads src/lib/docs-pages.ts (the single source of truth for the docs
// sections) and, for every page that declares an `ogImage` config, renders a
// PNG card from the design-system template below into public/og/<slug>.png.
// Pages without an ogImage keep the site-wide /og-image.png card.
//
// The card follows the Gooze design system: dark ink background, the capital-G
// mark, Oxanium for the title, Geist for the subtitle, and a per-page accent.
// Text stays subject to .claude/rules/writing.md: no em/en dashes, no
// competitor singling, factual subtitles.
//
// Run as part of `npm run build` (before astro build, so the cards land in
// public/ and are copied to out/ with the rest of the static site):
//
//   node --experimental-strip-types scripts/generate-og-cards.mjs
//
// Node 22.23.4+ required (type stripping is stable there; the repo already
// requires that version, see README).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { docsPages, ogImageSlug } from "../src/lib/docs-pages.ts";
import { Resvg } from "@resvg/resvg-js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "og");

// Design tokens, mirroring src/styles/tokens.css.
const INK = "#0c100d";
const INK_RAISED = "#1d231f";
const FG = "#eef1ea";
const FG_MUTED = "#9aa39b";
const ACCENT_GOPHER = "#00add8";
const ACCENT_TOXIC = "#b6f23a";
const BORDER = "#2a312c";

// Accents available to pages. Each matches a design-system brand token.
const ACCENTS = {
  gopher: ACCENT_GOPHER,
  toxic: ACCENT_TOXIC,
  blue: "#007e9e",
  orange: "#f59e2c",
};

// Default accent for pages that do not set one.
const DEFAULT_ACCENT = ACCENT_GOPHER;

const W = 1200;
const H = 630;

// The capital-G mark, inlined from the design system asset.
const MARK_SVG = readFileSync(join(ROOT, "public", "logo", "gooze-mark.svg"), "utf8");

// Fonts are the same self-hosted files the site preloads.
const FONT_OXANIUM = readFileSync(join(ROOT, "public", "fonts", "Oxanium.ttf"));
const FONT_GEIST = readFileSync(join(ROOT, "public", "fonts", "Geist.ttf"));

// Wrap text into at most maxLines lines, each capped at maxChars. Lines fill
// greedily at word boundaries up to the cap, and an overflow that truly cannot
// fit folds into the final line with an ellipsis, so a subtitle that fits
// never shows a truncation ellipsis.
function wrapLines(text, maxChars, maxLines) {
  const words = text.split(/\s+/);
  const totalChars = text.length;
  if (totalChars <= maxChars) return [text];

  const lines = [];
  let current = "";
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const candidate = current ? `${current} ${word}` : word;
    if (current && candidate.length > maxChars) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) {
        // No more room: the rest folds into the final line, ellipsized.
        const rest = words.slice(i).join(" ");
        lines[maxLines - 1] = `${rest.slice(0, maxChars - 1)}…`;
        break;
      }
    } else {
      current = candidate;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  // Hard safety cap: no line may exceed the box width.
  return lines.map((l) => (l.length > maxChars ? `${l.slice(0, maxChars - 1)}…` : l));
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// A slug is the page href minus the /docs prefix, slashes become dashes so
// every card is a flat file: /docs/quick-start -> quick-start,
// /docs/ci/sharing-reports -> ci-sharing-reports.png (lib/ogImageSlug keeps
// the metadata builder in agreement).

function cardSvg(href, title, subtitle, accent, section) {
  const titleLines = wrapLines(title, 22, 3).map(escapeXml);
  const subLines = wrapLines(subtitle, 60, 2).map(escapeXml);

  // Title block, vertically centered; subtitle below it.
  const titleLineH = 66;
  const titleBlockH = titleLines.length * titleLineH;
  const subBlockH = subLines.length * 38;
  const blockTop = Math.max(150, (H - (titleBlockH + 24 + subBlockH)) / 2) + 40;

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="72" y="${blockTop + i * titleLineH}">${line}</tspan>`
    )
    .join("");

  const subTop = blockTop + titleLines.length * titleLineH + 8;
  const subTspans = subLines
    .map((line, i) => `<tspan x="72" y="${subTop + i * 38}">${line}</tspan>`)
    .join("");

  // A quiet grid of 1px hairlines on the right half echoes the tool's report
  // grid without competing with the text.
  const gridLines = [];
  for (let gx = 660; gx <= 1160; gx += 100) {
    gridLines.push(`<line x1="${gx}" y1="0" x2="${gx}" y2="${H}" stroke="#1a211d" stroke-width="1"/>`);
  }
  for (let gy = 0; gy <= H; gy += 70) {
    gridLines.push(`<line x1="660" y1="${gy}" x2="1160" y2="${gy}" stroke="#1a211d" stroke-width="1"/>`);
  }

  // Accent chip: page accent in a rounded pill under the mark, top right.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${INK}"/>
      <stop offset="0.72" stop-color="${INK_RAISED}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${gridLines.join("")}
  <rect x="72" y="72" width="88" height="88" rx="20" fill="#151a16" stroke="${BORDER}" stroke-width="1.5"/>
  <g transform="translate(44,44) scale(1.3)">${MARK_SVG.replace(/<svg[^>]*>|<\/svg>/g, "")}</g>
  <g transform="translate(196, 84)">
    <rect x="0" y="0" width="${section.length * 15 + 34}" height="40" rx="20" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.85"/>
    <text x="17" y="27" font-family="Oxanium, sans-serif" font-size="22" font-weight="700" fill="${accent}">${escapeXml(section)}</text>
  </g>
  <g font-family="Oxanium, sans-serif">
    <text x="72" y="${blockTop}" font-size="62" font-weight="700" fill="${FG}" letter-spacing="0.5">${titleTspans}</text>
  </g>
  <g font-family="Geist, sans-serif">
    <text x="72" y="${subTop}" font-size="30" fill="${FG_MUTED}" font-weight="400">${subTspans}</text>
  </g>
  <rect x="72" y="${H - 120}" width="52" height="7" rx="3.5" fill="${accent}"/>
  <text x="72" y="${H - 62}" font-family="Oxanium, sans-serif" font-size="26" font-weight="600" fill="${FG_MUTED}">Test your tests.</text>
  <text x="${W - 72}" y="${H - 62}" text-anchor="end" font-family="Oxanium, sans-serif" font-size="26" font-weight="600" fill="${FG_MUTED}">gooze.dev</text>
</svg>`;
}

function resolveAccent(accent) {
  return accent && /^#[0-9a-fA-F]{6}$/.test(accent) ? accent : DEFAULT_ACCENT;
}

function render(pages) {
  mkdirSync(OUT_DIR, { recursive: true });
  const configured = pages.filter((p) => p.ogImage);
  if (configured.length === 0) {
    console.log("generate-og-cards: no pages declare ogImage; nothing to render.");
    return;
  }
  for (const page of configured) {
    const og = page.ogImage;
    const accent = ACCENTS[og.accent] ?? resolveAccent(og.accent);
    const svg = cardSvg(page.href, og.title ?? page.seoTitle ?? page.title, og.subtitle ?? page.description, accent, page.section);
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: W },
      font: { fontBuffers: [FONT_OXANIUM, FONT_GEIST] },
    });
    const png = resvg.render().asPng();
    const slug = ogImageSlug(page.href);
    const out = join(OUT_DIR, `${slug}.png`);
    writeFileSync(out, png);
    console.log(`generate-og-cards: ${out} (${png.length} bytes)`);
  }
}

render(docsPages);
