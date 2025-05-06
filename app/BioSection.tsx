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
  onLinkClick: (url: string) => void;
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
  onLinkClick,
}) => {
  const { i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Exact dimensions by language
  let profileCardWidth: string, cardHeight: string;
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
      profileCardWidth = "400px";
      cardHeight = "423px";
  }

  // Responsive logic
  const handleResize = useCallback(() => {
    if (wrapperRef.current) {
      setIsMobile(wrapperRef.current.offsetWidth < desktopVersionBottomThreshold);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    handleResize();
    return () => {
      if (wrapperRef.current) resizeObserver.unobserve(wrapperRef.current);
    };
  }, [handleResize]);

  // Shared hover state for both cards and image
  const [hovered, setHovered] = useState<null | "bio" | "pitch">(null);

  // Layout
  const align = isRTL ? "flex-end" : "flex-start";
  const textAlign = isRTL ? "right" : "left";
  const textDirection = isRTL ? "rtl" : "ltr";
  const direction = isMobile ? "column" : "row";

  // ORDER LOGIC: This is correct!
  const profileOrder = isMobile ? 1 : isRTL ? 2 : 1;
  const pitchOrder   = isMobile ? 2 : isRTL ? 1 : 2;

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
    overflow: "hidden",
  } as const;

  const cardHover = {
    backgroundColor: "var(--lightened-background-adjacent-color)",
    border: HOVER_OUTLINE,
    boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
  };

  const profileCardWrapperStyle = isMobile
    ? { width: "100%", height: "auto", flex: "unset" }
    : { width: profileCardWidth, height: cardHeight, flex: "0 0 auto" };

  const imageCardStyle = {
    ...cardBase,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: textAlign as "left" | "right",
    direction: textDirection as "ltr" | "rtl",
  } as const;

  const contentCardStyle = {
    ...cardBase,
    flex: isMobile ? "unset" : "1 1 0%",
    minWidth: 0,
    width: isMobile ? "100%" : "auto",
    overflow: "hidden",
    height: isMobile ? "auto" : cardHeight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  } as const;

  // Determine bioFontSize
  const bioFontSize = i18n.language === "de" && !isMobile ? 14 : undefined;

  // Set direction: rtl only for desktop RTL
  const flexContainerDirection =
    !isMobile && isRTL ? "rtl" : "ltr";

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
            direction: flexContainerDirection, // <--- THIS IS THE FIX
          }}
        >
          {isMobile && <ProfileCard
            photo={photo}
            name={name}
            bio={bio}
            aspectRatio={imageAspectRatio}
            onHoverStart={() => setHovered("bio")}
            onHoverEnd={() => setHovered(null)}
            outline={OUTLINE}
            hoverOutline={HOVER_OUTLINE}
            containerStyle={imageCardStyle}
            textAlign={textAlign as "left" | "right"}
            direction={textDirection as "ltr" | "rtl"}
            {...(bioFontSize ? { bioFontSize } : {})}
          /> }
          {/* Profile Card */}
          <div
            style={{
              ...profileCardWrapperStyle,
              order: profileOrder,
              display: "flex",
              alignItems: "stretch",
            }}
          >
            {!isMobile && <ProfileCard
              photo={photo}
              name={name}
              bio={bio}
              aspectRatio={imageAspectRatio}
              onHoverStart={() => setHovered("bio")}
              onHoverEnd={() => setHovered(null)}
              outline={OUTLINE}
              hoverOutline={HOVER_OUTLINE}
              containerStyle={imageCardStyle}
              textAlign={textAlign as "left" | "right"}
              direction={textDirection as "ltr" | "rtl"}
              {...(bioFontSize ? { bioFontSize } : {})}
            /> }
          </div>
          {/* Sales Pitch Card */}
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
            onLinkClick={onLinkClick}
            downloadCVLink={downloadCVLink}
            isRTL={isRTL}
          />
        </div>
      </StructuredBlock>
    </div>
  );
};

export default BioSection;
