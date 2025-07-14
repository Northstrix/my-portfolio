"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import StructuredBlock from "@/components/StructuredBlock/StructuredBlock";
import AnimatedTestimonials from "@/components/AnimatedTestimonials/AnimatedTestimonials";
import {
  addRTLProps,
  headlineProps,
  textProps,
  contentProps,
  maxSectionWidth,
} from "./LandingPage.styles";
import ProjectCard from "@/components/ProjectCard/ProjectCard";

interface Project {
  name: string;
  description: string;
  image: string;
  link: string;
  designation: string;
}

interface WebProjectsContentProps {
  isRTL: boolean;
  onProjectClick?: (link: string) => void;
}

const WebProjectsContent: React.FC<WebProjectsContentProps> = ({
  isRTL,
  onProjectClick,
}) => {
  const { t } = useTranslation();
  const [componentWidth, setComponentWidth] = useState(0);
  const componentRef = useRef<HTMLDivElement>(null);

  const projects: Project[] = [
    {
      name: t("web-project-1-name"),
      description: t("web-project-1-description"),
      image: t("web-project-1-image"),
      link: t("web-project-1-link"),
      designation: t("web-project-1-designation"),
    },
    {
      name: t("web-project-2-name"),
      description: t("web-project-2-description"),
      image: t("web-project-2-image"),
      link: t("web-project-2-link"),
      designation: t("web-project-2-designation"),
    },
    {
      name: t("web-project-3-name"),
      description: t("web-project-3-description"),
      image: t("web-project-3-image"),
      link: t("web-project-3-link"),
      designation: t("web-project-3-designation"),
    },
    {
      name: t("web-project-4-name"),
      description: t("web-project-4-description"),
      image: t("web-project-4-image"),
      link: t("web-project-4-link"),
      designation: t("web-project-4-designation"),
    },
    {
      name: t("web-project-5-name"),
      description: t("web-project-5-description"),
      image: t("web-project-5-image"),
      link: t("web-project-5-link"),
      designation: t("web-project-5-designation"),
    },
    {
      name: t("web-project-6-name"),
      description: t("web-project-6-description"),
      image: t("web-project-6-image"),
      link: t("web-project-6-link"),
      designation: t("web-project-6-designation"),
    },
    {
      name: t("web-project-7-name"),
      description: t("web-project-7-description"),
      image: t("web-project-7-image"),
      link: t("web-project-7-link"),
      designation: t("web-project-7-designation"),
    },
    {
      name: t("web-project-8-name"),
      description: t("web-project-8-description"),
      image: t("web-project-8-image"),
      link: t("web-project-8-link"),
      designation: t("web-project-8-designation"),
    },
  ];

  const handleItemClick = async (link: string) => {
    if (link) {
      window.open(link, "_blank");
    }
    if (onProjectClick) {
      onProjectClick(link);
    }
  };

  const handleResize = useCallback(() => {
    if (componentRef.current) {
      setComponentWidth(componentRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (componentRef.current) {
      resizeObserver.observe(componentRef.current);
    }
    handleResize(); // Initial check
    return () => {
      if (componentRef.current) {
        resizeObserver.unobserve(componentRef.current);
      }
    };
  }, [handleResize]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        justifyContent: "flex-start",
        alignItems: "stretch",
        width: "100%",
        maxWidth: maxSectionWidth,
      }}
    >
      <StructuredBlock {...addRTLProps(headlineProps, isRTL)}>
        {t("web-projects-block")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(textProps, isRTL)}>
        {t("web-projects-section-text")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(contentProps, isRTL)}>
        <div
          className="items-center justify-center relative flex"
          ref={componentRef}
        >
          {componentWidth < 1024 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-full mx-auto">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  name={project.name}
                  description={project.description}
                  image={project.image}
                  link={project.link}
                  imageAspectRatio={1.37}
                  outerRounding={"var(--outer-smooth-rounding)"}
                  innerRounding={"var(--smooth-rounding)"}
                  outlineColor={"var(--background-adjacent-color)"}
                  hoverOutlineColor={
                    "var(--lightened-background-adjacent-color)"
                  }
                  buttonInscriptions={{
                    openWebAppButton: t("open-web-app-button-inscription"),
                  }}
                  onItemClick={handleItemClick}
                  isRTL={isRTL}
                />
              ))}
            </div>
          ) : (
            <AnimatedTestimonials
              testimonials={projects.map((project) => ({
                quote: project.description,
                name: project.name,
                designation: project.designation,
                src: project.image,
                link: project.link,
              }))}
              colors={{
                name: "var(--foreground)",
                position: "var(--refresh-inscription-color)",
                testimony: "var(--foreground)",
              }}
              fontSizes={{ name: "28px", position: "20px", testimony: "20px" }}
              spacing={{
                nameTop: "0",
                nameBottom: "16px",
                positionTop: "0",
                positionBottom: "0.5em",
                testimonyTop: "16px",
                testimonyBottom: "1em",
                lineHeight: "1.52",
              }}
              imageAspectRatio={1.37}
              isRTL={isRTL}
              onItemClick={handleItemClick}
              buttonInscriptions={{
                previousButton: t("previous-button-inscription"),
                nextButton: t("next-button-inscription"),
                openWebAppButton: t("open-web-app-button-inscription"),
              }}
              outerRounding={"var(--outer-smooth-rounding)"}
              innerRounding={"var(--smooth-rounding)"}
              outlineColor={"var(--background-adjacent-color)"}
              hoverOutlineColor={"var(--lightened-background-adjacent-color)"}
            />
          )}
        </div>
      </StructuredBlock>
    </div>
  );
};

export default WebProjectsContent;