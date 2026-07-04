import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { galleryItems as STATIC_GALLERY } from "../data/gallery";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { api } from "../services/api";
import { resolveMediaUrl } from "../utils/resolveMediaUrl";

function GalleryGridCard({ src, alt, index, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="group relative block w-full overflow-hidden rounded-[18px] border border-[rgb(17_17_17_/_0.06)] bg-[var(--color-surface)] text-left shadow-[0_10px_30px_rgb(17_17_17_/_0.08)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      aria-label={`Open gallery image ${index + 1}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(5_5_12_/_0.14)_100%)] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
    </button>
  );
}

export default function Gallery() {
  const [apiItems, setApiItems] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get("/gallery")
      .then((json) => {
        if (!cancelled) setApiItems(json?.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiItems([]);
      });
    return () => { cancelled = true; };
  }, []);

  const items = (() => {
    if (!apiItems || apiItems.length === 0) return STATIC_GALLERY;
    const mapped = apiItems
      .filter((item) => item.image_url)
      .map((item) => ({
        id:  item.id,
        src: resolveMediaUrl(item.image_url),
        alt: item.alt_text || item.title || "ERA AXIS gallery image",
      }));
    return mapped.length > 0 ? mapped : STATIC_GALLERY;
  })();

  const activeItem = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? 0
            : current === 0
              ? items.length - 1
              : current - 1
        );
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? 0 : (current + 1) % items.length
        );
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, items.length]);

  function openLightbox(index) {
    setActiveIndex(index);
  }

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrevious() {
    setActiveIndex((current) =>
      current === null
        ? 0
        : current === 0
          ? items.length - 1
          : current - 1
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === null ? 0 : (current + 1) % items.length
    );
  }

  return (
    <>
      <SEO {...getPageSeo("/gallery")} />
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
              <Link to="/payments" className="btn-primary">
                Enrol now
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link to="/programs" className="btn-secondary">
                Explore programmes
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
            {items.map((item, index) => (
              <GalleryGridCard
                key={item.id}
                {...item}
                index={index}
                onOpen={openLightbox}
              />
            ))}
          </div>
        </div>
      </section>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgb(4_4_10_/_0.92)] p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image ${activeIndex + 1} of ${items.length}`}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-colors duration-200 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:right-6 sm:top-6"
            aria-label="Close image preview"
          >
            <X size={20} strokeWidth={2.25} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-6 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-colors duration-200 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:inline-flex"
            aria-label="Previous image"
          >
            <ArrowLeft size={20} strokeWidth={2.25} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-6 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-colors duration-200 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:inline-flex"
            aria-label="Next image"
          >
            <ArrowRight size={20} strokeWidth={2.25} />
          </button>

          <div
            className="relative flex max-h-full w-full max-w-6xl flex-col items-center justify-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="hidden self-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-white/76 backdrop-blur-md sm:block sm:text-sm">
              {activeIndex + 1} / {items.length}
            </div>

            <img
              src={activeItem.src}
              alt={activeItem.alt}
              className="max-h-[78vh] w-auto max-w-full rounded-[20px] object-contain shadow-[0_24px_80px_rgb(0_0_0_/_0.45)]"
            />

            <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-full border border-white/10 bg-white/8 px-3 py-2 backdrop-blur-md sm:hidden">
              <button
                type="button"
                onClick={showPrevious}
                className="inline-flex h-11 min-w-[3rem] items-center justify-center rounded-full border border-white/12 bg-white/8 px-4 text-white transition-colors duration-200 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Previous image"
              >
                <ArrowLeft size={20} strokeWidth={2.25} />
              </button>

              <div className="text-center text-sm font-semibold tracking-[0.16em] text-white/78">
                {activeIndex + 1} / {items.length}
              </div>

              <button
                type="button"
                onClick={showNext}
                className="inline-flex h-11 min-w-[3rem] items-center justify-center rounded-full border border-white/12 bg-white/8 px-4 text-white transition-colors duration-200 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Next image"
              >
                <ArrowRight size={20} strokeWidth={2.25} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
