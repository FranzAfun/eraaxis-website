/**
 * What a shared eraaxis.com link shows in WhatsApp, Facebook, LinkedIn and the
 * rest.
 *
 * Those apps read the page's <head> without running any JavaScript, so without
 * help every link that is not a fixed page shows the homepage card. The edge
 * functions rewrite the head for them: a form (/forms/*) and an article
 * (/insights/*) with their own title, description and picture from the API;
 * attendance, certificate and continue-payment links with fixed words, since
 * they are private and nothing about the person may appear in a preview.
 * These helpers are the pure part of that, kept apart so they can be tested
 * without Netlify.
 */

// The same rule the API uses for a form's address.
export const FORM_SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

// An article's address: lower-case words joined by hyphens.
export const INSIGHT_SLUG = /^[a-z0-9][a-z0-9-]{0,199}$/;

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

/**
 * The fixed preview for a private link, or null. Nothing here is looked up: an
 * attendance token, a certificate code or a payment link must never put a name
 * or a course in front of whoever the link was pasted to.
 */
const FIXED = [
  {
    prefix: "/attendance/",
    title: "Class attendance",
    description: "Sign in with the Google account you registered with to mark yourself present.",
  },
  {
    prefix: "/certificates/verify/",
    title: "Verify a certificate",
    description: "Check that an ERA AXIS certificate is genuine.",
  },
  {
    prefix: "/payments/resume/",
    title: "Continue your payment",
    description: "Finish paying for your ERA AXIS programme.",
  },
];

export function fixedPreviewFor(pathname) {
  const found = FIXED.find((item) => String(pathname || "").startsWith(item.prefix));
  return found ? { title: found.title, description: found.description, image: null } : null;
}

/**
 * A picture's address from the API: a relative "/api/files/..." path is on the
 * API's own host; a pasted "https://..." address is used as it is.
 */
export function absoluteMediaUrl(value, apiBase) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  try {
    return new URL(value, new URL(apiBase).origin).href;
  } catch {
    return null;
  }
}

/**
 * The picture to offer this fetcher. LinkedIn does not reliably show WebP
 * pictures (the site's own card is a JPEG for that reason), and pictures
 * uploaded through EDOS are WebP; LinkedIn gets the ERA AXIS card instead.
 */
export function shareableImage(image, userAgent) {
  if (!image) return null;
  if (/LinkedInBot/i.test(String(userAgent || "")) && /\.webp(\?|#|$)/i.test(image)) return null;
  return image;
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
 * The page's HTML with its own title, description, picture and address in its
 * head. `seo` is `{ title, description, image }`; without a picture or
 * description the site's defaults stay. A page's own picture replaces the
 * default card's, and the card's size and alt text go with it, so nothing
 * describes the wrong picture.
 *
 * `index`: false (forms, private links) asks search engines not to list the
 * page; true (articles) leaves that to the site. `type`: og:type, such as
 * "article".
 */
export function injectPreview(html, seo, pageUrl, { index = false, type } = {}) {
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
    out = out.replace(/[ \t]*<meta\s+property="og:image:(type|width|height)"[^>]*\/?>\r?\n?/gi, "");
    out = replaceOrInsert(out, /<meta\s+property="og:image:alt"[^>]*\/?>/i, `<meta property="og:image:alt" content="${escapeAttr(seo.imageAlt || seo.title)}" />`);
  }
  if (type) out = replaceOrInsert(out, /<meta\s+property="og:type"[^>]*\/?>/i, `<meta property="og:type" content="${escapeAttr(type)}" />`);
  out = replaceOrInsert(out, /<meta\s+property="og:url"[^>]*\/?>/i, `<meta property="og:url" content="${url}" />`);
  out = replaceOrInsert(out, /<link\s+rel="canonical"[^>]*\/?>/i, `<link rel="canonical" href="${url}" />`);
  if (!index) out = replaceOrInsert(out, /<meta\s+name="robots"[^>]*\/?>/i, `<meta name="robots" content="noindex" />`);
  return out;
}

/**
 * The edge functions' shared ending: the page with its preview head, marked as
 * different for preview fetchers and people.
 */
export async function previewResponse(response, seo, pageUrl, options) {
  const html = injectPreview(await response.text(), seo, pageUrl, options);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  // People and preview fetchers get different heads from the same address.
  headers.set("vary", "User-Agent");
  return new Response(html, { status: response.status, headers });
}
