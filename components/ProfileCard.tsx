"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LetterGlitch from "@/components/LetterGlitch";
import DecryptedText from "@/components/DecryptedText";
import Silk from "@/components/Silk";
import useIsRTL from "@/hooks/useIsRTL";

interface ProfileCardProps {
  photo?: string;
  name: string;
  bio: string;
  isMobile?: boolean;
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
  const [fontScaleOffset, setFontScaleOffset] = useState(0);
  const isRTL = useIsRTL();

  // Handle responsive font scaling
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let offset = 0;

      if (width < 800) offset -= 0.5;
      if (width < 720) offset -= 0.5;
      if (width < 600) offset -= 0.5;
      if (width < 540) offset -= 0.75;
      if (width < 460) offset -= 2;
      if (width < 420) offset -= 0.5;
      if (width < 390) offset -= 0.25;
      if (width < 380) offset -= 0.375;
      setFontScaleOffset(offset);
    };

    // Initial check and listener
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      className="transition-all duration-300"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 24,
        borderRadius: "var(--border-radius)",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--background)",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        textAlign: isMobile ? "center" : isRTL ? "right" : "left",
        direction: isRTL ? "rtl" : "ltr",
        transition: "background-color 0.3s ease, border 0.3s ease",
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
      {/* Overlay */}
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
        }}
      >
        <Silk speed={5} scale={1} noiseIntensity={0.5} rotation={0} isRTL={isRTL} />
      </div>

      {/* Image container with bottom-aligned image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: ASPECT_RATIO,
          borderRadius: "var(--border-radius)",
          border: "1px solid var(--border-color)",
          background: "var(--background)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          overflow: "hidden",
          marginBottom: 16,
          flexShrink: 0,
          zIndex: 1,
          transition: "border 0.3s ease, background-color 0.3s ease",
        }}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            borderRadius: "var(--border-radius)",
          }}
        >
          <LetterGlitch glitchSpeed={44} centerVignette outerVignette={false} smooth />
        </div>

        <img
          src={photo}
          alt={name}
          style={{
            maxWidth: "100%",
            height: "auto",
            objectFit: "contain",
            borderRadius: "var(--border-radius)",
            filter: isImageHovered ? "brightness(0.9)" : "none",
            transition: "filter 0.3s ease",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1,
            alignSelf: "flex-end",
          }}
        />
      </div>

      {/* Text content */}
      <div
        style={{
          flexGrow: 1,
          width: "100%",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <div
          className="font-sans font-bold text-[var(--foreground)] mb-2"
          style={{
            fontSize: 30 + fontScaleOffset,
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
          title={name}
        >
          {name}
        </div>

        <div
          className="font-sans text-[var(--sub-foreground)]"
          style={{
            fontSize: bioFontSize + fontScaleOffset,
            wordBreak: "break-word",
            whiteSpace: "pre-line",
          }}
        >
          <DecryptedText maxIterations={18} speed={76} animateOn="view" text={bio} />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
