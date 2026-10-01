import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import { ChevronRight, LifeBuoy, X } from "lucide-react";
import logo from "../../assets/brand/logo-white.webp";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The menu on phones: a drawer that slides in from the right over a dimmed page,
 * rather than a panel dropped under the bar. A panel competed with whatever the
 * page's own first screen was offering — on the home page its button landed
 * right on top of the hero's — and left no room to group anything.
 *
 * The drawer keeps its own state machine so it can animate out as well as in:
 * `closing` stays mounted for the length of the exit, then unmounts and hands
 * focus back to the button that opened it.
 */
export default function MobileMenu({ open, groups, onClose, returnFocusTo }) {
  const [phase, setPhase] = useState(open ? "open" : "closed");
  const [wasOpen, setWasOpen] = useState(open);
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  // Adjusting during render rather than in an effect: the drawer must never
  // paint a frame in the wrong state.
  if (wasOpen !== open) {
    setWasOpen(open);
    setPhase(open ? "open" : "closing");
  }

  useEffect(() => {
    if (phase !== "closing") return undefined;
    const timer = setTimeout(() => {
      setPhase("closed");
      returnFocusTo?.current?.focus();
    }, 200);
    return () => clearTimeout(timer);
  }, [phase, returnFocusTo]);

  // The page behind must not scroll under the drawer, and the scroll position
  // has to survive closing it.
  useEffect(() => {
    if (phase === "closed") return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "open") return undefined;
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      // Keep tabbing inside the drawer: everything behind it is inert.
      const items = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [phase, onClose]);

  if (phase === "closed") return null;

  return createPortal(
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        data-state={phase}
        onClick={onClose}
        className="site-scrim fixed inset-0 z-[80] cursor-default"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-state={phase}
        className="site-drawer fixed inset-y-0 right-0 z-[80] flex w-[86%] max-w-sm flex-col border-l border-[var(--header-scrolled-border)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <Link to="/" onClick={onClose} className="flex items-center">
            <img src={logo} alt="ERA AXIS" width={80} height={80} className="-my-3 h-16 w-auto" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-2">
          {groups.map((group) => (
            <div key={group.label} className="mb-2">
              <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                {group.label}
              </p>
              {group.links.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-[15px] font-medium transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                      isActive ? "bg-white/[0.08] text-[var(--color-accent)]" : "text-white/85 hover:bg-white/[0.06] hover:text-white",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-sm)] ${
                          isActive ? "bg-[var(--color-accent)]/15" : "bg-white/[0.06]"
                        }`}
                      >
                        <Icon size={17} strokeWidth={1.75} />
                      </span>
                      <span className="flex-1">{label}</span>
                      <ChevronRight size={16} className="shrink-0 text-white/25" />
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="space-y-2.5 border-t border-white/10 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3.5">
          <Link to="/payments" onClick={onClose} className="btn-nav-primary w-full justify-center py-3">
            Enrol Now
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/15 px-4 py-2.5 text-sm font-medium text-white/85 transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <LifeBuoy size={16} />
            Need help?
          </Link>
          <p className="text-center text-[11px] text-white/60">
            ERA AXIS &copy; {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </div>,
    document.body
  );
}
