"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import useIsRTL from "@/hooks/useIsRTL";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import SectionText from "@/components/SectionText";
import LimitedWidthWrapper from "@/components/limited-width-wrapper";
import ProjectCard from "@/components/ProjectCard";
import { embeddedProjects } from "@/data/stuff";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";

interface MobileEmbeddedProjectsSectionProps {
  metricEvent: (metric: string) => void;
  maxWidth: string;
  paddingDesktop: string;
  paddingMobile: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export default function MobileEmbeddedProjectsSection({
  metricEvent,
  maxWidth,
  paddingDesktop,
  paddingMobile,
  scrollContainerRef,
}: MobileEmbeddedProjectsSectionProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isRTL = useIsRTL();
  
  const sectionRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // ✅ Uses embeddedProjects data from @/data/stuff
  const testimonials = useMemo(() => {
    return embeddedProjects.map((p) => ({
      id: p.id,
      quote: t(p.descriptionKey),
      name: t(p.nameKey),
      designation: t(p.designationKey),
      rating: "5.0",
      src: p.image,
      link: p.link,
    }));
  }, [t, embeddedProjects]);

  // ✅ Projects for ProjectCard (same data structure)
  const projects = useMemo(() => {
    return embeddedProjects.map((p) => ({
      id: p.id,
      title: t(p.nameKey),
      description: t(p.descriptionKey),
      tech: t(p.designationKey),
      image: p.image,
      link: p.link,
    }));
  }, [t, embeddedProjects]);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (sectionRef.current) {
        setContainerWidth(sectionRef.current.clientWidth);
      }
    };
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);
    return () => window.removeEventListener("resize", updateContainerWidth);
  }, []);

  // ✅ EXACT ProjectsSection LOGIC: 912px breakpoint
  const breakpoints = {
    twoCols: 912,
  };

  let columns = 1;
  if (containerWidth >= breakpoints.twoCols) columns = 2;

  // Font scaling (preserved original logic)
  const baseWidth = 1226;
  const reductionStep = 36;
  const reductionRate = 0.0125;
  const criticalWidth = 1190;
  let fontScale = 1;
  if (containerWidth <= criticalWidth) {
    const steps = Math.floor((baseWidth - containerWidth) / reductionStep);
    fontScale = Math.max(0.5, 1 - steps * reductionRate);
  }

  // Padding interpolation (preserved original logic)
  const maxW = 1220;
  const minW = 200;
  const clampW = Math.min(Math.max(containerWidth, minW), maxW);
  const ratio = (clampW - minW) / (maxW - minW);
  const padY = 3.2 + (32 - 3.2) * ratio;
  const padX = 4 + (40 - 4) * ratio;
  const dynamicPadding = `${padY.toFixed(2)}px ${padX.toFixed(2)}px`;

  // Interpolate testimonialHeight + testimonialStartFraction (preserved original logic)
  const minBreakpoint = 694;
  const maxBreakpoint = 1152;
  const minHeight = 224;
  const maxHeight = 266;
  const minFraction = 0.675;
  const maxFraction = 0.81;

  let ratioBreak = 0;
  if (containerWidth <= minBreakpoint) ratioBreak = 0;
  else if (containerWidth >= maxBreakpoint) ratioBreak = 1;
  else
    ratioBreak = (containerWidth - minBreakpoint) / (maxBreakpoint - minBreakpoint);

  let rawHeight = minHeight + (maxHeight - minHeight) * ratioBreak;
  let testimonialHeight = Math.round(rawHeight);
  if (testimonialHeight % 2 !== 0) {
    testimonialHeight += 1;
  }

  const testimonialStartFraction =
    minFraction + (maxFraction - minFraction) * ratioBreak;

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
          id="mobile-embedded-projects-section-text"
          title={t("embedded_projects_block")}
          description={t("embedded_projects_section_text")}
          scrollContainerRef={scrollContainerRef}
          isRTL={isRTL}
        />

        {columns === 1 ? (
          // ✅ ONE COLUMN: ProjectCard grid
          <div
            className="grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: "16px",
              width: "100%",
            }}
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onCardClick={(metric) => {
                  metricEvent(metric);
                }}
              />
            ))}
          </div>
        ) : (
          // ✅ TWO COLUMNS: TestimonialCarousel
          <TestimonialCarousel
            testimonials={testimonials}
            isRTL={isRTL}
            testimonialHeight={testimonialHeight}
            testimonialStartFraction={testimonialStartFraction}
            imageAspectRatio="1 / 1"
            imageBorderRadius="12px"
            testimonialPadding={dynamicPadding}
            nameFontSize={`${1.5 * fontScale}rem`}
            designationFontSize={`${0.875 * fontScale}rem`}
            quoteFontSize={`${1 * fontScale}rem`}
            autoplay
            autoplayInterval={5000}
            showFirstSentenceOnly
            colors={{
              name: "var(--foreground)",
              designation: "var(--sub-foreground)",
              testimony: "var(--middle-foreground)",
              arrowBackground: "var(--foreground)",
              arrowHoverBackground: "var(--accent)",
              arrowForeground: "var(--background)",
              arrowForegroundHover: "var(--foreground)",
            }}
            buttonInscriptions={{
              previousButton: t("previous_button"),
              nextButton: t("next_button"),
              openWebAppButton: t("learn_more_button"),
            }}
            onItemClick={(metric) => {
              metricEvent(metric);
            }}
          />
        )}
      </LimitedWidthWrapper>
    </section>
  );
}
