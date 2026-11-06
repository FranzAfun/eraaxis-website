import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import privacySeal from "../assets/images/compliance/dpc-privacy-seal.webp";
import privacySealLarge from "../assets/images/compliance/dpc-privacy-seal-large.webp";

const LAST_UPDATED = { iso: "2026-11-06", label: "6 November 2026" };
const CONTACT_EMAIL = "support@eraaxis.com";

// The DPC registration, from the Certificate of Registration and Privacy Seal (Nov 2026).
const REGISTRATION = [
  ["Registered as", "Data controller, under the Data Protection Act, 2012 (Act 843)"],
  ["Registration serial", "REG-2026-AAAAEJ"],
  ["DPC ID", "DPC-2026-AAAANA"],
  ["Registered on", "20 October 2026"],
  ["Valid until", "19 October 2028"],
  ["Privacy Seal", "DPC-PSVS-2026-00115"],
];

const SECTIONS = [
  ["who-we-are", "Who we are"],
  ["registration", "Our registration with the Data Protection Commission"],
  ["what-we-collect", "What we collect"],
  ["why", "Why we use it"],
  ["children", "Children and young learners"],
  ["sharing", "Who we share it with"],
  ["outside-ghana", "Information kept outside Ghana"],
  ["payments", "Payments"],
  ["certificates", "Certificates and public verification"],
  ["retention", "How long we keep it"],
  ["security", "How we protect it"],
  ["cookies", "Cookies and storage on your device"],
  ["rights", "Your rights"],
  ["complaints", "Complaints"],
  ["changes", "Changes to this policy"],
  ["contact", "Contact us"],
];

const COLLECT = [
  ["Who you are and how to reach you", "First name, last name, other names, email address and phone number."],
  ["About the learner", "School or institution, gender, and location. For younger learners, the parent or guardian's name, phone number, relationship and agreement."],
  ["Learning records", "The programmes and courses you join, attendance, whether you qualify for a certificate, and the certificates we issue."],
  ["Forms and files", "Your answers to our forms and any files you upload, including files you choose from Google Drive."],
  ["Payments", "Amounts, payment references and whether a payment went through. Never your card or mobile money details."],
  ["Signing in", "Your Google account email, if you choose to sign in with Google on a form or an attendance link."],
  ["Messages and the newsletter", "What you send us through the Contact page, and your email address if you subscribe to our newsletter."],
  ["Technical and security", "IP address, browser type, and a record of important actions, used to keep our services safe."],
];

const PURPOSES = [
  "Signing you up and enrolling you on programmes, and running them",
  "Recording attendance and deciding who qualifies for a certificate",
  "Issuing certificates, and letting others check them with a certificate code",
  "Taking payments and sending receipts",
  "Contacting learners, applicants and subscribers about their programmes, and sending the newsletter to those who asked for it",
  "Running our business: staff, finance and day-to-day operations",
  "Keeping our forms and services safe from misuse and spam",
];

const PROVIDERS = [
  ["Amazon Web Services", "Hosts our servers and database", "Ireland (EU)"],
  ["Amazon Web Services", "Stores uploaded files and certificates, privately", "United States"],
  ["Google", "Sign in with Google, and the Google Drive file picker on our forms", "United States"],
  ["Google (Gemini)", "AI for our internal business insights. It receives summaries of our figures, never personal details of learners or customers", "United States"],
  ["Netlify", "Hosts this website", "United States and worldwide"],
  ["Namecheap Private Email", "Our email", "United States"],
  ["Speso", "Takes payments", "Ghana"],
];

const RETENTION = [
  ["Learner records", "While you take part in our programmes, then 4 years after your last programme."],
  ["Sign-up details", "Become part of the learner record above."],
  ["Certificates", "Name, programme and date, kept for as long as we offer certificate verification, so your certificate stays checkable."],
  ["Payment and financial records", "6 years."],
  ["Other form answers and uploaded files", "2 years after the form closes."],
  ["Started but unpaid sign-ups, and unsent forms", "12 months."],
  ["Contact-form messages", "3 years."],
  ["Newsletter", "Until you unsubscribe."],
  ["Security and audit records", "3 years."],
  ["Staff records", "For the time you work with us, then 6 years."],
  ["Form answers saved in your browser", "Until you send or clear the form."],
];

