import { useEffect, useState } from "react";
import { api } from "../services/api";
import { enrolmentModeOf, getProgrammePrice } from "../data/payments";

// One request per visit: every page that shows a price or a join button asks
// the same list, which EDOS keeps (price and how people join, per programme).
let request = null;

function loadProgrammes() {
  if (!request) {
    request = api
      .get("/programmes")
      .then((json) => json?.data ?? [])
      .catch(() => {
        request = null; // try again on the next page
        return [];
      });
  }
  return request;
}

/** The published programmes from EDOS, or null until they arrive. */
export default function useProgrammeCatalogue() {
  const [programmes, setProgrammes] = useState(null);
  useEffect(() => {
    let live = true;
    loadProgrammes().then((list) => {
      if (live) setProgrammes(list);
    });
    return () => {
      live = false;
    };
  }, []);
  return programmes;
}

/**
 * What a programme page needs to know about joining one kind of programme:
 * `mode` ("online", "enquiry" or "coming_soon"), its `price` for PriceTag or
 * the hero, and the EDOS row itself. Until the list arrives (or when it cannot
 * be reached) the defaults in data/payments.js stand in.
 */
export function useProgrammeOffer(category) {
  const programmes = useProgrammeCatalogue();
  const programme = programmes?.find((p) => p.category === category) || null;
  return {
    mode: enrolmentModeOf(category, programme),
    price: getProgrammePrice(category, programme),
    programme,
  };
}
