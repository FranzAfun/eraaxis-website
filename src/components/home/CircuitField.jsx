import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The hero's living circuit: a chip carrying the ERA AXIS E, with traces
 * fanning out to the edges. Pulses of light run along some of them and light
 * the LED at the end; touching the chip powers the whole board up.
 *
 * Plain SVG and CSS (see .circuit-* in index.css): no image to download, sharp
 * at any size. The pulses pause while the hero is off screen, and stand still
 * for people who ask for less motion.
 */

const W = 640;
const H = 560;
const CHIP = { x: 260, y: 210, size: 140 };
const PINS = 6;

// Every trace: out from a pin, a 45-degree bend that fans it away from its
// neighbours, then straight on to the edge of the board.
function buildTraces() {
  const traces = [];
  const { x, y, size } = CHIP;
  const step = size / (PINS + 1);
  for (let i = 0; i < PINS; i += 1) {
    const spread = (i - (PINS - 1) / 2) * 15;
    const far = i % 2 ? 40 : 0;
    const py = y + step * (i + 1);
    const px = x + step * (i + 1);
    // right
    traces.push([[x + size + 8, py], [x + size + 36, py], [x + size + 36 + Math.abs(spread), py + spread], [W - 24 - far, py + spread]]);
    // left
    traces.push([[x - 8, py], [x - 36, py], [x - 36 - Math.abs(spread), py + spread], [24 + far, py + spread]]);
    // top
    traces.push([[px, y - 8], [px, y - 36], [px + spread, y - 36 - Math.abs(spread)], [px + spread, 24 + far]]);
    // bottom
    traces.push([[px, y + size + 8], [px, y + size + 36], [px + spread, y + size + 36 + Math.abs(spread)], [px + spread, H - 24 - far]]);
  }
  return traces.map((points, k) => ({
    d: `M${points.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(" L")}`,
    end: points[points.length - 1],
    // Every third trace carries a pulse, each on its own beat.
    live: k % 3 === 0,
    duration: 2.6 + ((k * 7) % 11) / 6,
    delay: ((k * 0.61) % 3.2).toFixed(2),
  }));
}

const TRACES = buildTraces();

function Pins() {
  const { x, y, size } = CHIP;
  const step = size / (PINS + 1);
  const pins = [];
  for (let i = 0; i < PINS; i += 1) {
    const at = step * (i + 1) - 3;
    pins.push(<rect key={`r${i}`} x={x + size} y={y + at} width="8" height="6" rx="1" />);
    pins.push(<rect key={`l${i}`} x={x - 8} y={y + at} width="8" height="6" rx="1" />);
    pins.push(<rect key={`t${i}`} x={x + at} y={y - 8} width="6" height="8" rx="1" />);
    pins.push(<rect key={`b${i}`} x={x + at} y={y + size} width="6" height="8" rx="1" />);
  }
  return <g className="circuit-pins" aria-hidden="true">{pins}</g>;
}

// The ERA AXIS E, drawn to the proportions of the logo.
function Mark() {
  const s = 0.11; // logo units to board units (the mark is 536 x 662)
  const ox = CHIP.x + (CHIP.size - 536 * s) / 2;
  const oy = CHIP.y + (CHIP.size - 662 * s) / 2;
  const r = (x, y, w, h) => ({ x: ox + x * s, y: oy + y * s, width: w * s, height: h * s });
  return (
    <g>
      <rect {...r(0, 0, 420, 98)} fill="#fff" />
      <rect {...r(0, 0, 98, 600)} fill="#fff" />
      <rect {...r(98, 300, 290, 86)} fill="var(--color-accent)" />
      <rect {...r(0, 562, 430, 100)} rx={46 * s} fill="var(--color-text-on-dark-muted)" />
      <rect {...r(455, 562, 81, 100)} fill="var(--color-text-on-dark-muted)" />
    </g>
  );
}

export default function CircuitField({ className = "" }) {
  const wrapRef = useRef(null);
  const glowRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [powered, setPowered] = useState(false);

  // Pulses run only while the hero is on screen.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // A soft light follows the pointer across the board.
  const frame = useRef(0);
  const onPointerMove = useCallback((event) => {
    const glow = glowRef.current;
    const wrap = wrapRef.current;
    if (!glow || !wrap) return;
    cancelAnimationFrame(frame.current);
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      const box = wrap.getBoundingClientRect();
      glow.style.setProperty("--mx", `${clientX - box.left}px`);
      glow.style.setProperty("--my", `${clientY - box.top}px`);
      glow.style.opacity = "1";
    });
  }, []);
  const onPointerLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`circuit-field relative ${className}`.trim()}
      data-paused={visible ? undefined : ""}
      data-powered={powered ? "" : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div ref={glowRef} aria-hidden="true" className="circuit-glow pointer-events-none absolute inset-0" />
      <svg viewBox={`0 0 ${W} ${H}`} className="relative h-full w-full" role="group" aria-label="A circuit board with the ERA AXIS mark on its chip, its traces pulsing with light">
        <defs>
          <linearGradient id="circuit-chip" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-primary)" />
            <stop offset="1" stopColor="var(--color-primary-deep)" />
          </linearGradient>
        </defs>

        <g className="circuit-traces" aria-hidden="true">
          {TRACES.map((trace) => (
            <path key={trace.d} d={trace.d} />
          ))}
        </g>

        <g className="circuit-pulses" aria-hidden="true">
          {TRACES.filter((trace) => trace.live).map((trace) => (
            <path
              key={trace.d}
              d={trace.d}
              pathLength="100"
              style={{ animationDuration: `${trace.duration}s`, animationDelay: `${trace.delay}s` }}
            />
          ))}
        </g>

        <g className="circuit-ends" aria-hidden="true">
          {TRACES.map((trace) =>
            trace.live ? (
              <g key={trace.d} className="circuit-led" style={{ "--beat": `${trace.duration}s`, "--wait": `${trace.delay}s` }}>
                <circle cx={trace.end[0]} cy={trace.end[1]} r="11" className="circuit-led-halo" />
                <circle cx={trace.end[0]} cy={trace.end[1]} r="4.5" className="circuit-led-core" />
              </g>
            ) : (
              <circle key={trace.d} cx={trace.end[0]} cy={trace.end[1]} r="3.5" className="circuit-via" />
            )
          )}
        </g>

        <Pins />

        <g
          className="circuit-chip"
          tabIndex={0}
          role="button"
          aria-pressed={powered}
          aria-label={powered ? "Power the board down" : "Power the board up"}
          onClick={() => setPowered((on) => !on)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setPowered((on) => !on);
            }
          }}
        >
          <rect x={CHIP.x} y={CHIP.y} width={CHIP.size} height={CHIP.size} rx="16" fill="url(#circuit-chip)" className="circuit-chip-body" />
          <Mark />
        </g>
      </svg>
    </div>
  );
}
