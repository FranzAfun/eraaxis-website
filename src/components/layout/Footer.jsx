import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import logo from "../../assets/brand/logo-white.webp";
import linkedinImg  from "../../assets/social/linkedin.webp";
import xImg         from "../../assets/social/x-logo.webp";
import instagramImg from "../../assets/social/instagram.webp";
import tiktokImg    from "../../assets/social/tiktok.webp";
import whatsappImg  from "../../assets/social/whatsapp.webp";

const programmes = [
  { label: "School STEM",         to: "/programs/school-stem" },
  { label: "Out-of-School Youth", to: "/programs/out-of-school-youth" },
  { label: "Online Learning",     to: "/programs/online-learning" },
  { label: "ERA Digital Skills",  to: "/programs/era-digital-skills" },
];

const company = [
  { label: "About", to: "/about" },
  { label: "Partners", to: "/partners" },
  { label: "Gallery", to: "/gallery" },
  { label: "FAQ", to: "/faq" },
  { label: "Insights", to: "/insights" },
  { label: "Contact",  to: "/contact" },
  { label: "Enrolment & Dues", to: "/payments" },
];

const socials = [
  { label: "LinkedIn",  href: import.meta.env.VITE_SOCIAL_LINKEDIN_URL, img: linkedinImg  },
  { label: "X",         href: import.meta.env.VITE_SOCIAL_X_URL, img: xImg         },
  { label: "Instagram", href: import.meta.env.VITE_SOCIAL_INSTAGRAM_URL, img: instagramImg },
  { label: "TikTok",    href: import.meta.env.VITE_SOCIAL_TIKTOK_URL, img: tiktokImg    },
  { label: "WhatsApp",  href: import.meta.env.VITE_SOCIAL_WHATSAPP_URL, img: whatsappImg  },
].filter((social) => typeof social.href === "string" && social.href.trim().length > 0);

function FooterHeading({ children }) {
  return (
    <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
      {children}
    </p>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-white/55 transition-colors duration-200 hover:text-[var(--color-accent)]"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialButton({ label, href, img }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-white/10 bg-white/[0.06] transition-all duration-200 hover:border-white/20 hover:bg-white/[0.12]"
    >
      <img
        src={img}
        alt=""
        aria-hidden="true"
        className="h-4 w-4 object-contain"
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[var(--color-background-dark)]">
      <div className="container py-14 md:py-16 lg:py-20">

        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand block */}
          <div>
            <Link to="/" className="mb-5 inline-flex" aria-label="ERA AXIS home">
              <img
                src={logo}
                alt="ERA AXIS"
                width={200}
                height={80}
                className="h-20 w-auto"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="mb-3 max-w-[220px] text-sm leading-relaxed text-white/55">
              Practical STEM and digital skills education for African innovators.
            </p>
            <p className="max-w-[220px] text-xs leading-relaxed text-white/30">
              Built for Africa&apos;s next generation of innovators.
            </p>
          </div>

          {/* Programmes */}
          <div>
            <FooterHeading>Programmes</FooterHeading>
            <ul className="space-y-3">
              {programmes.map((l) => (
                <FooterLink key={l.to} to={l.to}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <FooterHeading>Company</FooterHeading>
            <ul className="space-y-3">
              {company.map((l) => (
                <FooterLink key={l.to} to={l.to}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <FooterHeading>Contact Us</FooterHeading>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <MapPin
                  size={15}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0 text-[var(--color-accent)]"
                  aria-hidden="true"
                />
                <span className="text-sm leading-snug text-white/55">
                  ERA AXIS HQ – Essikado, Ghana
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail
                  size={15}
                  strokeWidth={1.75}
                  className="shrink-0 text-[var(--color-accent)]"
                  aria-hidden="true"
                />
                <a
                  href="mailto:support@eraaxis.com"
                  className="text-sm text-white/55 transition-colors duration-200 hover:text-[var(--color-accent)]"
                >
                  support@eraaxis.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone
                  size={15}
                  strokeWidth={1.75}
                  className="shrink-0 text-[var(--color-accent)]"
                  aria-hidden="true"
                />
                <a
                  href="tel:+233509582497"
                  className="text-sm text-white/55 transition-colors duration-200 hover:text-[var(--color-accent)]"
                >
                  +233 50 958 2497
                </a>
              </li>
            </ul>

            {/* Social icons */}
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map((s) => (
                <SocialButton key={s.label} label={s.label} href={s.href} img={s.img} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-6 sm:flex-row">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} ERA AXIS Limited. All rights reserved.
          </p>
          <p className="text-xs text-white/25">
            Practical learning. Real outcomes.
          </p>
        </div>

      </div>
    </footer>
  );
}
