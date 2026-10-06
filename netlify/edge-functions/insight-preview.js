/* global Netlify -- provided by the Netlify edge runtime */
import { INSIGHT_SLUG, absoluteMediaUrl, previewResponse, shareableImage, wantsPreview } from "../shared/linkPreview.js";

/**
 * Link previews for articles. When LinkedIn, WhatsApp and the like fetch an
 * /insights/<slug> link, the page's head is rewritten with the article's own
 * title, summary and featured image (its SEO title and description when the
 * editor set them), from the same public API the article page reads. An article
 * without a featured image keeps the ERA AXIS card. Anything that goes wrong
 * serves the page unchanged: a preview is never worth a broken link. Unlike
 * forms, articles stay open to search engines.
 */
const API_TIMEOUT_MS = 2500;

export default async (request, context) => {
  const response = await context.next();
  if (!wantsPreview(request.headers.get("user-agent"))) return response;
  if (!(response.headers.get("content-type") || "").includes("text/html")) return response;

  const url = new URL(request.url);
  const slug = decodeURIComponent(url.pathname.split("/")[2] || "");
  if (!INSIGHT_SLUG.test(slug)) return response;

  let article;
  let apiBase;
  try {
    apiBase = new URL(`${(Netlify.env.get("VITE_API_URL") || "/api/website").replace(/\/+$/, "")}/`, url);
    const reply = await fetch(new URL(`insights/${slug}`, apiBase), {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!reply.ok) return response;
    article = (await reply.json())?.data;
  } catch {
    return response;
  }
  if (!article?.title) return response;

  const seo = {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || null,
    image: shareableImage(absoluteMediaUrl(article.featuredImageUrl, apiBase.href), request.headers.get("user-agent")),
  };
  return previewResponse(response, seo, `${url.origin}/insights/${slug}`, { index: true, type: "article" });
};

export const config = { path: "/insights/*" };
