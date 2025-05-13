"use client";
import React, { useRef, useEffect, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import StructuredBlock from "@/components/StructuredBlock/StructuredBlock";
import {
  addRTLProps,
  headlineProps,
  textProps,
  contentProps,
  maxSectionWidth,
} from "./LandingPage.styles";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";

// Define text sizes for different languages and screen widths
const TEXT_SIZES = {
  en: {
    minWidth: 300,
    maxWidth: 600,
    minTitleSize: 14,
    maxTitleSize: 24,
    minDescriptionSize: 12,
    maxDescriptionSize: 18,
  },
  he: {
    minWidth: 300,
    maxWidth: 600,
    minTitleSize: 14,
    maxTitleSize: 24,
    minDescriptionSize: 12,
    maxDescriptionSize: 18,
  },
  es_ar: {
    minWidth: 300,
    maxWidth: 600,
    minTitleSize: 10,
    maxTitleSize: 22,
    minDescriptionSize: 9.72,
    maxDescriptionSize: 18,
  },
  de: {
    minWidth: 300,
    maxWidth: 600,
    minTitleSize: 14,
    maxTitleSize: 24,
    minDescriptionSize: 12,
    maxDescriptionSize: 18,
  },
  ru: {
    minWidth: 300,
    maxWidth: 600,
    minTitleSize: 14,
    maxTitleSize: 24,
    minDescriptionSize: 10.4,
    maxDescriptionSize: 18,
  },
};

interface WorkExperienceCardContentProps {
  position: string;
  companyName: string;
  skills: string[];
  beginningDate: string;
  endingDate: string;
  align: "flex-start" | "flex-end";
  textAlign: "left" | "right";
  textDirection: "ltr" | "rtl";
  isMobile: boolean;
  titleSize: number;
  descriptionSize: number;
  isRTL: boolean;
}

const WorkExperienceCardContent: React.FC<WorkExperienceCardContentProps> = ({
  position,
  companyName,
  skills,
  beginningDate,
  endingDate,
  align,
  textAlign,
  textDirection,
  isMobile,
  titleSize,
  descriptionSize,
  isRTL,
}) => {
  const { t } = useTranslation();
  const resolvedTextAlign = isRTL ? "right" : textAlign;

  return (
    <div>
      <div
        className="font-sans font-bold text-[var(--foreground)] mb-2"
        style={{
          lineHeight: "1.25",
          marginBottom: "16px",
          fontSize: `${titleSize}px`,
          textAlign: resolvedTextAlign,
        }}
      >
        {t(position)}
      </div>
      <div
        className="font-sans text-[var(--secondary-foreground)] mb-2"
        style={{
          textAlign: resolvedTextAlign,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "pre-line",
          fontSize: `${descriptionSize}px`,
        }}
      >
        {t("company-name-inscription")}: {t(companyName)}
      </div>
      <ul
        style={{
          textAlign: resolvedTextAlign,
          listStyleType: "none",
          padding: 0,
        }}
      >
        {skills.map((skill, index) => (
          <li
            key={index}
            className="flex items-center mb-2"
            style={{ fontSize: `${descriptionSize}px` }}
          >
            <IconCheck
              stroke={2.5}
              size={descriptionSize}
              style={{
                marginRight: "0.5rem",
                marginLeft: isRTL ? "0.5rem" : 0,
              }}
            />
            <span>{t(skill)}</span>
          </li>
        ))}
      </ul>
      <div
        className="font-sans text-[var(--secondary-foreground)] mb-2"
        style={{
          textAlign: resolvedTextAlign,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "pre-line",
          fontSize: `${descriptionSize}px`,
        }}
      >
        {`${t(beginningDate)} - ${t(endingDate)}`}
      </div>
    </div>
  );
};

interface WorkExperienceCardProps {
  position: string;
  companyName: string;
  skills: string[];
  beginningDate: string;
  endingDate: string;
  align: "flex-start" | "flex-end";
  textAlign: "left" | "right";
  textDirection: "ltr" | "rtl";
  isMobile: boolean;
  hovered: boolean;
  cardStyle: React.CSSProperties;
  cardHover: React.CSSProperties;
  order: number;
  outerRounding: string;
  innerRounding: string;
  outlineColor: string;
  hoverOutlineColor: string;
  isRTL?: boolean;
  titleSize: number;
  descriptionSize: number;
}

const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({
  position,
  companyName,
  skills,
  beginningDate,
  endingDate,
  align,
  textAlign,
  textDirection,
  isMobile,
  hovered,
  cardStyle,
  cardHover,
  order,
  outerRounding,
  innerRounding,
  outlineColor,
  hoverOutlineColor,
  isRTL = false,
  titleSize,
  descriptionSize,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const isActive = hovered || isHovered;
  const { t } = useTranslation();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setSpotlightPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      className={cn(
        "group/bento hover:shadow-xl transition duration-200 flex flex-col h-full relative",
      )}
      style={{
        backgroundColor: isHovered
          ? "var(--lightened-background-adjacent-color)"
          : "var(--background-adjacent-color)",
        padding: "1px",
        borderRadius: outerRounding,
        borderColor: isHovered ? hoverOutlineColor : outlineColor,
        transition:
          "background-color 0.3s ease-in-out, border-color 0.3s ease-in-out",
        ...cardStyle,
        ...(isActive ? cardHover : {}),
        order,
        direction: textDirection,
        cursor: "pointer",
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setOpacity(0.6);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setOpacity(0);
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          borderRadius: innerRounding,
          background: `radial-gradient(circle at ${spotlightPosition.x}px ${spotlightPosition.y}px, #ffffff30, transparent 80%)`,
        }}
      />
      <div
        className="flex flex-col h-full"
        style={{
          borderRadius: innerRounding,
          backgroundColor: "var(--card-background)",
          padding: "1rem",
          alignItems: align,
          textAlign: isRTL ? "right" : textAlign,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
          direction: textDirection,
          flex: 1,
          display: "flex",
        }}
      >
        <WorkExperienceCardContent
          position={position}
          companyName={companyName}
          skills={skills}
          beginningDate={beginningDate}
          endingDate={endingDate}
          align={align}
          textAlign={textAlign}
          textDirection={textDirection}
          isMobile={isMobile}
          titleSize={titleSize}
          descriptionSize={descriptionSize}
          isRTL={isRTL}
        />
      </div>
    </motion.div>
  );
};

interface WorkExperienceContentProps {
  isRTL: boolean;
}

const WorkExperienceContent: React.FC<WorkExperienceContentProps> = ({
  isRTL,
}) => {
  const { t, i18n } = useTranslation();
  const componentRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const language = i18n.language as "en" | "he" | "es_ar" | "de" | "ru";
  const [titleSize, setTitleSize] = useState(TEXT_SIZES[language].maxTitleSize);
  const [descriptionSize, setDescriptionSize] = useState(
    TEXT_SIZES[language].maxDescriptionSize,
  );

  const handleResize = useCallback(() => {
    if (componentRef.current && cardsContainerRef.current) {
      const width = cardsContainerRef.current.offsetWidth;
      setIsMobile(width < 600);
      const updateTextSize = () => {
        const {
          minWidth,
          maxWidth,
          minTitleSize,
          maxTitleSize,
          minDescriptionSize,
          maxDescriptionSize,
        } = TEXT_SIZES[language];
        const calculatedTitleSize =
          ((maxTitleSize - minTitleSize) / (maxWidth - minWidth)) *
            (width - minWidth) +
          minTitleSize;
        const cappedTitleSize = Math.min(calculatedTitleSize, maxTitleSize);
        setTitleSize(cappedTitleSize);
        const calculatedDescriptionSize =
          ((maxDescriptionSize - minDescriptionSize) / (maxWidth - minWidth)) *
            (width - minWidth) +
          minDescriptionSize;
        const cappedDescriptionSize = Math.min(
          calculatedDescriptionSize,
          maxDescriptionSize,
        );
        setDescriptionSize(cappedDescriptionSize);
      };
      updateTextSize();
    }
  }, [language]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 300);
    });
    let resizeTimeout: NodeJS.Timeout;
    if (componentRef.current) {
      resizeObserver.observe(componentRef.current);
    }
    handleResize();
    return () => {
      if (componentRef.current) {
        resizeObserver.unobserve(componentRef.current);
      }
      clearTimeout(resizeTimeout);
    };
  }, [handleResize]);

  return (
    <div
      ref={componentRef}
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
        {t("work-experience-block")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(textProps, isRTL)}>
        {t("work-experience-section-text")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(contentProps, isRTL)}>
        <div
          className="items-center justify-center relative flex"
          ref={cardsContainerRef}
        >
          <div
            style={{ width: "100%" }}
            className="grid grid-cols-1 gap-4 max-w-full mx-auto"
          >
            <WorkExperienceCard
              position="work-experience-card1-position"
              companyName="work-experience-card1-company-name"
              skills={[
                "work-experience-card1-skill1",
                "work-experience-card1-skill2",
                "work-experience-card1-skill3",
                "work-experience-card1-skill4",
              ]}
              beginningDate="work-experience-card1-beginning-date"
              endingDate="work-experience-card1-ending-date"
              align="flex-start"
              textAlign="left"
              textDirection={isRTL ? "rtl" : "ltr"}
              isMobile={isMobile}
              hovered={false}
              cardStyle={{ border: "0px solid transparent" }}
              cardHover={{}}
              order={1}
              outerRounding="var(--outer-mild-rounding)"
              innerRounding="var(--mild-rounding)"
              outlineColor="var(--background-adjacent-color)"
              hoverOutlineColor="var(--lightened-background-adjacent-color)"
              isRTL={isRTL}
              titleSize={titleSize}
              descriptionSize={descriptionSize}
            />
          </div>
        </div>
      </StructuredBlock>
    </div>
  );
};

export default WorkExperienceContent;
