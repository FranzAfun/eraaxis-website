/**
 * Postbuild step (see package.json's "postbuild" script — runs automatically
 * after "npm run build", including on Netlify).
 *
 * SEO.jsx only sets per-page <title>/meta/OG/canonical tags client-side via
 * a useEffect, so a crawler that doesn't execute JS (Twitter/Facebook/
 * LinkedIn preview bots, among others) only ever sees the generic homepage
 * tags baked into dist/index.html, on every route. This script fixes that
 * without a full SSR/SSG rewrite: for each static route in src/data/seo.js's
 * pageSeo map, it clones the built index.html and swaps in that route's own
 * title/description/OG/Twitter/canonical tags, then writes it to
 * dist/<route>/index.html. Netlify's pretty_urls + SPA fallback redirect
 * (see netlify.toml) serve these directly — the client-side app still boots
 * normally from there, and SEO.jsx's own effect re-applies the same values
 * on hydration (idempotent, no conflict).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { pageSeo } from "../src/data/seo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "..", "dist");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");

// /payments/resume/:enrolmentId is a dynamic, private post-payment flow —
// no real SEO value, and there's no single canonical page to prerender for it.
const EXCLUDED_ROUTES = new Set(["/payments/resume"]);

function getSiteUrl() {
  // On Netlify, env vars configured in the site's dashboard are real
  // process.env values during the build, so this picks up VITE_SITE_URL
  // exactly like the client-side getSiteUrl() in src/data/seo.js does.
  // Locally, .env's VITE_SITE_URL isn't exported to the shell by Vite's own
  // build step, so this falls back to the same default the client uses.
  const configured = String(process.env.VITE_SITE_URL || "").trim();
  return (configured || "https://eraaxis.com").replace(/\/+$/, "");
}

function buildCanonicalUrl(pathname) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${normalized}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceOrInsert(html, regex, replacement) {
  if (regex.test(html)) {
    return html.replace(regex, replacement);
  }
  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

function renderPage(template, seo) {
  const canonicalUrl = buildCanonicalUrl(seo.pathname);
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);

  let html = template;
  html = replaceOrInsert(html, /<title>.*?<\/title>/s, `<title>${title}</title>`);
  html = replaceOrInsert(html, /<meta\s+name="description"[^>]*\/?>/i, `<meta name="description" content="${description}" />`);
  html = replaceOrInsert(html, /<meta\s+property="og:title"[^>]*\/?>/i, `<meta property="og:title" content="${title}" />`);
  html = replaceOrInsert(html, /<meta\s+property="og:description"[^>]*\/?>/i, `<meta property="og:description" content="${description}" />`);
  html = replaceOrInsert(html, /<meta\s+property="og:url"[^>]*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = replaceOrInsert(html, /<meta\s+name="twitter:title"[^>]*\/?>/i, `<meta name="twitter:title" content="${title}" />`);
  html = replaceOrInsert(html, /<meta\s+name="twitter:description"[^>]*\/?>/i, `<meta name="twitter:description" content="${description}" />`);
  html = replaceOrInsert(html, /<link\s+rel="canonical"[^>]*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  return html;
}

function main() {
  if (!existsSync(TEMPLATE_PATH)) {
    console.warn("[prerender-seo] dist/index.html not found — skipping (did the build run first?)");
    return;
  }

  const template = readFileSync(TEMPLATE_PATH, "utf8");
  let written = 0;

  for (const [route, seo] of Object.entries(pageSeo)) {
    if (route === "/" || EXCLUDED_ROUTES.has(route)) continue;

    const outDir = path.join(DIST_DIR, route.replace(/^\//, ""));
    const outFile = path.join(outDir, "index.html");
    mkdirSync(outDir, { recursive: true });
    writeFileSync(outFile, renderPage(template, seo), "utf8");
    written += 1;
  }

  // The homepage's own dist/index.html already has the correct default tags
  // (they match pageSeo["/"] exactly), so it's rewritten in place rather than
  // into a subdirectory.
  writeFileSync(TEMPLATE_PATH, renderPage(template, pageSeo["/"]), "utf8");

  console.log(`[prerender-seo] wrote ${written} route(s) + refreshed homepage index.html`);
}

main();
