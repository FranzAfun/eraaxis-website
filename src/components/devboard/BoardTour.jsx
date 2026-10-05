import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import boardImg from "../../assets/images/dev-board/dev-board-front.webp";
import { useMediaQuery } from "../motion/useMediaQuery";

/**
 * A tour of the real board. On a wide screen the board stays in place while
 * you scroll the steps beside it; each step zooms the board to its part and
 * outlines it. On a phone you tap the numbered spots, or step with the
 * buttons. Every part named here is on the board in the photo.
 *
 * Boxes are percentages of the photo (dev-board-front.webp, 1280 x 853).
 */
const PARTS = [
  {
    key: "board",
    title: "The whole board",
    line: "Power on the left. A breadboard to build on, on the right.",
    box: null,
  },
  {
    key: "battery",
    title: "Battery holder",
    line: "Four AA batteries give the board a safe 6 volts.",
    box: [3, 13.5, 39, 66.5],
  },
  {
    key: "switch",
    title: "ON/OFF switch",
    line: "Learners power up on purpose, and see why every circuit needs a switch.",
    box: [46.5, 12, 11, 8.5],
  },
  {
    key: "diode",
    title: "Protection diode",
    line: "Batteries in the wrong way round? Diode D3 blocks the current.",
    box: [43.8, 21, 3.6, 14.5],
  },
  {
    key: "led",
    title: "Power LED",
    line: "The red light that shows, at a glance, that the board is on.",
    box: [53.5, 26, 7, 9.5],
  },
  {
    key: "test",
    title: "Test points",
    line: "VBATT, GND and +RAIL: where learners measure what is really happening.",
    box: [43.5, 70, 13.5, 8.5],
  },
  {
    key: "breadboard",
    title: "Practice area",
    line: "A breadboard for LEDs, buzzers, series and parallel circuits, and their own ideas.",
    box: [61.5, 2, 32, 94],
  },
];

// Zoom the photo so the part fills most of the frame, centred.
function viewFor(box) {
  if (!box) return { transform: "none" };
  const [x, y, w, h] = box;
  const scale = Math.min(2.6, Math.max(1.15, 70 / Math.max(w, h * 1.5)));
  const cx = x + w / 2;
  const cy = y + h / 2;
  return { transform: `scale(${scale}) translate(${(50 - cx).toFixed(2)}%, ${(50 - cy).toFixed(2)}%)` };
}

function Board({ active, onPick }) {
  const part = PARTS[active];
  return (
    <div className="board-tour-frame relative aspect-[1280/853] w-full overflow-hidden rounded-[var(--radius-lg)] bg-[#c9cbe0]">
      <div className="board-tour-zoom absolute inset-0" style={viewFor(part.box)}>
        <img src={boardImg} alt="The ERA Dev Board from the front" loading="lazy" decoding="async" className="h-full w-full object-cover" draggable="false" />
        {part.box && (
          <span
            aria-hidden="true"
            className="board-tour-ring absolute"
            style={{ left: `${part.box[0]}%`, top: `${part.box[1]}%`, width: `${part.box[2]}%`, height: `${part.box[3]}%` }}
          />
        )}
      </div>
      {/* Numbered spots, on the whole board only. */}
      {!part.box &&
        PARTS.slice(1).map((p, i) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onPick(i + 1)}
            className="board-tour-spot absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-bold"
            style={{ left: `${p.box[0] + p.box[2] / 2}%`, top: `${p.box[1] + p.box[3] / 2}%` }}
            aria-label={`Show the ${p.title.toLowerCase()}`}
          >
            {i + 1}
          </button>
        ))}
    </div>
  );
}

function StepText({ part, index, className = "" }) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold text-[var(--color-primary)]">
        {index === 0 ? "Start here" : `${index} of ${PARTS.length - 1}`}
      </p>
      <h3 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">{part.title}</h3>
      <p className="mt-3 max-w-md text-lg leading-relaxed text-[var(--color-text-secondary)]">{part.line}</p>
    </div>
  );
}

export default function BoardTour() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const [active, setActive] = useState(0);
  const steps = useRef([]);

  // Wide screens: the step crossing the middle of the screen is the one shown.
  useEffect(() => {
    if (!wide || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    steps.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [wide]);

  if (wide) {
    return (
      <div className="grid grid-cols-[1.25fr_1fr] gap-14">
        <div className="sticky top-28 self-start py-6">
          <Board active={active} onPick={(i) => steps.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })} />
          <ol className="mt-5 flex gap-2" aria-hidden="true">
            {PARTS.map((p, i) => (
              <li key={p.key} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= active ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"}`} />
            ))}
          </ol>
        </div>
        <div>
          {PARTS.map((part, i) => (
            <div
              key={part.key}
              ref={(node) => { steps.current[i] = node; }}
              data-index={i}
              className="flex min-h-[62vh] items-center"
            >
              <StepText
                part={part}
                index={i}
                className={`transition-all duration-500 ${i === active ? "opacity-100" : "translate-y-2 opacity-35"}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const part = PARTS[active];
  const go = (step) => setActive((current) => (current + step + PARTS.length) % PARTS.length);
  return (
    <div>
      <Board active={active} onPick={setActive} />
      <div className="glass mt-5 p-5" aria-live="polite">
        <StepText part={part} index={active} />
        <div className="mt-5 flex items-center justify-between gap-3">
          <button type="button" onClick={() => go(-1)} className="btn-outline min-h-[44px] px-4" aria-label="Previous part">
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          </button>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {active === 0 ? "Tap a number on the board" : `${active} of ${PARTS.length - 1}`}
          </p>
          <button type="button" onClick={() => go(1)} className="btn-primary min-h-[44px] px-4" aria-label="Next part">
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
