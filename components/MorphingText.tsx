"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MorphingTextProps {
  texts: string[];
  className?: string;
}

export function MorphingText({ texts, className }: MorphingTextProps) {
  const [display, setDisplay] = React.useState(texts[0] || "");

  React.useEffect(() => {
    if (texts[0] && texts[0] !== display) {
      setDisplay(texts[0]);
    }
  }, [texts, display]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={display}
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ duration: 0.4 }}
        className={cn("inline-block", className)}
      >
        {display}
      </motion.span>
    </AnimatePresence>
  );
}
