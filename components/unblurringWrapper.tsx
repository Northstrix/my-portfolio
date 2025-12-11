"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface UnblurringWrapperProps {
  children: ReactNode;
  delay?: number;      // reveal delay after render
  duration?: number;   // reveal animation duration
}

/**
 * Wraps children with an opacity 0 + blur state,
 * keeps them mounted immediately, then after `delay`
 * smoothly reveals them within `duration`.
 * Background is set to var(--background).
 */
const UnblurringWrapper = ({
  children,
  delay = 0.1,
  duration = 0.32,
}: UnblurringWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ delay, duration, ease: "easeInOut" }}
      className="w-full h-full bg-[var(--background)]"
    >
      {children}
    </motion.div>
  );
};

export default UnblurringWrapper;
