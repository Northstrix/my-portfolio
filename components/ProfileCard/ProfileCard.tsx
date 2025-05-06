"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import LetterGlitch from '@/components/LetterGlitch/LetterGlitch';
import DecryptedText from '@/components/DecryptedText/DecryptedText';

interface ProfileCardProps {
  photo: string;
  name: string;
  bio: string;
  aspectRatio?: number;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  outline?: string;
  hoverOutline?: string;
  containerStyle?: React.CSSProperties;
  textAlign?: "left" | "right";
  direction?: "ltr" | "rtl";
  bioFontSize?: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  photo,
  name,
  bio,
  aspectRatio = 1,
  onHoverStart,
  onHoverEnd,
  outline = "1px solid var(--background-adjacent-color)",
  hoverOutline = "1px solid var(--lightened-background-adjacent-color)",
  containerStyle = {},
  textAlign = "left",
  direction = "ltr",
  bioFontSize = 16,
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  // Calculate width based on fixed height and aspect ratio
  let containerHeightPx = 0;
  if (containerStyle.height && typeof containerStyle.height === "number") {
    containerHeightPx = containerStyle.height;
  } else if (
    containerStyle.height &&
    typeof containerStyle.height === "string" &&
    containerStyle.height.endsWith("px")
  ) {
    containerHeightPx = parseFloat(containerStyle.height);
  }
  const isMobile = containerStyle.width === "100%";
  const calculatedWidth = isMobile
    ? "100%"
    : containerHeightPx
    ? `${containerHeightPx * aspectRatio}px`
    : "auto";

  return (
    <motion.div
      className="transition-all duration-200"
      style={{
        ...containerStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: 0,
        overflow: "hidden",
        padding: "0px",
        borderRadius: "var(--outer-mild-rounding)",
        backgroundColor: isCardHovered
          ? "var(--lightened-background-adjacent-color)"
          : "var(--background-adjacent-color)",
        border: isCardHovered ? hoverOutline : outline,
        transition: "background-color 0.3s ease-in-out, border 0.3s ease-in-out",
        width: calculatedWidth,
        maxWidth: calculatedWidth,
      }}
      onMouseEnter={() => {
        setIsCardHovered(true);
        if (onHoverStart) onHoverStart();
      }}
      onMouseLeave={() => {
        setIsCardHovered(false);
        if (onHoverEnd) onHoverEnd();
      }}
    >
      <div
        style={{
          borderRadius: "var(--mild-rounding)",
          backgroundColor: "var(--card-background)",
          padding: "1rem",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Image & Glitch Section with proper border radius clipping */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: `${aspectRatio}`,
            borderRadius: "var(--mild-rounding)",
            overflow: "hidden", // Ensures glitch and image are clipped
            border: isImageHovered ? hoverOutline : outline,
            direction: "ltr",
            background: isImageHovered
              ? "var(--lightened-background-adjacent-color)"
              : "var(--background-adjacent-color)",
            transition: "background-color 0.3s ease-in-out, border 0.3s ease-in-out",
            flexShrink: 0,
          }}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          {/* Glitch effect (now clipped by border radius via parent) */}
          <LetterGlitch
            glitchSpeed={44}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
          />
          {/* Image */}
          <Image
            src={photo}
            alt={name}
            fill
            style={{
              objectFit: "contain", // Fit entire image without cropping
              borderRadius: "var(--mild-rounding)",
              transition: "filter 0.3s",
              filter: isImageHovered ? "brightness(0.95)" : "none",
              zIndex: 1,
            }}
            priority
          />
        </div>
        {/* Content Section */}
        <div
          className="transition duration-200 flex-grow"
          style={{
            marginTop: "1rem",
            width: "100%",
            textAlign,
            overflow: "hidden",
            direction,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            className="font-sans font-bold text-[var(--foreground)] text-[30px] mb-2"
            style={{
              textAlign,
              wordBreak: "break-word",
              flexShrink: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={name}
          >
            {name}
          </div>
          <div
            className="font-sans text-[var(--secondary-foreground)]"
            style={{
              textAlign,
              wordBreak: "break-word",
              whiteSpace: "pre-line",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: `${bioFontSize}px`,
            }}
          >
            <DecryptedText
              maxIterations={18}
              speed={76}
              animateOn="view"
              text={bio}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
