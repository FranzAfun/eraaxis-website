import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "../../assets/brand/logo.webp";

const navLinks = [
  { label: "Programs", to: "/programs" },
  { label: "Dev Board", to: "/dev-board" },
  { label: "Partners", to: "/partners" },
  { label: "Insights", to: "/insights" },
  { label: "Contact", to: "/contact" },
];

const moreLinks = [
  { label: "Gallery", to: "/gallery" },
  { label: "FAQ", to: "/faq" },
  { label: "Enrolment & Dues", to: "/payments" },
];

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "text-sm font-medium transition-colors duration-200",
          isActive
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const moreIsActive =
    location.pathname === "/gallery" ||
    location.pathname === "/faq" ||
    location.pathname.startsWith("/payments");

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-primary)]/10 bg-[var(--color-surface-soft)]/80 backdrop-blur-xl"
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
                "inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200",
                moreIsActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
              ].join(" ")}
            >
              More
              <ChevronDown size={16} strokeWidth={2} />
            </button>

            <div className="pointer-events-none absolute right-0 top-full pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="min-w-[13rem] rounded-[var(--radius-md)] border border-[var(--color-primary)]/10 bg-white/95 p-2 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                {moreLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        "flex rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors duration-200",
                        isActive
                          ? "bg-[var(--color-surface-soft)] text-[var(--color-primary)]"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]",
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
          <Link to="/payments" className="btn-nav-primary">
            Enrol Now
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center text-[var(--color-text-primary)] md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-[var(--color-primary)]/10 bg-[var(--color-surface-soft)]/95 backdrop-blur-xl md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                label={link.label}
                onClick={() => setOpen(false)}
              />
            ))}
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
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
