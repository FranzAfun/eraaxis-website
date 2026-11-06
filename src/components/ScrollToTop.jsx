import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * A new page opens at the top, or at its #section when the link names one.
 * Arriving is instant; a button that jumps to a #section of the page you are
 * already on scrolls there smoothly (unless you ask for less motion). Without
 * that difference, the first press of such a button changed the address, this
 * ran, and jumped, cutting the smooth scroll short.
 */
// A refresh opens at the top too, every time. Left to the browser, Chrome jumps
// back to where you were after this has already sent the page to the top, and
// which one wins changes from refresh to refresh, so the scroll animations
// start from a different place each time.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lastPath = useRef(null);

  useEffect(() => {
    const samePage = lastPath.current === pathname;
    lastPath.current = pathname;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ block: "start", behavior: samePage && !calm ? "smooth" : "instant" });
        }
      });
      return;
    }

    // Same page, the #section cleared: leave the page where it is.
    if (samePage) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
