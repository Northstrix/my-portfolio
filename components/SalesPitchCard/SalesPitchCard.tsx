"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import HalomotButton from "@/components/HalomotButton/HalomotButton";
import { Mail, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import SalesPitchCardContent from "./SalesPitchCardContent";
import { useTranslation } from "react-i18next";
import ClickSpark from "@/components/ClickSpark/ClickSpark";
import Silk from "@/components/Silk/Silk";

interface SalesPitchCardProps {
  align: "flex-start" | "flex-end";
  textAlign: "left" | "right";
  textDirection: "ltr" | "rtl";
  isMobile: boolean;
  hovered: boolean;
  cardStyle: React.CSSProperties;
  cardHover: React.CSSProperties;
  order: number;
  contactInfoCallback: () => void;
  downloadCVLink: string;
  isRTL?: boolean;
  onLinkClick?: (url: string) => void;
}

const SalesPitchCard: React.FC<SalesPitchCardProps> = ({
  align,
  textAlign,
  textDirection,
  isMobile,
  hovered,
  cardStyle,
  cardHover,
  order,
  contactInfoCallback,
  downloadCVLink,
  isRTL = false,
  onLinkClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showBottomButtons, setShowBottomButtons] = useState(false);
  const isActive = hovered || isHovered;
  const { t } = useTranslation();

  const handleDownloadCV = () => {
    window.open(downloadCVLink, "_blank", "noopener,noreferrer");
    if (onLinkClick) onLinkClick(downloadCVLink);
  };

  const buttonGradient = isRTL
    ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
    : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))";

  // Prevent ClickSpark from triggering when clicking on buttons
  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest('[role="button"]')
    ) {
      return;
    }
    // Otherwise, ClickSpark will handle it as usual
  };

  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={16}
      sparkRadius={22}
      sparkCount={6}
      duration={596}
    >
      <motion.div
        className={cn("transition-all duration-200")}
        style={{
          ...cardStyle,
          ...(isActive ? cardHover : {}),
          order,
          direction: textDirection,
          cursor: "pointer",
          minWidth: 0,
          flex: isMobile ? "unset" : "1 1 0%",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div
          className="flex flex-col h-full"
          style={{
            borderRadius: "var(--mild-rounding)",
            backgroundColor: "var(--card-background)",
            padding: "1rem",
            alignItems: align,
            textAlign,
            height: "100%",
            minHeight: 0,
            overflow: "hidden",
            direction: textDirection,
            flex: 1,
            display: "flex",
            position: "relative",
          }}
        >
          {/* Silk overlay, fades in/out immediately on hover */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              borderRadius: "var(--mild-rounding)",
              overflow: "hidden",
              pointerEvents: "none",
              opacity: isActive ? 1 : 0,
              transition: "opacity 1s",
              background: "transparent",
            }}
          >
            <Silk
              speed={5}
              scale={1}
              color="#26252e"
              noiseIntensity={0.5}
              rotation={0}
              isRTL={isRTL}
            />
          </div>

          {/* Card content (above Silk) */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SalesPitchCardContent
              align={align}
              textAlign={textAlign}
              textDirection={textDirection}
              isMobile={isMobile}
              isRTL={isRTL}
              onShowBottomButtons={() => setShowBottomButtons(true)}
              onLinkClick={onLinkClick}
            />
            {/* Spacer to push buttons to bottom */}
            <div style={{ flex: 1 }} />
            <div
              className={`flex ${showBottomButtons ? "animate__animated animate__fadeIn" : ""}`}
              style={{
                gap: "1rem",
                flexDirection: isMobile ? "column" : "row",
                alignItems: align,
                justifyContent: align,
                width: "100%",
                direction: textDirection,
                opacity: showBottomButtons ? 1 : 0,
                pointerEvents: showBottomButtons ? "auto" : "none",
                transition: "opacity 0.2s",
              }}
            >
              <HalomotButton
                text={t("short-contact-info-inscription")}
                onClick={contactInfoCallback}
                icon={<Mail size={18} />}
                fillWidth
                gradient={buttonGradient}
              />
              <HalomotButton
                text={t("download-cv")}
                onClick={handleDownloadCV}
                icon={<FileDown size={18} />}
                fillWidth
                gradient={buttonGradient}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </ClickSpark>
  );
};

export default SalesPitchCard;
