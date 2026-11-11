/**
 * The reach figures (EDOS, Website > Settings; the bootstrap's `metrics`).
 * Every place on the site that shows one reads it through here, so one change
 * in EDOS updates them all. These numbers are only for when the API cannot be
 * reached; `partners` holds the year levels covered.
 */
export const REACH_FALLBACK = { students: 4000, schools: 5, projects: 100, partners: 13 };

export function reachFigure(metrics, key) {
  const value = Number(metrics?.[key]);
  return value > 0 ? value : REACH_FALLBACK[key];
}
