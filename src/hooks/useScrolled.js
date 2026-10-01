import { useEffect, useState } from "react";

/**
 * Whether the page has been scrolled past a small threshold.
 *
 * Two details matter. The thresholds differ on the way in and the way out, so a
 * page resting right on the boundary cannot strobe between states. And the
 * listener only sets a flag, deferring the read to the next animation frame, so
 * scrolling never pays for a layout measurement per event — it is the header on
 * every page, on phones that feel it.
 *
 * `resetKey` re-reads the position when it changes. A route change scrolls back
 * to the top, and a page that renders already at zero without firing a scroll
 * event would otherwise leave the header in the previous page's state.
 */
export default function useScrolled(enter = 24, exit = 8, resetKey) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const read = () => {
      const y = window.scrollY;
      setScrolled((previous) => (previous ? y > exit : y > enter));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enter, exit, resetKey]);

  return scrolled;
}
