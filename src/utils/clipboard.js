// navigator.clipboard is undefined outside a secure context, which includes the
// plain-HTTP LAN address used for local phone testing, so fall back to a
// throwaway textarea rather than leaving a copy button silently dead there.
export function copyTextToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value).then(() => true, () => legacyCopy(value));
  }
  return Promise.resolve(legacyCopy(value));
}

function legacyCopy(value) {
  try {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(field);
    return copied;
  } catch {
    return false;
  }
}
