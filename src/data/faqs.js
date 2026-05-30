export const faqGroups = [
  {
    id: "programmes",
    label: "Programmes",
    items: [
      {
        id: "faq-who-can-join",
        question: "Who can join ERA AXIS programmes?",
        answer:
          "ERA AXIS programmes are built for school learners, out-of-school youth, university students, graduates, working professionals, and institutions that want practical STEM or digital skills training.",
      },
      {
        id: "faq-programmes",
        question: "What programmes does ERA AXIS offer?",
        answer:
          "ERA AXIS offers School STEM programmes, Out-of-School Youth training, Online Learning, ERA Digital Skills, Student Chapter access, and practical learning around the ERA Dev Board.",
      },
      {
        id: "faq-practical",
        question: "Are the programmes practical?",
        answer:
          "Yes. ERA AXIS focuses on hands-on learning, real tools, learner-built projects, electronics, coding, AI tools, automation, and practical problem-solving.",
      },
      {
        id: "faq-beginners",
        question: "Can beginners join?",
        answer:
          "Yes. ERA AXIS programmes support beginners and help learners grow progressively from foundational understanding into confident practical project work.",
      },
    ],
  },
  {
    id: "enrolment-dues",
    label: "Enrolment & Dues",
    items: [
      {
        id: "faq-how-to-enrol",
        question: "How do I enrol in a programme?",
        answer:
          "Visit the Enrolment & Dues page, choose Programme Enrolment, select your programme, and complete the enrolment details. The ERA AXIS team will follow up with the next steps after confirmation.",
      },
      {
        id: "faq-full-programme-payment",
        question: "Can I pay for a full programme upfront?",
        answer:
          "Yes. Programme enrolment supports both monthly payment and full programme payment options. Final totals are shown clearly before checkout.",
      },
      {
        id: "faq-monthly-dues",
        question: "How do monthly dues work?",
        answer:
          "Monthly dues support active membership and community access. Members can pay dues through the Enrolment & Dues page based on the dues option that fits their membership status.",
      },
      {
        id: "faq-receipt",
        question: "Will I receive a receipt?",
        answer:
          "Yes. Receipts and confirmation details are shared using the contact information provided during enrolment or dues payment.",
      },
      {
        id: "faq-after-payment",
        question: "What happens after I complete payment?",
        answer:
          "After payment confirmation, the ERA AXIS team follows up using the contact details provided and shares the next steps for enrolment, access, or support.",
      },
    ],
  },
  {
    id: "schools-partners",
    label: "Schools & Partners",
    items: [
      {
        id: "faq-group-enrolment",
        question: "Can schools or organisations enrol a group?",
        answer:
          "Yes. Schools, NGOs, CSR partners, and community organisations should contact ERA AXIS for group support, custom arrangements, and institutional guidance.",
      },
      {
        id: "faq-partners",
        question: "Can ERA AXIS work with sponsors or NGOs?",
        answer:
          "Yes. ERA AXIS works with schools, institutions, NGOs, CSR teams, and sponsors interested in practical STEM education, youth skills, and innovation programmes.",
      },
      {
        id: "faq-group-payments",
        question: "How do institutional or group payments work?",
        answer:
          "Institutional and group arrangements are handled directly with the ERA AXIS team so schools, partners, or sponsors can receive the right structure, payment guidance, and onboarding support.",
      },
    ],
  },
  {
    id: "practical-learning",
    label: "Practical Learning & Outcomes",
    items: [
      {
        id: "faq-dev-board",
        question: "What is the ERA Dev Board?",
        answer:
          "The ERA Dev Board is ERA AXIS's practical learning platform for electronics, sensors, automation, and embedded systems. It helps learners build understanding through hands-on exploration and project work.",
      },
      {
        id: "faq-real-projects",
        question: "Do learners build real projects?",
        answer:
          "Yes. Learners combine practical STEM and digital skills to build projects they can test, explain, improve, and present.",
      },
      {
        id: "faq-certificates",
        question: "Will learners receive certificates or confirmation?",
        answer:
          "Yes. ERA AXIS can provide programme confirmation or completion recognition for learners based on the programme pathway and participation requirements.",
      },
      {
        id: "faq-location",
        question: "Where is ERA AXIS located?",
        answer:
          "ERA AXIS is based in Essikado, Ghana, and supports learners, institutions, and partners through in-person and online learning pathways.",
      },
    ],
  },
];

export const generalFaqs = faqGroups.flatMap((group) => group.items);
