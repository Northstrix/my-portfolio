"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, type ValueAnimationTransition } from "framer-motion";
import { cn } from "@/lib/utils";

interface HighlightHoverProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  effect?: ValueAnimationTransition;
  highlightColor?: string;
  barThickness?: number;
  gapRatio?: number;
  maxWidth?: string | number;
  noReact?: boolean; // disables animation but not text selection
  wrap?: boolean;    // Enables text wrapping
  href?: string;
  target?: string;
  rel?: string;
  isRTL?: boolean;
}

export const HighlightHover = ({
  children,
  as: Tag = "span",
  className,
  effect = { type: "spring", stiffness: 260, damping: 24 },
  highlightColor = "var(--foreground)",
  barThickness = 0.12,
  gapRatio = 0.03,
  maxWidth = "100%",
  noReact = false,
  wrap = false,
  ...rest
}: HighlightHoverProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const MotionTag = useMemo(() => motion.create(Tag), [Tag]);

  // Compute underline size relative to font size
  useEffect(() => {
    const applyVars = () => {
      if (ref.current) {
        const size = parseFloat(getComputedStyle(ref.current).fontSize);
        ref.current.style.setProperty("--hh-bar", `${size * barThickness}px`);
        ref.current.style.setProperty("--hh-gap", `${size * gapRatio}px`);
      }
    };
    applyVars();
    window.addEventListener("resize", applyVars);
    return () => window.removeEventListener("resize", applyVars);
  }, [barThickness, gapRatio]);

  // Underline animation
  const barAnim = {
    rest: {
      height: "var(--hh-bar)",
      backgroundColor: noReact ? "transparent" : "var(--sub-foreground)",
      bottom: "calc(-1 * var(--hh-gap))",
    },
    hover: noReact
      ? {}
      : {
          height: "100%",
          bottom: 0,
          backgroundColor: highlightColor,
          transition: effect,
        },
  };

  // Text color / padding animation
  const textAnim = {
    rest: {
      color: "var(--sub-foreground)",
      paddingLeft: "0px",
      paddingRight: "0px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    hover: noReact
      ? {}
      : {
          color: "var(--background)",
          paddingLeft: "6px",
          paddingRight: "6px",
          transition: { duration: 0.3, ease: "easeInOut" },
        },
  };

  // Logic to handle wrapping
  const wrapperStyle: React.CSSProperties = {
    display: "inline-block",
    maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
    whiteSpace: wrap ? "normal" : "nowrap",
    wordBreak: wrap ? "break-word" : undefined,       // Break words if needed
    overflowWrap: wrap ? "anywhere" : undefined,      // Break chars if word is too long
    overflowX: "visible",
    overflowY: "hidden",
    verticalAlign: "bottom", 
  };

  return (
    <MotionTag
      ref={ref}
      whileHover={noReact ? undefined : "hover"}
      initial="rest"
      animate="rest"
      className={cn(
        "relative select-text", 
        noReact ? "cursor-text" : "cursor-pointer", 
        className
      )}
      style={wrapperStyle}
      {...rest}
    >
      {/* Underline */}
      <motion.div
        aria-hidden="true"
        variants={barAnim}
        className="absolute w-full left-0 rounded-[var(--border-radius)] pointer-events-none"
        style={{
          height: "var(--hh-bar)",
          bottom: "calc(-1 * var(--hh-gap))",
          transformOrigin: "bottom center",
          zIndex: 0,
        }}
      />

      {/* Text content */}
      <motion.span
        variants={textAnim}
        className="relative z-[1] inline-block"
        style={{
          whiteSpace: wrap ? "normal" : "nowrap",
          userSelect: "text",
        }}
      >
        {children}
      </motion.span>
    </MotionTag>
  );
};

export default HighlightHover;