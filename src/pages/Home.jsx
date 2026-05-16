import Hero from "../components/home/Hero";
import ProgrammesOverview from "../components/home/ProgrammesOverview";
import PartnersStrip from "../components/home/PartnersStrip";
import DevBoardFeature from "../components/home/DevBoardFeature";
import ImpactMetrics from "../components/home/ImpactMetrics";
import ImpactStories from "../components/home/ImpactStories";
import InsightsPreview from "../components/home/InsightsPreview";
import FinalCTA from "../components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ProgrammesOverview />
      <PartnersStrip />
      <DevBoardFeature />
      <ImpactMetrics />
      <ImpactStories />
      <InsightsPreview />
      <FinalCTA />
    </>
  );
}
