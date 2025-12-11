"use client";

import { useRef, useEffect, useCallback } from "react";
import { db } from "@/app/lib/firebase";
import { doc, updateDoc, setDoc, increment } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const ANALYTICS_ENABLED = true;
// Centralized path config
const METRICS_COLLECTION = "data";
const METRICS_DOC = "thirdPortfolio";

const cleanMetricKey = (str: string) =>
  str.replace(/[.#$\[\]/ ]+/g, "_").toLowerCase();

export function useMetrics() {
  const { i18n } = useTranslation();
  
  // 1. Use a Ref to hold the current language.
  // This allows us to read the *latest* language inside the callback
  // without forcing the callback to be recreated when language changes.
  const langRef = useRef(i18n.language || "en");

  // 2. Keep the Ref in sync silently.
  useEffect(() => {
    langRef.current = i18n.language || "en";
  }, [i18n.language]);

  /**
   * 3. Send Analytics Increment (Fire-and-Forget).
   * 
   * This function is MEMOIZED with [] dependencies. 
   * Its identity NEVER changes, so passing it to children 
   * will NOT cause them to re-render.
   */
  const sendAnalyticsIncrement = useCallback((baseMetricKey: string) => {
    // We use an IIFE (Immediately Invoked Function Expression) to run async logic
    // detached from the main execution flow.
    (async () => {
      if (!ANALYTICS_ENABLED) return;
      if (!baseMetricKey) return;

      // Read current language from Ref (non-reactive)
      const currentLang = langRef.current;
      const fullMetricKey = `${baseMetricKey}:${currentLang}`;
      const safeKey = cleanMetricKey(fullMetricKey);
      
      const metricsDocRef = doc(db, METRICS_COLLECTION, METRICS_DOC);

      try {
        await updateDoc(metricsDocRef, {
          [safeKey]: increment(1),
        });
        // Optional: Uncomment for debugging, but keep off for production perf
        // console.log(`[Background] Incremented: ${safeKey}`);
      } catch (error: any) {
        // If document doesn't exist, create it efficiently
        if (
          error.code === "not-found" || 
          error.message?.includes("No document")
        ) {
          try {
            await setDoc(metricsDocRef, { [safeKey]: 1 }, { merge: true });
          } catch (createError) {
            // Silently fail in background to avoid disrupting UX
          }
        }
      }
    })();
  }, []); // Zero dependencies = Stable Reference

  return {
    sendAnalyticsIncrement,
  };
}