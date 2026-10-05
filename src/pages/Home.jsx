import Hero from "../components/home/Hero";
import WhoItIsFor from "../components/sections/WhoItIsFor";
import WhatYouLearn from "../components/sections/WhatYouLearn";
import GalleryPreview from "../components/sections/GalleryPreview";
import ProgrammesOverview from "../components/home/ProgrammesOverview";
import PartnersStrip from "../components/home/PartnersStrip";
import DevBoardFeature from "../components/home/DevBoardFeature";
import ImpactMetrics from "../components/home/ImpactMetrics";
import InsightsPreview from "../components/home/InsightsPreview";
import FinalCTA from "../components/home/FinalCTA";
import SEO from "../components/SEO";
import ScrollStack from "../components/motion/ScrollStack";
import ScrollScenes from "../components/motion/ScrollScenes";
import { getPageSeo } from "../data/seo";

export default function Home() {
  return (
    <>
      <SEO {...getPageSeo("/")} />
      <ScrollScenes>
      <ScrollStack>
      <Hero />
      <WhoItIsFor />
      <WhatYouLearn />
      <ProgrammesOverview />
      <PartnersStrip />
      <DevBoardFeature />
      <ImpactMetrics />
      <InsightsPreview />
      <GalleryPreview />
      <FinalCTA />
      </ScrollStack>
      </ScrollScenes>
    </>
  );
}
