"use client";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faMedium, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTools } from '@fortawesome/free-solid-svg-icons'; // instructables icon
import HalomotButton from "@/components/HalomotButton/HalomotButton";
import { useTranslation } from 'react-i18next';

// Define text sizes for different languages and screen widths
const TEXT_SIZES = {
  en: { 
    minWidth: 402,
    maxWidth: 1132,
    minTitleSize: 42,
    maxTitleSize: 64,
    minDescriptionSize: 14,
    maxDescriptionSize: 20,
  },
  he: { 
    minWidth: 402,
    maxWidth: 1132,
    minTitleSize: 38,
    maxTitleSize: 76,
    minDescriptionSize: 14,
    maxDescriptionSize: 20,
  },
  es_ar: { 
    minWidth: 402,
    maxWidth: 1132,
    minTitleSize: 40,
    maxTitleSize: 72,
    minDescriptionSize: 14,
    maxDescriptionSize: 20,
  },
  de: { 
    minWidth: 402,
    maxWidth: 1132,
    minTitleSize: 40,
    maxTitleSize: 68,
    minDescriptionSize: 12,
    maxDescriptionSize: 20,
  },
  ru: { 
    minWidth: 402,
    maxWidth: 1132,
    minTitleSize: 42,
    maxTitleSize: 82,
    minDescriptionSize: 16,
    maxDescriptionSize: 20,
  },
};

interface SalesPitchCardContentProps {
  align: "flex-start" | "flex-end";
  textAlign: "left" | "right";
  textDirection: "ltr" | "rtl";
  isMobile: boolean;
}

const SalesPitchCardContent: React.FC<SalesPitchCardContentProps> = ({ align, textAlign, textDirection, isMobile, }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language as "en" | "he" | "es_ar";
  const containerRef = useRef<HTMLDivElement>(null);
  const [titleSize, setTitleSize] = useState(TEXT_SIZES[language].maxTitleSize);
  const [descriptionSize, setDescriptionSize] = useState(TEXT_SIZES[language].maxDescriptionSize);

  useEffect(() => {
    const updateTextSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const { minWidth, maxWidth, minTitleSize, maxTitleSize, minDescriptionSize, maxDescriptionSize } = TEXT_SIZES[language];
        const calculatedTitleSize = ((maxTitleSize - minTitleSize) / (maxWidth - minWidth)) * (width - minWidth) + minTitleSize;
        const calculatedDescriptionSize = ((maxDescriptionSize - minDescriptionSize) / (maxWidth - minWidth)) * (width - minWidth) + minDescriptionSize;
        const cappedTitleSize = Math.min(calculatedTitleSize, maxTitleSize);
        const cappedDescriptionSize = Math.min(calculatedDescriptionSize, maxDescriptionSize);
        setTitleSize(cappedTitleSize);
        setDescriptionSize(cappedDescriptionSize);
      }
    };

    const handleResize = () => {
      setTimeout(updateTextSize, 500); // Update text size 0.5s after resize
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    updateTextSize(); // Initial update

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [language, isMobile]);

  const openLinkInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={containerRef}>
      <div className="font-sans font-bold text-[var(--foreground)] mb-2" style={{ lineHeight: "1.25", marginBottom: "16px", fontSize: `${titleSize}px` }}>
        {t('sales-pitch-card-translation-title')}
      </div>
      <div className="font-sans text-[var(--secondary-foreground)] mb-4" style={{ textAlign, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "pre-line", maxHeight: "5.5em", fontSize: `${descriptionSize}px` }}>
        {t('sales-pitch-card-translation-description')}
      </div>
      <div className="flex mb-4" style={{ flexDirection: "row", alignItems: align, gap: "12px", justifyContent: align, width: "244px", direction: textDirection }}>
        <HalomotButton
          text=""
          onClick={() => openLinkInNewTab('https://github.com/Northstrix')}
          href="https://github.com/Northstrix"
          icon={<FontAwesomeIcon icon={faGithub} size="lg" />}
          fillWidth
          gradient={textDirection === "rtl" ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))" : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"}
        />
        <HalomotButton
          text=""
          onClick={() => openLinkInNewTab('https://medium.com/@Northstrix')}
          href="https://medium.com/@Northstrix"
          icon={<FontAwesomeIcon icon={faMedium} size="lg" />}
          fillWidth
          gradient={textDirection === "rtl" ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))" : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"}
        />
        <HalomotButton
          text=""
          onClick={() => openLinkInNewTab('https://www.instructables.com/member/Northstrix/instructables/')}
          href="https://www.instructables.com/member/Northstrix/instructables/"
          icon={<FontAwesomeIcon icon={faTools} size="lg" />}
          fillWidth
          gradient={textDirection === "rtl" ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))" : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"}
        />
        <HalomotButton
          text=""
          onClick={() => openLinkInNewTab('https://www.facebook.com/profile.php?id=61550751306759')}
          href="https://www.facebook.com/profile.php?id=61550751306759"
          icon={<FontAwesomeIcon icon={faFacebook} size="lg" />}
          fillWidth
          gradient={textDirection === "rtl" ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))" : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"}
        />
      </div>
    </div>
  );
};

export default SalesPitchCardContent;
