import Hero from "../components/home/Hero";
import WhoItIsFor from "../components/sections/WhoItIsFor";
import WhatYouLearn from "../components/sections/WhatYouLearn";
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
      <WhoItIsFor />
      <WhatYouLearn />
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
