"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
  // Mobile: width 100%, desktop: width = height * aspectRatio
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
        {/* Image Section with outline */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "auto",
            aspectRatio: `${aspectRatio}`,
            borderRadius: "var(--mild-rounding)",
            overflow: "hidden",
            border: isImageHovered ? hoverOutline : outline,
            background: isImageHovered
              ? "var(--lightened-background-adjacent-color)"
              : "var(--background-adjacent-color)",
            transition: "background-color 0.3s ease-in-out, border 0.3s ease-in-out",
            flexShrink: 0,
          }}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <Image
            src={photo}
            alt={name}
            fill
            style={{
              objectFit: "contain", // Fit entire image without cropping
              borderRadius: "var(--mild-rounding)",
              transition: "filter 0.3s",
              filter: isImageHovered ? "brightness(0.95)" : "none",
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
            className="font-sans text-[var(--secondary-foreground)] text-[16px]"
            style={{
              textAlign,
              wordBreak: "break-word",
              whiteSpace: "pre-line",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={bio}
          >
            {bio}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
