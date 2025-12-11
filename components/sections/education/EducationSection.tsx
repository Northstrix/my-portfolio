"use client";
import React, { useRef, useState, useEffect } from "react";
import useIsRTL from "@/hooks/useIsRTL";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import SectionText from "@/components/SectionText";
import LimitedWidthWrapper from "@/components/limited-width-wrapper";
import EducationCard from "@/components/EducationCard";
import { education } from "@/data/stuff";

interface EducationSectionProps {
  maxWidth: string;
  paddingDesktop: string;
  paddingMobile: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export default function EducationSection({
  maxWidth,
  paddingDesktop,
  paddingMobile,
  scrollContainerRef,
}: EducationSectionProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isRTL = useIsRTL();
  const sectionRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const translatedEducation = education.map((e) => ({
    id: e.id,
    degree: t(e.degreeKey),
    institution: t(e.institutionKey),
    major: t(e.majorKey),
    startDate: t(e.beginningDateKey),
    graduationDate: t(e.graduationDateKey),
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

  const breakpoints = { twoCols: 912 };
  let columns = containerWidth >= breakpoints.twoCols ? 2 : 1;

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
          id="education-section-text"
          title={t("education_block")}
          description={t("education_section_text")}
          scrollContainerRef={scrollContainerRef}
          isRTL={isRTL}
        />
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "16px",
            width: "100%",
          }}
        >
          {translatedEducation.map((edu) => (
            <EducationCard
              key={edu.id}
              education={edu}
            />
          ))}
        </div>
      </LimitedWidthWrapper>
    </section>
  );
}
