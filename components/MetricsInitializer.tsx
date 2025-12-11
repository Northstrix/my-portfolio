"use client";

import React, { useState } from "react";
import { db } from "@/app/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Import your data sources
import { componentsMetadata } from "@/data/component-meta";
import { projects, embeddedProjects, footerBadges } from "@/data/stuff";

// Import your custom button
import RefinedChronicleButton from "@/components/RefinedChronicleButton";

// --- Configuration ---
const LANGUAGES = ["en", "he", "es", "it"] as const;

// Standard event set
const STANDARD_EVENTS = ["clicked", "wheel-clicked", "dragged"];

const cleanMetricKey = (str: string) =>
  str.replace(/[.#$\[\]/ ]+/g, "_").toLowerCase();

// --- Event Generators ---
const getProjectEvents = (items: { id: string }[], langs: readonly string[]) => {
  const sources = ["from-project-card", "from-project-showcase"];
  return items.flatMap(({ id }) =>
    sources.flatMap((suffix) =>
      STANDARD_EVENTS.flatMap((evt) =>
        langs.map((lang) => `${id}-${evt}-${suffix}:${lang}`)
      )
    )
  );
};

const getEmbeddedEvents = (items: { id: string }[], langs: readonly string[]) => {
  const sources = [
    "from-project-card", 
    "from-circular-testimonials", 
    "from-testimonial-carousel"
  ];
  return items.flatMap(({ id }) =>
    sources.flatMap((suffix) =>
      STANDARD_EVENTS.flatMap((evt) =>
        langs.map((lang) => `${id}-${evt}-${suffix}:${lang}`)
      )
    )
  );
};

const getComponentEvents = (items: { id: string }[], langs: readonly string[]) => {
  const parts = ["image", "button"];
  const componentEvents = [...STANDARD_EVENTS, "hovered"];
  const suffix = "from-inflected-card";
  return items.flatMap(({ id }) =>
    parts.flatMap((part) =>
      componentEvents.flatMap((evt) =>
        langs.map((lang) => `${id}-${part}-${evt}-${suffix}:${lang}`)
      )
    )
  );
};

const getFooterEvents = (items: { id: string }[], langs: readonly string[]) => {
  const badgeEvents = [...STANDARD_EVENTS, "hovered"];
  const suffix = "from-footer-badge";
  return items.flatMap(({ id }) =>
    badgeEvents.flatMap((evt) =>
      langs.map((lang) => `${id}-${evt}-${suffix}:${lang}`)
    )
  );
};

// --- Console Component ---
function Console({ logs }: { logs: string[] }) {
  return (
    <div
      role="log"
      aria-live="polite"
      className="custom-scrollbar"
      style={{
        backgroundColor: "var(--footer-background)",
        borderRadius: "var(--border-radius)",
        flexGrow: 1,
        minHeight: "200px",
        maxHeight: "400px",
        overflowY: "auto",
        padding: "16px",
        fontFamily: "monospace",
        fontSize: "13px",
        color: "var(--middle-foreground)",
        border: "1px solid var(--border-color)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        marginTop: "16px",
      }}
    >
      {logs.length > 0 ? (
        logs.map((logMsg, i) => <div key={i} style={{marginBottom:4}}>{"> "}{logMsg}</div>)
      ) : (
        <p style={{color:"var(--sub-foreground)"}}>Waiting for initialization...</p>
      )}
    </div>
  );
}

// --- Main Component ---
export default function MetricsInitializer() {
  const [logs, setLogs] = useState<string[]>([]);
  const [initializing, setInitializing] = useState(false);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  const metricsDocRef = doc(db, "data", "thirdPortfolio");

  // Updated: Generates clicked, wheel-clicked, and dragged for github-button
  const getStaticEvents = (langs: readonly string[]) => {
    const githubEvents = ["clicked", "wheel-clicked", "dragged"];
    
    const keys = [
      ...githubEvents.map(evt => `github-button-${evt}-from-footer-badge`)
    ];
    
    return keys.flatMap(key => langs.map(lang => `${key}:${lang}`));
  };

  // 1. Initialize Main Metrics
  async function initializeMainMetrics(fieldsToCreate: string[]) {
    const snap = await getDoc(metricsDocRef);
    const existing = snap.exists() ? snap.data() : {};
    const toCreate: Record<string, number> = {};
    let createdCount = 0;

    for (const field of fieldsToCreate) {
      if (!(field in existing)) {
        toCreate[field] = 0;
        createdCount++;
      }
    }

    if (Object.keys(toCreate).length > 0) {
      await setDoc(metricsDocRef, toCreate, { merge: true });
      addLog(`✅ Metrics: Created ${createdCount} new fields in 'thirdPortfolio'.`);
    } else {
      addLog("✨ Metrics: All main fields exist.");
    }
  }

  const initializeAllMetrics = async () => {
    if (initializing) return;
    setInitializing(true);
    setLogs([]); 
    addLog("🚀 Starting initialization...");

    try {
      // A. Generate Keys for Main Metrics
      const metrics: string[] = [];
      metrics.push(...getProjectEvents(projects, LANGUAGES));
      metrics.push(...getEmbeddedEvents(embeddedProjects, LANGUAGES));
      metrics.push(...getComponentEvents(componentsMetadata, LANGUAGES));
      metrics.push(...getFooterEvents(footerBadges, LANGUAGES));
      metrics.push(...getStaticEvents(LANGUAGES));

      const uniqueMetrics = Array.from(new Set(metrics.map(cleanMetricKey)));
      addLog(`🔍 Generated ${uniqueMetrics.length} unique metric keys.`);
      
      // B. Run Initializations
      await initializeMainMetrics(uniqueMetrics);

    } catch (e: any) {
      addLog(`❌ Critical Error: ${e.message}`);
    } finally {
      setInitializing(false);
      addLog("🏁 Process finished.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "24px auto", padding: 24, border: "1px solid var(--border-color)", borderRadius: 12 }}>
      <RefinedChronicleButton
        backgroundColor="var(--foreground)"
        textColor="var(--background)"
        hoverBackgroundColor="var(--accent)"
        hoverTextColor="var(--foreground)"
        borderVisible={false}
        width="100%"
        buttonHeight="3rem"
        onClick={initializeAllMetrics}
      >
        {initializing ? "Initializing..." : "Initialize All Metrics"}
      </RefinedChronicleButton>
      <Console logs={logs} />
    </div>
  );
}
