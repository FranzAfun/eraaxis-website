export const SITE_NAME = "ERA AXIS";
export const DEFAULT_TITLE =
  "ERA AXIS | Practical STEM and Digital Skills Education in Ghana";
export const DEFAULT_DESCRIPTION =
  "ERA AXIS is Ghana's practical STEM innovation platform helping students, out-of-school youth, parents, professionals, and business owners gain real technology skills through hands-on learning.";
export const DEFAULT_IMAGE = "/og-image.webp";

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
    title: "Programmes | ERA AXIS Practical Learning Pathways",
    description:
      "Explore ERA AXIS programmes in school STEM, out-of-school youth training, online learning, and digital skills built around hands-on outcomes.",
  },
  "/programs/school-stem": {
    pathname: "/programs/school-stem",
    title: "School STEM Programmes | ERA AXIS",
    description:
      "Hands-on STEM learning for Basic 1 to SHS 3 with electronics, coding, sensors, automation, and project-based classroom experiences.",
  },
  "/programs/out-of-school-youth": {
    pathname: "/programs/out-of-school-youth",
    title: "Out-of-School Youth Programme | ERA AXIS",
    description:
      "Practical innovation training for young people aged 16 to 30 to build employable skills, real projects, and community-focused solutions.",
  },
  "/programs/online-learning": {
    pathname: "/programs/online-learning",
    title: "Online Learning Programme | ERA AXIS",
    description:
      "Flexible online training in programming, AI, electronics, PCB design, simulation tools, and automation for practical learners.",
  },
  "/programs/era-digital-skills": {
    pathname: "/programs/era-digital-skills",
    title: "ERA Digital Skills | ERA AXIS",
    description:
      "Practical AI, spreadsheet, automation, and digital productivity training for working adults, professionals, and business owners.",
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
      "Start programme enrolment, pay dues, join the Student Chapter, or request institutional support through ERA AXIS enrolment and dues options.",
  },
  "/payments/programme-enrolment": {
    pathname: "/payments/programme-enrolment",
    title: "Programme Enrolment | ERA AXIS",
    description:
      "Choose your ERA AXIS programme, select monthly or full payment, and complete the details needed for enrolment before checkout.",
  },
  "/payments/student-chapter": {
    pathname: "/payments/student-chapter",
    title: "Student Chapter Enrolment | ERA AXIS",
    description:
      "Join the ERA AXIS Student Chapter and complete your first payment for community access, monthly sessions, and collaborative projects.",
  },
  "/payments/monthly-dues": {
    pathname: "/payments/monthly-dues",
    title: "Monthly Dues | ERA AXIS",
    description:
      "Pay monthly ERA AXIS dues, manage your dues period, and continue with a secure member payment experience.",
  },
};

export function getPageSeo(pathname) {
  return pageSeo[pathname] || null;
}