const SECURITY = [
  "Only staff whose role needs it can see personal information, and important actions are recorded.",
  "Passwords are stored only in scrambled (hashed) form; staff sign-in uses secure cookies, protection against forged requests, and a screen lock.",
  "Every connection to our services is encrypted (HTTPS).",
  "Uploaded files and certificates are kept in private storage, reachable only through our system.",
  "Email addresses are confirmed with a one-time code or Google sign-in.",
  "Our public forms have limits and checks that stop spam and misuse.",
  "Payments go through our payment provider; we never see or store card or mobile money details.",
];

const DEVICE_STORAGE = [
  ["Cookie notice", "Remembers that you have seen our cookie notice, so it does not show again.", "Until you clear your browser's data"],
  ["Form drafts", "Keeps your answers while you fill in one of our forms, so you do not lose them.", "Until you send or clear the form"],
  ["Payment reference", "Lets us show the right confirmation when you come back from checkout.", "Until you close the tab"],
];

const RIGHTS = [
  ["See it", "Ask what we hold about you and get a copy."],
  ["Correct it", "Ask us to fix anything that is wrong or out of date."],
  ["Delete it", "Ask us to delete it, unless the law or an open payment, certificate or programme means we must keep it."],
  ["Stop or object", "Ask us to stop using it for something, including unsubscribing from the newsletter at any time."],
  ["Withdraw consent", "Where we rely on your agreement, or a parent or guardian's, you can take it back."],
];

function SectionHeading({ id, children }) {
  return (
    <h2 id={id} className="mb-4 mt-12 scroll-mt-28 text-xl font-black leading-snug tracking-tight text-[var(--color-text-primary)] first:mt-0 sm:text-2xl">
      {children}
    </h2>
  );
}

function Paragraph({ children }) {
  return <p className="mb-5 text-base leading-relaxed text-[var(--color-text-secondary)]">{children}</p>;
}

