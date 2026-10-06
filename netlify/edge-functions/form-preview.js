/* global Netlify -- provided by the Netlify edge runtime */
import { FORM_SLUG, previewResponse, shareableImage, wantsPreview } from "../shared/linkPreview.js";

/**
 * Link previews for public forms. When WhatsApp, Facebook and the like fetch a
 * /forms/<slug> link, the page's head is rewritten with the form's own title,
 * description and picture from the API (GET /forms/:slug/seo). Anything that goes
 * wrong — an unknown form, the API slow or down — serves the page unchanged, with
 * the site's default card: a preview is never worth a broken link.
 *
 * VITE_API_URL is the same setting the site is built with; on Netlify it must be
 * available to functions as well as builds (see DEPLOYMENT.md).
 */
const API_TIMEOUT_MS = 2500;

export default async (request, context) => {
  const response = await context.next();
  if (!wantsPreview(request.headers.get("user-agent"))) return response;
  if (!(response.headers.get("content-type") || "").includes("text/html")) return response;

  const url = new URL(request.url);
  const slug = decodeURIComponent(url.pathname.split("/")[2] || "");
  if (!FORM_SLUG.test(slug)) return response;

  let seo;
  try {
    const apiBase = new URL(`${(Netlify.env.get("VITE_API_URL") || "/api/website").replace(/\/+$/, "")}/`, url);
    const reply = await fetch(new URL(`forms/${slug}/seo`, apiBase), {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!reply.ok) return response;
    seo = (await reply.json())?.data;
  } catch {
    return response;
  }
  if (!seo?.title) return response;

  return previewResponse(response, { ...seo, image: shareableImage(seo.image, request.headers.get("user-agent")) }, `${url.origin}/forms/${slug}`);
};

export const config = { path: "/forms/*" };
