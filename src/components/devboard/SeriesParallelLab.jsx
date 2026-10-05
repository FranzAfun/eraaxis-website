import { useState } from "react";

/**
 * Series or parallel, tried rather than read about: two LEDs, one battery.
 * Pull the first LED out and see what happens to the second. In series the
 * whole loop breaks and both go dark; in parallel the second has its own path
 * and stays lit. Plain SVG; current flows along whichever wires are live
 * (.lab-* in index.css), still for reduced motion.
 */
const RESULT = {
  series: {
    in: "In series, current runs through both LEDs in one loop. Both light.",
    out: "One loop, and it is broken: the second LED goes dark too.",
  },
  parallel: {
    in: "In parallel, each LED has its own path to the battery. Both light.",
    out: "Its own path is untouched, so the second LED stays lit.",
  },
};

function Led({ x, y, lit, removed, label }) {
  if (removed) {
    return (
      <g aria-hidden="true">
        <circle cx={x} cy={y} r="13" className="lab-led-gap" />
        <text x={x} y={y + 32} textAnchor="middle" className="lab-label">{label}</text>
      </g>
    );
  }
  return (
    <g aria-hidden="true">
      <circle cx={x} cy={y} r="26" className={`lab-halo${lit ? " is-lit" : ""}`} />
      <circle cx={x} cy={y} r="13" className={`lab-led${lit ? " is-lit" : ""}`} />
      <text x={x} y={y + 32} textAnchor="middle" className="lab-label">{label}</text>
    </g>
  );
}

function Battery() {
  return (
    <g className="lab-battery" aria-hidden="true">
      <rect x="42" y="84" width="36" height="62" rx="5" />
      <rect x="52" y="78" width="16" height="7" rx="2" />
      <text x="60" y="121" textAnchor="middle">6V</text>
    </g>
  );
}

export default function SeriesParallelLab() {
  const [mode, setMode] = useState("series");
  const [pulled, setPulled] = useState(false);
  const series = mode === "series";
  const secondLit = series ? !pulled : true;
  const firstLit = !pulled;

  // Wires, and which of them carry current right now.
  const seriesLoop = "M60 84 V40 H140 M166 40 H220 M246 40 H310 V200 H60 V146";
  const parallelRails = "M60 84 V40 H290 M60 146 V200 H290";
  const branch1 = "M180 40 V98 M180 132 V200";
  const branch2 = "M290 40 V98 M290 132 V200";

  return (
    <div className="glass-dark p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label="How the LEDs are wired" className="inline-flex rounded-full border border-white/15 bg-white/[0.06] p-1">
          {["series", "parallel"].map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => { setMode(m); setPulled(false); }}
              className={`min-h-[40px] rounded-full px-5 text-sm font-semibold capitalize transition-colors duration-300 ${
                mode === m ? "bg-[var(--color-accent)] text-[var(--color-primary-deep)]" : "text-white hover:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPulled((p) => !p)}
          aria-pressed={pulled}
          className="min-h-[44px] rounded-full border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/15"
        >
          {pulled ? "Put LED 1 back" : "Pull out LED 1"}
        </button>
      </div>

      <svg
        viewBox="0 0 360 240"
        className="lab-board mt-4 w-full"
        role="img"
        aria-label={`${series ? "Series" : "Parallel"} circuit: LED 1 ${pulled ? "removed" : (firstLit ? "lit" : "dark")}, LED 2 ${secondLit ? "lit" : "dark"}.`}
      >
        <Battery />
        {series ? (
          <g key="series">
            <path className="lab-wire" d={seriesLoop} />
            {!pulled && <path className="lab-current" d="M60 84 V40 H310 V200 H60 V146" />}
            <Led x={153} y={40} lit={firstLit} removed={pulled} label="LED 1" />
            <Led x={233} y={40} lit={secondLit} label="LED 2" />
          </g>
        ) : (
          <g key="parallel">
            <path className="lab-wire" d={parallelRails} />
            <path className="lab-wire" d={branch1} />
            <path className="lab-wire" d={branch2} />
            <path className="lab-current" d="M60 84 V40 H290 V200 H60 V146" />
            {!pulled && <path className="lab-current" d="M180 40 V200" />}
            <Led x={180} y={115} lit={firstLit} removed={pulled} label="LED 1" />
            <Led x={290} y={115} lit={secondLit} label="LED 2" />
          </g>
        )}
      </svg>

      <p className="mt-4 min-h-[3rem] text-[15px] leading-relaxed text-[var(--color-text-on-dark-muted)]" aria-live="polite">
        {RESULT[mode][pulled ? "out" : "in"]}
      </p>
    </div>
  );
}
