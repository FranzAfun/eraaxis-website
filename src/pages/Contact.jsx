import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Mail, Phone, ChevronDown } from "lucide-react";
import linkedinImg  from "../assets/social/linkedin.webp";
import xImg         from "../assets/social/X_white.webp";
import instagramImg from "../assets/social/instagram.webp";
import tiktokImg    from "../assets/social/tiktok.webp";
import whatsappImg  from "../assets/social/whatsapp.webp";
import { generalFaqs } from "../data/faqs";
import Reveal from "../components/motion/Reveal";
import { heroPrimaryClass, heroSecondaryClass } from "../components/programme/programmeClasses";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { api } from "../services/api";
import { useBootstrap } from "../hooks/useBootstrap";

import BusyLabel from "../components/ui/BusyLabel";
import ConsentLine from "../components/ui/ConsentLine";
/* ── Static data ─────────────────────────────────────────────────────────── */

const INQUIRY_TYPES = [
  "Enrolment / Admissions",
  "School or Institutional Partnership",
  "Sponsorship or Donation",
  "Media & Press",
  "General Inquiry",
];

// Short names for the topic buttons; the full name is what is sent.
const TOPIC_LABEL = {
  "Enrolment / Admissions":              "Enrolment",
  "School or Institutional Partnership": "School or partnership",
  "Sponsorship or Donation":             "Sponsorship",
  "Media & Press":                       "Media and press",
  "General Inquiry":                     "Something else",
};

