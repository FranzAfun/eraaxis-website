import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleSlash,
  Copy,
  RefreshCw,
  RotateCcw,
  SearchX,
  WifiOff,
} from "lucide-react";
import SEO from "../components/SEO";
import { API_ERROR_MESSAGES, toUserMessage } from "../services/api";
import { CERTIFICATE_STATUS, verifyCertificate } from "../services/certificateService";

const panel =
  "mx-auto max-w-xl rounded-[var(--radius-md)] border border-white/15 bg-white/[0.06] p-6 text-left backdrop-blur-xl sm:p-8";
const primaryAction =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90";
const secondaryAction =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]";

// Each status is a different answer to "can I rely on this?", so each gets its
// own heading and explanation rather than a shared "verified" badge with a
// qualifier bolted on.
const STATUS_PRESENTATION = {
  [CERTIFICATE_STATUS.ISSUED]: {
    icon: BadgeCheck,
    label: "Verified",
    tone: "text-[var(--color-accent)]",
    heading: "Certificate verified",
    body: "ERA AXIS issued this certificate and it remains valid.",
    // Only the valid state asks the visitor to compare: for a revoked or
    // superseded award, matching details is not the point being made.
    note: "Check that these details match the certificate you were shown.",
  },
  [CERTIFICATE_STATUS.REVOKED]: {
    icon: CircleSlash,
    label: "Revoked",
    tone: "text-red-300",
    heading: "This certificate has been revoked.",
    body: "ERA AXIS issued this certificate but has since withdrawn it. It should not be relied on. Please contact us if you need to know more.",
  },
  [CERTIFICATE_STATUS.SUPERSEDED]: {
    icon: RotateCcw,
    label: "Superseded",
    tone: "text-amber-300",
    heading: "This certificate has been replaced.",
    body: "ERA AXIS issued this certificate and later replaced it with a corrected version. Ask the holder for their current certificate.",
  },
};

// `stacked` keeps the label above the value at every width. The two-column
// layout leaves the value about 330px, which a 32-character ID plus its copy
// button cannot share without wrapping awkwardly.
function DetailRow({ label, value, valueClassName = "break-words", stacked = false, children }) {
  if (!value && !children) return null;
  return (
    <div className={`border-t border-white/10 py-3 first:border-t-0 first:pt-0 ${stacked ? "" : "sm:flex sm:gap-6"}`}>
      <dt className="text-xs font-semibold uppercase tracking-widest text-white/45 sm:w-40 sm:shrink-0">
        {label}
      </dt>
      <dd className={`mt-1 min-w-0 text-base text-white ${stacked ? "" : "sm:mt-0"} ${valueClassName}`}>
        {children || value}
      </dd>
    </div>
  );
}

// navigator.clipboard is undefined outside a secure context, which includes the
// plain-HTTP LAN address used for local phone testing, so fall back to a
// throwaway textarea rather than leaving the button silently dead there.
function copyTextToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value).then(() => true, () => legacyCopy(value));
  }
  return Promise.resolve(legacyCopy(value));
}

function legacyCopy(value) {
  try {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(field);
    return copied;
  } catch {
    return false;
  }
}

