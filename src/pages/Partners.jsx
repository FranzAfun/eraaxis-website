import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, School, Zap } from "lucide-react";
import STATIC_PARTNERS from "../data/partners";
import mestAfricaLogo from "../assets/partners/mest-africa.webp";
import heroImg from "../assets/partners/unicef-startup-img.webp";
import PickerTabs from "../components/motion/PickerTabs";
import Reveal from "../components/motion/Reveal";
import ScrollScenes from "../components/motion/ScrollScenes";
import { ProgrammeClose, ProgrammeHero, SectionHead } from "../components/programme/ProgrammeParts";
import { closePrimaryClass, closeSecondaryClass, heroPrimaryClass, heroSecondaryClass } from "../components/programme/programmeClasses";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { api } from "../services/api";
import { resolveMediaUrl } from "../utils/resolveMediaUrl";

const PARTNERSHIP = "School or Institutional Partnership";

const areas = [
  { key: "access", label: "STEM access", Icon: BookOpen, line: "Hands-on STEM for more schools and communities across Ghana and Africa." },
  { key: "youth", label: "Youth skills", Icon: Users, line: "Digital and technical skills for young people, through real projects." },
  { key: "schools", label: "Schools and communities", Icon: School, line: "Curriculum-aligned learning with schools, youth groups and communities." },
  { key: "edtech", label: "EdTech at scale", Icon: Zap, line: "Scaling the ERA Dev Board and AI-assisted learning support." },
];

export default function Partners() {
  const [apiPartners, setApiPartners] = useState(null);
  const [area, setArea] = useState(areas[0].key);

  useEffect(() => {
    let cancelled = false;
    api.get("/partners")
      .then((json) => {
        if (!cancelled) setApiPartners(json?.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiPartners([]);
      });
    return () => { cancelled = true; };
  }, []);

  const partners = (() => {
    if (!apiPartners || apiPartners.length === 0) return STATIC_PARTNERS;
    return apiPartners.map((p) => {
      // Known partners (matched by name) have a bundled logo of our own.
      const staticMatch = STATIC_PARTNERS.find(
        (s) => s.name.toLowerCase() === p.name.toLowerCase()
      );
      // A logo uploaded in EDOS wins. A pasted link to the partner's own site
      // is used only when we have no copy of our own: those load from other
      // sites, slowly, and some set third-party cookies. A web address saved
      // without "https://" would otherwise open as a page on this site.
      const uploaded = p.logo_url && !/^https?:\/\//i.test(p.logo_url);
      const logo = uploaded ? resolveMediaUrl(p.logo_url) : staticMatch?.logo ?? resolveMediaUrl(p.logo_url);
      const site = p.website_url || null;
      return {
        name: p.name,
        logo: logo ?? null,
        alt: `${p.name} logo`,
        websiteUrl: site && !/^https?:\/\//i.test(site) ? `https://${site}` : site,
      };
    });
  })();

  const displayPartners = partners.length > 0 ? partners : STATIC_PARTNERS;

  return (
    <ScrollScenes>
      <SEO {...getPageSeo("/partners")} />
      <ProgrammeHero
        back={false}
        eyebrow="Partners & recognition"
        title="Building practical STEM with the right partners."
        line="Partners, accelerators and organisations helping ERA AXIS reach more learners."
        image={heroImg}
        imageAlt="KOICA UNICEF Startup Lab recognition event"
        badge="KOICA UNICEF Startup Lab"
        actions={
          <>
            <Link to="/contact#enquiry" state={{ inquiryType: PARTNERSHIP }} className={heroPrimaryClass}>
              Start a Partnership
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link to="/programs" className={heroSecondaryClass}>
              Explore Programmes
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </>
        }
      />

      {/* ── Logos ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="container">
          <SectionHead eyebrow="Our network" title="Who supports us." />
          {/* Centred rows, so any number of partners sits balanced. */}
          <ul className="flex flex-wrap justify-center gap-4">
            {displayPartners.map((partner, i) => {
              const inner = (
                <>
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.alt} loading="lazy" decoding="async" className="max-h-12 w-full object-contain object-center" />
                  ) : (
                    <span className="flex h-12 w-full items-center justify-center rounded-md bg-[var(--color-surface-soft)] text-sm font-semibold text-[var(--color-text-muted)]">
                      {partner.name.split(" ").map((w) => w[0]).slice(0, 3).join("")}
                    </span>
                  )}
                  <span className="text-center text-xs font-medium text-[var(--color-text-secondary)]">{partner.name}</span>
                </>
              );
              const tile = "card-interactive flex h-full flex-col items-center justify-center gap-3 p-5";
              return (
                <Reveal as="li" key={partner.name} delay={(i % 6) * 60} className="flex w-[calc(50%-0.5rem)] sm:w-44">
                  {partner.websiteUrl ? (
                    <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${partner.name} website`} className={`${tile} w-full`}>
                      {inner}
                    </a>
                  ) : (
                    <div className={`${tile} w-full`}>{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── MEST and recognition ───────────────────────────────────────── */}
      <section className="soft-field py-20 md:py-24">
        <div className="container grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <Reveal className="glass p-7 sm:p-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Featured support</p>
            <div className="mb-6 flex max-w-[11rem] items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4">
              <img src={mestAfricaLogo} alt="MEST Africa logo" loading="lazy" decoding="async" className="max-h-10 w-full object-contain object-center" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">MEST Africa EdTech Fellowship</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
              Mentorship, strategy and capacity building to help ERA AXIS reach over 8,000 learners in underserved communities.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="What the fellowship gives">
              {["EdTech Fellowship", "Accelerator support", "Capacity building"].map((tag) => (
                <li key={tag} className="rounded-full bg-[var(--color-primary)]/[0.08] px-3 py-1 text-sm font-medium text-[var(--color-primary-deep)]">{tag}</li>
              ))}
            </ul>
          </Reveal>
          <figure className="overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
            <div data-scene="zoom-in">
              <img src={heroImg} alt="ERA AXIS at the KOICA UNICEF Startup Lab recognition event" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
            </div>
            <figcaption className="bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-secondary)]">
              Recognition: KOICA UNICEF Startup Lab
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Partnership areas ──────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="container">
          <SectionHead eyebrow="Partnership areas" title="What should we work on together?" className="mb-8" />
          <Reveal>
            <PickerTabs items={areas} value={area} onChange={setArea} label="Partnership areas">
              {(item) => (
                <div className="glass grid gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10">
                  <span className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white shadow-[0_16px_36px_-16px_var(--color-primary)]">
                    <item.Icon size={30} strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <p className="text-xl font-bold leading-snug text-[var(--color-text-primary)] sm:text-2xl">{item.line}</p>
                  <Link
                    to="/contact#enquiry"
                    state={{ inquiryType: PARTNERSHIP, message: `We would like to partner with ERA AXIS on ${item.label.toLowerCase()}.` }}
                    className="btn-primary w-fit whitespace-nowrap"
                  >
                    Talk to us about this
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </PickerTabs>
          </Reveal>
        </div>
      </section>

      <ProgrammeClose
        title="Work with ERA AXIS."
        line="Help bring practical STEM and digital skills to more schools, youth groups and communities."
        actions={
          <>
            <Link to="/contact#enquiry" state={{ inquiryType: PARTNERSHIP }} className={closePrimaryClass}>
              Start a Partnership
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/contact#enquiry" state={{ inquiryType: "Sponsorship or Donation" }} className={closeSecondaryClass}>
              Sponsor Learners
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </>
        }
      />
    </ScrollScenes>
  );
}
