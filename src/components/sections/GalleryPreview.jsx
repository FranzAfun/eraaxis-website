import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { galleryPreviewItems } from "../../data/gallery";

const AUTOPLAY_MS = 4800;
const featuredItems = galleryPreviewItems.slice(0, 6);

function GalleryThumbnail({ item, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative aspect-[16/10] overflow-hidden rounded-2xl border text-left transition-all duration-300",
        isActive
          ? "border-[var(--color-accent)] shadow-[0_0_0_1px_var(--color-accent)]"
          : "border-white/10 opacity-60 hover:opacity-90",
      ].join(" ")}
      aria-pressed={isActive}
    >
      <img
        src={item.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(6_6_12_/_0.42)] via-[rgb(6_6_12_/_0.08)] to-transparent" />
    </button>
  );
}

export default function GalleryPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredItems.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  function goTo(index) {
    setActiveIndex(index);
  }

  function goPrev() {
    setActiveIndex((current) =>
      current === 0 ? featuredItems.length - 1 : current - 1
    );
  }

  function goNext() {
    setActiveIndex((current) => (current + 1) % featuredItems.length);
  }

  return (
    <section
      id="gallery"
      aria-label="Gallery preview"
      className="gallery-preview-section overflow-hidden py-20 md:py-24 lg:py-28"
    >
      <div className="container">
        <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              Gallery
            </p>
            <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.7rem]">
              Moments from practical learning in action.
            </h2>
            <p className="text-base leading-relaxed text-white/68 sm:text-[17px]">
              A glimpse of ERA AXIS workshops, learner builds, STEM sessions,
              and community innovation activities.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link to="/gallery" className="btn-primary">
              View gallery
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link to="/payments" className="btn-secondary">
              Enrol now
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div
          className="gallery-hero-shell"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="gallery-stage">
            <div className="gallery-stage-image-wrap">
              {featuredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={[
                    "gallery-stage-slide",
                    index === activeIndex ? "is-active" : "",
                  ].join(" ")}
                  aria-hidden={index === activeIndex ? undefined : "true"}
                >
                  <img
                    src={item.src}
                    alt={index === activeIndex ? item.alt : ""}
                    loading="lazy"
                    decoding="async"
                    className="gallery-stage-image"
                  />
                  <div className="gallery-stage-overlay" />
                </div>
              ))}
            </div>

            {featuredItems.map((item, index) => (
              <div
                key={`${item.id}-content`}
                className={[
                  "gallery-stage-content",
                  index === activeIndex ? "is-active" : "",
                ].join(" ")}
                aria-hidden={index === activeIndex ? undefined : "true"}
              />
            ))}

            <div className="gallery-stage-arrows">
              <button
                type="button"
                onClick={goPrev}
                className="gallery-stage-arrow"
                aria-label="Previous gallery item"
              >
                <ArrowLeft size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="gallery-stage-arrow"
                aria-label="Next gallery item"
              >
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="gallery-stage-dots">
              {featuredItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className={[
                    "gallery-stage-dot",
                    index === activeIndex ? "is-active" : "",
                  ].join(" ")}
                  aria-label={`Show gallery image ${index + 1}`}
                  aria-pressed={index === activeIndex}
                />
              ))}
            </div>

            <div className="gallery-stage-progress-track">
              <div
                key={`${activeIndex}-${paused ? "paused" : "playing"}`}
                className={[
                  "gallery-stage-progress-bar",
                  paused ? "is-paused" : "",
                ].join(" ")}
                style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
              />
            </div>
          </div>

          <div className="gallery-thumb-grid">
            {featuredItems.map((item, index) => (
              <GalleryThumbnail
                key={item.id}
                item={item}
                isActive={index === activeIndex}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
