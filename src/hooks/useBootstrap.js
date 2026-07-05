import { useEffect, useState } from "react";
import { fetchBootstrap } from "../services/bootstrapService";

// Module-level cache — survives re-renders and component remounts within a session.
let cache = null;
let inflight = null;

const EMPTY = {
  settings: null,
  socials: null,
  metrics: null,
  cta: null,
  featuredProgrammes: [],
  featuredInsights: [],
  partners: [],
  gallery: [],
};

export function useBootstrap() {
  const [state, setState] = useState({
    data: cache,
    loading: cache === null,
    error: null,
  });

  useEffect(() => {
    if (cache !== null) return;

    if (!inflight) {
      inflight = fetchBootstrap()
        .then((response) => {
          cache = response;
          inflight = null;
        })
        .catch((err) => {
          inflight = null;
          return Promise.reject(err);
        });
    }

    let cancelled = false;

    inflight
      .then(() => {
        if (!cancelled) setState({ data: cache, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const data = state.data ?? EMPTY;

  return {
    loading: state.loading,
    error: state.error,
    settings: data.settings,
    socials: data.socials,
    metrics: data.metrics,
    cta: data.cta,
    featuredProgrammes: data.featuredProgrammes ?? [],
    featuredInsights: data.featuredInsights ?? [],
    partners: data.partners ?? [],
    gallery: data.gallery ?? [],
  };
}
