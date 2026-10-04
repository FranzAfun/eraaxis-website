import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Users,
} from "lucide-react";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";

// Three ways in, side by side. Student Chapter is the one most people choose,
// so it carries the badge and the brand colour. Group or institutional support
// is a line under the cards, not a fourth card.
const paymentOptions = [
  {
    title: "Programme Enrolment",
    amount: "From GHS 200/month",
    description: "Choose an ERA AXIS learning programme. Monthly or full upfront.",
    bullets: [
      "4 programmes across school, youth, and professional tracks",
      "Monthly or full programme enrolment options",
      "Full pricing and checkout totals shown at the next step",
    ],
    cta: "Choose programme",
    to: "/payments/programme-enrolment",
    Icon: GraduationCap,
  },
  {
    title: "Student Chapter",
    amount: "GHS 125 first payment",
    description: "Join the ERA AXIS Student Chapter.",
    bullets: [
      "GHS 110 chapter fee",
      "GHS 15 first month dues",
      "Then GHS 110 every 3 months",
    ],
    cta: "Join the chapter",
    to: "/payments/student-chapter",
    Icon: Users,
    isPopular: true,
  },
  {
    title: "Monthly Dues",
    amount: "GHS 15/month",
    description: "Pay monthly membership or chapter dues.",
    bullets: [
      "For active members",
      "Monthly payment record",
      "Receipt after confirmation",
    ],
    cta: "Pay dues",
    to: "/payments/monthly-dues",
    Icon: CalendarDays,
  },
];

function OptionCard({ option }) {
  const { Icon, isPopular } = option;
  // The popular card is filled with the primary colour, its words in white.
  const tone = isPopular
    ? {
        card: "relative border-2 border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/25 lg:-my-3",
        eyebrow: "text-[var(--color-text-on-dark-muted)]",
        title: "text-white",
        amount: "text-white",
        body: "text-[var(--color-text-on-dark-muted)]",
        dot: "bg-white",
        icon: "border-white/25 bg-white/10",
        iconColour: "text-white",
        button: "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-white/90",
      }
    : {
        card: "card-interactive",
        eyebrow: "text-[var(--color-primary)]",
        title: "text-[var(--color-text-primary)]",
        amount: "text-[var(--color-primary)]",
        body: "text-[var(--color-text-secondary)]",
        dot: "bg-[var(--color-primary)]",
        icon: "border-[var(--color-border)] bg-[var(--color-surface-soft)]",
        iconColour: "text-[var(--color-primary)]",
        button: "btn-primary",
      };

  return (
    <article className={`flex flex-col rounded-[var(--radius-md)] p-6 transition-all duration-300 hover:-translate-y-1 ${tone.card}`}>
      {isPopular && (
        <div className="absolute right-5 top-0 -translate-y-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] shadow-sm ring-2 ring-[var(--color-primary)]">
          Most Popular
        </div>
      )}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className={`mb-2 text-[11px] font-semibold uppercase tracking-widest ${tone.eyebrow}`}>
            Enrolment option
          </p>
          <h2 className={`text-2xl font-black tracking-tight ${tone.title}`}>{option.title}</h2>
        </div>
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] border shadow-sm ${tone.icon}`}>
          <Icon size={21} className={tone.iconColour} strokeWidth={1.85} />
        </span>
      </div>

      <p className={`text-2xl font-black tracking-tight ${tone.amount}`}>{option.amount}</p>
      <p className={`mt-4 text-sm leading-relaxed ${tone.body}`}>{option.description}</p>

      <ul className="mt-6 space-y-3">
        {option.bullets.map((bullet) => (
          <li key={bullet} className={`flex items-start gap-3 text-sm ${tone.body}`}>
            <span aria-hidden="true" className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <Link to={option.to} className={tone.button}>
          {option.cta}
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </article>
  );
}

export default function Payments() {
  return (
    <>
      <SEO {...getPageSeo("/payments")} />
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-14 pt-36 text-white md:pb-20 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 18%, color-mix(in srgb, var(--color-accent) 24%, transparent) 0%, transparent 30%), radial-gradient(circle at 84% 8%, color-mix(in srgb, var(--color-primary) 38%, transparent) 0%, transparent 34%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)] backdrop-blur-xl">
              ERA AXIS ENROLMENT
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Enrolment &amp; Dues
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
              Enrol on a programme, join the Student Chapter, or pay your dues. Totals are shown before you pay.
            </p>
          </div>
        </div>
      </section>

      <section id="payment-options" className="bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="container">
          <div className="grid gap-6 pt-3 lg:grid-cols-3 lg:items-stretch">
            {paymentOptions.map((option) => (
              <OptionCard key={option.title} option={option} />
            ))}
          </div>
          {/* The other ways in, quietly: groups, and help choosing. */}
          <p className="mt-10 text-center text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Enrolling several learners for a school, community or organisation?{" "}
            <Link to="/contact#enquiry" className="font-semibold text-[var(--color-primary)] underline underline-offset-2">Request a group quote</Link>.
            {" "}Not sure which to choose?{" "}
            <Link to="/contact#enquiry" className="font-semibold text-[var(--color-primary)] underline underline-offset-2">Ask us</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
