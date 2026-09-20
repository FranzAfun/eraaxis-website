import { useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  CircuitBoard,
  GraduationCap,
  Handshake,
  HelpCircle,
  Home,
  Images,
  Info,
  Mail,
  Menu,
  Newspaper,
  Wallet,
  X,
} from "lucide-react";
import logo from "../../assets/brand/logo-white.webp";
import useScrolled from "../../hooks/useScrolled";
import MobileMenu from "./MobileMenu";

// The icons are for the drawer on phones, where a flat list of ten links has no
// shape to it. The desktop bar ignores them.
const navLinks = [
  { label: "Home", to: "/", icon: Home },
  { label: "Programs", to: "/programs", icon: GraduationCap },
  { label: "Dev Board", to: "/dev-board", icon: CircuitBoard },
  { label: "Partners", to: "/partners", icon: Handshake },
  { label: "Insights", to: "/insights", icon: Newspaper },
  { label: "Contact", to: "/contact", icon: Mail },
];

const moreLinks = [
  { label: "About", to: "/about", icon: Info },
  { label: "Gallery", to: "/gallery", icon: Images },
  { label: "FAQ", to: "/faq", icon: HelpCircle },
  { label: "Dues", to: "/payments/monthly-dues", icon: Wallet },
];

const menuGroups = [
  { label: "Main", links: navLinks },
  { label: "More", links: moreLinks },
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

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [menuRoute, setMenuRoute] = useState(pathname);
  const toggleRef = useRef(null);
  const scrolled = useScrolled(24, 8, pathname);
  const moreIsActive = moreLinks.some((link) => link.to === pathname);
  const glass = scrolled || open || !opensOnDarkHero(pathname);

  // Navigating closes the menu, including by the browser's back button, which no
  // link handler would catch — and a menu left open holds the page scroll locked.
  if (menuRoute !== pathname) {
    setMenuRoute(pathname);
    setOpen(false);
  }

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
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClasses}>
              {link.label}
            </NavLink>
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
          ref={toggleRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center rounded text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <MobileMenu
        open={open}
        groups={menuGroups}
        onClose={() => setOpen(false)}
        returnFocusTo={toggleRef}
      />
    </header>
  );
}
