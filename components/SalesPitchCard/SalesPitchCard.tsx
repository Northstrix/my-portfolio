"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import HalomotButton from "@/components/HalomotButton/HalomotButton";
import { Mail, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import SalesPitchCardContent from "./SalesPitchCardContent";
import { useTranslation } from 'react-i18next';

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
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = hovered || isHovered;
  const { t } = useTranslation();

  const handleDownloadCV = () => {
    window.open(downloadCVLink, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      className={cn("transition-all duration-200")}
      style={{
        ...cardStyle,
        ...(isActive ? cardHover : {}),
        order,
        direction: textDirection,
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        }}
      >
        <SalesPitchCardContent
          align={align}
          textAlign={textAlign}
          textDirection={textDirection}
          isMobile={isMobile}
        />
        {/* Spacer to push buttons to bottom */}
        <div style={{ flex: 1 }} />
        <div
          className="flex"
          style={{
            gap: "1rem",
            flexDirection: isMobile ? "column" : "row",
            alignItems: align,
            justifyContent: align,
            width: "100%",
            direction: textDirection,
          }}
        >
          <HalomotButton
            text={t("short-contact-info-inscription")}
            onClick={contactInfoCallback}
            icon={<Mail size={18} />}
            fillWidth
            gradient={
              isRTL
                ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
                : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"
            }
          />
          <HalomotButton
            text={t("download-cv")}
            onClick={handleDownloadCV}
            icon={<FileDown size={18} />}
            fillWidth
            gradient={
              isRTL
                ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
                : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"
            }
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SalesPitchCard;