function List({ items }) {
  return (
    <ul className="mb-5 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)] marker:text-[var(--color-primary)]">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

// Label-and-text pairs: stacked on phones, two columns from small screens up.
function Pairs({ rows }) {
  return (
    <dl className="mb-5 divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      {rows.map(([term, detail, extra]) => (
        <div key={`${term}-${detail}`} className="grid gap-1 px-5 py-4 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-6">
          <dt className="font-semibold text-[var(--color-text-primary)]">{term}</dt>
          <dd className="min-w-0 break-words text-[var(--color-text-secondary)]">
            {detail}
            {extra && <span className="mt-1 block text-sm font-medium text-[var(--color-text-primary)]">{extra}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function MailLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[var(--color-primary)] underline underline-offset-2">
      {CONTACT_EMAIL}
    </a>
  );
}

export default function Privacy() {
  return (
    <>
      <SEO {...getPageSeo("/privacy")} />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="dark-surface relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-16 pt-36 text-white md:pb-20 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, transparent 30%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div className="land-in container relative z-10">
          <p className="mb-5 inline-flex w-fit rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)] backdrop-blur-xl">
            Legal
          </p>
          <h1 className="mb-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
            Privacy &amp; Cookie Policy
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
            What we collect, why, who helps us handle it, how long we keep it,
            and the choices you have. In plain language.
          </p>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-background)] py-16 md:py-20">
        <div className="container max-w-3xl">
          <Paragraph>
            Last updated: <time dateTime={LAST_UPDATED.iso}>{LAST_UPDATED.label}</time>.
          </Paragraph>

          <div className="mb-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="mb-3 text-lg font-black text-[var(--color-text-primary)]">The short version</h2>
            <List
              items={[
                "We collect what we need to run our programmes, take payments and issue certificates.",
                "We never sell your information, and this website has no advertising or analytics trackers.",
                "A few trusted providers help us run our services; they are listed below.",
                "Younger learners need a parent or guardian to agree before they sign up.",
                "You can ask to see, correct or delete your information at any time.",
                "ERA AXIS Limited is registered with Ghana's Data Protection Commission.",
              ]}
            />
          </div>

          <nav aria-label="On this page" className="mb-12">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">On this page</h2>
            <ol className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {SECTIONS.map(([id, title], index) => (
                <li key={id} className="min-w-0">
                  <a href={`#${id}`} className="text-[var(--color-primary)] underline-offset-2 hover:underline">
                    {index + 1}. {title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <SectionHeading id="who-we-are">1. Who we are</SectionHeading>
          <Paragraph>
            ERA AXIS Limited (&quot;ERA AXIS&quot;, &quot;we&quot;) runs practical STEM and
            digital skills programmes. We are a company registered in Ghana under the
            Companies Act, 2019 (Act 992), company number CS132340626, at HNO. A1205,
            Sekondi, Western Region (GhanaPost GPS WS0236471).
          </Paragraph>
          <Paragraph>
            This policy covers this website and everything you do through it: signing up
            and paying for programmes, our forms, attendance links, the newsletter,
            contacting us, and checking a certificate. It also covers the records we keep
            about learners in our internal system. We decide how this information is used,
            which makes us its data controller.
          </Paragraph>

          <SectionHeading id="registration">2. Our registration with the Data Protection Commission</SectionHeading>
          <div className="mb-5 grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_9rem]">
            <div className="min-w-0">
              <Paragraph>
                ERA AXIS Limited is registered with the Data Protection Commission (DPC)
                of Ghana and holds the DPC Privacy Seal.
              </Paragraph>
              <Pairs rows={REGISTRATION} />
            </div>
            <a
              href={privacySealLarge}
              target="_blank"
              rel="noopener"
              className="mx-auto block w-32 text-center sm:w-36"
            >
              <img
                src={privacySeal}
                alt="DPC Ghana Privacy Seal awarded to ERA AXIS Limited"
                width="438"
                height="646"
                loading="lazy"
                className="w-full rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[var(--color-border)]"
              />
              <span className="mt-2 block text-xs font-semibold text-[var(--color-primary)] underline underline-offset-2">
                Open full size to scan
              </span>
            </a>
          </div>

          <SectionHeading id="what-we-collect">3. What we collect</SectionHeading>
          <Paragraph>
            Most of it comes straight from you, or from a parent, guardian, school or sponsor
            signing a learner up. We only ask for what we need.
          </Paragraph>
          <Pairs rows={COLLECT} />
          <Paragraph>
            We do not ask for sensitive information such as health, religion or biometrics on
            our standard forms.
          </Paragraph>

          <SectionHeading id="why">4. Why we use it</SectionHeading>
          <List items={PURPOSES} />
          <Paragraph>
            We do not make decisions about you by automated means alone. Certificates, for
            example, are approved by our staff.
          </Paragraph>

          <SectionHeading id="children">5. Children and young learners</SectionHeading>
          <Paragraph>
            Many of our learners are school pupils. When a learner&apos;s school is a basic,
            junior high or senior high school, or a parent or guardian signs them up, a parent
            or guardian must give their name, phone number and relationship to the learner,
            and agree to the learner taking part. We keep that agreement with the learner&apos;s
            record.
          </Paragraph>
          <Paragraph>
            A parent or guardian can ask to see, correct or delete a child&apos;s information
            in the same way as described under Your rights.
          </Paragraph>

          <SectionHeading id="sharing">6. Who we share it with</SectionHeading>
          <Paragraph>
            We never sell personal information, and this website has no advertising or
            analytics trackers. These providers help us run our services, and only handle
            information for that purpose:
          </Paragraph>
          <Pairs rows={PROVIDERS} />
          <Paragraph>
            We would also share information if the law required it, or to protect people
            from harm or fraud.
          </Paragraph>

          <SectionHeading id="outside-ghana">7. Information kept outside Ghana</SectionHeading>
          <Paragraph>
            Some of our providers keep information in Ireland (EU) and the United States, as
            listed above. We use established providers, every connection is encrypted, and
            access is limited to the people and systems that need it.
          </Paragraph>

          <SectionHeading id="payments">8. Payments</SectionHeading>
          <Paragraph>
            Payments for programmes, Campus Chapter membership, dues and paid forms are made on
            Speso&apos;s secure checkout. We never see or store your card or mobile money details.
            We keep the amount, the payment reference and whether it went through, to give you
            a receipt and keep our accounts. Speso has its own privacy policy for what it handles.
          </Paragraph>

          <SectionHeading id="certificates">9. Certificates and public verification</SectionHeading>
          <Paragraph>
            Each certificate we issue has a code, with a link and QR code on the certificate.
            Anyone who has it, such as an employer, can check the certificate on this website.
            The check shows the name on the certificate, the programme and course, the date it
            was issued, and whether it is still valid. Nothing else about you is shown.
          </Paragraph>

          <SectionHeading id="retention">10. How long we keep it</SectionHeading>
          <Pairs rows={RETENTION} />
          <Paragraph>
            When a period ends, we delete the information or make it anonymous.
          </Paragraph>

          <SectionHeading id="security">11. How we protect it</SectionHeading>
          <List items={SECURITY} />
          <Paragraph>
            If a data breach ever puts your information at risk, we will tell the Data
            Protection Commission and the people affected, as the law requires.
          </Paragraph>

          <SectionHeading id="cookies">12. Cookies and storage on your device</SectionHeading>
          <Paragraph>
            This website uses no tracking, analytics or advertising cookies, and our fonts are
            served from our own site. We keep only these small items in your browser, and they
            are never used to follow you:
          </Paragraph>
          <Pairs rows={DEVICE_STORAGE} />
          <Paragraph>
            When you choose to sign in with Google, pick a file from Google Drive, or pay through
            Speso, those services may set their own cookies, under their own policies. If we
            ever add analytics or advertising tools, we will update this page and the cookie
            notice first.
          </Paragraph>

          <SectionHeading id="rights">13. Your rights</SectionHeading>
          <Paragraph>
            Under the Data Protection Act, 2012 (Act 843), you can:
          </Paragraph>
          <Pairs rows={RIGHTS} />
          <Paragraph>
            To use any of these rights, email <MailLink />. We may ask you to confirm who you
            are first, so we only ever give information to the right person. We will reply as
            soon as we can, and within the time the law allows.
          </Paragraph>

          <SectionHeading id="complaints">14. Complaints</SectionHeading>
          <Paragraph>
            If you are unhappy with how we have handled your information, please tell us first
            at <MailLink /> so we can put it right. You can also complain to the Data Protection
            Commission: email{" "}
            <a href="mailto:info@dataprotection.org.gh" className="font-semibold text-[var(--color-primary)] underline underline-offset-2">
              info@dataprotection.org.gh
            </a>{" "}
            or call 0302 222 929.
          </Paragraph>

          <SectionHeading id="changes">15. Changes to this policy</SectionHeading>
          <Paragraph>
            When we change how we handle information, we update this page and the date at the
            top. Important changes will also be announced on this website.
          </Paragraph>

          <SectionHeading id="contact">16. Contact us</SectionHeading>
          <Paragraph>
            Questions about this policy or your information: email <MailLink />, use our{" "}
            <Link to="/contact" className="font-semibold text-[var(--color-primary)] underline underline-offset-2">
              Contact page
            </Link>
            , or write to ERA AXIS Limited, HNO. A1205, Sekondi, Western Region, Ghana.
          </Paragraph>
        </div>
      </section>
    </>
  );
}
