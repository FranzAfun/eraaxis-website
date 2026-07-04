import { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import logo from "../../assets/brand/logo-white.webp";
import linkedinImg  from "../../assets/social/linkedin.webp";
import xImg         from "../../assets/social/x-logo.webp";
import instagramImg from "../../assets/social/instagram.webp";
import tiktokImg    from "../../assets/social/tiktok.webp";
import whatsappImg  from "../../assets/social/whatsapp.webp";
import { useBootstrap } from "../../hooks/useBootstrap";
import NewsletterForm from "../ui/NewsletterForm";

const programmes = [
  { label: "School STEM",         to: "/programs/school-stem" },
  { label: "Out-of-School Youth", to: "/programs/out-of-school-youth" },
  { label: "Online Learning",     to: "/programs/online-learning" },
  { label: "ERA Digital Skills",  to: "/programs/era-digital-skills" },
];

const company = [
  { label: "About",           to: "/about" },
  { label: "Partners",        to: "/partners" },
  { label: "Gallery",         to: "/gallery" },
  { label: "FAQ",             to: "/faq" },
  { label: "Insights",        to: "/insights" },
  { label: "Contact",         to: "/contact" },
  { label: "Enrolment & Dues", to: "/payments" },
];

// Static fallbacks — used when bootstrap values are absent
const FALLBACK_ADDRESS = "ERA AXIS HQ – Essikado, Ghana";
const FALLBACK_EMAIL   = "support@eraaxis.com";
const FALLBACK_PHONE   = "+233 50 958 2497";
const FALLBACK_ORG     = "ERA AXIS Limited";

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
  const { settings, socials: bootstrapSocials } = useBootstrap();

  const address = settings?.address                                    || FALLBACK_ADDRESS;
  const email   = settings?.contactEmail || settings?.supportEmail     || FALLBACK_EMAIL;
  const phone   = settings?.phone                                      || FALLBACK_PHONE;
  const orgName = settings?.organizationName                           || FALLBACK_ORG;
  const phoneTel = phone.replace(/\s/g, "");

  const socials = useMemo(() => [
    { label: "LinkedIn",  href: bootstrapSocials?.linkedin  || import.meta.env.VITE_SOCIAL_LINKEDIN_URL,  img: linkedinImg  },
    { label: "X",         href: bootstrapSocials?.x         || import.meta.env.VITE_SOCIAL_X_URL,         img: xImg         },
    { label: "Instagram", href: bootstrapSocials?.instagram || import.meta.env.VITE_SOCIAL_INSTAGRAM_URL, img: instagramImg },
    { label: "TikTok",    href: import.meta.env.VITE_SOCIAL_TIKTOK_URL,                                   img: tiktokImg    },
    { label: "WhatsApp",  href: import.meta.env.VITE_SOCIAL_WHATSAPP_URL,                                 img: whatsappImg  },
  ].filter((s) => typeof s.href === "string" && s.href.trim().length > 0), [bootstrapSocials]);

  return (
    <footer className="border-t border-white/[0.07] bg-[var(--color-background-dark)]">
      <div className="container py-14 md:py-16 lg:py-20">

        {/* Newsletter row */}
        <div className="mb-12 flex flex-col gap-4 border-b border-white/[0.07] pb-12 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div className="shrink-0">
            <p className="text-sm font-semibold text-white">
              Get ERA AXIS updates in your inbox.
            </p>
            <p className="mt-1 text-xs text-white/45">
              Insights, programme news, and learner stories.
            </p>
          </div>
          <div className="w-full sm:max-w-sm">
            <NewsletterForm source="footer" />
          </div>
        </div>

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
                  {address}
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
                  href={`mailto:${email}`}
                  className="text-sm text-white/55 transition-colors duration-200 hover:text-[var(--color-accent)]"
                >
                  {email}
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
                  href={`tel:${phoneTel}`}
                  className="text-sm text-white/55 transition-colors duration-200 hover:text-[var(--color-accent)]"
                >
                  {phone}
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
            © {new Date().getFullYear()} {orgName}. All rights reserved.
          </p>
          <p className="text-xs text-white/25">
            Website by <a  rel="noopener noreferrer" className="text-[var(--color-accent)] ">ERA Technologies</a>.
          </p>
        </div>

      </div>
    </footer>
  );
}
