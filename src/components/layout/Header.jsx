import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "../../assets/brand/logo-white.webp";
import useScrolled from "../../hooks/useScrolled";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Programs", to: "/programs" },
  { label: "Dev Board", to: "/dev-board" },
  { label: "Partners", to: "/partners" },
  { label: "Insights", to: "/insights" },
  { label: "Contact", to: "/contact" },
];

const moreLinks = [
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "FAQ", to: "/faq" },
  { label: "Dues", to: "/payments/monthly-dues" },
];

// Routes whose first screenful is a dark full-bleed hero, so the bar can be
// transparent there. Every page listed was checked, not guessed from its name.
// Anything not listed gets the glass bar from the top, which is the safe
// default: white links on an unknown background is an invisible navbar.
const DARK_HERO_ROUTES = [
  "/",
  "/about",
  "/programs",
  "/dev-board",
  "/partners",
  "/insights",
  "/gallery",
  "/faq",
  "/contact",
  "/payments",
  "/certificates/verify",
  "/attendance",
  "/newsletter/unsubscribe",
  "/privacy",
];

const opensOnDarkHero = (pathname) =>
  DARK_HERO_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`)
  );

const linkClasses = ({ isActive }) =>
  [
    "rounded text-sm font-medium transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-dark)]",
    isActive ? "text-[var(--color-accent)]" : "text-white/[0.82] hover:text-white",
  ].join(" ");

function NavItem({ to, label, onClick }) {
  return (
    <NavLink to={to} end={to === "/"} onClick={onClick} className={linkClasses}>
      {label}
    </NavLink>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [menuRoute, setMenuRoute] = useState(pathname);
  const scrolled = useScrolled(24, 8, pathname);
  const moreIsActive = moreLinks.some((link) => link.to === pathname);

  // An open menu over a transparent bar is unreadable, so it forces the glass.
  const glass = scrolled || open || !opensOnDarkHero(pathname);

  // Navigating closes the menu, including by the browser's back button, which no
  // link handler would catch — and a menu left open holds the page scroll locked.
  if (menuRoute !== pathname) {
    setMenuRoute(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 ${glass ? "site-header--glass" : ""}`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="ERA AXIS"
            width={80}
            height={80}
            className="-my-2 h-20 w-auto"
            loading="eager"
            decoding="async"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} />
          ))}
          <div className="group relative">
            <button
              type="button"
              aria-haspopup="menu"
              className={[
                "inline-flex items-center gap-1 rounded text-sm font-medium transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-dark)]",
                moreIsActive ? "text-[var(--color-accent)]" : "text-white/[0.82] hover:text-white",
              ].join(" ")}
            >
              More
              <ChevronDown size={16} strokeWidth={2} />
            </button>

            <div className="pointer-events-none absolute right-0 top-full pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="site-header__panel min-w-[13rem] rounded-[var(--radius-md)] border border-[var(--header-scrolled-border)] p-2 shadow-[var(--header-scrolled-shadow)]">
                {moreLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        "flex rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                        isActive
                          ? "bg-white/10 text-[var(--color-accent)]"
                          : "text-white/[0.82] hover:bg-white/10 hover:text-white",
                      ].join(" ")
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <Link
            to="/payments"
            className={`btn-nav-primary${glass ? "" : " btn-nav-primary--on-hero"}`}
          >
            Enrol Now
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center rounded text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="site-header__panel border-t border-[var(--header-scrolled-border)] md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                label={link.label}
                onClick={() => setOpen(false)}
              />
            ))}
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/50">
              More
            </p>
            {moreLinks.map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                label={link.label}
                onClick={() => setOpen(false)}
              />
            ))}
            <Link
              to="/payments"
              onClick={() => setOpen(false)}
              className="btn-nav-primary mt-3 w-full justify-center"
            >
              Enrol Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
