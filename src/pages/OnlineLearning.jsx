import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Wrench,
  FolderOpen,
  Monitor,
  Cpu,
  Brain,
  Zap,
  Layers,
  Eye,
  Cog,
  Target,
  Search,
  Hammer,
  TrendingUp,
} from "lucide-react";

import onlineLearningImg from "../assets/images/programmes/online-learning.webp";
import ScrollScenes from "../components/motion/ScrollScenes";
import StepLine from "../components/programme/StepLine";
import TrackPicker from "../components/programme/TrackPicker";
import { ProgrammeClose, ProgrammeHero, ReasonLines } from "../components/programme/ProgrammeParts";
import { closePrimaryClass, closeSecondaryClass, heroPrimaryClass, heroSecondaryClass } from "../components/programme/programmeClasses";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";

const enrol = {
  to: "/payments/programme-enrolment",
  state: {
    programmeSlug: "online-learning",
    returnTo: "/programs/online-learning",
    returnLabel: "Back to Online Learning",
  },
  label: "Start Enrolment",
};

// `taste` is a glimpse of the first lesson, shown on the lesson screen.
const tracks = [
  { key: "python", label: "Python", Icon: Cpu, line: "Write, run and debug real scripts.", taste: 'print("Hello, ERA")', tags: ["Logic", "Data handling", "Automation"] },
  { key: "ai", label: "AI tools", Icon: Brain, line: "Use AI tools well, from prompts to simple workflows.", taste: "Summarise this report in three points.", tags: ["Prompting", "Automation", "AI workflows"] },
  { key: "electronics", label: "Electronics", Icon: Zap, line: "Circuits and components, with real hardware.", taste: "6 V → 330 Ω → LED → GND", tags: ["Circuits", "Components", "Guided builds"] },
  { key: "pcb", label: "PCB design", Icon: Layers, line: "Design a circuit board, from schematic to layout.", taste: "Schematic → Layout → Board", tags: ["Schematics", "Layout", "Design software"] },
  { key: "simulation", label: "Simulation", Icon: Eye, line: "Test circuits on screen before you build them.", taste: "Run: LED current = 12 mA", tags: ["Circuit models", "Systems", "Testing"] },
  { key: "automation", label: "Automation", Icon: Cog, line: "Scripts and simple controls that do the work for you.", taste: "if soil_is_dry: pump.on()", tags: ["Workflows", "Scripts", "Control systems"] },
];

const steps = [
  { heading: "Choose a track", line: "Start from your level and where you want to get to.", Icon: Target },
  { heading: "Follow guided lessons", line: "Learn a concept, then practise it straight away.", Icon: Search },
  { heading: "Build and test", line: "Code, circuits, simulations or designs that really work.", Icon: Hammer },
  { heading: "Review and improve", line: "Come back to your work and make it stronger.", Icon: TrendingUp },
];

const gains = [
  { Icon: CheckCircle, title: "Fits your week", line: "Learn around work, school or other commitments." },
  { Icon: Wrench, title: "Hands-on confidence", line: "Guided exercises and real builds, not just videos." },
  { Icon: FolderOpen, title: "A growing portfolio", line: "Every track leaves you with work you can show." },
  { Icon: Monitor, title: "Modern tools", line: "The programming, AI, design and simulation tools used at work." },
];

export default function OnlineLearning() {
  return (
    <ScrollScenes>
      <SEO {...getPageSeo("/programs/online-learning")} />
      <ProgrammeHero
        eyebrow="Online Learning"
        title="Learn technology around your life."
        line="Guided online lessons and real projects in code, AI and electronics."
        glance={["Students", "Graduates", "Working professionals", "Your own pace"]}
        image={onlineLearningImg}
        imageAlt="A learner wiring a circuit beside a laptop"
        badge="Online, guided"
        actions={
          <>
            <Link to={enrol.to} state={enrol.state} className={heroPrimaryClass}>
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

      <TrackPicker eyebrow="Six tracks" title="Pick a track. See where it starts." tracks={tracks} enrol={enrol} />

      <StepLine eyebrow="How it works" title="Four steps to a finished project." steps={steps} />

      <ReasonLines eyebrow="What you gain" title="Online, and still hands-on." items={gains} />

      <ProgrammeClose
        title="Online, but never alone."
        line="Guided tasks, real projects and support when you need it."
        actions={
          <>
            <Link to={enrol.to} state={enrol.state} className={closePrimaryClass}>
              Start Enrolment
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/contact#enquiry" className={closeSecondaryClass}>
              Ask a Question
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </>
        }
      />
    </ScrollScenes>
  );
}
