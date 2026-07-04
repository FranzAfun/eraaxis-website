import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBootstrap } from "../../hooks/useBootstrap";
import { galleryPreviewItems } from "../../data/gallery";
import { resolveMediaUrl } from "../../utils/resolveMediaUrl";

const AUTOPLAY_MS = 4800;
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function normaliseItems(raw) {
  return raw
    .filter((item) => item.image_url)
    .map((item) => ({
      id: item.id,
      src: resolveMediaUrl(item.image_url),
      alt: item.alt_text || item.title || "ERA AXIS gallery image",
    }));
}

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
  const { gallery: bootstrapGallery } = useBootstrap();
  const [fetchedItems, setFetchedItems] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const animationFrameRef = useRef(null);
  const lastFrameTimeRef = useRef(null);
  const progressMsRef = useRef(0);

  // Fetch from API only when bootstrap has no gallery items
  useEffect(() => {
    if (bootstrapGallery.length > 0) return;

    let cancelled = false;
    fetch(`${BASE_URL}/gallery`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        if (!cancelled) setFetchedItems(json?.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setFetchedItems([]);
      });

    return () => { cancelled = true; };
  }, [bootstrapGallery.length]);

  const resolvedItems = (() => {
    if (bootstrapGallery.length > 0) return normaliseItems(bootstrapGallery);
    if (fetchedItems !== null && fetchedItems.length > 0) return normaliseItems(fetchedItems);
    return null; // still loading or empty — fall through to static
  })();

  const featuredItems = (resolvedItems ?? galleryPreviewItems).slice(0, 6);

  useEffect(() => {
    if (paused) {
      lastFrameTimeRef.current = null;
      return undefined;
    }

    const tick = (timestamp) => {
      if (lastFrameTimeRef.current == null) {
        lastFrameTimeRef.current = timestamp;
      }

      const delta = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      let nextProgress = progressMsRef.current + delta;

      if (nextProgress >= AUTOPLAY_MS) {
        nextProgress = 0;
        setActiveIndex((current) => (current + 1) % featuredItems.length);
      }

      progressMsRef.current = nextProgress;
      setProgressPercent((nextProgress / AUTOPLAY_MS) * 100);
      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current != null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = null;
      lastFrameTimeRef.current = null;
    };
  }, [paused, featuredItems.length]);

  function resetProgress() {
    progressMsRef.current = 0;
    lastFrameTimeRef.current = null;
    setProgressPercent(0);
  }

  function goTo(index) {
    resetProgress();
    setActiveIndex(index);
  }

  function goPrev() {
    resetProgress();
    setActiveIndex((current) =>
      current === 0 ? featuredItems.length - 1 : current - 1
    );
  }

  function goNext() {
    resetProgress();
    setActiveIndex((current) => (current + 1) % featuredItems.length);
  }

  return (
    <section
      id="gallery"
      aria-label="Gallery preview"
      className="overflow-hidden bg-[var(--color-background-dark)] pt-8 pb-16 md:pt-10 md:pb-20 lg:pt-0 lg:pb-24"
    >
      <div className="container">
        <div className="mb-8 flex flex-col gap-6 md:mb-10 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
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

          <div className="hidden flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex">
            <Link to="/payments" className="btn-primary cta-mobile-btn">
              Enrol now
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link to="/gallery" className="btn-secondary cta-mobile-btn">
              View gallery
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
                className="gallery-stage-progress-bar"
                style={{ transform: `scaleX(${progressPercent / 100})` }}
              />
            </div>
          </div>

          <div className="hidden md:grid gallery-thumb-grid">
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

        <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:hidden">
          <Link to="/payments" className="btn-primary cta-mobile-btn">
            Enrol now
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <Link to="/gallery" className="btn-secondary cta-mobile-btn">
            View gallery
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
