// VITE_API_URL is the JSON API base (e.g. "http://localhost:5000/api/website")
// — it already carries a path suffix, so media URLs (served at the sibling
// path "/api/files/...", not nested under /api/website) need just the origin,
// not this whole value. Deriving it via URL avoids hardcoding a second env
// var that has to be kept in sync with the first.
const API_ORIGIN = (() => {
  try {
    return new URL(import.meta.env.VITE_API_URL || "").origin;
  } catch {
    return "";
  }
})();

// Media URLs from the API are either a relative S3-backed path (e.g.
// "/api/files/...", needs the API origin prefixed) or an already-absolute
// pasted external URL (e.g. "https://..."), which must be returned as-is.
export function resolveMediaUrl(url) {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `${API_ORIGIN}${url}`;
}
