"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import useIsRTL from "@/hooks/useIsRTL";
import { MobileDisableableMorphText } from "./MobileDisableableMorphText";
import { MobileDisableableMorphText as MobileDisableableMorphTextWithOptionalLineBreak } from "./MobileDisableableMorphTextWithOptionalLineBreak";
import MobileButtonSection from "./MobileButtonSection";
import HeroCollage from "./HeroCollage";
import ProfileCard from "@/components/ProfileCard";
import useMobileButtonHeight from "@/hooks/useMobileButtonHeight";

interface MobileHeroSectionProps {
  onButtonClick?: (buttonKey: "explore" | "contact-info") => void;
}

// Exponential decay scaling applied to font sizes for stronger reduction on smaller widths.
function decaySizeFactor(
  baseSize: number,
  windowWidth: number,
  decayStartWidth = 600,
  decayPer100px = 0.7,
  minSizeFactor = 0.3
) {
  if (windowWidth >= decayStartWidth) return baseSize;
  if (windowWidth <= 0) return baseSize * minSizeFactor;

  const widthDrop = decayStartWidth - windowWidth;
  const multiplier = Math.pow(decayPer100px, widthDrop / 100);

  const clampedMultiplier = Math.max(multiplier, minSizeFactor);

  return baseSize * clampedMultiplier;
}

// Utility to interpolate margin bottom px between 4px at 200px width and 40px at 600px width
function interpolateMarginBottom(windowWidth: number) {
  const minWidth = 200;
  const maxWidth = 600;
  const minMb = -4;
  const maxMb = 40;

  if (windowWidth <= minWidth) return minMb;
  if (windowWidth >= maxWidth) return maxMb;

  const ratio = (windowWidth - minWidth) / (maxWidth - minWidth);
  return minMb + ratio * (maxMb - minMb);
}

export default function MobileHeroSection({ onButtonClick }: MobileHeroSectionProps) {
  const isRTL = useIsRTL();
  const sectionRef = useRef<HTMLElement>(null);
  const { i18n, t } = useTranslation();
  const mobileButtonHeight = useMobileButtonHeight();

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1226);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Per-language font + padding config
  const fontConfig = useMemo(() => {
    if (i18n.language === "he") {
      return { titleMin: 40, titleMax: 94, subMin: 15, subMax: 22, padMin: 12, padMax: 32 };
    }
    if (i18n.language === "it" || i18n.language === "es") {
      return { titleMin: 44, titleMax: 88, subMin: 14.4, subMax: 22, padMin: 12, padMax: 60 };
    }
    return { titleMin: 40, titleMax: 92, subMin: 14, subMax: 21.6, padMin: 12, padMax: 40 };
  }, [i18n.language]);

  const [rawTitleFontSize, setRawTitleFontSize] = useState(fontConfig.titleMin);
  const [subFontSize, setSubFontSize] = useState(fontConfig.subMin);
  const [sectionPadding, setSectionPadding] = useState(fontConfig.padMin);
  const swapWords = useMemo(() => t("hero_slider_words").split("|"), [t, i18n.language]);
  const [currentWord, setCurrentWord] = useState(swapWords[0] || "");

  // Cycle morphing words
  useEffect(() => {
    if (!swapWords.length) return;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % swapWords.length;
      setCurrentWord(swapWords[index]);
    }, 4400);
    return () => clearInterval(interval);
  }, [swapWords]);

  // Update raw font sizes and padding based on container width
  useEffect(() => {
    if (!sectionRef.current) return;
    const updateSizes = () => {
      const w = sectionRef.current ? sectionRef.current.offsetWidth : 0;
      const minW = 120;
      const maxW = 1226;
      const clamped = Math.min(Math.max(w, minW), maxW);
      const ratio = (clamped - minW) / (maxW - minW);

      setRawTitleFontSize(fontConfig.titleMin + ratio * (fontConfig.titleMax - fontConfig.titleMin));
      setSubFontSize(fontConfig.subMin + ratio * (fontConfig.subMax - fontConfig.subMin));
      setSectionPadding(fontConfig.padMin + ratio * (fontConfig.padMax - fontConfig.padMin));
    };
    updateSizes();
    const resizeObs = new ResizeObserver(updateSizes);
    if (sectionRef.current) resizeObs.observe(sectionRef.current);
    return () => resizeObs.disconnect();
  }, [fontConfig]);

  const adjustedTitleFontSize = decaySizeFactor(rawTitleFontSize, windowWidth, 600, 0.84);

  // Dynamic margin bottom for subtext paragraph
  const dynamicMarginBottom = interpolateMarginBottom(windowWidth);

  const showStaticProfileCard = windowWidth < 524;

  return (
    <section
      ref={sectionRef}
      className={clsx(
        "relative w-full flex flex-col items-center justify-center text-center",
        isRTL ? "rtl" : "ltr"
      )}
      style={{ height: "auto", paddingTop: sectionPadding }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mt-16 w-full">
        {showStaticProfileCard ? (
          <div style={{ marginBottom: 12, marginTop: -52, width: "100%" }}>
            <ProfileCard name={t("profile_name")} bio={t("profile_bio")} isMobile={true} />
          </div>
        ) : (
          <HeroCollage />
        )}
      </div>

      <h1
        className="font-bold tracking-tight text-[var(--foreground)] leading-tight w-full flex flex-col items-center justify-center"
        style={{ fontSize: `${adjustedTitleFontSize}px` }}
      >
        <span className="mb-2">
          <MobileDisableableMorphTextWithOptionalLineBreak
            texts={[t("hero_title_prefix")]}
            className="bg-[var(--background)]"
            disable
          />
        </span>

        <MobileDisableableMorphText texts={[currentWord]} className="px-3 py-1 bg-[var(--accent)]" />
      </h1>

      <p
        style={{ lineHeight: 1.75, fontSize: `${subFontSize}px`, marginBottom: `${dynamicMarginBottom}px` }}
        className="mt-5 text-[var(--sub-foreground)]"
      >
        {t("hero_subtext")}
      </p>

      <div className="w-full flex justify-center">
        <MobileButtonSection
          buttonsBelowOneAnother
          mobileButtonHeight={mobileButtonHeight}
          isRTL={isRTL}
          onButtonClick={onButtonClick}
        />
      </div>
    </section>
  );
}
