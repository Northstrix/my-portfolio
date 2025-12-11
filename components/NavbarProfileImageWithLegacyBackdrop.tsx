"use client";
import { useMemo } from "react";
import { getLegacyBackdropStyle } from "./LegacyBackdrop";
import LetterGlitch from "@/components/LetterGlitch";

interface LogoWithLegacyBackdropProps {
  size?: number;
  blurStrength?: number;
  bodyOpacity?: number;
  borderOpacity?: number;
}

export default function LogoWithLegacyBackdrop({
  size = 32,
  blurStrength = 5.2,
  bodyOpacity = 0.64,
  borderOpacity = 0.28,
}: LogoWithLegacyBackdropProps) {
  const supportsBackdropFilter =
    typeof window !== "undefined" &&
    window.CSS &&
    typeof window.CSS.supports === "function" &&
    (window.CSS.supports("backdrop-filter", `blur(${blurStrength}px)`) ||
      window.CSS.supports("-webkit-backdrop-filter", `blur(${blurStrength}px)`));

  // Always use the "scrolled" style but soften background opacity to avoid solid fill
  const style = useMemo(() => {
    const baseStyle = getLegacyBackdropStyle({
      supportsBackdropFilter,
      bodyOpacity,
      borderOpacity,
      blurStrength,
      isScrolled: true, // Force scrolled style
    });

    return {
      ...baseStyle,
      background: supportsBackdropFilter
        ? `rgba(0, 0, 0, ${bodyOpacity * 0.4})` // Reduced opacity translucent black
        : `rgba(0, 0, 0, ${bodyOpacity * 0.2})`, // Lighter fallback for no backdrop filter
      border: `1px solid rgba(128,128,128,${borderOpacity})`,
      boxShadow: "0 1px 10px 0 rgba(0,0,0,0.05)",
    };
  }, [supportsBackdropFilter, bodyOpacity, borderOpacity, blurStrength]);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "var(--border-radius)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Glitch background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          borderRadius: "var(--border-radius)",
        }}
      >
        <LetterGlitch
          glitchSpeed={44}
          fontSize={Math.round(size * 0.6)}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      {/* Foreground image */}
      <img
        src="/profile_image.webp"
        alt="logo"
        width={size}
        height={size}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "none",
        }}
      />
    </div>
  );
}
