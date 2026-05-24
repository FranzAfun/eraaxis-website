import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import SchoolStem from "./pages/SchoolStem";
import OutOfSchoolYouth from "./pages/OutOfSchoolYouth";
import OnlineLearning from "./pages/OnlineLearning";
import EraDigitalSkills from "./pages/EraDigitalSkills";
import DevBoard from "./pages/DevBoard";
import Partners from "./pages/Partners";
import Insights from "./pages/Insights";
import InsightDetail from "./pages/InsightDetail";
import Contact from "./pages/Contact";
import Payments from "./pages/Payments";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/school-stem" element={<SchoolStem />} />
          <Route path="/programs/out-of-school-youth" element={<OutOfSchoolYouth />} />
          <Route path="/programs/online-learning" element={<OnlineLearning />} />
          <Route path="/programs/era-digital-skills" element={<EraDigitalSkills />} />
          <Route path="/dev-board" element={<DevBoard />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  );
}
