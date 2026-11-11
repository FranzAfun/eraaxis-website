export const SITE_NAME = "ERA AXIS";
export const DEFAULT_TITLE =
  "ERA AXIS | Practical STEM and Digital Skills Education in Ghana";
export const DEFAULT_DESCRIPTION =
  "ERA AXIS is Ghana's practical STEM innovation platform helping students, out-of-school youth, parents, professionals, and business owners gain real technology skills through hands-on learning.";
// Share images stay JPEG: LinkedIn and some other apps show no preview for WebP.
export const DEFAULT_IMAGE = "/og-card-2026.jpg";
export const DEFAULT_IMAGE_ALT =
  "The ERA AXIS E mark beside the words ERA AXIS, Practical STEM and Digital Skills, eraaxis.com, on a purple circuit-board background";

// A page's own link preview: a 1200 x 630 JPEG in public/share (made from the
// page's photo), so a shared programme shows that programme.
const share = (file, alt) => ({ image: `/share/${file}`, imageAlt: alt });

export function getSiteUrl() {
  const configuredUrl = String(import.meta.env.VITE_SITE_URL || "").trim();

  if (!configuredUrl) {
    return "https://eraaxis.com";
  }

  return configuredUrl.replace(/\/+$/, "");
}

export function buildCanonicalUrl(pathname = "/") {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export const pageSeo = {
  "/": {
    pathname: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  "/about": {
    pathname: "/about",
    title: "About ERA AXIS | Practical STEM and Digital Skills Learning in Ghana",
    description:
      "Learn about ERA AXIS, Ghana's practical STEM innovation platform helping learners, youth, professionals, schools, and partners build real technology skills.",
  },
  "/programs": {
    pathname: "/programs",
    ...share("programmes.jpg", "ERA AXIS learners at work in a practical programme session"),
    title: "Programmes | ERA AXIS Practical Learning Pathways",
    description:
      "Explore ERA AXIS programmes and pricing: School Partnerships for school STEM, Out-of-School Youth training, and ERA Digital Skills, coming soon.",
  },
  "/programs/school-stem": {
    pathname: "/programs/school-stem",
    ...share("school-stem.jpg", "School learners holding up the circuits they built in an ERA AXIS STEM class"),
    title: "School STEM Programmes | ERA AXIS",
    description:
      "Hands-on STEM learning for Basic 1 to SHS 3 with electronics, coding, sensors, automation, and project-based classroom experiences.",
  },
  "/programs/out-of-school-youth": {
    pathname: "/programs/out-of-school-youth",
    ...share("out-of-school-youth.jpg", "A young person building an electronics project in the ERA AXIS Out-of-School Youth programme"),
    title: "Out-of-School Youth Programme | ERA AXIS",
    description:
      "Practical innovation training for young people aged 16 to 30 to build employable skills, real projects, and community-focused solutions.",
  },
  "/programs/era-digital-skills": {
    pathname: "/programs/era-digital-skills",
    ...share("era-digital-skills.jpg", "Professionals working with digital tools in ERA Digital Skills"),
    title: "ERA Digital Skills | ERA AXIS",
    description:
      "ERA Digital Skills is coming soon: practical AI, spreadsheet, automation, and digital productivity training for working adults, professionals, and business owners.",
  },
  "/dev-board": {
    pathname: "/dev-board",
    title: "ERA Dev Board | Hands-On Electronics Learning Kit",
    description:
      "Discover the ERA Dev Board, a practical electronics learning kit that helps learners understand circuits, components, and real builds by doing.",
  },
  "/partners": {
    pathname: "/partners",
    title: "Partners | ERA AXIS",
    description:
      "See how ERA AXIS works with schools, institutions, NGOs, CSR teams, and ecosystem partners to expand practical STEM and digital skills learning.",
  },
  "/insights": {
    pathname: "/insights",
    title: "Insights | ERA AXIS",
    description:
      "Read ERA AXIS perspectives on STEM education, digital skills, learner outcomes, programme stories, and practical learning in action.",
  },
  "/gallery": {
    pathname: "/gallery",
    title: "Gallery | ERA AXIS",
    description:
      "Explore moments from ERA AXIS workshops, learner projects, STEM sessions, Dev Board activities, and community innovation programmes.",
  },
  "/faq": {
    pathname: "/faq",
    title: "FAQ | ERA AXIS",
    description:
      "Find answers about ERA AXIS programmes, enrolment, dues, partnerships, practical learning, and learner support.",
  },
  "/contact": {
    pathname: "/contact",
    title: "Contact ERA AXIS",
    description:
      "Contact ERA AXIS about programmes, school partnerships, sponsorships, media enquiries, and practical STEM or digital skills learning.",
  },
  "/payments": {
    pathname: "/payments",
    title: "Enrolment & Dues | ERA AXIS",
    description:
      "Start programme enrolment, pay dues, join the Campus Chapter, or request institutional support through ERA AXIS enrolment and dues options.",
  },
  "/payments/programme-enrolment": {
    pathname: "/payments/programme-enrolment",
    title: "Programme Enrolment | ERA AXIS",
    description:
      "Enrol in an ERA AXIS programme, select monthly or full payment, and complete the details needed for enrolment before checkout.",
  },
  "/payments/campus-chapter": {
    pathname: "/payments/campus-chapter",
    ...share("campus-chapter.jpg", "ERA AXIS Campus Chapter members, the Purple Innovators, building an electronics project together"),
    title: "ERA AXIS Campus Chapters | GHS 200 for 12 months",
    description:
      "Learn by building with ERA AXIS Campus Chapters. GHS 200 covers 12 months of practical sessions, projects and support. Completion credentials are earned.",
  },
  "/payments/monthly-dues": {
    pathname: "/payments/monthly-dues",
    title: "Monthly Dues | ERA AXIS",
    description:
      "Pay monthly ERA AXIS dues, manage your dues period, and continue with a secure member payment experience.",
  },
  "/payments/confirmation": {
    pathname: "/payments/confirmation",
    title: "Payment Confirmation | ERA AXIS",
    description:
      "Confirm your ERA AXIS payment status and view your receipt summary.",
  },
  "/payments/resume": {
    pathname: "/payments/resume",
    title: "Continue Your Payment | ERA AXIS",
    description:
      "Continue your ERA AXIS programme instalment payment securely via Speso.",
  },
  "/privacy": {
    pathname: "/privacy",
    title: "Privacy & Cookie Policy | ERA AXIS",
    description:
      "How ERA AXIS Limited, registered with Ghana's Data Protection Commission, collects, uses, shares and protects your information, and your rights.",
  },
};

export function getPageSeo(pathname) {
  return pageSeo[pathname] || null;
}
