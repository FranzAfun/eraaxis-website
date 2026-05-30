import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { galleryItems } from "../data/gallery";

function GalleryGridCard({ src, alt }) {
  return (
    <article className="group relative overflow-hidden rounded-[18px] border border-[rgb(17_17_17_/_0.06)] bg-[var(--color-surface)] shadow-[0_10px_30px_rgb(17_17_17_/_0.08)]">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(5_5_12_/_0.14)_100%)] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
    </article>
  );
}

export default function Gallery() {
  return (
    <>
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 16%, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 30%), radial-gradient(circle at 84% 10%, color-mix(in srgb, var(--color-primary) 42%, transparent) 0%, transparent 36%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-28 top-24 h-80 w-80 rounded-full bg-white/[0.05] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-6 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl"
        />

        <div className="container relative z-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/68 transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to home
          </Link>

          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
              ERA AXIS Gallery
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Practical learning, captured in motion.
            </h1>
            <p className="mb-8 text-base leading-relaxed text-white/72 sm:text-lg">
              Explore moments from workshops, learner projects, STEM sessions,
              Dev Board activities, and community innovation programmes.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/programs" className="btn-primary">
                Explore programmes
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link to="/payments" className="btn-secondary">
                Enrol now
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f7f5ff_0%,#ffffff_100%)] py-16 md:py-20 lg:py-24">
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Gallery collection
            </p>
            <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Learning moments across workshops and community programmes.
            </h2>
            <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
              Each frame reflects hands-on learning, active mentoring, and real
              project work across the ERA AXIS experience.
            </p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {galleryItems.map((item) => (
              <GalleryGridCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
