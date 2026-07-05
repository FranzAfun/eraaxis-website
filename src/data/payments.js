export const PAYSTACK_FEE_RATE = 0.0195;
export const MAINTENANCE_FEE_GHS = 2;
export const PAYMENT_REFERENCE_FORMAT = "ERA-TYPE-YYYYMMDD-UNIQUEID";
export const PAYMENT_REFERENCE_NOTE =
  "A final payment reference will be provided when your checkout is started.";

export function formatGhs(amount) {
  return `GHS ${Number(amount).toFixed(2)}`;
}

export function calculateCustomerTotal(baseAmount) {
  const customerPays =
    (Number(baseAmount) + MAINTENANCE_FEE_GHS) / (1 - PAYSTACK_FEE_RATE);

  return Number(customerPays.toFixed(2));
}

export function calculatePaymentBreakdown(baseAmount) {
  const normalizedBaseAmount = Number(baseAmount);
  const subtotal = normalizedBaseAmount + MAINTENANCE_FEE_GHS;
  const customerTotal = calculateCustomerTotal(normalizedBaseAmount);
  const paystackFee = customerTotal - subtotal;

  return {
    baseAmount: Number(normalizedBaseAmount.toFixed(2)),
    maintenanceFee: Number(MAINTENANCE_FEE_GHS.toFixed(2)),
    paystackFee: Number(paystackFee.toFixed(2)),
    customerTotal,
  };
}

export function calculateFullProgrammeBase(monthlyAmount, months) {
  return Number((Number(monthlyAmount) * Number(months)).toFixed(2));
}

export function generateStaticReferencePreview(prefix) {
  return `${prefix}-YYYYMMDD-8B1F4F`;
}

export const PAYMENT_METHODS = [
  {
    id: "mobile_money",
    label: "Mobile Money",
    shortLabel: "MoMo",
    description: "Pay securely using supported mobile money wallets.",
  },
  {
    id: "card",
    label: "Card Payment",
    shortLabel: "Card",
    description: "Pay securely with a debit or credit card through Paystack.",
  },
  {
    id: "bank_or_contact",
    label: "Bank Transfer or Contact ERA AXIS",
    shortLabel: "Bank / Contact",
    description:
      "Contact ERA AXIS for bank transfer guidance, institutional payments, or payment support.",
  },
];

export const PAYMENT_CATEGORIES = [
  {
    slug: "programme-enrolment",
    title: "Programme Enrolment",
    description: "Choose monthly enrolment or full programme enrolment upfront.",
    route: "/payments/programme-enrolment",
    referencePrefix: "ERA-PROG",
    items: [
      {
        slug: "junior-stem",
        title: "Junior STEM",
        monthlyAmount: 200,
        fullPaymentMonths: 3,
        audience: "School learners",
        paymentModes: ["monthly", "full"],
      },
      {
        slug: "out-of-school-youth",
        title: "Out-of-School Youth",
        monthlyAmount: 400,
        fullPaymentMonths: 3,
        audience: "Youth aged 16-30",
        paymentModes: ["monthly", "full"],
      },
      {
        slug: "online-learning",
        title: "Online Learning",
        monthlyAmount: 400,
        fullPaymentMonths: 3,
        audience: "Remote learners",
        paymentModes: ["monthly", "full"],
      },
      {
        slug: "era-digital-skills",
        title: "ERA Digital Skills",
        monthlyAmount: 700,
        fullPaymentMonths: 3,
        audience: "Professionals and working adults",
        paymentModes: ["monthly", "full"],
      },
    ],
  },
  {
    slug: "monthly-dues",
    title: "Monthly Dues",
    description: "Pay monthly membership or chapter dues.",
    route: "/payments/monthly-dues",
    referencePrefix: "ERA-DUE",
    items: [
      {
        slug: "monthly-dues",
        title: "Monthly Dues",
        baseAmount: 15,
        breakdown: [
          {
            label: "Monthly dues",
            amount: 15,
          },
        ],
      },
    ],
  },
  {
    slug: "student-chapter",
    title: "Student Chapter",
    description: "First payment for Student Chapter access.",
    route: "/payments/student-chapter",
    referencePrefix: "ERA-SC",
    items: [
      {
        slug: "student-chapter-first-payment",
        title: "Student Chapter First Payment",
        baseAmount: 125,
        breakdown: [
          {
            label: "Chapter Fee",
            amount: 110,
          },
          {
            label: "First Month Dues",
            amount: 15,
          },
        ],
      },
    ],
  },
  {
    slug: "institutional-group",
    title: "Institutional / Group Enrolment",
    description:
      "For schools, communities, NGOs, CSR sponsors, and partners supporting multiple learners.",
    route: "/contact#enquiry",
    referencePrefix: "ERA-INST",
    isContactOnly: true,
    ctaLabel: "Request a Custom Quote",
    items: [],
  },
];

export const PAYMENT_ITEMS_BY_SLUG = PAYMENT_CATEGORIES.reduce(
  (itemsBySlug, category) => {
    category.items.forEach((item) => {
      itemsBySlug[item.slug] = {
        ...item,
        categorySlug: category.slug,
        categoryTitle: category.title,
        referencePrefix: category.referencePrefix,
      };
    });

    return itemsBySlug;
  },
  {}
);

export function getPaymentCategoryBySlug(slug) {
  return PAYMENT_CATEGORIES.find((category) => category.slug === slug) || null;
}

export function getPaymentItemBySlug(slug) {
  return PAYMENT_ITEMS_BY_SLUG[slug] || null;
}
