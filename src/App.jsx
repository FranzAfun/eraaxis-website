import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import ScrollToTop from "./components/ScrollToTop";
import RouteTransitionOverlay, {
  RouteLoadSignal,
  RouteReadySignal,
} from "./components/navigation/RouteTransitionOverlay";
import Home from "./pages/Home";

const Programs = lazy(() => import("./pages/Programs"));
const About = lazy(() => import("./pages/About"));
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

function AppShell() {
  const hideTimerRef = useRef(null);
  const showTimerRef = useRef(null);
  const pendingPathRef = useRef(null);
  const [transitionState, setTransitionState] = useState({
    visible: false,
    exiting: false,
    tone: "brand",
    sequence: 0,
  });

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const handlePendingStart = useCallback(
    (pathname) => {
      clearTimers();
      pendingPathRef.current = pathname;

      showTimerRef.current = setTimeout(() => {
        setTransitionState((current) => ({
          visible: true,
          exiting: false,
          tone: pathname.startsWith("/payments") ? "calm" : "brand",
          sequence: current.sequence + 1,
        }));
      }, pathname.startsWith("/payments") ? 80 : 110);
    },
    [clearTimers]
  );

  const handleRouteReady = useCallback(
    (pathname) => {
      if (pendingPathRef.current !== pathname) return;

      clearTimers();

      let shouldHide = false;

      setTransitionState((current) => {
        if (!current.visible) {
          pendingPathRef.current = null;
          return current;
        }

        shouldHide = true;
        return {
          ...current,
          exiting: true,
        };
      });

      if (!shouldHide) return;

      hideTimerRef.current = setTimeout(() => {
        pendingPathRef.current = null;
        setTransitionState((current) => ({
          ...current,
          visible: false,
          exiting: false,
        }));
      }, pathname.startsWith("/payments") ? 180 : 240);
    },
    [clearTimers]
  );

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <>
      <RouteTransitionOverlay
        visible={transitionState.visible}
        exiting={transitionState.exiting}
        tone={transitionState.tone}
        sequence={transitionState.sequence}
      />
      <ScrollToTop />
      <SiteLayout>
        <Suspense fallback={<RouteLoadSignal onPendingStart={handlePendingStart} />}>
          <RouteReadySignal onRouteReady={handleRouteReady} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/about" element={<About />} />
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
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
