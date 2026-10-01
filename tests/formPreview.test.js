import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FORM_SLUG, injectPreview, wantsPreview } from "../netlify/shared/formPreview.js";

// The real shell, so a change to index.html's tags cannot quietly stop the
// rewrite from finding them.
const shell = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("preview fetchers get the rewritten head, people do not", () => {
  for (const bot of [
    "WhatsApp/2.23.20.0 A",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Twitterbot/1.0",
    "TelegramBot (like TwitterBot)",
    "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
    "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)",
    "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  ]) assert.equal(wantsPreview(bot), true, bot);
  for (const person of [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14; SM-A145F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36",
  ]) assert.equal(wantsPreview(person), false, person);
});

test("the head carries the form's own title, description, picture and address", () => {
  const html = injectPreview(shell, {
    title: 'Bootcamp "2026" registration',
    description: "Ten weeks, three courses, free.",
    image: "https://api.example.invalid/api/files/website-media/form-share-1.webp",
  }, "https://eraaxis.com/forms/bootcamp-2026");

  assert.match(html, /<title>Bootcamp &quot;2026&quot; registration \| ERA AXIS<\/title>/);
  assert.match(html, /<meta property="og:title" content="Bootcamp &quot;2026&quot; registration \| ERA AXIS" \/>/);
  assert.match(html, /<meta property="og:description" content="Ten weeks, three courses, free\." \/>/);
  assert.match(html, /<meta name="twitter:description" content="Ten weeks, three courses, free\." \/>/);
  assert.match(html, /<meta property="og:image" content="https:\/\/api\.example\.invalid\/api\/files\/website-media\/form-share-1\.webp" \/>/);
  assert.match(html, /<meta property="og:url" content="https:\/\/eraaxis\.com\/forms\/bootcamp-2026" \/>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/eraaxis\.com\/forms\/bootcamp-2026" \/>/);
  assert.match(html, /<meta name="robots" content="noindex" \/>/);
  // Replaced, not added alongside: one of each.
  for (const tag of ['property="og:title"', 'property="og:description"', 'property="og:image"', 'name="description"', "<title>"]) {
    assert.equal(html.split(tag).length - 1, 1, tag);
  }
  assert.doesNotMatch(html, /Practical STEM and Digital Skills Education in Ghana<\/title>/);
});

test("a form without a picture or description keeps the site's defaults for those", () => {
  const html = injectPreview(shell, { title: "Quick survey", description: null, image: null }, "https://eraaxis.com/forms/quick-survey");
  assert.match(html, /<meta property="og:image" content="https:\/\/eraaxis\.com\/og-image\.webp" \/>/);
  assert.match(html, /<title>Quick survey \| ERA AXIS<\/title>/);
});

test("only a real form address is looked up", () => {
  assert.equal(FORM_SLUG.test("bootcamp-2026"), true);
  for (const bad of ["", "../etc", "Bootcamp", "a b", "-leading", "x".repeat(81)]) assert.equal(FORM_SLUG.test(bad), false, bad);
});
