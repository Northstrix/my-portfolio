"use client";
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StructuredBlock from '@/components/StructuredBlock/StructuredBlock';
import { addRTLProps, headlineProps, textProps, contentProps, maxSectionWidth } from './LandingPage.styles';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconCheck, IconChecks } from "@tabler/icons-react";

// Define text sizes for different languages and screen widths
const TEXT_SIZES = {
  en: { minWidth: 300, maxWidth: 600, minTitleSize: 14, maxTitleSize: 24, minDescriptionSize: 12, maxDescriptionSize: 18, },
  he: { minWidth: 300, maxWidth: 600, minTitleSize: 14, maxTitleSize: 24, minDescriptionSize: 12, maxDescriptionSize: 18, },
  es_ar: { minWidth: 300, maxWidth: 600, minTitleSize: 10, maxTitleSize: 22, minDescriptionSize: 9.72, maxDescriptionSize: 18, },
  de: { minWidth: 300, maxWidth: 600, minTitleSize: 14, maxTitleSize: 24, minDescriptionSize: 12, maxDescriptionSize: 18, },
  ru: { minWidth: 300, maxWidth: 600, minTitleSize: 14, maxTitleSize: 24, minDescriptionSize: 10.4, maxDescriptionSize: 18, },
};

interface EducationCardContentProps {
  degree: string;
  institutionName: string;
  major: string;
  beginningDate: string;
  graduationDate: string;
  align: "flex-start" | "flex-end";
  textAlign: "left" | "right";
  textDirection: "ltr" | "rtl";
  isMobile: boolean;
  icon: React.ReactNode;
  titleSize: number;
  descriptionSize: number;
  isRTL: boolean;
}

const EducationCardContent: React.FC<EducationCardContentProps> = ({
  degree,
  institutionName,
  major,
  beginningDate,
  graduationDate,
  align,
  textAlign,
  textDirection,
  isMobile,
  icon,
  titleSize,
  descriptionSize,
  isRTL,
}) => {
  const { t } = useTranslation();
  const resolvedTextAlign = isRTL ? "right" : textAlign;

  return (
    <div>
      <div className="font-sans font-bold text-[var(--foreground)] mb-2 flex items-center" style={{ lineHeight: "1.25", marginBottom: "16px", fontSize: `${titleSize}px` }}>
        {icon}
        <span style={{ marginLeft: isRTL ? 0 : '0.5rem', marginRight: isRTL ? '0.5rem' : 0 }}>{t(degree)}</span>
      </div>
      <div className="font-sans text-[var(--secondary-foreground)] mb-2" style={{ textAlign: resolvedTextAlign, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "pre-line", fontSize: `${descriptionSize}px` }}>
        {t(institutionName)}
      </div>
      <div className="font-sans text-[var(--secondary-foreground)] mb-2" style={{ textAlign: resolvedTextAlign, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "pre-line", fontSize: `${descriptionSize}px` }}>
        {t(major)}
      </div>
      <div className="font-sans text-[var(--secondary-foreground)] mb-2" style={{ textAlign: resolvedTextAlign, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "pre-line", fontSize: `${descriptionSize}px` }}>
        {`${t(beginningDate)} - ${t(graduationDate)}`}
      </div>
    </div>
  );
};

interface EducationCardProps {
  degree: string;
  institutionName: string;
  major: string;
  beginningDate: string;
  graduationDate: string;
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
  icon: React.ReactNode;
  titleSize: number;
  descriptionSize: number;
}

