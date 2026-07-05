import { Component, Suspense, lazy } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Lazy + a local error boundary, not a plain top-level import: a browser
// extension (ad/tracker blocker) blocking this one chunk must never be able
// to take down the rest of the site. A static import fails at module-load
// time, before React has any control, so an error boundary around it can't
// help — lazy() turns a blocked/failed fetch into a render-time rejection
// that Suspense + the boundary below can actually catch.
const PrivacyNotice = lazy(() => import("../components/ui/PrivacyNotice"));

class PrivacyNoticeBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <PrivacyNoticeBoundary>
        <Suspense fallback={null}>
          <PrivacyNotice />
        </Suspense>
      </PrivacyNoticeBoundary>
    </div>
  );
}
