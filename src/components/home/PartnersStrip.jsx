import { useState } from "react";
import partners from "../../data/partners";

export default function PartnersStrip() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="pt-0 pb-20 md:pb-24 lg:pb-28 overflow-hidden partners-section">
      <div className="container mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
          Partners, Accelerators &amp; Recognition
        </p>
        <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl max-w-2xl">
          Trusted by the ecosystem helping us grow.
        </h2>
        <p className="text-base leading-relaxed text-[var(--color-text-secondary)] max-w-xl">
          Partners, accelerators, and recognition programmes helping ERA AXIS expand practical STEM and digital skills learning.
        </p>
      </div>

      <div
        className="marquee-viewport"
        onClick={() => setPaused((p) => !p)}
        role="region"
        aria-label="Partner logos"
      >
        <div className={`marquee-track${paused ? " is-paused" : ""}`}>
          {[0, 1].map((setIdx) => (
            <div
              key={setIdx}
              className="marquee-group"
              aria-hidden={setIdx === 1 ? "true" : undefined}
            >
              {partners.map((partner) => (
                <div key={partner.name} className="partner-card">
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    loading="lazy"
                    decoding="async"
                    className="partner-logo"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
