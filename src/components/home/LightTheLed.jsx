import { useState } from "react";
import { Power } from "lucide-react";

/**
 * The smallest lesson ERA AXIS teaches: a battery, a switch, a resistor and an
 * LED. Flip the switch and current runs round the loop and the LED lights.
 * Plain SVG; the current's flow is a CSS animation (.led-demo-* in index.css)
 * that stands still for people who ask for less motion.
 */
export default function LightTheLed() {
  const [on, setOn] = useState(false);
  const toggle = () => setOn((value) => !value);

  return (
    <div className="glass-dark p-5 sm:p-6" data-on={on ? "" : undefined}>
      <svg
        viewBox="0 0 360 230"
        className="led-demo w-full"
        role="img"
        aria-label={on ? "The switch is closed: current flows and the LED is lit." : "The switch is open: no current flows and the LED is dark."}
      >
        {/* The loop of wire, with a gap where the switch sits. */}
        <path className="led-demo-wire" d="M60 84 V40 H150 M196 40 H300 V96 M300 124 V146 M300 196 V206 H60 V146" />
        {/* Current, drawn over the wire while the circuit is closed. */}
        <path className="led-demo-current" d="M60 84 V40 H300 V96 M300 124 V146 M300 196 V206 H60 V146" />

        {/* Battery */}
        <g className="led-demo-battery">
          <rect x="42" y="84" width="36" height="62" rx="5" />
          <rect x="52" y="78" width="16" height="7" rx="2" />
          <text x="60" y="121" textAnchor="middle">3V</text>
        </g>

        {/* Switch: a lever that drops onto its contact. */}
        <g className="led-demo-switch" onClick={toggle} role="presentation">
          <circle cx="150" cy="40" r="5" />
          <circle cx="196" cy="40" r="5" />
          <line x1="150" y1="40" x2="196" y2="40" className="led-demo-lever" style={{ transform: on ? "rotate(0deg)" : "rotate(-32deg)" }} />
        </g>

        {/* LED */}
        <g className="led-demo-led">
          <circle cx="300" cy="110" r="26" className="led-demo-halo" />
          <circle cx="300" cy="110" r="13" className="led-demo-bulb" />
        </g>

        {/* Resistor */}
        <path className="led-demo-resistor" d="M300 146 l10 5 l-20 8 l20 8 l-20 8 l20 8 l-10 5" />
      </svg>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] leading-relaxed text-[var(--color-text-on-dark-muted)]" aria-live="polite">
          {on ? "Circuit closed. Current flows and the LED lights up." : "Try it: close the switch and light the LED."}
        </p>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={on}
          className={`inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-all duration-300 ${
            on
              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-primary-deep)]"
              : "border-white/25 bg-white/[0.08] text-white hover:bg-white/15"
          }`}
        >
          <Power size={16} strokeWidth={2.2} aria-hidden="true" />
          {on ? "Switch off" : "Flip the switch"}
        </button>
      </div>
    </div>
  );
}
