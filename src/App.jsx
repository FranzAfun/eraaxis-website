import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";

const Programs = lazy(() => import("./pages/Programs"));
const SchoolStem = lazy(() => import("./pages/SchoolStem"));
const OutOfSchoolYouth = lazy(() => import("./pages/OutOfSchoolYouth"));
const OnlineLearning = lazy(() => import("./pages/OnlineLearning"));
const EraDigitalSkills = lazy(() => import("./pages/EraDigitalSkills"));
const DevBoard = lazy(() => import("./pages/DevBoard"));
const Partners = lazy(() => import("./pages/Partners"));
const Insights = lazy(() => import("./pages/Insights"));
const InsightDetail = lazy(() => import("./pages/InsightDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Faq = lazy(() => import("./pages/Faq"));
const Contact = lazy(() => import("./pages/Contact"));
const Payments = lazy(() => import("./pages/Payments"));
const ProgrammeEnrolmentPayment = lazy(() =>
  import("./pages/ProgrammeEnrolmentPayment")
);
const MonthlyDuesPayment = lazy(() => import("./pages/MonthlyDuesPayment"));
const StudentChapterPayment = lazy(() => import("./pages/StudentChapterPayment"));

function RouteFallback() {
  return (
    <div className="bg-[var(--color-background)] py-32">
      <div className="container">
        <div className="glass-surface-light mx-auto flex max-w-xl flex-col items-center gap-4 rounded-[var(--radius-lg)] px-8 py-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Loading
          </p>
          <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
            Preparing the next ERA AXIS page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteLayout>
        <Suspense fallback={<RouteFallback />}>
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
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/programme-enrolment" element={<ProgrammeEnrolmentPayment />} />
            <Route path="/payments/monthly-dues" element={<MonthlyDuesPayment />} />
            <Route path="/payments/student-chapter" element={<StudentChapterPayment />} />
          </Routes>
        </Suspense>
      </SiteLayout>
    </BrowserRouter>
  );
}
