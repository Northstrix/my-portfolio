"use client";
import React, { useRef, useState, useEffect } from "react";
import useIsRTL from "@/hooks/useIsRTL";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import SectionText from "@/components/SectionText";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import LimitedWidthWrapper from "@/components/limited-width-wrapper";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/stuff";

interface ProjectsSectionProps {
  metricEvent: (metric: string) => void;
  maxWidth: string;
  paddingDesktop: string;
  paddingMobile: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export default function ProjectsSection({
  metricEvent,
  maxWidth,
  paddingDesktop,
  paddingMobile,
  scrollContainerRef,
}: ProjectsSectionProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isRTL = useIsRTL();
  const sectionRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  const translatedProjects = projects.map((m) => ({
    id: m.id,
    title: t(m.nameKey),
    description: t(m.descriptionKey),
    tech: t(m.techKey),
    image: m.image,
    link: m.link,
  }));

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

  const breakpoints = {
    twoCols: 912,
  };

  let columns = 1;
  if (containerWidth >= breakpoints.twoCols) columns = 2;

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
          id="project-section-text"
          title={t("projects_block")}
          description={t("projects_section_text")}
          scrollContainerRef={scrollContainerRef}
          isRTL={isRTL}
        />

        {isMobile ? (
          <div
            className="grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: "16px",
              width: "100%",
            }}
          >
            {translatedProjects.map((project) => (
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
          <div
            style={{
              maxWidth: maxWidth,
              margin: "0 auto",
              paddingLeft: paddingDesktop,
              paddingRight: paddingDesktop,
            }}
          >
            <div className="mt-[-70px] mb-[-62px]">
              <ProjectShowcase
                testimonials={translatedProjects.map((p) => ({
                  quote: p.description,
                  name: p.title,
                  designation: p.tech,
                  src: p.image,
                  id: p.id,
                  link: p.link,
                }))}

                isRTL={isRTL}
                imageAspectRatio={1280 / 935}
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
                  openWebAppButton: t("open_web_app_button"),
                }}
                onItemClick={(metric) => {
                  metricEvent(metric);
                }}
              />
            </div>
          </div>
        )}
      </LimitedWidthWrapper>
    </section>
  );
}
