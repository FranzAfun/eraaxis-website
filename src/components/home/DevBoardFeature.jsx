import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import devBoardImg from "../../assets/images/dev-board/dev-board-main.webp";

const features = [
  "Built for classroom learning",
  "Supports beginner to advanced learners",
  "Connects electronics, coding, and problem-solving",
  "Designed for practical project-based education",
];

export default function DevBoardFeature() {
  return (
    <section
      aria-label="ERA Dev Board"
      className="bg-[var(--color-background-dark)] py-20 md:py-24 lg:py-28"
    >
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Text column */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              ERA Dev Board
            </p>
            <h2 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
              Hands-on STEM learning, powered by hardware built in Ghana.
            </h2>
            <p className="mb-8 max-w-[480px] text-base leading-relaxed text-white/65 sm:text-[17px]">
              The ERA Dev Board gives learners a practical way to understand
              electronics, sensors, automation, and embedded systems by
              building real working projects.
            </p>

            <ul className="mb-10 space-y-3.5">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 text-[var(--color-accent)]"
                  />
                  <span className="text-[0.9375rem] leading-snug text-white/80">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link to="/dev-board" className="btn-primary group">
              Explore the Dev Board
              <ArrowRight
                size={17}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </Link>
          </div>

          {/* Product image card */}
          <div className="glass-surface rounded-[var(--radius-lg)] p-4 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_rgb(0_0_0_/_0.5)] sm:p-6">
            <img
              src={devBoardImg}
              alt="ERA Dev Board — hands-on electronics learning kit"
              className="w-full rounded-[var(--radius-md)] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
