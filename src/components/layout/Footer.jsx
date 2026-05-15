import { Link } from "react-router-dom";

const programmes = [
  { label: "School STEM", to: "/programs/school-stem" },
  { label: "Out-of-School Youth", to: "/programs/out-of-school-youth" },
  { label: "Online Learning", to: "/programs/online-learning" },
  { label: "ERA Digital Skills", to: "/programs/era-digital-skills" },
];

const company = [
  { label: "About", to: "/" },
  { label: "Partner", to: "/partners" },
  { label: "Insights", to: "/insights" },
  { label: "Contact", to: "/contact" },
];

function FooterColumn({ heading, children }) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
        {heading}
      </p>
      {children}
    </div>
  );
}

function FooterLink({ to, label }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)]"
      >
        {label}
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-soft)]">
      <div className="container py-16 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand summary */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="mb-3 text-base font-black tracking-widest text-[var(--color-primary)] uppercase">
              ERA AXIS
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Practical STEM and digital skills education for African innovators.
            </p>
          </div>

          {/* Programmes */}
          <FooterColumn heading="Programmes">
            <ul className="space-y-2">
              {programmes.map((l) => (
                <FooterLink key={l.to} to={l.to} label={l.label} />
              ))}
            </ul>
          </FooterColumn>

          {/* Company */}
          <FooterColumn heading="Company">
            <ul className="space-y-2">
              {company.map((l) => (
                <FooterLink key={l.to} to={l.to} label={l.label} />
              ))}
            </ul>
          </FooterColumn>

          {/* Contact */}
          <FooterColumn heading="Contact">
            <ul className="space-y-2">
              <li className="text-sm text-[var(--color-text-secondary)]">
                info@eraaxis.com
              </li>
              <li className="text-sm text-[var(--color-text-secondary)]">
                Ghana, West Africa
              </li>
            </ul>
          </FooterColumn>
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-6 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">
            © 2026 ERA AXIS Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
