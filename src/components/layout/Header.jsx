import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/brand/logo.webp";

const navLinks = [
  { label: "Programs", to: "/programs" },
  { label: "Dev Board", to: "/dev-board" },
  { label: "Partners", to: "/partners" },
  { label: "Insights", to: "/insights" },
  { label: "Contact", to: "/contact" },
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

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border-soft)] bg-white/75 backdrop-blur-xl"
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
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <Link to="/contact" className="btn-nav-primary">
            Get Started
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
        <div className="border-t border-[var(--color-border-soft)] bg-[var(--color-background)] md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                label={link.label}
                onClick={() => setOpen(false)}
              />
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn-nav-primary mt-3 w-full justify-center"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
