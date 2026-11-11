import { BellRing } from "lucide-react";
import Reveal from "../motion/Reveal";
import NewsletterForm from "../ui/NewsletterForm";

/**
 * A programme that is coming soon asks people to stay connected instead of
 * enrolling: the newsletter signup, on the page itself (the footer leaves its
 * own out there, see Footer.jsx). JoinLink's "Get updates" lands here.
 */
export default function StayConnected({ line, source }) {
  return (
    <section id="stay-connected" className="soft-field scroll-mt-24 py-20 md:py-24">
      <div className="container">
        <Reveal className="card-interactive mx-auto flex max-w-3xl flex-col gap-6 p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white shadow-[0_14px_30px_-16px_var(--color-primary)]"
            >
              <BellRing size={22} strokeWidth={2} />
            </span>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Coming soon</p>
              <h2 className="text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">Stay connected.</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{line}</p>
            </div>
          </div>
          <div>
            <NewsletterForm source={source} />
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">You can unsubscribe at any time.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
