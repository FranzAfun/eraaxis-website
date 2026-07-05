import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";

function SectionHeading({ children }) {
  return (
    <h2 className="mb-4 mt-10 text-xl font-black leading-snug tracking-tight text-[var(--color-text-primary)] first:mt-0 sm:text-2xl">
      {children}
    </h2>
  );
}

function Paragraph({ children }) {
  return (
    <p className="mb-5 text-base leading-relaxed text-[var(--color-text-secondary)]">
      {children}
    </p>
  );
}

export default function Privacy() {
  return (
    <>
      <SEO {...getPageSeo("/privacy")} />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-16 pt-36 text-white md:pb-20 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, transparent 30%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div className="container relative z-10">
          <p className="mb-5 inline-flex w-fit rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
            Legal
          </p>
          <h1 className="mb-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
            Privacy &amp; Cookie Policy
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
            A plain-language explanation of what information ERA AXIS collects
            through this website, and how local storage and cookies are used.
          </p>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-background)] py-16 md:py-20">
        <div className="container max-w-3xl">
          <Paragraph>
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
          </Paragraph>

          <SectionHeading>Cookies and local storage</SectionHeading>
          <Paragraph>
            This website does not use tracking, analytics, or advertising
            cookies. The only thing stored in your browser is a small local
            flag remembering that you&apos;ve seen the cookie notice, so it
            doesn&apos;t show again on your next visit. This value stays on
            your device and is never sent to our servers.
          </Paragraph>
          <Paragraph>
            Site fonts are loaded from Google Fonts, which does not set
            cookies for this purpose. If we ever add analytics or advertising
            tools in the future, we&apos;ll update this page and the cookie
            notice before doing so.
          </Paragraph>

          <SectionHeading>Payments</SectionHeading>
          <Paragraph>
            When you make a payment (enrolment, dues, or Student Chapter
            fees), you&apos;re redirected to Paystack&apos;s secure checkout
            to complete the transaction. Paystack is a separate service with
            its own cookies and privacy practices, which are outside ERA
            AXIS&apos;s control — please refer to Paystack&apos;s own privacy
            policy for details on how they handle payment data.
          </Paragraph>

          <SectionHeading>Information you provide to us</SectionHeading>
          <Paragraph>
            When you fill out a form on this site — enrolment, contact,
            newsletter subscription, or a similar request — we collect the
            details you submit (such as your name, email, phone number, and
            message) to respond to your request, process your enrolment or
            payment, or send the updates you asked for. We don&apos;t sell or
            share this information with third parties for marketing purposes.
          </Paragraph>

          <SectionHeading>Contact us</SectionHeading>
          <Paragraph>
            If you have questions about this policy or how your information
            is handled, reach out via the{" "}
            <a href="/contact" className="font-semibold text-[var(--color-primary)] underline underline-offset-2">
              Contact page
            </a>.
          </Paragraph>
        </div>
      </section>
    </>
  );
}
