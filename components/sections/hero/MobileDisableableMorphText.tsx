"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MobileDisableableMorphTextProps {
  texts: string[];
  className?: string;
  disable?: boolean;
}

export function MobileDisableableMorphText({
  texts,
  className,
  disable = false,
}: MobileDisableableMorphTextProps) {
  const [display, setDisplay] = React.useState(texts[0] || "");
  const [renderIndex, setRenderIndex] = React.useState(0);

  React.useEffect(() => {
    if (!disable && texts[0] && texts[0] !== display) {
      setRenderIndex((i) => i + 1); // trigger AnimatePresence re-mount
    }
  }, [texts, display, disable]);

  if (disable) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center px-2 py-1 rounded-lg",
          className
        )}
        style={{ whiteSpace: "nowrap" }}
      >
        {texts[0]}
      </span>
    );
  }

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        // Swap text when it's invisible (mid-point of cycle)
        setDisplay(texts[0]);
      }}
    >
      <motion.span
        key={renderIndex}
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{
          duration: 0.63,
          ease: "easeInOut",
        }}
        className={cn(
          "inline-flex items-center justify-center px-2 py-1 rounded-lg",
          "overflow-hidden",
          className
        )}
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {display}
      </motion.span>
    </AnimatePresence>
  );
}
