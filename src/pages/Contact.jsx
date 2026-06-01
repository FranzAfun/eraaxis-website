import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Mail, Phone, ChevronDown } from "lucide-react";
import linkedinImg  from "../assets/social/linkedin.webp";
import xImg         from "../assets/social/X_white.webp";
import instagramImg from "../assets/social/instagram.webp";
import tiktokImg    from "../assets/social/tiktok.webp";
import whatsappImg  from "../assets/social/whatsapp.webp";
import { generalFaqs } from "../data/faqs";
import SelectField from "../components/ui/SelectField";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";

/* ── Static data ─────────────────────────────────────────────────────────── */

const INQUIRY_TYPES = [
  "Enrolment / Admissions",
  "School or Institutional Partnership",
  "Sponsorship or Donation",
  "Media & Press",
  "General Inquiry",
];

const EMPTY_FORM = { name: "", phone: "", email: "", type: "", message: "" };
const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactItems = [
  {
    Icon: MapPin,
    label: "Visit us",
    value: "ERA AXIS HQ – Essikado, Ghana",
    href: null,
  },
  {
    Icon: Mail,
    label: "Email us",
    value: "support@eraaxis.com",
    href: "mailto:support@eraaxis.com",
  },
  {
    Icon: Phone,
    label: "Call us",
    value: "+233 50 958 2497",
    href: "tel:+233509582497",
  },
];

const socials = [
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/era-axis",                                             img: linkedinImg  },
  { label: "X",         href: "https://x.com/ERRAAXIS?t=EphVMATn3dQAMr4lE3su1Q&s=09",                                 img: xImg         },
  { label: "Instagram", href: "https://www.instagram.com/era_axis?igsh=OTNsems5YWJjeDZh",                              img: instagramImg },
  { label: "TikTok",    href: "https://www.tiktok.com/@eraaxis?_t=ZM-8ztLE4T5YDs&_r=1",                               img: tiktokImg    },
  { label: "WhatsApp",  href: "https://whatsapp.com/channel/0029Va9foNM002T9PHdytX1h",                                 img: whatsappImg  },
];

const ctaPrimaryClass =
  "final-cta-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function fieldCls(hasError) {
  return [
    "min-h-[44px] w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm",
    "text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]",
    "outline-none transition-colors focus:ring-2",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
      : "border-[var(--color-border)] bg-white focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20",
  ].join(" ");
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-600">{msg}</p>;
}

function ContactFaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="card-interactive overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
      >
        <span className="text-sm font-bold text-[var(--color-text-primary)] sm:text-base">
          {item.question}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 text-[var(--color-primary)] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */

export default function Contact() {
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const contactFaqs = generalFaqs.filter((item) =>
    [
      "faq-how-to-enrol",
      "faq-group-enrolment",
      "faq-partners",
    ].includes(item.id)
  );
  const [openFaqId, setOpenFaqId] = useState(contactFaqs[0]?.id ?? null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim())    next.name    = "Full name is required";
    if (!form.email.trim())   next.email   = "Email address is required";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address";
    if (!form.message.trim()) next.message = "Message is required";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  return (
    <>
      <SEO {...getPageSeo("/contact")} />
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 18%, color-mix(in srgb, var(--color-accent) 24%, transparent) 0%, transparent 30%), radial-gradient(circle at 84% 8%, color-mix(in srgb, var(--color-primary) 38%, transparent) 0%, transparent 34%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-28 top-28 h-80 w-80 rounded-full bg-white/[0.05] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-4 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl"
        />
        <div className="container relative z-10">
          <p className="mb-5 inline-flex w-fit rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
            Contact ERA AXIS
          </p>
          <h1 className="mb-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
            Let&apos;s talk about practical STEM and digital skills learning.
          </h1>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
            Reach out about programmes, school partnerships, sponsorships, media
            enquiries, or general questions about ERA AXIS.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#enquiry"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
            >
              Start enquiry <ArrowRight size={16} />
            </a>
            <Link
              to="/programs"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]"
            >
              View programmes
            </Link>
          </div>
        </div>
      </section>

      {/* ── Enquiry + Contact info ──────────────────────────────────────── */}
      <section id="enquiry" className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-14">

            {/* Form */}
            <div>
              <h2 className="mb-2 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                Send us a message
              </h2>
              <p className="mb-8 text-base leading-relaxed text-[var(--color-text-secondary)]">
                Tell us what you&apos;re interested in and the right ERA AXIS team
                member will follow up.
              </p>

              {submitted ? (
                <div className="card-interactive p-8">
                  <p className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
                    Message received
                  </p>
                  <p className="mb-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Thanks for reaching out. The ERA AXIS team will review your
                    message and respond as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn-outline text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form noValidate onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text-primary)]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Genny Amadapah"
                      className={fieldCls(!!errors.name)}
                    />
                    <FieldError msg={errors.name} />
                  </div>

                  {/* Phone + Email row */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text-primary)]">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+233 XX XXX XXXX"
                        className={fieldCls(false)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text-primary)]">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="genny@example.com"
                        className={fieldCls(!!errors.email)}
                      />
                      <FieldError msg={errors.email} />
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text-primary)]">
                      Inquiry Type
                    </label>
                    <SelectField
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className={fieldCls(false)}
                      placeholder="Select inquiry type"
                      options={INQUIRY_TYPES.map((type) => ({
                        value: type,
                        label: type,
                      }))}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text-primary)]">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us about your interest or question..."
                      className={fieldCls(!!errors.message).replace("min-h-[44px] ", "")}
                    />
                    <FieldError msg={errors.message} />
                  </div>

                  <div>
                    <button type="submit" className="btn-primary min-h-[44px] justify-center sm:px-8">
                      Send Message <ArrowRight size={16} />
                    </button>
                    <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                      The right ERA AXIS team member will follow up using the
                      contact details you provide.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Right: contact info + socials */}
            <div className="flex flex-col gap-4">
              {contactItems.map(({ Icon, label, value, href }) => (
                <div key={label} className="card-interactive p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)]">
                      <Icon
                        size={16}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="text-[var(--color-primary)]"
                      />
                    </span>
                    <div>
                      <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-primary)]"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-[var(--color-text-primary)]">{value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Social links */}
              <div className="card-interactive p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Connect with ERA AXIS
                </p>
                <div className="flex flex-wrap gap-2">
                  {socials.map(({ label, href, img }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] transition-all hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5"
                    >
                      <img
                        src={img}
                        alt=""
                        aria-hidden="true"
                        className="h-[18px] w-[18px] object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Map ────────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Find us
          </p>
          <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Find ERA AXIS Hub
          </h2>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            Visit our hub in Takoradi or use the directions link to find us
            easily.
          </p>

          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] shadow-[var(--shadow-soft)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3974.8793207774065!2d-1.7167443000000002!3d4.9597231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfe77b000eec9f9b%3A0x26cc1a1276bcd1c1!2sERA%20Axis%20Hub!5e0!3m2!1sen!2sgh!4v1764130262261!5m2!1sen!2sgh"
              title="ERA Axis Hub Google Map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full border-0 md:h-[420px]"
              allowFullScreen
            />
          </div>

          <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              ERA Axis Hub &mdash; Takoradi, Ghana
            </p>
            <a
              href="https://maps.app.goo.gl/GUM8jHMNA1q3vUDr5?g_st=atm"
              target="_blank"
              rel="noreferrer"
              className="btn-outline text-sm"
            >
              Get Directions <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Contact FAQ
              </p>
              <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                A few quick answers before you reach out.
              </h2>
              <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
                These cover the most common contact and support questions. For
                everything else, use the full FAQ page.
              </p>
            </div>

            <Link to="/faq" className="btn-outline">
              View full FAQ
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {contactFaqs.map((item) => (
              <ContactFaqItem
                key={item.id}
                item={item}
                isOpen={openFaqId === item.id}
                onToggle={() =>
                  setOpenFaqId(openFaqId === item.id ? null : item.id)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="final-cta-band relative overflow-hidden py-20 md:py-28">
        <div className="final-cta-orb pointer-events-none absolute inset-0" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Ready to start the conversation?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Whether you are a learner, parent, school, sponsor, or partner, ERA
            AXIS is ready to help you take the next step.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#enquiry" className={ctaPrimaryClass}>
              Send an enquiry <ArrowRight size={16} />
            </a>
            <Link to="/programs" className={ctaSecondaryClass}>
              Explore programmes <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
