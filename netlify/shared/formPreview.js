/**
 * What a shared form link shows in WhatsApp, Facebook, LinkedIn and the rest.
 *
 * Those apps read the page's <head> without running any JavaScript, so without
 * help every form link shows the homepage card. The edge function on /forms/*
 * asks the API for the form's preview text and picture and rewrites the head with
 * them. These helpers are the pure part of that, kept apart so they can be tested
 * without Netlify.
 */

// The same rule the API uses for a form's address.
export const FORM_SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

/**
 * Whether the request comes from something building a link preview rather than a
 * person. People get the page unchanged and fast; the page sets its own title once
 * it loads. Preview fetchers either do not claim to be a browser at all
 * (WhatsApp, facebookexternalhit, Twitterbot, TelegramBot, Slackbot) or say so in
 * a browser-like string (LinkedInBot, Discordbot, Googlebot).
 */
export function wantsPreview(userAgent) {
  const ua = String(userAgent || "");
  if (!ua) return true;
  if (!/Mozilla/.test(ua)) return true;
  return /bot\b|bot\/|facebookexternalhit|whatsapp|embedly|preview|crawler|spider|slurp/i.test(ua);
}

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Replaces a tag the shell already has, or adds it before </head>.
function replaceOrInsert(html, pattern, tag) {
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

/**
 * The page's HTML with the form's own title, description, picture and address in
 * its head. `seo` is the API's `{ title, description, image }`; a form without a
 * picture keeps the site's default one. Forms are never indexed.
 */
export function injectPreview(html, seo, pageUrl) {
  const title = escapeAttr(`${seo.title} | ERA AXIS`);
  const description = seo.description ? escapeAttr(seo.description) : null;
  const url = escapeAttr(pageUrl);
  let out = html;
  out = replaceOrInsert(out, /<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  out = replaceOrInsert(out, /<meta\s+property="og:title"[^>]*\/?>/i, `<meta property="og:title" content="${title}" />`);
  out = replaceOrInsert(out, /<meta\s+name="twitter:title"[^>]*\/?>/i, `<meta name="twitter:title" content="${title}" />`);
  if (description) {
    out = replaceOrInsert(out, /<meta\s+name="description"[^>]*\/?>/i, `<meta name="description" content="${description}" />`);
    out = replaceOrInsert(out, /<meta\s+property="og:description"[^>]*\/?>/i, `<meta property="og:description" content="${description}" />`);
    out = replaceOrInsert(out, /<meta\s+name="twitter:description"[^>]*\/?>/i, `<meta name="twitter:description" content="${description}" />`);
  }
  if (seo.image) {
    const image = escapeAttr(seo.image);
    out = replaceOrInsert(out, /<meta\s+property="og:image"[^>]*\/?>/i, `<meta property="og:image" content="${image}" />`);
    out = replaceOrInsert(out, /<meta\s+name="twitter:image"[^>]*\/?>/i, `<meta name="twitter:image" content="${image}" />`);
  }
  out = replaceOrInsert(out, /<meta\s+property="og:url"[^>]*\/?>/i, `<meta property="og:url" content="${url}" />`);
  out = replaceOrInsert(out, /<link\s+rel="canonical"[^>]*\/?>/i, `<link rel="canonical" href="${url}" />`);
  out = replaceOrInsert(out, /<meta\s+name="robots"[^>]*\/?>/i, `<meta name="robots" content="noindex" />`);
  return out;
}
