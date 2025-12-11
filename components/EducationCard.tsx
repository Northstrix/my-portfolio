"use client";

import { useState } from "react";
import useIsRTL from "@/hooks/useIsRTL";
import { useTranslation } from "react-i18next";

interface Education {
  id: string;
  degree: string;
  institution: string;
  major: string;
  startDate: string;
  graduationDate: string;
}

interface EducationCardProps {
  education: Education;
  onCardClick?: (metric: string) => void;
}

export default function EducationCard({ education, onCardClick }: EducationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isRTL = useIsRTL();
  const { t } = useTranslation();

  const handleInteraction = (eventType: string) => {
    onCardClick?.(`${education.id}-${eventType}-from-education-card`);
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      onClick={() => handleInteraction("clicked")}
      onAuxClick={(e) => {
        if (e.button === 1) handleInteraction("wheel-clicked");
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block relative rounded-[var(--border-radius)] border border-[var(--border-color)] overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: isHovered
          ? "var(--lightened-background-adjacent-color)"
          : "var(--background-adjacent-color)",
        transition: "background-color 0.3s ease-in-out, border 0.3s ease-in-out",
      }}
    >
      <div className="flex flex-col relative z-10 p-5 space-y-2">
        <div
          className="transition-transform duration-300"
          style={{
            transform: isHovered
              ? isRTL
                ? "translateX(-6px)"
                : "translateX(6px)"
              : "translateX(0)",
            transition: "transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
          }}
        >
          {/* Degree */}
          <h3 className="font-headline text-2xl font-semibold text-[var(--foreground)] mb-2">
            {education.degree}
          </h3>

          {/* Institution */}
          <h4 className="font-body text-lg font-medium text-[var(--sub-foreground)] mb-1">
            {education.institution}
          </h4>

          {/* Major */}
          <p className="font-body text-base text-[var(--foreground)] italic mb-3">
            {education.major}
          </p>

          {/* Dates block */}
          <div
            className="flex flex-row justify-between items-start border-t border-[var(--border-color)] pt-3 mt-2"
            style={{
              color: "var(--foreground)",
              fontSize: "0.9rem",
            }}
          >
            <div className="flex flex-col">
              <span className="font-semibold text-[var(--sub-foreground)] mb-1">
                {t("education_from")}
              </span>
              <span className="text-[var(--foreground)]">
                {education.startDate}
              </span>
            </div>

            <div className="flex flex-col text-right">
              <span className="font-semibold text-[var(--sub-foreground)] mb-1">
                {t("education_to")}
              </span>
              <span className="text-[var(--foreground)]">
                {education.graduationDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
