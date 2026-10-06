import { fixedPreviewFor, previewResponse, wantsPreview } from "../shared/linkPreview.js";

/**
 * Link previews for private links: an attendance link pasted in a class chat, a
 * certificate's verification link, an emailed continue-payment link. Each gets
 * fixed words saying what it is for, instead of the homepage card. Nothing is
 * looked up, so no name, course or amount can appear in a preview. Never indexed.
 */
export default async (request, context) => {
  const response = await context.next();
  if (!wantsPreview(request.headers.get("user-agent"))) return response;
  if (!(response.headers.get("content-type") || "").includes("text/html")) return response;

  const url = new URL(request.url);
  const seo = fixedPreviewFor(url.pathname);
  if (!seo) return response;
  return previewResponse(response, seo, `${url.origin}${url.pathname}`);
};

export const config = { path: ["/attendance/*", "/certificates/verify/*", "/payments/resume/*"] };
