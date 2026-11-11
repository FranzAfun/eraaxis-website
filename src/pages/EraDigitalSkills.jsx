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
import JoinLink from "../components/programme/JoinLink";
import { ProgrammeClose, ProgrammeHero, ReasonLines } from "../components/programme/ProgrammeParts";
import StayConnected from "../components/programme/StayConnected";
import { closePrimaryClass, closeSecondaryClass, heroPrimaryClass, heroSecondaryClass } from "../components/programme/programmeClasses";
import SEO from "../components/SEO";
import { PROGRAMME_IMAGES } from "../data/programmeImages";
import { getPageSeo } from "../data/seo";
import { useProgrammeOffer } from "../hooks/useProgrammeCatalogue";

// Coming soon for now (Partnerships, Nov 2026): no price, no enrolment, and a
// "Stay connected" signup. EDOS opens it when it launches, with no release.
const enrol = {
  to: "/payments/programme-enrolment",
  state: { programmeSlug: "era-digital-skills", returnTo: "/programs/era-digital-skills", returnLabel: "Back to ERA Digital Skills" },
  label: "Enrol Now",
};
const question = { inquiryType: "Enrolment / Admissions" };


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
  const { mode, price } = useProgrammeOffer("digital_skills");
  const open = mode === "online";
  return (
    <ScrollScenes>
      <SEO {...getPageSeo("/programs/era-digital-skills")} />
      <ProgrammeHero
        eyebrow="ERA Digital Skills"
        title="AI and digital skills for real work."
        line="Three months online: AI tools, spreadsheets and automation, built around your own job or business."
        price={price}
        glance={["3 months, online"]}
        image={PROGRAMME_IMAGES.digital_skills.src}
        imageSrcSet={PROGRAMME_IMAGES.digital_skills.srcSet}
        imageAlt="Professional using digital productivity and AI tools"
        badge="Working adults & professionals"
        actions={
          <>
            <JoinLink mode={mode} enrol={enrol} enquiry={question} className={heroPrimaryClass} />
            <Link to="/contact#enquiry" state={question} className={heroSecondaryClass}>
              Ask About the Programme
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </>
        }
      />

      <MonthStory eyebrow="Month by month" title="Three months. Three focused areas." months={months} />

      <ToolBox eyebrow="Your toolkit" title="The tools you will work with." tools={tools} />

      <ReasonLines eyebrow="What you gain" title="Skills you use the next morning." items={gains} />

      {mode === "coming_soon" && (
        <StayConnected
          source="digital-skills"
          line="Exciting digital skills learning opportunities are on the way. Stay connected for updates."
        />
      )}

      <ProgrammeClose
        title="Build a system for your own work."
        line="Your capstone is a workflow, dashboard or automation for your own job or business."
        actions={
          <>
            <JoinLink mode={mode} enrol={enrol} enquiry={question} className={closePrimaryClass} iconSize={15} />
            {open ? (
              <Link to="/contact#enquiry" state={{ ...question, message: "We would like to enrol a team in ERA Digital Skills." }} className={closeSecondaryClass}>
                Enrol a Team
                <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            ) : (
              <Link to="/contact#enquiry" state={question} className={closeSecondaryClass}>
                Ask a Question
                <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            )}
          </>
        }
      />
    </ScrollScenes>
  );
}
