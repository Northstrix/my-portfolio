"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import LetterGlitch from "@/components/LetterGlitch";
import DecryptedText from "@/components/DecryptedText";
import Silk from "@/components/Silk";
import { useTranslation } from "react-i18next";
import useIsRTL from "@/hooks/useIsRTL";

interface ProfileCardProps {
  photo?: string;
  name: string;
  bio: string;
  isMobile?: boolean; // New prop
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  bioFontSize?: number;
}

const ASPECT_RATIO = 1600 / 1842; // ~0.868

const ProfileCard: React.FC<ProfileCardProps> = ({
  photo = "/profile_image.webp",
  name,
  bio,
  isMobile = false,
  onHoverStart,
  onHoverEnd,
  bioFontSize = 16,
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const isRTL = useIsRTL();

  return (
    <motion.div
      className="transition-all duration-200"
      style={{
        width: "100%",
        aspectRatio: ASPECT_RATIO,
        display: "flex",
        flexDirection: "column",
        padding: 24,
        borderRadius: "var(--border-radius)",
        border: `1px solid var(--border-color)`,
        backgroundColor: "var(--background)",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        transition: "background-color 0.3s ease-in-out, border 0.3s ease-in-out",
        minHeight: 0,
        textAlign: isMobile ? "center" : isRTL ? "right" : "left", // Center if mobile
        direction: isRTL ? "rtl" : "ltr",
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
      {/* Silk overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          pointerEvents: "none",
          opacity: isCardHovered ? 1 : 0,
          transition: "opacity 1s",
          background: "transparent",
        }}
      >
        <Silk
          speed={5}
          scale={1}
          noiseIntensity={0.5}
          rotation={0}
          isRTL={isRTL}
        />
      </div>

      {/* Image container */}
      <div
        style={{
          background: "var(--background)",
          borderRadius: "var(--border-radius)",
          border: `1px solid var(--border-color)`,
          flexShrink: 0,
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          position: "relative",
          overflow: "hidden",
          transition: "background-color 0.3s ease-in-out, border 0.3s ease-in-out",
          marginBottom: 16,
          zIndex: 1,
        }}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {/* LetterGlitch behind the image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "var(--border-radius)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <LetterGlitch
            glitchSpeed={44}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
          />
        </div>

        {/* Image */}
        <img
          src={photo}
          alt={name}
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "var(--border-radius)",
            filter: isImageHovered ? "brightness(0.95)" : "none",
            zIndex: 1,
            userSelect: "none",
            pointerEvents: "none",
            objectFit: "contain",
            alignSelf: "flex-end",
          }}
        />
      </div>

      {/* Text content */}
      <div
        className="transition duration-200"
        style={{
          width: "100%",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        <div
          className="font-sans font-bold text-[var(--foreground)] mb-2"
          style={{
            wordBreak: "break-word",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontSize: 30,
          }}
          title={name}
        >
          {name}
        </div>
        <div
          className="font-sans text-[var(--sub-foreground)]"
          style={{
            wordBreak: "break-word",
            whiteSpace: "pre-line",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: bioFontSize,
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
    </motion.div>
  );
};

export default ProfileCard;
