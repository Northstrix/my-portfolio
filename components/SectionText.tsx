"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import clsx from "clsx";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SectionTextProps {
  id: string;
  title: string;
  description?: string;
  isRTL?: boolean;
  baseColor?: string;
  accentOverride?: string;
  specialWordsString?: string;
  specialWordsDelimiter?: string;
  specialTargetColor?: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  titleWeight?: number | string;
}

const SectionText: React.FC<SectionTextProps> = React.memo(function SectionText({
  id,
  title,
  description,
  isRTL = false,
  baseColor = "var(--reveal-mask)",
  accentOverride,
  specialWordsString = "",
  specialWordsDelimiter = "|",
  specialTargetColor = "var(--foreground)",
  scrollContainerRef,
  titleWeight = 600,
}) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  
  // STABLE uniqueId with useRef
  const uniqueId = useRef(`section-${id}`).current;

  // Responsive sizing
  const [titleFontSize, setTitleFontSize] = useState("16px");
  const [descFontSize, setDescFontSize] = useState("32px");
  const [descMarginTop, setDescMarginTop] = useState("0.25rem");

  // Mounted state + scroll progress
  const [isMounted, setIsMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const activeAccentColor = useMemo(() => {
    return accentOverride ?? "var(--accent)";
  }, [accentOverride]);

  const parsedLines = useMemo(() => {
    if (!description) return [];
    const rawLines = description.split(/\n|<br\s*\/?>/);
    return rawLines.map((line, i) => {
      const chunks: { text: string; isSpecial: boolean }[] = [];
      const highlightRegex = /<hghlt>(.*?)<\/hghlt>/gi;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = highlightRegex.exec(line)) !== null) {
        const matchText = match[1];
        const start = match.index;
        if (start > lastIndex) {
          chunks.push({ text: line.slice(lastIndex, start), isSpecial: false });
        }
        if (matchText) {
          chunks.push({ text: matchText, isSpecial: true });
        }
        lastIndex = highlightRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        chunks.push({ text: line.slice(lastIndex), isSpecial: false });
      }
      if (chunks.length === 0) {
        chunks.push({ text: line, isSpecial: false });
      }
      return { key: i, chunks };
    });
  }, [description]);

  // Set mounted after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // RESOURCE EFFICIENT SCROLL LOGIC (used by both mobile + desktop)
  useEffect(() => {
    if (!isMounted || !description || !ref.current || prefersReducedMotion || !scrollContainerRef?.current) return;

    const descElement = ref.current.querySelector(`.${uniqueId}-desc`) as HTMLElement;
    if (!descElement) return;

    const lines = Array.from(descElement.querySelectorAll(`.${uniqueId}-desc-line-wrapper`)) as HTMLElement[];
    const containerEl = scrollContainerRef.current;

    let lastScrollTime = 0;
    let lastProgresses = new Array(lines.length).fill(0);
    let updateIntervalId: number | null = null;

    const calculateProgresses = () => {
      const containerRect = containerEl.getBoundingClientRect();
      lines.forEach((line, idx) => {
        const rect = line.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        const height = rect.height;
        const start = containerRect.height * 0.9;
        const end = containerRect.height * 0.1;

        let progress = 0;
        if (relativeTop < start && relativeTop + height > end) {
          progress = 1 - (relativeTop - end) / (start - end);
          progress = Math.min(Math.max(progress, 0), 1);
        } else if (relativeTop + height <= end) {
          progress = 1;
        } else {
          progress = 0;
        }

        const multiplier = isMobile ? 2 : 1.75;
        const rawPercent = progress * 100 * multiplier;
        lastProgresses[idx] = Math.min(rawPercent, 100);
      });
    };

    const applyProgresses = () => {
      lines.forEach((line, idx) => {
        line.style.setProperty("--progress", `${lastProgresses[idx]}%`);
      });
    };

    const onScroll = () => {
      lastScrollTime = performance.now();
      calculateProgresses();

      if (updateIntervalId === null) {
        updateIntervalId = window.setInterval(() => {
          const now = performance.now();
          if (now - lastScrollTime > 24) {
            if (updateIntervalId !== null) {
              clearInterval(updateIntervalId);
              updateIntervalId = null;
            }
          }
          applyProgresses();
        }, 24);
      }
    };

    containerEl.addEventListener("scroll", onScroll, { passive: true });
    
    // Initial calculation
    lastScrollTime = performance.now();
    calculateProgresses();
    applyProgresses();

    return () => {
      containerEl.removeEventListener("scroll", onScroll);
      if (updateIntervalId !== null) {
        clearInterval(updateIntervalId);
      }
    };
  }, [uniqueId, scrollContainerRef, description, prefersReducedMotion, isMobile, isMounted]);

  // Responsive font sizing
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const updateSizes = () => {
      const width = el.offsetWidth;
      const MIN_WIDTH = 200;
      const MAX_WIDTH = 1400;
      const ratio = Math.min(Math.max((width - MIN_WIDTH) / (MAX_WIDTH - MIN_WIDTH), 0), 1);

      setTitleFontSize(`${(15 + ratio * 4).toFixed(1)}px`);
      setDescFontSize(`${(28 + ratio * 10).toFixed(1)}px`);
      setDescMarginTop(`${(0.1 + ratio * 0.4).toFixed(2)}rem`);
    };

    updateSizes();
    const ro = new ResizeObserver(updateSizes);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // NEW MASK STYLES: Mobile = circle (unchanged), Desktop = square (side-to-side)
  const getMaskStyle = (isRTL: boolean) => {
    if (prefersReducedMotion) return {};

    if (isMobile) {
      // MOBILE: Circle (unchanged - center out)
      return {
        maskImage: `radial-gradient(circle at center, black var(--progress), transparent var(--progress))`,
        WebkitMaskImage: `radial-gradient(circle at center, black var(--progress), transparent var(--progress))`,
      };
    }

    // DESKTOP: Square mask (side-to-side fill using linear gradient)
    const direction = isRTL ? "to left" : "to right";
    return {
      maskImage: `linear-gradient(${direction}, black 0%, black var(--progress), transparent var(--progress), transparent 100%)`,
      WebkitMaskImage: `linear-gradient(${direction}, black 0%, black var(--progress), transparent var(--progress), transparent 100%)`,
    };
  };

  const h2Color = prefersReducedMotion || scrollProgress < 50
    ? "var(--sub-foreground)"
    : "var(--foreground)";
  
  const descWeight = isRTL ? 700 : 900;

  return (
    <div
      ref={ref}
      className={clsx(
        "flex flex-col w-full overflow-hidden relative",
        isMobile ? "mb-6 items-center text-center" : "mb-10",
        isRTL && !isMobile ? "items-end text-right" : !isMobile ? "items-start text-left" : ""
      )}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <h2
        className={`${uniqueId}-title font-headline tracking-tight leading-tight w-full transition-colors`}
        style={{
          fontSize: titleFontSize,
          fontWeight: titleWeight,
          lineHeight: 1.2,
          color: h2Color,
          transition: prefersReducedMotion ? "none" : "color 1s ease",
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`${uniqueId}-desc w-full relative mt-1.5`}
          style={{
            fontSize: descFontSize,
            lineHeight: 1.4,
            marginTop: descMarginTop,
            fontWeight: descWeight,
            position: "relative",
          }}
        >
          {parsedLines.map(({ key, chunks }) => (
            <span
              key={key}
              className={`${uniqueId}-desc-line-wrapper desc-line-wrapper block relative w-full`}
              style={{ display: "block", position: "relative" }}
            >
              <span
                className="base-layer"
                style={{
                  color: baseColor,
                  position: "relative",
                  zIndex: 1,
                  display: "block",
                }}
              >
                {chunks.map((chunk, i) => (
                  <span key={i}>{chunk.text}</span>
                ))}
              </span>
              <span
                className="reveal-layer"
                aria-hidden="true"
                style={{
                  ...getMaskStyle(isRTL),
                  color: activeAccentColor,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 2,
                  pointerEvents: "none",
                  userSelect: "none",
                  display: "block",
                }}
              >
                {chunks.map((chunk, i) => (
                  <span key={i} style={chunk.isSpecial ? { color: specialTargetColor } : undefined}>
                    {chunk.text}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </p>
      )}
    </div>
  );
});

export default SectionText;