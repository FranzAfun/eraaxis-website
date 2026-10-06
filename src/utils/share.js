// Where a link can be shared, as the address each service's share page expects.
export function shareLinks(url, title) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    x: `https://x.com/intent/post?text=${t}&url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    email: `mailto:?subject=${t}&body=${encodeURIComponent(`${title}\n\n${url}`)}`,
  };
}

// A phone's own share sheet (WhatsApp, Telegram, Messages and the rest), where
// the browser offers one. On a computer the site's own list is clearer.
export function hasShareSheet() {
  return typeof navigator !== "undefined"
    && typeof navigator.share === "function"
    && typeof window !== "undefined"
    && window.matchMedia?.("(pointer: coarse)").matches;
}
