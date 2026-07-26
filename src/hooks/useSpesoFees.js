import { useEffect, useState } from "react";
import { DEFAULT_SPESO_FEE_CONFIG } from "../data/payments";
import { api } from "../services/api";

export default function useSpesoFees() {
  const [feeConfig, setFeeConfig] = useState(DEFAULT_SPESO_FEE_CONFIG);
  const [feesLoading, setFeesLoading] = useState(true);
  const [feesError, setFeesError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api.get("/payments/fees")
      .then((payload) => {
        if (cancelled) return;

        setFeeConfig({
          businessRate: Number(payload.data.businessRate),
          providerRate: Number(payload.data.providerRate),
          cap: Number(payload.data.cap),
        });
      })
      .catch(() => {
        if (!cancelled) {
          setFeesError(
            "Current Speso fees could not be loaded. The displayed fee is an estimate."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setFeesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { feeConfig, feesLoading, feesError };
}
