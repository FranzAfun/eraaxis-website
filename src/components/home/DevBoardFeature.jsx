import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import devBoardImg from "../../assets/images/dev-board/dev-board-main.webp";
import Reveal from "../motion/Reveal";
import LightTheLed from "./LightTheLed";

export default function DevBoardFeature() {
  return (
    <section
      aria-label="ERA Dev Board"
      className="dark-surface relative overflow-hidden bg-[var(--color-background-dark)] py-20 md:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_80%_50%,color-mix(in_srgb,var(--color-primary)_40%,transparent),transparent_70%)]"
      />
      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
                ERA Dev Board
              </p>
              <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
                Hands-on STEM, on hardware built in Ghana.
              </h2>
              <p className="mb-8 max-w-[480px] text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-[17px]">
                This is how every learner starts. Go on:
              </p>
            </Reveal>

            <Reveal delay={90}>
              <LightTheLed />
            </Reveal>

            <Reveal delay={150} className="mt-8">
              <Link to="/dev-board" className="btn-primary group w-full justify-center sm:w-auto">
                Explore the Dev Board
                <ArrowRight size={17} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <img
              src={devBoardImg}
              alt="The ERA Dev Board, a hands-on electronics learning kit"
              className="w-full rounded-[var(--radius-lg)] object-cover shadow-[0_30px_70px_-30px_rgb(0_0_0_/_0.7)] transition-transform duration-500 hover:-translate-y-1"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
