"use client";
import React, { useRef, useState, useEffect, forwardRef } from "react";
import useIsRTL from "@/hooks/useIsRTL";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import SectionText from "@/components/SectionText";
import LimitedWidthWrapper from "@/components/limited-width-wrapper";
// Ensure PlaygroundHandle is imported from your content file to type the ref correctly
import PlaygroundContent, { PlaygroundHandle } from "@/components/sections/playground/PlaygroundContent";

interface PlaygroundSectionProps {
  metricEvent: (metric: string) => void;
  maxWidth: string;
  paddingDesktop: string;
  paddingMobile: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  accentColor?: string;
  setAccentColor?: (color: string) => void;
}

// We wrap the component in forwardRef to accept the 'ref' from HomePage
const PlaygroundSection = forwardRef<PlaygroundHandle, PlaygroundSectionProps>(
  (
    {
      metricEvent,
      maxWidth,
      paddingDesktop,
      paddingMobile,
      scrollContainerRef,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const isRTL = useIsRTL();
    const sectionRef = useRef<HTMLElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
      const updateContainerWidth = () => {
        if (sectionRef.current) {
          setContainerWidth(sectionRef.current.clientWidth);
        }
      };

      // Initial call
      updateContainerWidth();

      // Resize listener
      window.addEventListener("resize", updateContainerWidth);
      return () => window.removeEventListener("resize", updateContainerWidth);
    }, []);

    return (
      <section
        ref={sectionRef}
        className={`relative overflow-hidden flex flex-col transition duration-300 ease-in-out ${
          isMobile ? "justify-start min-h-0 py-14" : "py-20"
        }`}
      >
        <LimitedWidthWrapper
          expandToFull={false}
          maxWidth={maxWidth}
          paddingDesktop={paddingDesktop}
          paddingMobile={paddingMobile}
        >
          <SectionText
            id="playground-section-text"
            title={t("playground_block")}
            description={t("playground_section_text")}
            scrollContainerRef={scrollContainerRef}
            isRTL={isRTL}
          />
          {/* 
             We pass the 'ref' received from HomePage down to PlaygroundContent.
             This allows HomePage to call functions inside PlaygroundContent directly
             without triggering a re-render of PlaygroundSection.
          */}
          <PlaygroundContent
            ref={ref}
            containerWidth={containerWidth}
            isRTL={isRTL}
          />
        </LimitedWidthWrapper>
      </section>
    );
  }
);

PlaygroundSection.displayName = "PlaygroundSection";

export default PlaygroundSection;