const EMPTY_FORM = { name: "", phone: "", email: "", type: "", message: "" };
const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Static fallbacks — used when bootstrap values are absent (matches Footer.jsx)
const FALLBACK_ADDRESS = "ERA AXIS HQ – Essikado, Ghana";
const FALLBACK_EMAIL   = "support@eraaxis.com";
const FALLBACK_PHONE   = "+233 59 353 5925";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function fieldCls(hasError) {
  return [
    "min-h-[44px] w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm",
    "text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]",
    "outline-none transition-colors focus:ring-2",
    hasError
      ? "border-[var(--color-field-danger)] focus:border-[var(--color-field-danger)] focus:ring-[var(--color-field-danger)] focus:ring-offset-2"
      : "border-[var(--color-ui-border)] bg-white focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-2",
  ].join(" ");
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-[var(--color-field-danger)]">{msg}</p>;
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
  const { settings, socials: bootstrapSocials } = useBootstrap();
  // Other pages can open the form already pointed at a topic, e.g. Partners:
  // <Link to="/contact#enquiry" state={{ inquiryType, message }}>.
  const preset = useLocation().state;
  const [form, setForm]               = useState(() => ({
    ...EMPTY_FORM,
    type:    INQUIRY_TYPES.includes(preset?.inquiryType) ? preset.inquiryType : "",
    message: typeof preset?.message === "string" ? preset.message.slice(0, 500) : "",
  }));
  const [errors, setErrors]           = useState({});
  const [submitted, setSubmitted]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const contactFaqs = generalFaqs.filter((item) =>
    [
      "faq-how-to-enrol",
      "faq-group-enrolment",
      "faq-partners",
    ].includes(item.id)
  );
  const [openFaqId, setOpenFaqId] = useState(contactFaqs[0]?.id ?? null);

  const address = settings?.address                                || FALLBACK_ADDRESS;
  const email   = settings?.contactEmail || settings?.supportEmail || FALLBACK_EMAIL;
  const phone   = settings?.phone                                  || FALLBACK_PHONE;
  const phoneTel = phone.replace(/\s/g, "");

  const contactItems = useMemo(() => [
    { Icon: MapPin, label: "Visit us",  value: address, href: null },
    { Icon: Mail,   label: "Email us",  value: email,   href: `mailto:${email}` },
    { Icon: Phone,  label: "Call us",   value: phone,   href: `tel:${phoneTel}` },
  ], [address, email, phone, phoneTel]);

  const socials = useMemo(() => [
    { label: "LinkedIn",  href: bootstrapSocials?.linkedin  || import.meta.env.VITE_SOCIAL_LINKEDIN_URL,  img: linkedinImg  },
    { label: "X",         href: bootstrapSocials?.x         || import.meta.env.VITE_SOCIAL_X_URL,         img: xImg         },
    { label: "Instagram", href: bootstrapSocials?.instagram || import.meta.env.VITE_SOCIAL_INSTAGRAM_URL, img: instagramImg },
    { label: "TikTok",    href: import.meta.env.VITE_SOCIAL_TIKTOK_URL,                                   img: tiktokImg    },
    { label: "WhatsApp",  href: import.meta.env.VITE_SOCIAL_WHATSAPP_URL,                                 img: whatsappImg  },
  ].filter((s) => typeof s.href === "string" && s.href.trim().length > 0), [bootstrapSocials]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await api.post("/contacts", {
        full_name: form.name.trim(),
        email:     form.email.trim(),
        phone:     form.phone.trim() || undefined,
        subject:   form.type || undefined,
        message:   form.message.trim(),
      });
      setSubmitted(true);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SEO {...getPageSeo("/contact")} />
      <section className="dark-surface hero-ground relative -mt-20 overflow-hidden pb-16 pt-36 text-white md:pb-20 md:pt-44">
        <div className="container relative z-10">
          <p className="mb-5 inline-flex w-fit rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
            Contact ERA AXIS
          </p>
          <h1 className="mb-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
            Let&apos;s talk.
          </h1>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
            Programmes, partnerships, sponsorship or press: we&apos;ll get you to the right person.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#enquiry" className={heroPrimaryClass}>
              Send a message
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
            <a href="#find-us" className={heroSecondaryClass}>
              Find the hub
              <MapPin size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Enquiry + Contact info ──────────────────────────────────────── */}
      <section id="enquiry" className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-14">

            {/* Form */}
            <div>
              <h2 className="mb-8 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                Send us a message
              </h2>

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
                  {/* What it is about: tap one (real radio buttons, so arrow
                      keys and screen readers work as usual). */}
                  <fieldset>
                    <legend className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
                      What&apos;s it about?
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_TYPES.map((type) => (
                        <label
                          key={type}
                          className="inline-flex min-h-[44px] cursor-pointer items-center rounded-full border border-[var(--color-ui-border)] bg-white px-4 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)] has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)] has-[:checked]:text-white"
                        >
                          <input
                            type="radio"
                            name="type"
                            value={type}
                            checked={form.type === type}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          {TOPIC_LABEL[type] || type}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Full Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text-primary)]">
                      Full Name <span className="text-[var(--color-field-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      aria-invalid={errors.name ? true : undefined}
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
                        Email Address <span className="text-[var(--color-field-danger)]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        aria-invalid={errors.email ? true : undefined}
                        value={form.email}
                        onChange={handleChange}
                        placeholder="genny@example.com"
                        className={fieldCls(!!errors.email)}
                      />
                      <FieldError msg={errors.email} />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text-primary)]">
                      Message <span className="text-[var(--color-field-danger)]">*</span>
                    </label>
                    <textarea
                      name="message"
                      aria-invalid={errors.message ? true : undefined}
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us about your interest or question..."
                      className={fieldCls(!!errors.message).replace("min-h-[44px] ", "")}
                    />
                    <FieldError msg={errors.message} />
                  </div>

                  <div>
                    {submitError && (
                      <p className="mb-4 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary min-h-[44px] justify-center sm:px-8 disabled:opacity-100 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? <BusyLabel>Sending…</BusyLabel> : "Send Message"}
                      {!isSubmitting && <ArrowRight size={16} />}
                    </button>
                    <ConsentLine action="sending" className="mt-3" />
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
      <section id="find-us" className="soft-field scroll-mt-20 py-16 md:py-24">
        <div className="container">
          <Reveal className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Find us
            </p>
            <h2 className="text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              The ERA AXIS Hub, Takoradi.
            </h2>
          </Reveal>
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
          <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Quick answers
              </p>
              <h2 className="text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                Before you write.
              </h2>
            </div>
            <Link to="/faq" className="btn-outline w-fit">
              All questions
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </Reveal>
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

    </>
  );
}
