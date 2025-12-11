"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DisableableMorphTextProps {
  texts: string[];
  className?: string;
  disable?: boolean;
}

export function DisableableMorphText({ texts, className, disable = false }: DisableableMorphTextProps) {
  const [display, setDisplay] = React.useState(texts[0] || "");

  React.useEffect(() => {
    if (!disable && texts[0] && texts[0] !== display) {
      setDisplay(texts[0]);
    }
    // If disabled, keep display fixed to first text, no changes
  }, [texts, display, disable]);

  if (disable) {
    return (
      <span
        className={cn("inline-block", className)}
        style={{ whiteSpace: "nowrap", overflow: "hidden" }}
      >
        {texts[0]}
      </span>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={display}
        initial={{ opacity: 0, filter: "blur(4px)", width: 0 }}
        animate={{ opacity: 1, filter: "blur(0px)", width: "auto" }}
        exit={{ opacity: 0, filter: "blur(4px)", width: 0 }}
        transition={{ duration: 0.4 }}
        className={cn("inline-block overflow-hidden", className)}
        style={{ display: "inline-block", whiteSpace: "nowrap" }}
      >
        {display}
      </motion.span>
    </AnimatePresence>
  );
}
