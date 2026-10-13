"use client";
import { useEffect } from "react";
import { advertising } from "@/config/advertising";
import { getFocusedAdFrame } from "@/services/ad-interaction";
import { createConversionState, trackAdConversion } from "@/services/analytics";

/** Heuristic interaction tracking: iframe focus does not confirm an ad click. */
export function useAdClickTracking() {
  useEffect(() => {
    let state = createConversionState();
    let pending = false;
    let insideBlurWindow = false;
    let blurTimer: ReturnType<typeof setTimeout> | undefined;
    let reportTimer: ReturnType<typeof setTimeout> | undefined;

    const report = () => {
      if (!pending && !getFocusedAdFrame()) return;
      trackAdConversion(state);
      pending = false;
    };
    const onBlur = () => {
      if (!getFocusedAdFrame()) return;
      // Finish any previous delayed interaction before starting a new one.
      if (reportTimer !== undefined) {
        clearTimeout(reportTimer);
        reportTimer = undefined;
        report();
      }
      clearTimeout(blurTimer);
      state = createConversionState();
      pending = true;
      insideBlurWindow = true;
      blurTimer = setTimeout(() => { insideBlurWindow = false; }, advertising.blurWindowMs);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState !== "hidden" || !insideBlurWindow) return;
      clearTimeout(reportTimer);
      reportTimer = setTimeout(() => {
        reportTimer = undefined;
        report();
      }, advertising.debounceMs);
    };
    const onBeforeUnload = () => {
      clearTimeout(reportTimer);
      reportTimer = undefined;
      report();
    };
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      clearTimeout(blurTimer);
      clearTimeout(reportTimer);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);
}
