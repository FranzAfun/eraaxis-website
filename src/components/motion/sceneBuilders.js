/**
 * The scroll scenes a page can ask for, by tagging an element with
 * data-scene="…". Each is a GSAP ScrollTrigger tween, scrubbed to the scroll
 * position so it moves with your finger or wheel rather than on a timer.
 *
 *   hero-exit   the hero's words drift up and fade as you leave the top
 *   hero-sink   the hero's artwork sinks back and shrinks (wide screens)
 *   zoom-in     grows from a little smaller to full size as it arrives
 *   tilt-zoom   a product shot settles from slightly large and tilted
 *   parallax    moves a little slower than the page inside its frame
 *               (wide screens); the frame must clip it
 *   drift       slides in from the side it names in data-from (left/right)
 *               as it arrives (wide screens)
 *   grow-line   a progress line that fills as its section scrolls past
 *               (data-axis="y" for an upright one)
 *   stack-card  a card in a sticky pile; it eases back as the next one
 *               slides over it
 *   [data-h-scroll]  a section that holds still while its [data-h-track]
 *               slides sideways (wide screens; see below)
 *
 * Only transforms and opacity are animated. `wide` is a wide screen with a
 * mouse; phones get the gentle ones only.
 */
export function buildScenes(gsap, root, { wide }) {
  const all = (name) => gsap.utils.toArray(root.querySelectorAll(`[data-scene="${name}"]`));
  const firstScreen = () => window.innerHeight;

  all("hero-exit").forEach((el) => {
    gsap.to(el, {
      yPercent: wide ? -14 : -8,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { start: 0, end: firstScreen, scrub: true },
    });
  });

  if (wide) {
    all("hero-sink").forEach((el) => {
      gsap.to(el, {
        y: 90,
        scale: 0.86,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: { start: 0, end: firstScreen, scrub: true },
      });
    });
  }

  all("zoom-in").forEach((el) => {
    gsap.fromTo(
      el,
      { scale: wide ? 0.9 : 0.95, opacity: 0.6 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "top 40%", scrub: 0.6 },
      }
    );
  });

  all("tilt-zoom").forEach((el) => {
    gsap.fromTo(
      el,
      // Gentler on a phone, where the button sits right under the photo.
      { scale: wide ? 1.12 : 1.04, rotate: wide ? -3 : 0 },
      {
        scale: 1,
        rotate: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "center 55%", scrub: 0.8 },
      }
    );
  });

  all("grow-line").forEach((el) => {
    const vertical = el.dataset.axis === "y";
    gsap.fromTo(
      el,
      vertical ? { scaleY: 0 } : { scaleX: 0 },
      {
        ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
        transformOrigin: vertical ? "50% 0%" : "0% 50%",
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
      }
    );
  });

  // h-scroll: a section whose cards slide sideways while you scroll down. It
  // pins the section and moves its [data-h-track] across; until this runs
  // (phones, reduced motion, before GSAP loads) the cards are a plain grid or a
  // swipeable row, so none is ever out of reach.
  const cleanups = [];
  if (wide) {
    root.querySelectorAll("[data-h-scroll]").forEach((section) => {
      const track = section.querySelector("[data-h-track]");
      if (!track) return;
      section.setAttribute("data-h-active", "");
      cleanups.push(() => section.removeAttribute("data-h-active"));
      const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
      const progress = section.querySelector("[data-h-progress]");
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          // Measured first, so scenes further down allow for the pinned stretch.
          refreshPriority: 1,
        },
      });
      timeline.to(track, { x: () => -distance(), ease: "none" });
      if (progress) timeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
    });
  }

  if (wide) {
    all("parallax").forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom 30%", scrub: true },
        }
      );
    });

    all("drift").forEach((el) => {
      const from = el.dataset.from === "right" ? 70 : -70;
      gsap.fromTo(
        el,
        { x: from, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 62%", scrub: 0.6 },
        }
      );
    });
  } else {
    // Without the drift, these still arrive softly.
    all("drift").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 98%", end: "top 75%", scrub: 0.5 } }
      );
    });
  }

  all("stack-card").forEach((card, i, cards) => {
    const next = cards[i + 1];
    if (!next || next.parentElement !== card.parentElement) return;
    gsap.to(card, {
      scale: wide ? 0.93 : 0.96,
      ease: "none",
      scrollTrigger: { trigger: next, start: "top bottom", end: "top 30%", scrub: true },
    });
  });

  return () => cleanups.forEach((undo) => undo());
}
