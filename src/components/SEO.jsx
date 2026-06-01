import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_TITLE,
  buildCanonicalUrl,
  getSiteUrl,
} from "../data/seo";

function getOrCreateMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  return element;
}

function getOrCreateCanonical() {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  return link;
}

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  type = "website",
  image = DEFAULT_IMAGE,
  pathname,
}) {
  const location = useLocation();

  useEffect(() => {
    const resolvedPath = pathname || location.pathname;
    const canonicalUrl = buildCanonicalUrl(resolvedPath);
    const resolvedImage = image
      ? image.startsWith("http")
        ? image
        : `${getSiteUrl()}${image.startsWith("/") ? image : `/${image}`}`
      : null;

    document.title = title;

    const descriptionMeta = getOrCreateMeta('meta[name="description"]', {
      name: "description",
    });
    descriptionMeta.setAttribute("content", description);

    const ogTitleMeta = getOrCreateMeta('meta[property="og:title"]', {
      property: "og:title",
    });
    ogTitleMeta.setAttribute("content", title);

    const ogDescriptionMeta = getOrCreateMeta(
      'meta[property="og:description"]',
      { property: "og:description" }
    );
    ogDescriptionMeta.setAttribute("content", description);

    const ogTypeMeta = getOrCreateMeta('meta[property="og:type"]', {
      property: "og:type",
    });
    ogTypeMeta.setAttribute("content", type);

    const ogUrlMeta = getOrCreateMeta('meta[property="og:url"]', {
      property: "og:url",
    });
    ogUrlMeta.setAttribute("content", canonicalUrl);

    const twitterCardMeta = getOrCreateMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
    });
    twitterCardMeta.setAttribute(
      "content",
      resolvedImage ? "summary_large_image" : "summary"
    );

    const twitterTitleMeta = getOrCreateMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
    });
    twitterTitleMeta.setAttribute("content", title);

    const twitterDescriptionMeta = getOrCreateMeta(
      'meta[name="twitter:description"]',
      { name: "twitter:description" }
    );
    twitterDescriptionMeta.setAttribute("content", description);

    const canonicalLink = getOrCreateCanonical();
    canonicalLink.setAttribute("href", canonicalUrl);

    const ogImageMeta = document.head.querySelector('meta[property="og:image"]');
    const twitterImageMeta = document.head.querySelector(
      'meta[name="twitter:image"]'
    );

    if (resolvedImage) {
      const ensuredOgImageMeta =
        ogImageMeta ||
        getOrCreateMeta('meta[property="og:image"]', {
          property: "og:image",
        });
      ensuredOgImageMeta.setAttribute("content", resolvedImage);

      const ensuredTwitterImageMeta =
        twitterImageMeta ||
        getOrCreateMeta('meta[name="twitter:image"]', {
          name: "twitter:image",
        });
      ensuredTwitterImageMeta.setAttribute("content", resolvedImage);
    } else {
      ogImageMeta?.remove();
      twitterImageMeta?.remove();
    }
  }, [description, image, location.pathname, pathname, title, type]);

  return null;
}
