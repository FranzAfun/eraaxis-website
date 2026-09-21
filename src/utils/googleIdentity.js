// Google Identity Services, loaded on demand and shared by every page that
// signs somebody in with Google: attendance, and forms that require it.
const GSI_SRC = "https://accounts.google.com/gsi/client";

// Google's script is loaded only when a page actually needs to sign somebody
// in, so nobody has a third party's script pulled in on their behalf for a
// page that turns out not to use it.
let gsiPromise = null;
export function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (gsiPromise) return gsiPromise;

  gsiPromise = new Promise((resolve, reject) => {
    // Only this function adds the script, and a load in progress is shared through
    // gsiPromise, so an element found here is left over from a failed attempt. It
    // has already fired its events and would never fire them again, which left a
    // retry waiting forever; start from a fresh element instead.
    document.querySelector(`script[src="${GSI_SRC}"]`)?.remove();
    const script = document.createElement("script");
    const fail = () => {
      script.remove();
      reject(new Error("Google sign-in did not load."));
    };
    script.addEventListener("load", () => {
      if (window.google?.accounts?.id) resolve(window.google);
      else fail();
    });
    script.addEventListener("error", fail);
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }).catch((error) => {
    // A failed load must not be cached as permanent: the learner may simply
    // have lost signal for a moment, and Try again has to mean something.
    gsiPromise = null;
    throw error;
  });
  return gsiPromise;
}
