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
}
