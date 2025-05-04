"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import StructuredBlock from "@/components/StructuredBlock/StructuredBlock";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import { addRTLProps, contentProps, maxSectionWidth } from "./LandingPage.styles";
import SalesPitchCard from "@/components/SalesPitchCard/SalesPitchCard";

interface BioSectionProps {
  photo: string;
  name: string;
  bio: string;
  contactInfoCallback: () => void;
  downloadCVLink: string;
  isRTL?: boolean;
  imageAspectRatio?: number;
}

const desktopVersionBottomThreshold = 768;
const OUTLINE = "1px solid var(--background-adjacent-color)";
const HOVER_OUTLINE = "1px solid var(--lightened-background-adjacent-color)";
const GAP = "1rem";

const BioSection: React.FC<BioSectionProps> = ({
  photo,
  name,
  bio,
  contactInfoCallback,
  downloadCVLink,
  isRTL = false,
  imageAspectRatio = 1,
}) => {
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const profileCardWrapperRef = useRef<HTMLDivElement>(null);

  let profileCardWidth;
  let cardHeight;

  switch (i18n.language) {
    case "en":
      profileCardWidth = "306px";
      cardHeight = "423px";
      break;
    case "he":
      profileCardWidth = "296px";
      cardHeight = "413px";
      break;
    case "es_ar":
      profileCardWidth = "376px";
      cardHeight = "493px";
      break;
    case "de":
      profileCardWidth = "376px";
      cardHeight = "493px";
      break;
    case "ru":
      profileCardWidth = "330px";
      cardHeight = "476px";
      break;
    default:
      profileCardWidth = "400px"; // Fallback/default value
      cardHeight = "423px"; // Default max height
  }

  // Responsive logic
  const handleResize = useCallback(() => {
    if (wrapperRef.current) {
      setIsMobile(wrapperRef.current.offsetWidth < desktopVersionBottomThreshold);
    }
    if (profileCardWrapperRef.current) {
    }
  }, []);

  // Track previous isMobile and i18n.language to reset height on change
  const prevIsMobileRef = useRef(isMobile);
  const prevLangRef = useRef(i18n.language);

  useEffect(() => {
    if (prevIsMobileRef.current !== isMobile || prevLangRef.current !== i18n.language) {
      prevIsMobileRef.current = isMobile;
      prevLangRef.current = i18n.language;
    }
  }, [isMobile, i18n.language]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    handleResize();
    const timeout = setTimeout(handleResize, 50); // Ensure height is measured after mount
    return () => {
      if (wrapperRef.current) resizeObserver.unobserve(wrapperRef.current);
      clearTimeout(timeout);
    };
  }, [handleResize]);

  // Shared hover state for both cards and image
  const [hovered, setHovered] = useState<null | "bio" | "pitch">(null);

  // Layout
  const align = isRTL ? "flex-end" : "flex-start";
  const textAlign = isRTL ? "right" : "left";
  const textDirection = isRTL ? "rtl" : "ltr";

  // Desktop flex-direction: always "row"
  // Desktop order: isRTL = [profile, pitch], else [pitch, profile]
  // Mobile: always [profile, pitch]
  const direction = isMobile ? "column" : "row";
  const profileOrder = isMobile ? 1 : isRTL ? 1 : 2;
  const pitchOrder = isMobile ? 2 : isRTL ? 2 : 1;

  // Card styles
  const cardBase = {
    backgroundColor: "var(--background-adjacent-color)",
    borderRadius: "var(--outer-mild-rounding)",
    border: OUTLINE,
    transition: "background-color 0.3s, border 0.3s, box-shadow 0.3s",
    boxShadow: "0 1.5px 12px 0 rgba(0,0,0,0.06)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    minWidth: 0,
    minHeight: 0,
    height: isMobile ? "auto" : "100%",
    overflow: "hidden",
  } as const;

  const cardHover = {
    backgroundColor: "var(--lightened-background-adjacent-color)",
    border: HOVER_OUTLINE,
    boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
  };

  // Image card: shrinkable, truncates, does not overflow
  const imageCardStyle = {
    ...cardBase,
    flex: isMobile ? "unset" : `0 1 ${profileCardWidth}`,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    height: isMobile ? "auto" : "100%",
    maxHeight: isMobile ? "none" : cardHeight, // Apply cardHeight based on language
  } as const;

  // Content card: takes remaining width
  const contentCardStyle = {
    ...cardBase,
    flex: isMobile ? "unset" : "1 1 0%",
    minWidth: 0,
    width: "100%",
    overflow: "hidden",
    height: isMobile ? "auto" : cardHeight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  } as const;

  return (
    <div
      ref={wrapperRef}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: maxSectionWidth,
        alignItems: "stretch",
      }}
    >
      <StructuredBlock {...addRTLProps(contentProps, isRTL)}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: direction,
            gap: GAP,
            alignItems: "stretch",
            justifyContent: "stretch",
            minHeight: isMobile ? "auto" : 0,
            // Always use LTR for flex container so order works as intended
            direction: "ltr",
          }}
        >
          {/* Profile Card (Image) Wrapper */}
          <div
            ref={profileCardWrapperRef}
            style={{
              flex: isMobile ? "unset" : `0 1 ${profileCardWidth}`,
              order: profileOrder,
              display: "flex",
              alignItems: "stretch",
              width: isMobile ? "100%" : undefined,
            }}
          >
            <ProfileCard
              photo={photo}
              name={name}
              bio={bio}
              aspectRatio={imageAspectRatio}
              onHoverStart={() => setHovered("bio")}
              onHoverEnd={() => setHovered(null)}
              outline={OUTLINE}
              hoverOutline={HOVER_OUTLINE}
              containerStyle={{
                ...imageCardStyle,
                height: isMobile ? "auto" : "100%",
                width: isMobile ? "100%" : "auto",
                textAlign: textAlign as "left" | "right",
                direction: textDirection as "ltr" | "rtl",
              }}
              textAlign={textAlign as "left" | "right"}
              direction={textDirection as "ltr" | "rtl"}
            />
          </div>
          {/* Sales Pitch Card (Content) */}
          <SalesPitchCard
            align={align as "flex-start" | "flex-end"}
            textAlign={textAlign as "left" | "right"}
            textDirection={textDirection as "ltr" | "rtl"}
            isMobile={isMobile}
            hovered={hovered === "pitch"}
            cardStyle={contentCardStyle}
            cardHover={cardHover}
            order={pitchOrder}
            contactInfoCallback={contactInfoCallback}
            downloadCVLink={downloadCVLink}
            isRTL={isRTL}
          />
        </div>
      </StructuredBlock>
    </div>
  );
};

export default BioSection;
