import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  FolderOpen,
  TrendingUp,
  Zap,
  Monitor,
  Cog,
  Lightbulb,
  Eye,
  Target,
} from "lucide-react";

import ScrollScenes from "../components/motion/ScrollScenes";
import MonthStory from "../components/programme/MonthStory";
import ToolBox from "../components/programme/ToolBox";
import { ProgrammeClose, ProgrammeHero, ReasonLines } from "../components/programme/ProgrammeParts";
import { closePrimaryClass, closeSecondaryClass, heroPrimaryClass, heroSecondaryClass } from "../components/programme/programmeClasses";
import SEO from "../components/SEO";
import { PROGRAMME_IMAGES } from "../data/programmeImages";
import { getPageSeo } from "../data/seo";
import { calculateFullProgrammeBase, getPaymentItemBySlug } from "../data/payments";

const enrolState = {
  programmeSlug: "era-digital-skills",
  returnTo: "/programs/era-digital-skills",
  returnLabel: "Back to ERA Digital Skills",
};

// The price comes from the payments list, so the page and checkout agree.
const fee = getPaymentItemBySlug("era-digital-skills");
const ghs = (amount) => `GHS ${Number(amount).toLocaleString("en-US")}`;
const monthly = ghs(fee.monthlyAmount);
const inFull = ghs(calculateFullProgrammeBase(fee.monthlyAmount, fee.fullPaymentMonths));

const months = [
  {
    Icon: Monitor,
    title: "Computer confidence and digital foundations",
    focus: ["Google Workspace", "Excel fundamentals", "File and folder organisation", "Digital admin and communication", "Online payments", "Practical digital workflows"],
  },
  {
    Icon: Brain,
    title: "AI tools for work and business",
    focus: ["AI writing and research", "AI for planning and content", "Canva AI for design", "Notion AI for organisation", "Responsible AI use", "Summarising data"],
  },
  {
    Icon: Cog,
    title: "Automation and your own work system",
    focus: ["Automation workflow tools", "Connecting apps", "Dashboards and simple reports", "A system for your own work", "Capstone in your own context"],
  },
];

const tools = [
  { Icon: Lightbulb, title: "AI writing and research", line: "Draft, edit, research and plan faster with AI help." },
  { Icon: TrendingUp, title: "Spreadsheets and reporting", line: "Structured data, formulas, summaries and simple reports.", names: ["Excel", "Google Sheets"] },
  { Icon: Monitor, title: "Digital workspace", line: "Documents, tasks and team communication in one place.", names: ["Google Workspace", "Notion"] },
  { Icon: Eye, title: "Design and content", line: "Professional documents, slides and social posts, no design training needed.", names: ["Canva"] },
  { Icon: Zap, title: "Automation workflows", line: "No-code tools that connect apps and take over repetitive tasks." },
  { Icon: Target, title: "Dashboards and simple systems", line: "A clearer picture of your work, business data or team." },
];

const gains = [
  { Icon: Brain, title: "Practical AI confidence", line: "Use AI on purpose for real tasks, knowing what it can and cannot do." },
  { Icon: FolderOpen, title: "Organised digital work", line: "Files, messages and workflows that save you real time." },
  { Icon: TrendingUp, title: "Spreadsheets that report", line: "From data entry to reports and simple dashboards." },
  { Icon: Zap, title: "An automation mindset", line: "Spot repetitive work and connect tools to cut it, without code." },
];

export default function EraDigitalSkills() {
  return (
    <ScrollScenes>
      <SEO {...getPageSeo("/programs/era-digital-skills")} />
      <ProgrammeHero
        eyebrow="ERA Digital Skills"
        title="AI and digital skills for real work."
        line="Three months online: AI tools, spreadsheets and automation, built around your own job or business."
        glance={["3 months, online", `${monthly} a month`, `${inFull} in full`]}
        image={PROGRAMME_IMAGES.digital_skills.src}
        imageSrcSet={PROGRAMME_IMAGES.digital_skills.srcSet}
        imageAlt="Professional using digital productivity and AI tools"
        badge="Working adults & professionals"
        actions={
          <>
            <Link to="/payments/programme-enrolment" state={enrolState} className={heroPrimaryClass}>
              Start Enrolment
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link to="/contact#enquiry" className={heroSecondaryClass}>
              Ask About the Programme
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </>
        }
      />

      <MonthStory eyebrow="Month by month" title="Three months. Three focused areas." months={months} />

      <ToolBox eyebrow="Your toolkit" title="The tools you will work with." tools={tools} />

      <ReasonLines eyebrow="What you gain" title="Skills you use the next morning." items={gains} />

      <ProgrammeClose
        title="Build a system for your own work."
        line="Your capstone is a workflow, dashboard or automation for your own job or business."
        actions={
          <>
            <Link to="/payments/programme-enrolment" state={enrolState} className={closePrimaryClass}>
              Start Enrolment
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/contact#enquiry" className={closeSecondaryClass}>
              Enrol a Team
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </>
        }
      />
    </ScrollScenes>
  );
}
