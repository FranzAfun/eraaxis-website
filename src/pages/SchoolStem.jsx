import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Bell,
  Droplets,
  Lightbulb,
  Cog,
  Cpu,
  Target,
  Eye,
  Trophy,
  TrendingUp,
  Search,
  Hammer,
  Layers,
  Rocket,
} from "lucide-react";

import ScrollScenes from "../components/motion/ScrollScenes";
import StageJourney from "../components/programme/StageJourney";
import { BuildTiles, DevBoardStrip, ProgrammeClose, ProgrammeHero, ReasonLines } from "../components/programme/ProgrammeParts";
import { closePrimaryClass, closeSecondaryClass, heroPrimaryClass, heroSecondaryClass } from "../components/programme/programmeClasses";
import SEO from "../components/SEO";
import { PROGRAMME_IMAGES } from "../data/programmeImages";
import { getPageSeo } from "../data/seo";

const enrolState = {
  programmeSlug: "junior-stem",
  returnTo: "/programs/school-stem",
  returnLabel: "Back to School STEM",
};

const stages = [
  { label: "Discover", heading: "Curiosity first.", line: "Safe experiments with circuits, switches and cause and effect.", tag: "Basic 1 – Basic 3", Icon: Search },
  { label: "Build", heading: "Start making things.", line: "Components, sensors and their first working projects.", tag: "Basic 4 – JHS 1", Icon: Hammer },
  { label: "Connect", heading: "Understand the system.", line: "Automation, data and programming microcontrollers.", tag: "JHS 2 – SHS 1", Icon: Layers },
  { label: "Create", heading: "Build real solutions.", line: "Design, build and present working prototypes.", tag: "SHS 2 – SHS 3", Icon: Rocket },
];

const builds = [
  { Icon: Zap, title: "Circuits and lights" },
  { Icon: Bell, title: "Sensor alarms" },
  { Icon: Droplets, title: "Automatic watering" },
  { Icon: Lightbulb, title: "Smart classroom models" },
  { Icon: Cog, title: "Robots that move" },
  { Icon: Cpu, title: "Controls on the ERA Dev Board" },
];

const reasons = [
  { Icon: Target, title: "Fits your curriculum", line: "Works alongside science, maths and ICT, not instead of them." },
  { Icon: Eye, title: "STEM they can see", line: "Learners build things that work, not just read about them." },
  { Icon: Trophy, title: "Confidence that lasts", line: "A project they built themselves changes what they think they can do." },
  { Icon: TrendingUp, title: "Grows every year", line: "Each level builds on the last, from Basic 1 to SHS 3." },
];

export default function SchoolStem() {
  return (
    <ScrollScenes>
      <SEO {...getPageSeo("/programs/school-stem")} />
      <ProgrammeHero
        eyebrow="School STEM"
        title={<>Hands-on STEM from Basic&nbsp;1 to SHS&nbsp;3.</>}
        line="Electronics, coding, sensors and automation, learned by building in class."
        glance={["In-school sessions", "Project-based", "ERA Dev Board"]}
        image={PROGRAMME_IMAGES.school_stem.src}
        imageSrcSet={PROGRAMME_IMAGES.school_stem.srcSet}
        imageAlt="Students engaged in a hands-on school STEM class"
        badge="Basic 1 – SHS 3"
        actions={
          <>
            <Link to="/payments/programme-enrolment" state={enrolState} className={heroPrimaryClass}>
              Start Learner Enrolment
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link to="/contact#enquiry" state={{ inquiryType: "School or Institutional Partnership" }} className={heroSecondaryClass}>
              Discuss School Partnership
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </>
        }
      />

      <StageJourney eyebrow="The journey" title="Four stages. Thirteen year levels." stages={stages} />

      <BuildTiles eyebrow="What they build" title="Projects that switch on." items={builds} />

      <ReasonLines eyebrow="For schools" title="Why schools choose it." items={reasons} />

      <DevBoardStrip line="A real board for circuits, sensors and code, years before university." />

      <ProgrammeClose
        title="Bring practical STEM into your school."
        actions={
          <>
            <Link to="/payments/programme-enrolment" state={enrolState} className={closePrimaryClass}>
              Start Learner Enrolment
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/contact#enquiry" state={{ inquiryType: "School or Institutional Partnership" }} className={closeSecondaryClass}>
              Discuss School Partnership
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </>
        }
      />
    </ScrollScenes>
  );
}
