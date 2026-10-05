import { Link } from "react-router-dom";
import {
  ArrowRight,
  Wrench,
  Brain,
  FolderOpen,
  Briefcase,
  Zap,
  Radio,
  Sprout,
  ShieldAlert,
  Monitor,
  Users,
  GraduationCap,
  Search,
  Hammer,
  Layers,
  Presentation,
  CheckCircle,
} from "lucide-react";

import ScrollScenes from "../components/motion/ScrollScenes";
import FitCheck from "../components/programme/FitCheck";
import StackedStages from "../components/programme/StackedStages";
import { BuildTiles, PartnerStrip, ProgrammeClose, ProgrammeHero, ReasonLines } from "../components/programme/ProgrammeParts";
import { closePrimaryClass, closeSecondaryClass, heroPrimaryClass, heroSecondaryClass } from "../components/programme/programmeClasses";
import SEO from "../components/SEO";
import { PROGRAMME_IMAGES } from "../data/programmeImages";
import { getPageSeo } from "../data/seo";

const enrol = {
  to: "/payments/programme-enrolment",
  state: {
    programmeSlug: "out-of-school-youth",
    returnTo: "/programs/out-of-school-youth",
    returnLabel: "Back to Out-of-School Youth",
  },
  label: "Start Enrolment",
};

const fits = [
  { label: "I have finished or left school", Icon: GraduationCap },
  { label: "I am looking for work", Icon: Search },
  { label: "I like building things", Icon: Hammer },
  { label: "I want to help my community", Icon: Users },
];

const stages = [
  { label: "Orientation", heading: "Set the foundation.", line: "Tools, safety, and how to frame a real problem.", Icon: Search },
  { label: "Foundations", heading: "Learn the building blocks.", line: "Electronics, programming logic and digital tools, hands on.", Icon: Layers },
  { label: "Guided builds", heading: "Build with structure.", line: "Step-by-step projects with sensors, boards and code.", Icon: Hammer },
  { label: "Community project", heading: "Solve a real problem.", line: "Find a problem in your community and build a working answer.", Icon: Users },
  { label: "Demo and next steps", heading: "Present. Improve. Move on.", line: "Show your build, take feedback and plan what comes next.", Icon: Presentation },
];

const builds = [
  { Icon: Zap, title: "Simple automation" },
  { Icon: Radio, title: "Sensor monitoring" },
  { Icon: Sprout, title: "Smart farming demos" },
  { Icon: ShieldAlert, title: "Safety and alert systems" },
  { Icon: Monitor, title: "Digital productivity tools" },
  { Icon: CheckCircle, title: "Community prototypes" },
];

const gains = [
  { Icon: Wrench, title: "Technical confidence", line: "From no experience to building and explaining working systems." },
  { Icon: Brain, title: "Problem-solving", line: "Break a problem down, test it, improve it." },
  { Icon: FolderOpen, title: "A project to show", line: "A working build you can demonstrate, not just a certificate." },
  { Icon: Briefcase, title: "Ready for work", line: "Skills for a job, freelance work or your own venture." },
];

export default function OutOfSchoolYouth() {
  return (
    <ScrollScenes>
      <SEO {...getPageSeo("/programs/out-of-school-youth")} />
      <ProgrammeHero
        eyebrow="Out-of-School Youth"
        title="Practical tech skills for young people ready to build."
        line="Hands-on training, real tools and community projects. Start where you are."
        glance={["Ages 16 – 30", "3 – 6 months", "No experience needed"]}
        image={PROGRAMME_IMAGES.out_of_school_youth.src}
        imageSrcSet={PROGRAMME_IMAGES.out_of_school_youth.srcSet}
        imageAlt="Young people working together on a hands-on technology project"
        badge="Ages 16 – 30"
        actions={
          <>
            <Link to={enrol.to} state={enrol.state} className={heroPrimaryClass}>
              Start Enrolment
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link to="/contact#enquiry" state={{ inquiryType: "Enrolment / Admissions" }} className={heroSecondaryClass}>
              Ask About the Programme
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </>
        }
      />

      <FitCheck
        eyebrow="Is this for you?"
        title="Built for young people ready to start."
        items={fits}
        yes="Sounds like you. No experience needed to start."
        enrol={enrol}
      />

      <StackedStages eyebrow="The journey" title="Five stages, start to final build." stages={stages} />

      <BuildTiles eyebrow="What you work on" title="Projects with a purpose." items={builds} />

      <ReasonLines eyebrow="What you leave with" title="Skills you can show." items={gains} />

      <PartnerStrip title="Support young builders." line="Partner with ERA AXIS to train youth groups and communities." />

      <ProgrammeClose
        title="Ready to start building?"
        actions={
          <>
            <Link to={enrol.to} state={enrol.state} className={closePrimaryClass}>
              Start Enrolment
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/contact#enquiry" state={{ inquiryType: "Enrolment / Admissions" }} className={closeSecondaryClass}>
              Ask a Question
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </>
        }
      />
    </ScrollScenes>
  );
}
