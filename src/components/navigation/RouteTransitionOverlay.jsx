import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouteLoadSignal({ onPendingStart }) {
  const { pathname } = useLocation();

  useEffect(() => {
    onPendingStart(pathname);
  }, [onPendingStart, pathname]);

  return null;
}

export function RouteReadySignal({ onRouteReady }) {
  const { pathname } = useLocation();

  useEffect(() => {
    onRouteReady(pathname);
  }, [onRouteReady, pathname]);

  return null;
}

export default function RouteTransitionOverlay({
  visible,
  exiting,
  tone,
  sequence,
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        "route-transition-overlay",
        visible ? "is-visible" : "",
        exiting ? "is-exiting" : "",
        tone === "calm" ? "is-calm" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="route-transition-surface">
        <div key={sequence} className="route-transition-brand">
          <div className="route-transition-lockup">
            <span className="route-transition-segment route-transition-segment--era">
              ERA
            </span>
            <span className="route-transition-axis" />
            <span className="route-transition-segment route-transition-segment--axis">
              AXIS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