function formatIssueDate(value) {
  // The API sends a plain YYYY-MM-DD with no timezone. Parsing it as UTC and
  // formatting in UTC keeps the printed date identical to the certificate for
  // a visitor in any timezone, instead of slipping a day west of Greenwich.
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value || "";
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const LOADING = Object.freeze({ state: "loading", certificate: null, error: "" });

export default function CertificateVerify() {
  const { publicId } = useParams();
  const [attempt, setAttempt] = useState(0);
  // The resolved answer is stamped with the ID it belongs to, so a late reply
  // for a previous certificate can never be shown against the current one.
  const [result, setResult] = useState({ id: publicId, ...LOADING });

  useEffect(() => {
    let active = true;

    verifyCertificate(publicId)
      .then((certificate) => {
        if (!active) return;
        setResult({
          id: publicId,
          state: certificate ? "found" : "not-found",
          certificate,
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;
        setResult({
          id: publicId,
          state: "error",
          certificate: null,
          error: toUserMessage(error, API_ERROR_MESSAGES.server),
        });
      });

    return () => {
      active = false;
    };
  }, [publicId, attempt]);

  const retry = useCallback(() => {
    setResult({ id: publicId, ...LOADING });
    setAttempt((current) => current + 1);
  }, [publicId]);

  const [copied, setCopied] = useState(false);
  const copyResetTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyResetTimer.current), []);

  const copyCertificateId = useCallback(() => {
    copyTextToClipboard(publicId).then((ok) => {
      if (!ok) return;
      setCopied(true);
      clearTimeout(copyResetTimer.current);
      copyResetTimer.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [publicId]);

  // Navigating straight from one certificate to another keeps the component
  // mounted, so derive the loading view rather than showing the old answer.
  const { state, certificate, error: errorMessage } =
    result.id === publicId ? result : LOADING;

  const presentation = certificate ? STATUS_PRESENTATION[certificate.status] : null;
  const StatusIcon = presentation?.icon;

  return (
    <>
      <SEO
        title="Verify a certificate — ERA AXIS"
        description="Check whether a certificate was issued by ERA AXIS."
        noindex
      />
      <section className="relative -mt-20 min-h-[60vh] overflow-hidden bg-[var(--color-background-dark)] pb-20 pt-40 text-white md:pb-28 md:pt-52">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, transparent 30%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div className="container relative z-10">
          <div aria-live="polite" aria-busy={state === "loading"}>
            {state === "loading" && (
              <p className="text-center text-base text-white/60">Checking this certificate…</p>
            )}

            {state === "found" && presentation && (
              <div className={panel}>
                <p
                  className={`mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest backdrop-blur-xl ${presentation.tone}`}
                >
                  {StatusIcon && <StatusIcon aria-hidden="true" size={14} />}
                  {presentation.label}
                </p>
                <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                  {presentation.heading}
                </h1>

                {/* The recipient is the answer the visitor came for, so it leads
                    rather than sitting as one row among the details below. */}
                <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
                  Awarded to
                </p>
                <p className="mt-1 mb-5 break-words text-2xl font-bold leading-snug text-white sm:text-3xl">
                  {certificate.issuedName}
                </p>

                <div className="mb-8 space-y-2 text-base leading-relaxed text-white/68">
                  <p>{presentation.body}</p>
                  {presentation.note && <p>{presentation.note}</p>}
                </div>

                <dl className="mb-8">
                  <DetailRow label="Programme" value={certificate.programme} />
                  <DetailRow label="Course" value={certificate.track} />
                  <DetailRow label="Issued on" value={formatIssueDate(certificate.issueDate)} />
                  <DetailRow label="Issued by" value={certificate.issuer} />
                  <DetailRow label="Certificate ID" stacked>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      {/* break-all so a 32-character ID wraps inside a narrow phone
                          column instead of forcing the card to scroll sideways. */}
                      <span className="min-w-0 break-all font-mono text-sm">
                        {certificate.publicId}
                      </span>
                      <button
                        type="button"
                        onClick={copyCertificateId}
                        aria-label={`Copy certificate ID ${certificate.publicId}`}
                        className="inline-flex min-h-[32px] shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-3 text-xs font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[var(--color-primary)]"
                      >
                        {copied ? <Check aria-hidden="true" size={14} /> : <Copy aria-hidden="true" size={14} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <span aria-live="polite" className="sr-only">
                        {copied ? "Certificate ID copied to clipboard" : ""}
                      </span>
                    </span>
                  </DetailRow>
                </dl>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/" className={primaryAction}>
                    Back to Home <ArrowRight size={16} />
                  </Link>
                  <Link to="/contact" className={secondaryAction}>
                    Contact ERA AXIS <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {state === "not-found" && (
              <div className={panel}>
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 backdrop-blur-xl">
                  <SearchX aria-hidden="true" size={14} />
                  Not found
                </p>
                <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                  We couldn&apos;t find that certificate.
                </h1>
                {/* Deliberately does not claim the certificate is fake: a mistyped
                    or truncated ID reaches this same state. */}
                <p className="mb-8 text-base leading-relaxed text-white/68">
                  No ERA AXIS certificate matches this link. Check that the full
                  certificate ID was entered exactly as it appears, or scan the QR
                  code on the certificate again. If it still doesn&apos;t match,
                  please contact us.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/contact" className={primaryAction}>
                    Contact ERA AXIS <ArrowRight size={16} />
                  </Link>
                  <Link to="/" className={secondaryAction}>
                    Back to Home <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {state === "error" && (
              <div className={panel}>
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 backdrop-blur-xl">
                  <WifiOff aria-hidden="true" size={14} />
                  Unavailable
                </p>
                <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                  We couldn&apos;t check this certificate.
                </h1>
                {/* An outage must never be presented as an invalid certificate. */}
                <p className="mb-8 text-base leading-relaxed text-white/68">
                  {errorMessage} This does not mean the certificate is invalid — we
                  simply could not reach our records just now.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={retry} className={primaryAction}>
                    <RefreshCw aria-hidden="true" size={16} /> Try again
                  </button>
                  <Link to="/contact" className={secondaryAction}>
                    Contact ERA AXIS <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
