import { useEffect, useRef } from "react";

/**
 * Sections that stack like cards as you scroll. Each one scrolls normally
 * until its end is in view, then holds there while the next slides up over it;
 * the one being covered sinks back (dims, and on a wide screen shrinks a
 * little). The sections themselves are untouched: this wraps them and sets a
 * few CSS variables (see .scroll-stack in index.css).
 *
 * Per section: --stick-top (where it holds: 0 for a short section, negative
 * for a tall one so its end stays in view), --stack-origin (the middle of what
 * is on screen while it holds) and --cover (0 to 1, how far the next one has
 * come over it). One passive scroll listener, at most once per frame. Off for
 * people who ask for less motion.
 */
export default function ScrollStack({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    root.dataset.stacking = "";
    let panels = [];
    let frame = 0;

    const measure = () => {
      panels = [...root.querySelectorAll(":scope > section")];
      const vh = window.innerHeight;
      panels.forEach((panel, i) => {
        const h = panel.offsetHeight;
        const top = Math.min(0, vh - h);
        panel.style.setProperty("--stick-top", `${top}px`);
        panel.style.setProperty("--stack-origin", `${Math.round(h - Math.min(h, vh) / 2)}px`);
        panel.style.zIndex = String(i + 1);
        panel.dataset.stackHeight = String(h);
        panel.dataset.stackTop = String(top);
      });
      update();
    };

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (let i = 0; i < panels.length - 1; i += 1) {
        const panel = panels[i];
        const h = Number(panel.dataset.stackHeight);
        const top = Number(panel.dataset.stackTop);
        const bottom = Math.min(vh, top + h);
        const visible = Math.max(1, bottom - Math.max(0, top));
        const nextTop = panels[i + 1].getBoundingClientRect().top;
        const cover = Math.min(1, Math.max(0, (bottom - nextTop) / visible));
        panel.style.setProperty("--cover", cover.toFixed(3));
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const resize = new ResizeObserver(() => measure());
    [...root.querySelectorAll(":scope > section")].forEach((panel) => resize.observe(panel));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    measure();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      delete root.dataset.stacking;
    };
  }, []);

  return (
    <div ref={ref} className="scroll-stack">
      {children}
    </div>
  );
}
