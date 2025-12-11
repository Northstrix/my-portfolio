"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";

// --- Configuration ---
const THEME_PURPLE = "#802EE8";
const THEME_BLUE = "#2E68E8";
const ORB_COUNT = 6;

// Helper to generate random orb data
// We export this logic so we can reuse it for initial load AND respawning
const generateOrbData = () => {
  const colors = [THEME_PURPLE, THEME_BLUE];
  
  // Randomize movement paths (smoother, less erratic range)
  const moveX = [
    Math.random() * 30,
    Math.random() * -30,
    Math.random() * 20,
    Math.random() * -20,
    Math.random() * 30,
  ];
  const moveY = [
    Math.random() * 30,
    Math.random() * -30,
    Math.random() * -20,
    Math.random() * 20,
    Math.random() * 30,
  ];

  return {
    // Unique key to force React to remount the component on regeneration
    key: Math.random().toString(36).substring(7), 
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.floor(Math.random() * 150) + 200, // Size between 200-350px
    // Random position on screen
    initialLeft: `${Math.floor(Math.random() * 100)}%`,
    initialTop: `${Math.floor(Math.random() * 100)}%`,
    moveX,
    moveY,
    // Slow, drifting duration (25s - 45s)
    duration: Math.random() * 20 + 25, 
    delay: Math.random() * 5,
  };
};

// Interface
interface OrbData {
  key: string;
  color: string;
  size: number;
  initialLeft: string;
  initialTop: string;
  moveX: number[];
  moveY: number[];
  duration: number;
  delay: number;
}

// --- Single Orb Component ---
// Wrapped in memo, though the "key" change strategy makes this less critical, it's good practice.
const SingleOrb = React.memo(({ orb, onFadeComplete }: { orb: OrbData; onFadeComplete: (key: string) => void }) => {
  const opacity = useMotionValue(0);

  // Animation State Management
  // Phase: 'in' (fade in) -> 'hold' (stay visible) -> 'out' (fade out)
  const state = useRef({
    phase: "in" as "in" | "hold" | "out",
    maxOpacity: 0.3 + Math.random() * 0.3, // Lower max opacity for subtlety (0.3 - 0.6)
    holdDuration: 3000 + Math.random() * 4000, // Hold for 3s - 7s
    currentHoldTime: 0,
  });

  useAnimationFrame((time, delta) => {
    let current = opacity.get();
    let next = current;
    const s = state.current;

    // 1. FADE IN
    if (s.phase === "in") {
      next += 0.002; // Very slow fade in
      if (next >= s.maxOpacity) {
        next = s.maxOpacity;
        s.phase = "hold";
      }
    } 
    
    // 2. HOLD
    else if (s.phase === "hold") {
      s.currentHoldTime += delta;
      if (s.currentHoldTime >= s.holdDuration) {
        s.phase = "out";
      }
    } 
    
    // 3. FADE OUT
    else if (s.phase === "out") {
      next -= 0.001; // Extremely slow fade out

      // --- CRITICAL CHECK: Strict 0.1% Threshold ---
      if (next <= 0.001) {
        next = 0;
        // Notify parent that this orb is done. 
        // The parent will remove this orb and create a NEW one in a NEW place.
        onFadeComplete(orb.key); 
      }
    }

    // Safety Clamps
    if (next < 0) next = 0;
    if (next > 1) next = 1;

    opacity.set(next);
  });

  return (
    <motion.div
      className="absolute rounded-full"
      // Use will-change to hint browser for optimization
      style={{
        backgroundColor: orb.color,
        width: orb.size,
        height: orb.size,
        left: orb.initialLeft,
        top: orb.initialTop,
        filter: "blur(50px)", // Increased blur for smoother look
        opacity: opacity, // Driven by useAnimationFrame
        willChange: "transform, opacity", 
      }}
      initial={{
        scale: 1,
        x: 0,
        y: 0,
      }}
      animate={{
        // Gentle breathing effect instead of jumpy resizing
        scale: [1, 1.15, 1], 
        x: orb.moveX,
        y: orb.moveY,
      }}
      transition={{
        duration: orb.duration,
        repeat: Infinity,
        ease: "linear", // Linear ease for position prevents "snapping" at curve changes
        delay: orb.delay,
      }}
    />
  );
});

SingleOrb.displayName = "SingleOrb";

// --- Main Container ---
const OrbBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { margin: "100px 0px", once: false });
  
  const [orbs, setOrbs] = useState<OrbData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize orbs once
  useEffect(() => {
    if (!isInitialized) {
      setOrbs(Array.from({ length: ORB_COUNT }).map(() => generateOrbData()));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Callback to respawn a specific orb
  // When an orb fades out, we replace it in the array with a FRESH one (new key, new position)
  const handleOrbFadeComplete = useCallback((finishedKey: string) => {
    setOrbs((prevOrbs) => 
      prevOrbs.map((orb) => {
        if (orb.key === finishedKey) {
          return generateOrbData(); // Returns new data with new random Left/Top
        }
        return orb;
      })
    );
  }, []);

  // IMMEDIATE REMOVAL: If not in view, render nothing (null).
  if (!isInView) {
    return (
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ opacity: 0 }} 
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        background: "transparent",
        opacity: 1, // Logic handled by child unmounting
      }}
    >
      {orbs.map((orb) => (
        <SingleOrb 
          key={orb.key} // Using a unique key ensures a fresh mount/animation on respawn
          orb={orb} 
          onFadeComplete={handleOrbFadeComplete} 
        />
      ))}
    </div>
  );
};

export default OrbBackground;