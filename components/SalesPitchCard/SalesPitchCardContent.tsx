"use client";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faMedium,
  faXTwitter,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faTools } from "@fortawesome/free-solid-svg-icons";
import HalomotButton from "@/components/HalomotButton/HalomotButton";
import { useTranslation } from "react-i18next";
import BlurText from "@/components/BlurText/BlurText";
import "animate.css";

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
  it: {
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
    minTitleSize: 38,
    maxTitleSize: 64,
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

const SOCIAL_LINKS = [
  { url: "https://github.com/Northstrix", icon: faGithub },
  { url: "https://medium.com/@Northstrix", icon: faMedium },
  {
    url: "https://www.instructables.com/member/Northstrix/instructables/",
    icon: faTools,
  },
  {
    url: "https://www.x.com/maxim_bortnikov",
    icon: faXTwitter,
  },
  {
    url: "https://www.facebook.com/profile.php?id=61550751306759",
    icon: faFacebook,
  },
];

interface SalesPitchCardContentProps {
  align: "flex-start" | "flex-end";
  textAlign: "left" | "right";
  textDirection: "ltr" | "rtl";
  isMobile: boolean;
  isRTL?: boolean;
  onShowBottomButtons?: () => void;
  onLinkClick?: (url: string) => void;
}

const SalesPitchCardContent: React.FC<SalesPitchCardContentProps> = ({
  align,
  textAlign,
  textDirection,
  isMobile,
  isRTL = false,
  onShowBottomButtons,
  onLinkClick,
}) => {
  const { t, i18n } = useTranslation();
  const language = (i18n.language as keyof typeof TEXT_SIZES) || "en";
  const containerRef = useRef<HTMLDivElement>(null);
  const [titleSize, setTitleSize] = useState(TEXT_SIZES[language].maxTitleSize);
  const [descriptionSize, setDescriptionSize] = useState(
    TEXT_SIZES[language].maxDescriptionSize,
  );
  const [showDescriptionText, setShowDescriptionText] = useState(false);
  const [showSocialMediaButtons, setShowSocialMediaButtons] = useState(false);

  // State for container width (to force rerender on resize)
  const [containerWidth, setContainerWidth] = useState(0);

  // State for animation: only true on first mount or language change
  const [playAnimation, setPlayAnimation] = useState(true);

  // Force remount of the entire content on language change
  const contentKey = i18n.language;

  useEffect(() => {
    setPlayAnimation(true); // play animation on language change
    setShowDescriptionText(false);
    setShowSocialMediaButtons(false);
  }, [i18n.language]);

  useEffect(() => {
    const updateTextSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width); // update width state for key
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
        const calculatedDescriptionSize =
          ((maxDescriptionSize - minDescriptionSize) / (maxWidth - minWidth)) *
            (width - minWidth) +
          minDescriptionSize;
        const cappedTitleSize = Math.min(
          Math.max(calculatedTitleSize, minTitleSize),
          maxTitleSize,
        );
        const cappedDescriptionSize = Math.min(
          Math.max(calculatedDescriptionSize, minDescriptionSize),
          maxDescriptionSize,
        );
        setTitleSize(cappedTitleSize);
        setDescriptionSize(cappedDescriptionSize);
      }
    };
    const handleResize = () => {
      setTimeout(updateTextSize, 500);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    updateTextSize();
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [language, isMobile]);

  // Animation sequencing: blur -> desc -> social -> bottom
  const handleBlurComplete = () => {
    setShowDescriptionText(true);
    setTimeout(() => setShowSocialMediaButtons(true), 300);
    setTimeout(() => {
      if (onShowBottomButtons) onShowBottomButtons();
    }, 600);
  };

  const buttonGradient =
    textDirection === "rtl"
      ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
      : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))";

  const handleSocialClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    if (onLinkClick) onLinkClick(url);
  };

  // The key depends only on containerWidth, so rerender is forced only on resize
  const socialButtonsKey = `w-${containerWidth}`;

  return (
    <div key={contentKey} ref={containerRef}>
      {/* BlurText for title */}
      <div
        className="font-sans font-bold text-[var(--foreground)] mb-2"
        style={{
          lineHeight: "1.25",
          marginBottom: "16px",
          fontSize: `${titleSize}px`,
        }}
      >
        <BlurText
          text={t("sales-pitch-card-translation-title")}
          delay={200}
          animateBy="words"
          direction="top"
          stepDuration={0.35}
          onAnimationComplete={handleBlurComplete}
        />
      </div>
      {/* Description */}
      {showDescriptionText && (
        <div
          className={`font-sans text-[var(--secondary-foreground)] mb-4 animate__animated ${
            isRTL ? "animate__fadeInRight" : "animate__fadeInLeft"
          }`}
          style={{
            textAlign,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre-line",
            maxHeight: "6em",
            fontSize: `${descriptionSize}px`,
          }}
        >
          {t("sales-pitch-card-translation-description")}
        </div>
      )}
      {/* Social Buttons */}
      {showSocialMediaButtons && (
        <div
          key={socialButtonsKey}
          className={`flex mb-4 ${
            playAnimation ? "animate__animated animate__fadeInDown" : ""
          }`}
          style={{
            flexDirection: "row",
            alignItems: align,
            gap: "12px",
            justifyContent: align,
            width: "305px",
            direction: textDirection,
          }}
          // After first render or language change, stop animation for future rerenders
          onAnimationEnd={() => setPlayAnimation(false)}
        >
          {SOCIAL_LINKS.map(({ url, icon }) => (
            <HalomotButton
              key={url}
              text=""
              onClick={() => handleSocialClick(url)}
              href={url}
              icon={<FontAwesomeIcon icon={icon} size="lg" />}
              fillWidth
              gradient={buttonGradient}
            />
          ))}
          <div style={{ height: "1px" }} />
        </div>
      )}
    </div>
  );
};

export default SalesPitchCardContent;
