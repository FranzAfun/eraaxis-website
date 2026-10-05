import { useEffect, useRef } from "react";
import { buildScenes } from "./sceneBuilders";

/**
 * Turns the data-scene tags inside it into scroll-linked animation (see
 * sceneBuilders.js). GSAP and ScrollTrigger load on the first scroll or touch,
 * or a few seconds after the page has loaded, so they never hold up the first
 * paint; until then everything is simply in place. Wide screens and phones get their own sets, and people who ask for
 * less motion get none (gsap.matchMedia reverts it all when that changes).
 */
export default function ScrollScenes({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let media = null;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      // A phone's address bar showing and hiding is not a real resize.
      ScrollTrigger.config({ ignoreMobileResize: true });
      media = gsap.matchMedia(ref.current);
      media.add(
        {
          // matchMedia runs this only when a condition matches, so one always does.
          any: "all",
          wide: "(min-width: 1024px) and (pointer: fine)",
          calm: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions.calm) return undefined;
          // Anything the scenes changed outside GSAP is undone with them.
          return buildScenes(gsap, ref.current, { wide: context.conditions.wide });
        }
      );
      // The stack's sections settle their sizes as images load.
      ScrollTrigger.refresh();
    };

    // Start on the first sign of someone moving through the page, or a few
    // seconds after it has loaded, whichever comes first. Never before the
    // page is drawn: on a slow phone, loading GSAP "when idle" landed before
    // the hero image was painted and delayed it.
    let started = false;
    let timer = 0;
    const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"];
    const go = () => {
      if (started) return;
      started = true;
      events.forEach((name) => window.removeEventListener(name, go));
      window.clearTimeout(timer);
      start();
    };
    events.forEach((name) => window.addEventListener(name, go, { passive: true, once: true }));
    const afterLoad = () => { timer = window.setTimeout(go, 3000); };
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });

    return () => {
      cancelled = true;
      started = true;
      events.forEach((name) => window.removeEventListener(name, go));
      window.removeEventListener("load", afterLoad);
      window.clearTimeout(timer);
      media?.revert();
    };
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
