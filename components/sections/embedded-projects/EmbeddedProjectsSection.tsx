"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import useIsRTL from "@/hooks/useIsRTL";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import SectionText from "@/components/SectionText";
import LimitedWidthWrapper from "@/components/limited-width-wrapper";
import { CircularTestimonials } from "@/components/CircularTestimonials";
import { embeddedProjects } from "@/data/stuff";

interface EmbeddedProjectsSectionProps {
  metricEvent?: (metric: string) => void;
  maxWidth: string;
  paddingDesktop: string;
  paddingMobile: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export default function EmbeddedProjectsSection({
  metricEvent,
  maxWidth,
  paddingDesktop,
  paddingMobile,
  scrollContainerRef,
}: EmbeddedProjectsSectionProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isRTL = useIsRTL();
  const sectionRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [elementWidth, setElementWidth] = useState(0);

  const lerp = (
    x: number,
    x0: number,
    x1: number,
    y0: number,
    y1: number
  ): number => {
    return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
  };

  const WIDTH_MAX = 1352;
  const WIDTH_MIN = 1174;

  const STYLES_MAX = {
    gap: 4.9,
    imageWidth: 77.3,
    imageContainerTranslateX: 76,
    testimonialTextTranslateY: 56,
    arrowContainerTranslateY: 88,
    mb: 164,
  };

  const STYLES_MIN = {
    gap: 4.4,
    imageWidth: 78,
    imageContainerTranslateX: 64,
    testimonialTextTranslateY: 20,
    arrowContainerTranslateY: 104,
    mb: 92,
  };

  const dynamicStyles = {
    gap: `${lerp(
      elementWidth,
      WIDTH_MIN,
      WIDTH_MAX,
      STYLES_MIN.gap,
      STYLES_MAX.gap
    ).toFixed(2)}rem`,
    imageWidth: `${lerp(
      elementWidth,
      WIDTH_MIN,
      WIDTH_MAX,
      STYLES_MIN.imageWidth,
      STYLES_MAX.imageWidth
    ).toFixed(2)}%`,
    imageContainerTranslateX: `${lerp(
      elementWidth,
      WIDTH_MIN,
      WIDTH_MAX,
      STYLES_MIN.imageContainerTranslateX,
      STYLES_MAX.imageContainerTranslateX
    ).toFixed(2)}px`,
    testimonialTextTranslateY: `${lerp(
      elementWidth,
      WIDTH_MIN,
      WIDTH_MAX,
      STYLES_MIN.testimonialTextTranslateY,
      STYLES_MAX.testimonialTextTranslateY
    ).toFixed(2)}px`,
    arrowContainerTranslateY: `${lerp(
      elementWidth,
      WIDTH_MIN,
      WIDTH_MAX,
      STYLES_MIN.arrowContainerTranslateY,
      STYLES_MAX.arrowContainerTranslateY
    ).toFixed(2)}px`,
    mb: `${lerp(
      elementWidth,
      WIDTH_MIN,
      WIDTH_MAX,
      STYLES_MIN.mb,
      STYLES_MAX.mb
    ).toFixed(2)}px`,
  };

  const testimonials = useMemo(() => {
    return embeddedProjects.map((p) => ({
      id: p.id,
      quote: t(p.descriptionKey),
      name: t(p.nameKey),
      designation: t(p.designationKey),
      src: p.image,
      link: p.link,
    }));
  }, [t, isRTL]);

  useEffect(() => {
    if (!measureRef.current) return;
    const updateWidth = () => {
      const width = measureRef.current?.getBoundingClientRect().width || 0;
      setElementWidth(width);
    };
    updateWidth();
    const timerId = setTimeout(updateWidth, 2000);
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(measureRef.current);
    return () => {
      clearTimeout(timerId);
      resizeObserver.disconnect();
    };
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
          id="embedded-projects-section-text"
          title={t("embedded_projects_block")}
          description={t("embedded_projects_section_text")}
          scrollContainerRef={scrollContainerRef}
          isRTL={isRTL}
        />

        <div
          className="mt-[50px]"
          style={{ marginBottom: dynamicStyles.mb }}
          ref={measureRef}
        >
          <CircularTestimonials
            testimonials={testimonials}
            autoplay
            autoplayInterval={5000}
            gap={dynamicStyles.gap}
            imageWidth={dynamicStyles.imageWidth}
            imageContainerTranslateX={dynamicStyles.imageContainerTranslateX}
            testimonialTextTranslateY={dynamicStyles.testimonialTextTranslateY}
            arrowContainerTranslateY={dynamicStyles.arrowContainerTranslateY}
            isRTL={isRTL}
            // EXACT color and spacing scheme from ProjectShowcase parent
            fontSizes={{
              name: "22px",
              position: "15px",
              testimony: "17px",
            }}
            colors={{
              name: "var(--foreground)",
              position: "var(--sub-foreground)",
              testimony: "var(--middle-foreground)",
            }}
            spacing={{
              top: "20",
              bottom: "20",
              lineHeight: "1.5",
              nameTop: "0",
              nameBottom: "0.25em",
              positionTop: "0",
              positionBottom: "0.25em",
              testimonyTop: "1.75em",
              testimonyBottom: "0em",
            }}
            buttonInscriptions={{
              previousButton: t("previous_button"),
              nextButton: t("next_button"),
              openWebAppButton: t("learn_more_button"),
            }}
            onItemClick={metricEvent}
          />
        </div>
      </LimitedWidthWrapper>
    </section>
  );
}
