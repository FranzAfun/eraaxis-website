import unicefStartupLabs from "../assets/partners/unicef-startup-labs.webp";
import adwumawura from "../assets/partners/adwumawura.webp";
import bloombergPhilanthropies from "../assets/partners/bloomberg-philanthropies.webp";
import f6s from "../assets/partners/f6s.webp";
import kosmosInnovationCenter from "../assets/partners/kosmos-innovation-center.webp";
import mestAfrica from "../assets/partners/mest-africa.webp";

// width and height are each logo file's own size, so its space is kept
// before it loads.
const partners = [
  { name: "UNICEF Startup Labs", logo: unicefStartupLabs, alt: "UNICEF Startup Labs logo", websiteUrl: "https://unicefstartuplab.org/", width: 1200, height: 144 },
  { name: "Adwumawura", logo: adwumawura, alt: "Adwumawura logo", websiteUrl: "https://adwumawura.neip.gov.gh/", width: 1200, height: 1172 },
  { name: "Bloomberg Philanthropies", logo: bloombergPhilanthropies, alt: "Bloomberg Philanthropies logo", websiteUrl: "https://www.bloomberg.org/", width: 536, height: 176 },
  { name: "F6S", logo: f6s, alt: "F6S logo", websiteUrl: "https://www.f6s.com", width: 474, height: 474 },
  { name: "Kosmos Innovation Center", logo: kosmosInnovationCenter, alt: "Kosmos Innovation Center logo", websiteUrl: "https://kicghana.org/", width: 470, height: 272 },
  { name: "MEST Africa", logo: mestAfrica, alt: "MEST Africa logo", websiteUrl: "https://meltwater.org/", width: 1200, height: 198 },
];

export default partners;