const EducationCard: React.FC<EducationCardProps> = ({
  degree,
  institutionName,
  major,
  beginningDate,
  graduationDate,
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
  icon,
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
      className={cn("group/bento hover:shadow-xl transition duration-200 flex flex-col h-full relative")}
      style={{
        backgroundColor: isHovered ? 'var(--lightened-background-adjacent-color)' : 'var(--background-adjacent-color)',
        padding: '1px',
        borderRadius: outerRounding,
        borderColor: isHovered ? hoverOutlineColor : outlineColor,
        transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
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
      <div className="flex flex-col h-full" style={{
        borderRadius: innerRounding,
        backgroundColor: 'var(--card-background)',
        padding: '1rem',
        alignItems: align,
        textAlign: isRTL ? "right" : textAlign,
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        direction: textDirection,
        flex: 1,
        display: "flex",
      }}>
        <EducationCardContent
          degree={degree}
          institutionName={institutionName}
          major={major}
          beginningDate={beginningDate}
          graduationDate={graduationDate}
          align={align}
          textAlign={textAlign}
          textDirection={textDirection}
          isMobile={isMobile}
          icon={icon}
          titleSize={titleSize}
          descriptionSize={descriptionSize}
          isRTL={isRTL}
        />
      </div>
    </motion.div>
  );
};

interface EducationContentProps {
  isRTL: boolean;
}

const EducationContent: React.FC<EducationContentProps> = ({ isRTL }) => {
  const { t, i18n } = useTranslation();
  const componentRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDoubleCard, setIsDoubleCard] = useState(false);
  const language = i18n.language as "en" | "he" | "es_ar";
  const [titleSize, setTitleSize] = useState(TEXT_SIZES[language].maxTitleSize);
  const [descriptionSize, setDescriptionSize] = useState(TEXT_SIZES[language].maxDescriptionSize);

  const handleResize = useCallback(() => {
    if (componentRef.current && cardsContainerRef.current) {
      const width = cardsContainerRef.current.offsetWidth;
      setIsMobile(width < 600);
      setIsDoubleCard(width >= 1096);
      const updateTextSize = () => {
        const { minWidth, maxWidth, minTitleSize, maxTitleSize, minDescriptionSize, maxDescriptionSize } = TEXT_SIZES[language];
        const calculatedTitleSize = ((maxTitleSize - minTitleSize) / (maxWidth - minWidth)) * (width - minWidth) + minTitleSize;
        const cappedTitleSize = Math.min(calculatedTitleSize, maxTitleSize);
        setTitleSize(cappedTitleSize);
        const calculatedDescriptionSize = ((maxDescriptionSize - minDescriptionSize) / (maxWidth - minWidth)) * (width - minWidth) + minDescriptionSize;
        const cappedDescriptionSize = Math.min(calculatedDescriptionSize, maxDescriptionSize);
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
    <div ref={componentRef} style={{ display: 'flex', flexDirection: 'column', gap: '0px', justifyContent: 'flex-start', alignItems: 'stretch', width: '100%', maxWidth: maxSectionWidth }}>
      <StructuredBlock {...addRTLProps(headlineProps, isRTL)}>
        {t("education-block")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(textProps, isRTL)}>
        {t("education-section-text")}
      </StructuredBlock>
      <StructuredBlock {...addRTLProps(contentProps, isRTL)}>
        <div className="items-center justify-center relative flex" ref={cardsContainerRef}>
          <div style={{ width: '100%' }} className={`grid ${isDoubleCard ? 'grid-cols-2' : 'grid-cols-1'} gap-4 max-w-full mx-auto`}>
            <EducationCard
              degree="education-card1-degree-name"
              institutionName="education-card1-institution-name"
              major="education-card1-major"
              beginningDate="education-card1-beginning-date"
              graduationDate="education-card1-graduation-date"
              align="flex-start"
              textAlign="left"
              textDirection={isRTL ? "rtl" : "ltr"}
              isMobile={isMobile}
              hovered={false}
              cardStyle={{ border: '0px solid transparent' }}
              cardHover={{}}
              order={1}
              outerRounding="var(--outer-mild-rounding)"
              innerRounding="var(--mild-rounding)"
              outlineColor="var(--background-adjacent-color)"
              hoverOutlineColor="var(--lightened-background-adjacent-color)"
              isRTL={isRTL}
              icon={<IconCheck stroke={2.5} size={titleSize} />}
              titleSize={titleSize}
              descriptionSize={descriptionSize}
            />
            <EducationCard
              degree="education-card2-degree-name"
              institutionName="education-card2-institution-name"
              major="education-card2-major"
              beginningDate="education-card2-beginning-date"
              graduationDate="education-card2-graduation-date"
              align="flex-start"
              textAlign="left"
              textDirection={isRTL ? "rtl" : "ltr"}
              isMobile={isMobile}
              hovered={false}
              cardStyle={{ border: '0px solid transparent' }}
              cardHover={{}}
              order={2}
              outerRounding="var(--outer-mild-rounding)"
              innerRounding="var(--mild-rounding)"
              outlineColor="var(--background-adjacent-color)"
              hoverOutlineColor="var(--lightened-background-adjacent-color)"
              isRTL={isRTL}
              icon={<IconChecks stroke={2.5} size={titleSize} />}
              titleSize={titleSize}
              descriptionSize={descriptionSize}
            />
          </div>
        </div>
      </StructuredBlock>
    </div>
  );
};

export default EducationContent;
