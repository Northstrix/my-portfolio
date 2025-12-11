"use client";

import { motion } from "framer-motion";
import React, { useEffect, useMemo } from "react";

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

interface BackdropOptions {
  supportsBackdropFilter: boolean;
  bodyOpacity: number;
  borderOpacity: number;
  blurStrength: number;
  isScrolled?: boolean;
}

function getLegacyBackdropStyle({
  supportsBackdropFilter,
  bodyOpacity,
  borderOpacity,
  blurStrength,
  isScrolled = true,
}: BackdropOptions): React.CSSProperties {
  const invisibleOpacity = 0;

  return {
    background: supportsBackdropFilter
      ? `rgba(0, 0, 0, ${isScrolled ? bodyOpacity : invisibleOpacity})`
      : `rgba(0, 0, 0, ${isScrolled ? bodyOpacity + 0.2 : invisibleOpacity})`,
    backdropFilter: supportsBackdropFilter
      ? `blur(${isScrolled ? blurStrength : 0}px)`
      : undefined,
    WebkitBackdropFilter: supportsBackdropFilter
      ? `blur(${isScrolled ? blurStrength : 0}px)`
      : undefined,
    border: `1px solid rgba(255,255,255,${
      isScrolled ? borderOpacity : invisibleOpacity
    })`,
    boxShadow: isScrolled ? "0 2px 16px 0 rgba(0,0,0,0.08)" : "none",
    transition:
      "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease",
  };
}

export function ModalOverlay({ children, onClose }: ModalOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Detect backdrop-filter support
  const supportsBackdropFilter = useMemo(() => {
    if (typeof window === "undefined") return false;
    const testEl = document.createElement("div");
    if ("backdropFilter" in testEl.style) return true;
    if ("webkitBackdropFilter" in testEl.style) return true;
    return false;
  }, []);

  const legacyStyle = useMemo(
    () =>
      getLegacyBackdropStyle({
        supportsBackdropFilter,
        bodyOpacity: 0.6,
        borderOpacity: 0.1,
        blurStrength: 6,
        isScrolled: true,
      }),
    [supportsBackdropFilter]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={legacyStyle}
      onClick={onClose}
    >
      {children}
    </motion.div>
  );
}
