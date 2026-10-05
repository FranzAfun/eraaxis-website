import { useEffect, useRef, useState } from "react";

/**
 * Whether an element has come into view: true the first time it does (and,
 * with `once: false`, false again when it leaves). One observer per element,
 * released as soon as it is no longer needed.
 */
export function useInView({ rootMargin = "0px 0px -8% 0px", once = true } = {}) {
  const ref = useRef(null);
  // Without an observer (very old browsers) everything simply shows.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return [ref, inView];
}
