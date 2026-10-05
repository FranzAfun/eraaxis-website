import { useEffect, useRef } from "react";
import { buildScenes } from "./sceneBuilders";

/**
 * Turns the data-scene tags inside it into scroll-linked animation (see
 * sceneBuilders.js). GSAP and ScrollTrigger load only once the page is idle, so
 * they never hold up the first paint; until then everything is simply in
 * place. Wide screens and phones get their own sets, and people who ask for
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
          wide: "(min-width: 1024px) and (pointer: fine)",
          calm: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions.calm) return;
          buildScenes(gsap, ref.current, { wide: context.conditions.wide });
        }
      );
      // The stack's sections settle their sizes as images load.
      ScrollTrigger.refresh();
    };

    const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 400));
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout;
    const handle = idle(() => { start(); }, { timeout: 1500 });

    return () => {
      cancelled = true;
      cancelIdle(handle);
      media?.revert();
    };
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
