import { useCallback, useState } from "react";
import { ThinkingOrb } from "thinking-orbs";

// The orb's inline-text preset (the library draws only 20, 32 and 64).
const ORB_SIZE = 20;

// Light text means a dark background, and the other way round; the orb shades
// toward whatever it sits on either way.
function readInk(element) {
  const color = element ? getComputedStyle(element).color : "";
  const parts = color.match(/\d+(\.\d+)?/g)?.map(Number) || [];
  if (parts.length < 3) return { color: undefined, theme: "auto" };
  const [r, g, b] = parts;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return { color: `rgb(${r}, ${g}, ${b})`, theme: luminance > 0.5 ? "dark" : "light" };
}

function useInk() {
  const [ink, setInk] = useState({ color: undefined, theme: "auto" });
  const measure = useCallback((node) => {
    if (node) setInk(readInk(node));
  }, []);
  return [ink, measure];
}

function Orb({ ink }) {
  return (
    <ThinkingOrb
      state="working"
      size={ORB_SIZE}
      theme={ink.theme}
      color={ink.color}
      aria-hidden="true"
      className="-my-1 shrink-0"
      style={{ width: ORB_SIZE, height: ORB_SIZE }}
    />
  );
}

/**
 * A busy button's label: the working orb beside the words ("Sending…"), in the
 * button's own text colour, as on EDOS. Use in place of the plain busy text:
 * `{sending ? <BusyLabel>Sending…</BusyLabel> : "Send"}`.
 */
export default function BusyLabel({ children }) {
  const [ink, measure] = useInk();
  return (
    <span ref={measure} role="status" className="inline-flex items-center justify-center gap-2">
      <Orb ink={ink} />
      {children}
    </span>
  );
}

/**
 * A page or section waiting on something ("Opening this session…"): the same
 * small orb before the words. Never the large full-page orb.
 */
export function Waiting({ children, className = "" }) {
  const [ink, measure] = useInk();
  return (
    <p ref={measure} role="status" className={`flex items-center justify-center gap-2.5 ${className}`.trim()}>
      <Orb ink={ink} />
      <span>{children}</span>
    </p>
  );
}
