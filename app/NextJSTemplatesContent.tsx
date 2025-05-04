"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import StructuredBlock from '@/components/StructuredBlock/StructuredBlock';
import { addRTLProps, headlineProps, textProps, contentProps, maxSectionWidth } from './LandingPage.styles';
import ProjectCard from '@/components/ProjectCard/ProjectCard';

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

const WebProjectsContent: React.FC<WebProjectsContentProps> = ({ isRTL, onProjectClick }) => {
  const { t } = useTranslation();
  const componentRef = useRef<HTMLDivElement>(null);
  const projects: Project[] = [
    { name: t("next-js-template-1-name"), description: t("next-js-template-1-description"), image: t("next-js-template-1-image"), link: t("next-js-template-1-link"), designation: t("next-js-template-1-designation") },
    { name: t("next-js-template-2-name"), description: t("next-js-template-2-description"), image: t("next-js-template-2-image"), link: t("next-js-template-2-link"), designation: t("next-js-template-2-designation") },
  ];

  // Handle click: increment count then open link
  const handleItemClick = async (link: string) => {
    if (link) {
      window.open(link, '_blank');
    }
    if (onProjectClick) {
      onProjectClick(link);
    }
  };

  const handleResize = useCallback(() => {
    if (componentRef.current) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', justifyContent: 'flex-start', alignItems: 'stretch', width: '100%', maxWidth: maxSectionWidth }}>
      <StructuredBlock {...addRTLProps(headlineProps, isRTL)}>
        {t("nextjs-templates-block")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(textProps, isRTL)}>
        {t("nextjs-templates-section-text")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(contentProps, isRTL)}>
        <div className="items-center justify-center relative flex" ref={componentRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-full mx-auto">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  name={project.name}
                  description={project.description}
                  image={project.image}
                  link={project.link}
                  imageAspectRatio={1.37}
                  outerRounding={'var(--outer-smooth-rounding)'}
                  innerRounding={'var(--smooth-rounding)'}
                  outlineColor={'var(--background-adjacent-color)'}
                  hoverOutlineColor={'var(--lightened-background-adjacent-color)'}
                  buttonInscriptions={{ openWebAppButton: t("view-template-button-inscription") }}
                  onItemClick={handleItemClick}
                  isRTL={isRTL}
                />
              ))}
            </div>
        </div>
      </StructuredBlock>
    </div>
  );
};

export default WebProjectsContent;
