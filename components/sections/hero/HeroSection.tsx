"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import useIsRTL from "@/hooks/useIsRTL";
import ScrollIndicator from "./ScrollIndicator";
import TextSwap from "@/components/TextSwap";
import ButtonSection from "./ButtonSection";
import { useTranslation } from "react-i18next";
import ProfileCard from "@/components/DesktopProfileCard";

interface HeroSectionProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  onButtonClick?: (buttonKey: "explore" | "contact-info") => void;
}

const HEBREW_SWAP_THRESHOLD = 1336;

export default function HeroSection({ scrollContainerRef, onButtonClick }: HeroSectionProps) {
  const isRTL = useIsRTL();
  const imageRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const [titleFontSize, setTitleFontSize] = useState("56px");
  const [subFontSize, setSubFontSize] = useState("18px");
  const [hasScrolled, setHasScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  // Font config
  const fontConfig = useMemo(() => {
    if (i18n.language === "he") return { titleMin: 52, titleMax: 70, subMin: 18, subMax: 20 };
    if (i18n.language === "it") return { titleMin: 49, titleMax: 62, subMin: 18, subMax: 20 };
    if (i18n.language === "es") return { titleMin: 47, titleMax: 61, subMin: 18, subMax: 20 };
    return { titleMin: 48, titleMax: 62, subMin: 18, subMax: 20 };
  }, [i18n.language]);

  // Font size calculation based on section width
  useEffect(() => {
    function updateFontSizes() {
      if (!sectionRef.current) return;
      const w = sectionRef.current.offsetWidth;
      const minW = 1232;
      const maxW = 1400;
      const clamped = Math.min(Math.max(w, minW), maxW);
      const ratio = (clamped - minW) / (maxW - minW);
      const curTitle = fontConfig.titleMin + ratio * (fontConfig.titleMax - fontConfig.titleMin);
      const curSub = fontConfig.subMin + ratio * (fontConfig.subMax - fontConfig.subMin);
      setTitleFontSize(`${curTitle}px`);
      setSubFontSize(`${curSub}px`);
    }
    updateFontSizes();
    if (!sectionRef.current) return;
    const resizeObserver = new ResizeObserver(updateFontSizes);
    resizeObserver.observe(sectionRef.current);
    return () => resizeObserver.disconnect();
  }, [fontConfig]);

  // Scroll detection with 3s smooth fade
  useEffect(() => {
    const scroller = scrollContainerRef.current;
    if (!scroller || !sectionRef.current) return;

    const onScroll = () => {
      // Immediately mark as scrolled on first movement
      setHasScrolled(true);
      
      // Clear existing timeout and set new 3s fade
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setHasScrolled(false);
      }, 3000);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    
    // Initial state
    onScroll();
    
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollContainerRef]);

  // Image rect update
  useEffect(() => {
    const updateRect = () => {
      if (imageRef.current && sectionRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const relativeTop = imageRef.current.offsetTop;
      }
    };

    // Run immediately at init
    updateRect();

    const timeout = setTimeout(updateRect, 2240);

    // Run on window resize
    window.addEventListener("resize", updateRect);

    // Also re-run when the hero image itself finishes loading
    if (imageRef.current) {
      imageRef.current.onload = updateRect;
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateRect);
    };
  }, []);

  const swapWords = useMemo(() => t("hero_slider_words").split("|"), [t, i18n.language]);

  const delayTimeoutRef = useRef<number | null>(null);

  // Decide to show normal Hebrew version (TextSwap) or morphing Hebrew version
  const sectionWidth = sectionRef.current?.offsetWidth || 0;
  const isHebrewMorphingVersion = i18n.language === "he" && sectionWidth < HEBREW_SWAP_THRESHOLD;

  // To simulate TextSwap callback for MorphingText in Hebrew below threshold,
  // cycle through swapWords every 7s (same as rotationInterval ~2200ms *3)
  const [morphIndex, setMorphIndex] = useState(0);
  useEffect(() => {
    if (!isHebrewMorphingVersion) return;
    const interval = setInterval(() => {
      setMorphIndex((idx) => (idx + 1) % swapWords.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isHebrewMorphingVersion, swapWords.length]);

  const handleButtonClick = (buttonKey: "explore" | "contact-info") => {
    if (onButtonClick) {
      onButtonClick(buttonKey);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float-left {0%,100%{transform:translateX(0)}50%{transform:translateX(-25px)}}
        @keyframes float-right {0%,100%{transform:translateX(0)}50%{transform:translateX(25px)}}
        @keyframes float-slow {0%,100%{transform:translateX(0)}50%{transform:translateX(15px)}}
      `}</style>
      <section
        ref={sectionRef}
        className="relative w-full translateY(-23px) overflow-hidden flex flex-row items-center"
        style={{ height: "calc(100vh - 58px)" }}
      >
        <div
          className="flex w-full relative flex-row gap-12"
          style={{ height: "100%", transform: "translateY(-20px)" }}
        >
          <div
            className="flex-1 flex flex-col justify-center"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <h1 className="font-bold tracking-tight text-[var(--foreground)] leading-tight" style={{ fontSize: titleFontSize }}>
                <>
                  {t("hero_title_prefix")}
                  <br />
                  <TextSwap
                    texts={swapWords}
                    mainClassName="px-3 py-1 bg-[var(--accent)] overflow-hidden justify-center rounded-lg"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden inline-flex items-center justify-center"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                    style={{ color: "var(--foreground)", fontWeight: 700, fontSize: titleFontSize }}
                  />
                </>
            </h1>
            <p style={{ lineHeight: 1.75, fontSize: subFontSize }} className="mt-5 mb-8 text-[var(--sub-foreground)]">
              {t("hero_subtext")}
            </p>
            <ButtonSection isRTL={isRTL} onButtonClick={handleButtonClick} />
          </div>
            <div
              className="flex-1 relative flex items-center justify-center"
              style={{
                width: "100%",
                height: "100%", // full available height from flex parent (HeroSection)
              }}
            >
              <ProfileCard
                name={t("profile_name")}
                bio={t("profile_bio")}
              />
            </div>
        </div>
          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-4 pointer-events-none"
            style={{ 
              opacity: hasScrolled ? 0 : 1,
              transition: "opacity 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              pointerEvents: "none" 
            }}
          >
            <ScrollIndicator scrollContainerRef={scrollContainerRef} />
          </div>
      </section>
    </>
  );
}
